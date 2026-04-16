import { useState } from 'react';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Navbar } from './components/Navbar/Navbar';
import { PriorityModal } from './components/PriorityModal/PriorityModal';
import { TaskForm } from './components/TaskForm/TaskForm';
import { TaskList } from './components/TaskList/TaskList';
import type { ICEValues, PrioritySuggestion, Task, TaskFormValues } from './types/task';
import { getSuggestedICEValues } from './utils/geminiApi';
import { sortTasksByScore } from './utils/ice';

type Feedback = {
  severity: 'success' | 'error';
  message: string;
};

const emptyFormValues: TaskFormValues = {
  name: '',
  description: '',
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [prioritySuggestion, setPrioritySuggestion] = useState<PrioritySuggestion | null>(null);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const sortedTasks = sortTasksByScore(tasks);
  const editingTask = tasks.find((task) => task.id === editingTaskId) ?? null;
  const geminiConfigured = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  function handleOpenCreateTask() {
    setFormMode('create');
    setEditingTaskId(null);
    setFormOpen(true);
  }

  function handleOpenEditTask(task: Task) {
    setFormMode('edit');
    setEditingTaskId(task.id);
    setFormOpen(true);
  }

  function handleCloseTaskForm() {
    setFormOpen(false);
  }

  function handleSubmitTaskForm(values: TaskFormValues) {
    if (formMode === 'create') {
      setTasks((currentTasks) => [
        ...currentTasks,
        {
          id: crypto.randomUUID(),
          name: values.name,
          description: values.description,
          ice: {
            impact: null,
            confidence: null,
            ease: null,
          },
        },
      ]);

      setFeedback({
        severity: 'success',
        message: 'Tarea creada correctamente.',
      });
    } else if (editingTaskId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                name: values.name,
                description: values.description,
              }
            : task,
        ),
      );

      setFeedback({
        severity: 'success',
        message: 'Tarea actualizada correctamente.',
      });
    }

    setFormOpen(false);
  }

  function handleIceCommit(taskId: string, values: ICEValues) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ice: values,
            }
          : task,
      ),
    );
  }

  async function handleCalculateAI(task: Task) {
    setLoadingTaskId(task.id);

    try {
      const values = await getSuggestedICEValues(task.description);

      setPrioritySuggestion({
        taskId: task.id,
        taskName: task.name,
        values,
      });
    } catch (error) {
      setFeedback({
        severity: 'error',
        message: error instanceof Error ? error.message : 'No se pudo calcular ICE con IA.',
      });
    } finally {
      setLoadingTaskId(null);
    }
  }

  function handleAcceptSuggestedValues() {
    if (!prioritySuggestion) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === prioritySuggestion.taskId
          ? {
              ...task,
              ice: prioritySuggestion.values,
            }
          : task,
      ),
    );

    setPrioritySuggestion(null);
    setFeedback({
      severity: 'success',
      message: 'Valores ICE aplicados.',
    });
  }

  function handleCloseSuggestion() {
    setPrioritySuggestion(null);
  }

  function handleCloseFeedback() {
    setFeedback(null);
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              background:
                'linear-gradient(135deg, rgba(11,31,44,0.96) 0%, rgba(16,88,111,0.96) 100%)',
              color: 'common.white',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 'auto -10% -30% auto',
                width: 220,
                height: 220,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                filter: 'blur(10px)',
              }}
            />

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              sx={{
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
              }}
            >
              <Box sx={{ maxWidth: 620 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  Prioriza tareas con ICE
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.82)' }}>
                  Crea tareas, ajusta Impacto, Confianza y Facilidad manualmente o calcula una
                  sugerencia con Gemini. La lista se reordena automaticamente por puntuacion ICE.
                </Typography>
                {!geminiConfigured && (
                  <Typography variant="body2" sx={{ mt: 1.5, color: 'rgba(255, 255, 255, 0.72)' }}>
                    Para habilitar la IA, anade tu clave en <strong>VITE_GEMINI_API_KEY</strong>.
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddCircleOutlinedIcon />}
                onClick={handleOpenCreateTask}
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'primary.dark',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: 'secondary.light',
                  },
                }}
              >
                Nueva tarea
              </Button>
            </Stack>
          </Paper>

          <TaskList
          tasks={sortedTasks}
          loadingTaskId={loadingTaskId}
          onEditTask={handleOpenEditTask}
          onCalculateAI={handleCalculateAI}
          onIceCommit={handleIceCommit}
        />
      </Stack>
      </Container>

      <TaskForm
        open={formOpen}
        mode={formMode}
        initialValues={
          editingTask
            ? {
                name: editingTask.name,
                description: editingTask.description,
              }
            : emptyFormValues
        }
        onClose={handleCloseTaskForm}
        onSubmit={handleSubmitTaskForm}
      />

      <PriorityModal
        suggestion={prioritySuggestion}
        open={Boolean(prioritySuggestion)}
        onAccept={handleAcceptSuggestedValues}
        onManualEdit={handleCloseSuggestion}
      />

      {feedback ? (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={handleCloseFeedback}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseFeedback} severity={feedback.severity} variant="filled">
            {feedback.message}
          </Alert>
        </Snackbar>
      ) : null}
    </Box>
  );
}
