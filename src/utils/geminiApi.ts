import type { ICEValues } from '../types/task';
import { sanitizeICEValues } from './ice';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    impact: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
      description: 'Impacto potencial de la tarea en una escala del 1 al 10.',
    },
    confidence: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
      description: 'Nivel de confianza de la estimacion en una escala del 1 al 10.',
    },
    ease: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
      description: 'Facilidad de implementacion o ejecucion en una escala del 1 al 10.',
    },
  },
  required: ['impact', 'confidence', 'ease'],
  additionalProperties: false,
} as const;

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function getSuggestedICEValues(description: string): Promise<ICEValues> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Configura VITE_GEMINI_API_KEY en un archivo .env para usar Gemini.');
  }

  // To switch Gemini models or endpoints later, update only these constants.
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: buildPrompt(description),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseJsonSchema: RESPONSE_SCHEMA,
      },
    }),
  });

  const payload = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'No se pudo obtener una sugerencia ICE desde Gemini.');
  }

  const rawJson = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

  if (!rawJson) {
    throw new Error('Gemini no devolvio una sugerencia ICE valida.');
  }

  let parsedValues: unknown;

  try {
    parsedValues = JSON.parse(rawJson);
  } catch {
    throw new Error('Gemini devolvio una respuesta en un formato inesperado.');
  }

  const values = sanitizeICEValues((parsedValues ?? {}) as Record<string, unknown>);

  if (values.impact === null || values.confidence === null || values.ease === null) {
    throw new Error('Gemini no devolvio los tres valores ICE esperados.');
  }

  return values;
}

function buildPrompt(description: string): string {
  return [
    'Analiza la siguiente tarea usando el modelo ICE.',
    'Devuelve valores enteros entre 1 y 10 para impact, confidence y ease.',
    'No anadas explicaciones ni texto adicional fuera del JSON solicitado.',
    `Descripcion: ${description}`,
  ].join('\n');
}
