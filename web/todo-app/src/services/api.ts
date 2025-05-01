import axios from 'axios';
import { 
  User, 
  LoginCredentials, 
  UserCreate, 
  UserUpdate,
  AuthResponse 
} from '../types/auth';
import { 
  Task, 
  TaskCreate, 
  TaskUpdate, 
  TaskFilter 
} from '../types/task';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Authentication API service
export const authApi = {
  // Login and get access token
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<AuthResponse>('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Register new user
  register: async (userData: UserCreate): Promise<User> => {
    const response = await api.post<User>('/register', userData);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userData: Partial<UserUpdate>): Promise<User> => {
    const response = await api.put<User>('/users/me', userData);
    return response.data;
  },
};

// Tasks API service
export const tasksApi = {
  // Get all tasks with optional filters
  getTasks: async (filter?: TaskFilter): Promise<Task[]> => {
    const params = filter || {};
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  // Get a task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (task: TaskCreate): Promise<Task> => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  // Update a task
  updateTask: async (id: string, task: TaskUpdate): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Mark a task as completed
  completeTask: async (id: string): Promise<Task> => {
    const response = await api.post<Task>(`/tasks/${id}/complete`);
    return response.data;
  },

  // Mark task as not completed
  uncompleteTask: async (id: string): Promise<Task> => {
    const response = await api.post<Task>(`/tasks/${id}/uncomplete`);
    return response.data;
  },
};

export default api; 