import { useEffect, useState, type FormEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { TaskFormValues } from '../../types/task';
import { countWords, DESCRIPTION_MAX_WORDS, isDescriptionWithinLimit } from '../../utils/ice';

type TaskFormProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues: TaskFormValues;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
};

type FormErrors = {
  name?: string;
  description?: string;
};

export function TaskForm({ open, mode, initialValues, onClose, onSubmit }: TaskFormProps) {
  const [formValues, setFormValues] = useState<TaskFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormValues(initialValues);
    setErrors({});
  }, [initialValues, open]);

  const wordCount = countWords(formValues.description);

  const title = mode === 'create' ? 'Nueva tarea' : 'Editar tarea';
  const submitLabel = mode === 'create' ? 'Guardar' : 'Guardar cambios';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(formValues);

    if (nextErrors.name || nextErrors.description) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      name: formValues.name.trim(),
      description: formValues.description.trim(),
    });
  }

  function handleFieldChange(field: keyof TaskFormValues, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label="Nombre"
              value={formValues.name}
              onChange={(event) => handleFieldChange('name', event.target.value)}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Descripcion"
              value={formValues.description}
              onChange={(event) => handleFieldChange('description', event.target.value)}
              error={Boolean(errors.description)}
              helperText={errors.description ?? `${wordCount}/${DESCRIPTION_MAX_WORDS} palabras`}
              fullWidth
              multiline
              minRows={5}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function validateForm(values: TaskFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'El nombre es obligatorio.';
  }

  if (!values.description.trim()) {
    errors.description = 'La descripcion es obligatoria.';
  } else if (!isDescriptionWithinLimit(values.description)) {
    errors.description = `La descripcion no puede superar ${DESCRIPTION_MAX_WORDS} palabras.`;
  }

  return errors;
}
