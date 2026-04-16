import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { ICEValues, IceField, Task } from '../../types/task';
import { TaskCard } from '../TaskCard/TaskCard';

type TaskListProps = {
  tasks: Task[];
  loadingTaskId: string | null;
  onEditTask: (task: Task) => void;
  onCalculateAI: (task: Task) => void;
  onIceCommit: (taskId: string, values: ICEValues) => void;
};

export function TaskList({
  tasks,
  loadingTaskId,
  onEditTask,
  onCalculateAI,
  onIceCommit,
}: TaskListProps) {
  if (!tasks.length) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          borderStyle: 'dashed',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          No hay tareas creadas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pulsa en &quot;Nueva tarea&quot; para empezar a priorizar.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isCalculating={loadingTaskId === task.id}
          onEdit={onEditTask}
          onCalculateAI={onCalculateAI}
          onIceCommit={onIceCommit}
        />
      ))}
    </Stack>
  );
}
