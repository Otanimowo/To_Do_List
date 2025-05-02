import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  Tooltip,
  alpha
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  CalendarToday as CalendarIcon,
  EventNote as EventIcon,
  Label as LabelIcon,
  Flag as FlagIcon,
  StickyNote2 as NotesIcon
} from '@mui/icons-material';
import { Task } from '../../types';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { createLogger } from '../../utils/logger';

// Create module-specific logger
const log = createLogger('TaskItem');

/**
 * Task Item Component Props
 */
interface TaskItemProps {
  /** The task to display */
  task: Task;
  /** Callback when task is deleted */
  onDelete: (id: string) => void;
  /** Callback when task should be edited */
  onEdit: (task: Task) => void;
  /** Callback when task completion status is toggled */
  onToggleComplete: (id: string, completed: boolean) => void;
}

/**
 * Priority level definitions with labels and colors
 */
const PRIORITY_LEVELS = {
  1: { label: 'Low', color: 'success.main' },
  2: { label: 'Medium', color: 'info.main' },
  3: { label: 'High', color: 'warning.main' },
  4: { label: 'Urgent', color: 'error.main' }
};

/**
 * TaskItem Component
 * 
 * Displays a single task with interactive UI elements for managing tasks.
 * Features:
 * - Toggle completion status
 * - Expandable view for details
 * - Contextual menu for actions
 * - Visual indicators for priority, category, and due dates
 * - Highlighting for overdue tasks
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onEdit,
  onToggleComplete,
}) => {
  const theme = useMuiTheme();
  const [expanded, setExpanded] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  /**
   * Formats a date string for display
   * @param {string} dateString - ISO date string
   * @returns {string|null} Formatted date or null if invalid
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      log.error('Error formatting date:', error);
      return null;
    }
  };
  
  /**
   * Determines if a task is overdue based on its due date
   * @returns {boolean} True if task is overdue and not completed
   */
  const isOverdue = (): boolean => {
    if (task.completed || !task.due_date) return false;
    
    const dueDate = new Date(task.due_date);
    const today = new Date();
    
    // Reset hours to compare only dates
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  const formattedDueDate = formatDate(task.due_date);
  const formattedCreatedDate = formatDate(task.created_at);
  const taskIsOverdue = isOverdue();

  // Handle menu open/close
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle task actions
  const handleDelete = () => {
    handleMenuClose();
    onDelete(task.id);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(task);
  };

  const handleToggleComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onToggleComplete(task.id, event.target.checked);
  };

  // Handle card click to expand/collapse
  const handleCardClick = () => {
    setExpanded(!expanded);
  };

  // Get priority display info
  const getPriorityInfo = () => {
    const level = task.priority as keyof typeof PRIORITY_LEVELS;
    return PRIORITY_LEVELS[level] || { label: 'None', color: 'text.secondary' };
  };

  const priorityInfo = getPriorityInfo();

  return (
    <Card
      sx={{
        mb: 2,
        position: 'relative',
        transition: theme.transitions.create(['transform', 'box-shadow'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
        ...(task.completed && {
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          boxShadow: theme.shadows[1],
        }),
        cursor: 'pointer',
        borderLeft: `4px solid ${priorityInfo.color}`
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Tooltip title={task.completed ? "Mark as incomplete" : "Mark as complete"}>
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              onClick={(e) => e.stopPropagation()}
              color="primary"
              sx={{ p: 0.5, mr: 1 }}
            />
          </Tooltip>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body1"
              component="div"
              sx={{
                fontWeight: 500,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.description}
            </Typography>
            
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              mt: 1,
              gap: 1
            }}>
              {task.category && (
                <Chip
                  icon={<LabelIcon fontSize="small" />}
                  label={task.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              
              {task.priority && (
                <Chip
                  icon={<FlagIcon fontSize="small" />}
                  label={priorityInfo.label}
                  size="small"
                  sx={{
                    color: priorityInfo.color,
                    borderColor: priorityInfo.color,
                  }}
                  variant="outlined"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              
              {formattedDueDate && (
                <Chip
                  icon={<EventIcon fontSize="small" />}
                  label={taskIsOverdue 
                    ? `Overdue: ${formattedDueDate}` 
                    : formattedDueDate}
                  size="small"
                  color={taskIsOverdue ? "error" : "default"}
                  variant="outlined"
                  onClick={(e) => e.stopPropagation()}
                  sx={taskIsOverdue ? {
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
                      '70%': { boxShadow: '0 0 0 6px rgba(211, 47, 47, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
                    }
                  } : {}}
                />
              )}
            </Box>
          </Box>
          
          <Tooltip title="Task options">
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 1 }} />
          {task.notes && (
            <Box sx={{ display: 'flex', mt: 2, alignItems: 'flex-start' }}>
              <NotesIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {task.notes}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            {formattedCreatedDate && (
              <Chip
                icon={<CalendarIcon fontSize="small" />}
                label={`Created: ${formattedCreatedDate}`}
                size="small"
                variant="outlined"
                color="default"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TaskItem; 