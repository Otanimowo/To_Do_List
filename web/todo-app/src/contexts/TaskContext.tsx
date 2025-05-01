import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskCreate, TaskUpdate, TaskFilter, TaskState, TaskContextType } from '../types/task';
import { tasksApi } from '../services/api';
import { useAuth } from './AuthContext';

// Initial state
const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: {},
};

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Task provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TaskState>(initialState);
  const { isAuthenticated } = useAuth();

  // Load tasks when authenticated or filter changes
  useEffect(() => {
    if (isAuthenticated) {
      getTasks(state.filter);
    }
  }, [isAuthenticated, state.filter]);

  // Get all tasks with optional filtering
  const getTasks = async (filter?: TaskFilter) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const tasks = await tasksApi.getTasks(filter);
      setState({
        ...state,
        tasks,
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Failed to load tasks. Please try again.',
      });
    }
  };

  // Get a specific task
  const getTask = async (id: string): Promise<Task> => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const task = await tasksApi.getTask(id);
      return task;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Failed to load task. Please try again.',
      });
      throw error;
    } finally {
      setState({ ...state, isLoading: false });
    }
  };

  // Create a new task
  const createTask = async (task: TaskCreate): Promise<Task> => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const newTask = await tasksApi.createTask(task);
      setState({
        ...state,
        tasks: [...state.tasks, newTask],
        isLoading: false,
      });
      return newTask;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Failed to create task. Please try again.',
      });
      throw error;
    }
  };

  // Update a task
  const updateTask = async (id: string, task: TaskUpdate): Promise<Task> => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const updatedTask = await tasksApi.updateTask(id, task);
      setState({
        ...state,
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t),
        isLoading: false,
      });
      return updatedTask;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Failed to update task. Please try again.',
      });
      throw error;
    }
  };

  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      await tasksApi.deleteTask(id);
      setState({
        ...state,
        tasks: state.tasks.filter(t => t.id !== id),
        isLoading: false,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Failed to delete task. Please try again.',
      });
      throw error;
    }
  };

  // Mark task as completed
  const completeTask = async (id: string): Promise<Task> => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const updatedTask = await tasksApi.completeTask(id);
      setState({
        ...state,
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t),
        isLoading: false,
      });
      return updatedTask;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Failed to complete task. Please try again.',
      });
      throw error;
    }
  };

  // Mark task as not completed
  const uncompleteTask = async (id: string): Promise<Task> => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const updatedTask = await tasksApi.uncompleteTask(id);
      setState({
        ...state,
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t),
        isLoading: false,
      });
      return updatedTask;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Failed to uncomplete task. Please try again.',
      });
      throw error;
    }
  };

  // Set filter for tasks
  const setFilter = (filter: TaskFilter) => {
    setState({ ...state, filter });
  };

  // Context value
  const value: TaskContextType = {
    ...state,
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    setFilter,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Hook for easy context use
export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext; 