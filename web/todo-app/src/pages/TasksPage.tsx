import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon, Sort as SortIcon } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import { useTasks } from '../contexts/TaskContext';
import { Task, TaskCreate, TaskUpdate } from '../types/task';

const TasksPage: React.FC = () => {
  const { tasks, isLoading, error, filter, setFilter, createTask, updateTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [tabValue, setTabValue] = useState(0);

  // Handle opening the form for editing a task
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  // Handle closing the form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(undefined);
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) { // All tasks
      setFilter({ ...filter, completed: undefined });
    } else if (newValue === 1) { // Active tasks
      setFilter({ ...filter, completed: false });
    } else if (newValue === 2) { // Completed tasks
      setFilter({ ...filter, completed: true });
    }
  };

  // Handle category filter change
  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const category = event.target.value as string;
    setFilter({ ...filter, category: category === 'all' ? undefined : category });
  };

  // Handle priority filter change
  const handlePriorityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const priority = event.target.value as number | 'all';
    setFilter({ ...filter, priority: priority === 'all' ? undefined : Number(priority) });
  };

  // Calculate counts for tabs
  const allTasksCount = tasks.length;
  const activeTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  // Get unique categories for filter dropdown (using useMemo to avoid recalculation)
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    tasks.forEach(task => {
      if (task.category) {
        categorySet.add(task.category);
      }
    });
    return ['all', ...Array.from(categorySet)];
  }, [tasks]);

  // Handle form submission
  const handleTaskSubmit = (taskData: TaskCreate | TaskUpdate) => {
    if (taskToEdit && taskToEdit.id) {
      updateTask(taskToEdit.id, taskData as TaskUpdate);
    } else {
      createTask(taskData as TaskCreate);
    }
    handleCloseForm();
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4" component="h1">
            My Tasks
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Task
          </Button>
        </Box>

        <Paper elevation={3} sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label={`All (${allTasksCount})`} />
              <Tab label={`Active (${activeTasksCount})`} />
              <Tab label={`Completed (${completedTasksCount})`} />
            </Tabs>
          </Box>

          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Tooltip title="Filter">
              <IconButton color="primary" sx={{ mr: 1 }}>
                <FilterIcon />
              </IconButton>
            </Tooltip>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2, mb: { xs: 2, sm: 0 } }}>
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={filter.category || 'all'}
                onChange={handleCategoryChange as any}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category || 'none'} value={category || 'none'}>
                    {category === 'all' ? 'All Categories' : category || 'Uncategorized'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="priority-filter-label">Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                id="priority-filter"
                value={filter.priority || 'all'}
                onChange={handlePriorityChange as any}
                label="Priority"
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value={1}>Low</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>High</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ ml: 'auto' }}>
              <Tooltip title="Sort">
                <IconButton color="primary">
                  <SortIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
              <Typography>{error}</Typography>
            </Box>
          ) : tasks.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {tabValue === 0
                  ? "You don't have any tasks yet. Click 'Add Task' to create one!"
                  : tabValue === 1
                  ? "You don't have any active tasks."
                  : "You don't have any completed tasks."}
              </Typography>
            </Box>
          ) : (
            <TaskList 
              tasks={tasks} 
              onEdit={handleEditTask} 
            />
          )}
        </Paper>
      </Container>

      <TaskForm
        open={isFormOpen}
        onClose={handleCloseForm}
        task={taskToEdit}
        onSubmit={handleTaskSubmit}
      />
    </Layout>
  );
};

export default TasksPage; 