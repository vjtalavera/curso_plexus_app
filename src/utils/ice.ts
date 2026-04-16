import type { CompleteICEValues, ICEValues, Task } from '../types/task';

export const DESCRIPTION_MAX_WORDS = 200;
const ICE_MIN = 1;
const ICE_MAX = 10;

export function countWords(text: string): number {
  const trimmedText = text.trim();
  return trimmedText ? trimmedText.split(/\s+/).length : 0;
}

export function isDescriptionWithinLimit(text: string): boolean {
  return countWords(text) <= DESCRIPTION_MAX_WORDS;
}

export function parseIceInput(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return clampIceValue(parsedValue);
}

export function sanitizeICEValues(values: Partial<Record<keyof ICEValues, unknown>>): ICEValues {
  return {
    impact: sanitizeICEValue(values.impact),
    confidence: sanitizeICEValue(values.confidence),
    ease: sanitizeICEValue(values.ease),
  };
}

export function isICEComplete(ice: ICEValues): ice is CompleteICEValues {
  return [ice.impact, ice.confidence, ice.ease].every(
    (value): value is number => typeof value === 'number',
  );
}

export function calculateICEScore(ice: ICEValues): number {
  if (!isICEComplete(ice)) {
    return 0;
  }

  // The project wireframes show ICE as the arithmetic mean of the three fields.
  return Number(((ice.impact + ice.confidence + ice.ease) / 3).toFixed(1));
}

export function sortTasksByScore(tasks: Task[]): Task[] {
  return [...tasks].sort((taskA, taskB) => calculateICEScore(taskB.ice) - calculateICEScore(taskA.ice));
}

function sanitizeICEValue(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return clampIceValue(value);
}

function clampIceValue(value: number): number {
  return Math.min(ICE_MAX, Math.max(ICE_MIN, Math.round(value)));
}
