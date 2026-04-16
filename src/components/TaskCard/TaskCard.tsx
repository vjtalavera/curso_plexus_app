import { useEffect, useState, type FocusEvent } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { ICEValues, IceField, Task } from '../../types/task';
import { calculateICEScore, parseIceInput } from '../../utils/ice';

type TaskCardProps = {
  task: Task;
  isCalculating: boolean;
  onEdit: (task: Task) => void;
  onCalculateAI: (task: Task) => void;
  onIceCommit: (taskId: string, values: ICEValues) => void;
};

const iceFields: Array<{ key: IceField; label: string }> = [
  { key: 'impact', label: 'Impacto' },
  { key: 'confidence', label: 'Confianza' },
  { key: 'ease', label: 'Facilidad' },
];

type DraftICEValues = Record<IceField, string>;

export function TaskCard({ task, isCalculating, onEdit, onCalculateAI, onIceCommit }: TaskCardProps) {
  const [draftIce, setDraftIce] = useState<DraftICEValues>(() => toDraftIceValues(task.ice));
  const [isEditingIce, setIsEditingIce] = useState(false);

  useEffect(() => {
    if (isEditingIce) {
      return;
    }

    setDraftIce(toDraftIceValues(task.ice));
  }, [isEditingIce, task.ice]);

  const draftValues = {
    impact: parseIceInput(draftIce.impact),
    confidence: parseIceInput(draftIce.confidence),
    ease: parseIceInput(draftIce.ease),
  };
  const score = calculateICEScore(draftValues);

  function handleDraftChange(field: IceField, nextValue: string) {
    setDraftIce((currentDraft) => ({
      ...currentDraft,
      [field]: sanitizeDraftValue(nextValue),
    }));
  }

  function handleIceFocus() {
    setIsEditingIce(true);
  }

  function handleIceBlur(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
      return;
    }

    setIsEditingIce(false);
    onIceCommit(task.id, draftValues);
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        borderColor: 'rgba(11, 31, 44, 0.1)',
        boxShadow: '0 24px 40px rgba(11, 31, 44, 0.06)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>
                {task.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {task.description}
              </Typography>
            </Box>

            <Button
              variant="text"
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEdit(task)}
              sx={{ flexShrink: 0 }}
            >
              Editar
            </Button>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            onFocusCapture={handleIceFocus}
            onBlurCapture={handleIceBlur}
          >
            {iceFields.map((field) => (
              <TextField
                key={field.key}
                label={field.label}
                type="text"
                size="small"
                value={draftIce[field.key]}
                onChange={(event) => handleDraftChange(field.key, event.target.value)}
                slotProps={{
                  htmlInput: {
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 2,
                  },
                }}
                helperText="Escala 1-10"
                fullWidth
              />
            ))}
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <Chip
              label={`ICE: ${score.toFixed(1)}`}
              color={score > 0 ? 'primary' : 'default'}
              sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
            />

            <Button
              variant="contained"
              startIcon={<AutoAwesomeOutlinedIcon />}
              onClick={() => onCalculateAI(task)}
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculando...' : 'Calcular ICE con IA'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function toDraftIceValues(ice: ICEValues): DraftICEValues {
  return {
    impact: ice.impact?.toString() ?? '',
    confidence: ice.confidence?.toString() ?? '',
    ease: ice.ease?.toString() ?? '',
  };
}

function sanitizeDraftValue(rawValue: string): string {
  const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 2);

  if (!digitsOnly) {
    return '';
  }

  const numericValue = Number(digitsOnly);

  if (numericValue < 1) {
    return '1';
  }

  if (numericValue > 10) {
    return '10';
  }

  return digitsOnly;
}
