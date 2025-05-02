import React from 'react';
import {
  Box,
  Alert,
  Fade,
} from '@mui/material';
import { Task } from '../../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}) => {
  if (tasks.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
        No tasks found. Try adjusting your filters or create a new task.
      </Alert>
    );
  }

  const handleEdit = (task: Task) => {
    onEdit(task);
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    if (onToggleComplete) {
      onToggleComplete(id);
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {tasks.map((task) => (
        <Fade key={task.id} in={true} timeout={300}>
          <div>
            <TaskItem
              task={task}
              onDelete={handleDelete}
              onEdit={() => handleEdit(task)}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </Fade>
      ))}
    </Box>
  );
};

export default TaskList; 