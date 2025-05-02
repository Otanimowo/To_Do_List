import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slide,
  IconButton,
  Chip,
  Box,
  Typography,
  useMediaQuery
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {
  Close as CloseIcon,
  Flag as FlagIcon,
  Label as LabelIcon,
  Event as EventIcon,
  Create as CreateIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Task, TaskCreate, TaskUpdate } from '../../types';
import { formatDateForInput } from '../../utils/dateUtils';
import { createLogger } from '../../utils/logger';

// Create module-specific logger
const log = createLogger('TaskForm');

// Slide up transition for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * TaskForm Component Props
 */
interface TaskFormProps {
  /** Whether the form dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Callback when form is submitted */
  onSubmit: (task: TaskCreate | TaskUpdate) => void;
  /** Optional task for editing (undefined for new tasks) */
  task?: Task;
}

// Common categories that might be useful
const SUGGESTED_CATEGORIES = [
  'Work', 'Personal', 'Errands', 'Health', 'Finance', 'Home', 'Learning'
];

// Priority options
const PRIORITY_OPTIONS = [
  { value: 1, label: 'Low', color: 'success' },
  { value: 2, label: 'Medium', color: 'info' },
  { value: 3, label: 'High', color: 'warning' },
  { value: 4, label: 'Urgent', color: 'error' }
];

/**
 * TaskForm Component
 * 
 * Provides a form dialog for creating or editing tasks.
 * Features:
 * - Create new tasks with description, priority, due date, category, and notes
 * - Edit existing tasks
 * - Form validation
 * - Responsive design (full screen on mobile)
 */
const TaskForm: React.FC<TaskFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  task 
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isEditMode = Boolean(task);
  
  // Form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<number>(1);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      log.info('Initializing form with existing task', { taskId: task.id });
      setDescription(task.description || '');
      setCategory(task.category || '');
      setPriority(task.priority || 1);
      setDueDate(task.due_date ? formatDateForInput(task.due_date) : '');
      setNotes(task.notes || '');
    } else {
      // Default values for new task
      log.info('Initializing form for new task');
      setDescription('');
      setCategory('');
      setPriority(1);
      setDueDate('');
      setNotes('');
    }
    setErrors({});
  }, [task, open]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      log.warn('Form validation failed');
      return;
    }
    
    const taskData: TaskCreate | TaskUpdate = {
      description,
      ...(category && { category }),
      priority,
      ...(dueDate && { due_date: dueDate }),
      ...(notes && { notes })
    };
    
    log.info(
      isEditMode ? 'Submitting task update' : 'Submitting new task', 
      { description, priority, hasCategory: !!category, hasDueDate: !!dueDate }
    );
    
    onSubmit(taskData);
    onClose();
  };

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    setCategory(categoryName);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isEditMode ? <EditIcon sx={{ mr: 1 }} /> : <CreateIcon sx={{ mr: 1 }} />}
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Task Description"
              type="text"
              fullWidth
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="What needs to be done?"
              variant="outlined"
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ flexGrow: 1, minWidth: '45%' }} variant="outlined" margin="dense">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as number)}
                  label="Priority"
                  startAdornment={<FlagIcon color={PRIORITY_OPTIONS.find(p => p.value === priority)?.color as any} sx={{ mr: 1 }} />}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlagIcon color={option.color as any} sx={{ mr: 1 }} />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                margin="dense"
                id="dueDate"
                label="Due Date"
                type="date"
                sx={{ flexGrow: 1, minWidth: '45%' }}
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: <EventIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Box>
            
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                startAdornment={category ? <LabelIcon sx={{ mr: 1, color: 'primary.main' }} /> : null}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {SUGGESTED_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Suggested categories:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                {SUGGESTED_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    size="small"
                    color={category === cat ? 'primary' : 'default'}
                    variant={category === cat ? 'filled' : 'outlined'}
                    onClick={() => handleCategorySelect(cat)}
                    icon={<LabelIcon />}
                  />
                ))}
              </Box>
            </Box>
            
            <TextField
              margin="dense"
              id="notes"
              label="Notes"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              variant="outlined"
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditMode ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 