import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { PrioritySuggestion } from '../../types/task';
import { calculateICEScore } from '../../utils/ice';

type PriorityModalProps = {
  suggestion: PrioritySuggestion | null;
  open: boolean;
  onAccept: () => void;
  onManualEdit: () => void;
};

export function PriorityModal({ suggestion, open, onAccept, onManualEdit }: PriorityModalProps) {
  if (!suggestion) {
    return null;
  }

  const score = calculateICEScore(suggestion.values);

  return (
    <Dialog open={open} onClose={onManualEdit} fullWidth maxWidth="xs">
      <DialogTitle>Sugerencia de valores ICE (IA)</DialogTitle>

      <DialogContent>
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            Tarea: {suggestion.taskName}
          </Typography>

          <MetricCard label="Impacto sugerido" value={suggestion.values.impact} />
          <MetricCard label="Confianza sugerida" value={suggestion.values.confidence} />
          <MetricCard label="Facilidad sugerida" value={suggestion.values.ease} />
          <MetricCard label="ICE total" value={score.toFixed(1)} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onManualEdit}>Editar manualmente</Button>
        <Button variant="contained" onClick={onAccept}>
          Aceptar valores
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type MetricCardProps = {
  label: string;
  value: number | string | null;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {value ?? '-'}
      </Typography>
    </Paper>
  );
}
