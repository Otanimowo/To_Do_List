/**
 * API Service Module
 * 
 * This module provides API services for authentication and task management.
 * For development purposes, it uses mock implementation instead of real API calls.
 * 
 * In a production environment, you would replace these mock implementations
 * with actual API calls using axios or another HTTP client.
 */

// Import necessary types
// import axios from 'axios';
import { 
  User, 
  LoginCredentials, 
  UserCreate, 
  UserUpdate,
  AuthResponse 
} from '../types';
import { 
  Task, 
  TaskCreate, 
  TaskUpdate, 
  TaskFilter 
} from '../types';

// Debug flag to enable/disable console logging
// Set to false for production builds
const DEBUG = true;

// Logger function that only logs when DEBUG is true
const log = {
  info: (message: string, ...args: any[]) => {
    if (DEBUG) console.log(message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    if (DEBUG) console.error(message, ...args);
  }
};

/**
 * Extended user type with password for mock API implementation
 * In a real implementation, passwords would be handled securely on the backend
 */
interface MockUser extends User {
  password?: string;
}

/**
 * Mock user data for development and testing
 */
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password', // Default password for test user
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    modified_at: '2023-01-01T00:00:00Z'
  }
];

/**
 * Mock task data for development and testing
 */
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    description: 'Complete project documentation',
    completed: false,
    priority: 3,
    category: 'Work',
    due_date: '2023-05-20T00:00:00Z',
    notes: 'Need to include all API endpoints and examples',
    created_at: '2023-05-01T00:00:00Z',
    modified_at: '2023-05-01T00:00:00Z',
    user_id: '1'
  },
  {
    id: '2',
    description: 'Buy groceries',
    completed: true,
    priority: 2,
    category: 'Personal',
    due_date: '2023-05-15T00:00:00Z',
    notes: 'Milk, eggs, bread, fruits',
    created_at: '2023-05-10T00:00:00Z',
    modified_at: '2023-05-12T00:00:00Z',
    user_id: '1'
  },
  {
    id: '3',
    description: 'Schedule dentist appointment',
    completed: false,
    priority: 2,
    category: 'Health',
    due_date: '2023-05-30T00:00:00Z',
    created_at: '2023-05-05T00:00:00Z',
    modified_at: '2023-05-05T00:00:00Z',
    user_id: '1'
  }
];

// Initialize with the first mock user for development convenience
let currentUser: MockUser | null = MOCK_USERS[0];
let tasks = [...MOCK_TASKS];

/**
 * Helper function to check if a valid authentication token exists
 * @returns {boolean} True if token exists, false otherwise
 */
const checkToken = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Simulates API request delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after the specified delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock Authentication API Service
 * Provides authentication-related functionality (login, register, etc.)
 */
export const authApi = {
  /**
   * Authenticates a user with username and password
   * @param {LoginCredentials} credentials - User login credentials
   * @returns {Promise<AuthResponse>} Authentication response with token
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(500);
    log.info('Mock API: Attempting login for:', credentials.username);
    
    const user = MOCK_USERS.find(u => u.username === credentials.username);
    
    // Check if user exists
    if (!user) {
      log.error('Mock API: User not found:', credentials.username);
      throw new Error('Invalid username or password');
    }
    
    // Check if password matches
    // Note: In a real app, you would use a secure password hashing library
    if (user.password !== credentials.password) {
      log.error('Mock API: Password mismatch for user:', credentials.username);
      throw new Error('Invalid username or password');
    }
    
    log.info('Mock API: Login successful for user:', user.username);
    currentUser = user;
    const token = 'mock-token-' + Math.random().toString(36).substring(2);
    localStorage.setItem('token', token);
    
    return {
      access_token: token,
      token_type: 'bearer'
    };
  },

  /**
   * Registers a new user
   * @param {UserCreate} userData - New user data
   * @returns {Promise<User>} Created user object
   */
  register: async (userData: UserCreate): Promise<User> => {
    await delay(700);
    log.info('Mock API: Registering new user:', userData.username);
    
    // Check if username already exists
    if (MOCK_USERS.some(u => u.username === userData.username)) {
      log.error('Mock API: Username already exists:', userData.username);
      throw new Error('Username already exists');
    }
    
    const newUser: MockUser = {
      id: (MOCK_USERS.length + 1).toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password, // Store password for mock authentication
      is_active: true,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString()
    };
    
    log.info('Mock API: User registered successfully:', newUser.username);
    MOCK_USERS.push(newUser);
    currentUser = newUser;
    
    return newUser;
  },

  /**
   * Retrieves the currently authenticated user
   * @returns {Promise<User>} Current user data
   */
  getCurrentUser: async (): Promise<User> => {
    await delay(300);
    
    if (!checkToken()) {
      log.error('Mock API: Not authenticated when getting current user');
      throw new Error('Not authenticated');
    }
    
    // Make a copy without the password field
    if (currentUser) {
      const { password, ...userWithoutPassword } = currentUser;
      return userWithoutPassword;
    }
    
    // Return mock user for development
    const { password, ...defaultUser } = MOCK_USERS[0];
    return defaultUser;
  },

  /**
   * Updates the current user's profile information
   * @param {Partial<UserUpdate>} userData - User data to update
   * @returns {Promise<User>} Updated user object
   */
  updateUserProfile: async (userData: Partial<UserUpdate>): Promise<User> => {
    await delay(500);
    
    if (!checkToken()) {
      log.error('Mock API: Not authenticated when updating profile');
      throw new Error('Not authenticated');
    }
    
    if (!currentUser) {
      currentUser = MOCK_USERS[0]; // Fallback for development
    }
    
    const updatedUser: MockUser = {
      ...currentUser,
      ...userData,
      modified_at: new Date().toISOString()
    };
    
    // Update in the MOCK_USERS array
    const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser?.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = updatedUser;
    }
    
    currentUser = updatedUser;
    
    // Return without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
};

/**
 * Mock Tasks API Service
 * Provides task management functionality (create, read, update, delete)
 */
export const tasksApi = {
  /**
   * Retrieves tasks with optional filtering
   * @param {TaskFilter} [filter] - Optional filter criteria
   * @returns {Promise<Task[]>} Array of tasks matching the filter
   */
  getTasks: async (filter?: TaskFilter): Promise<Task[]> => {
    await delay(300);
    
    if (!currentUser) {
      return [];
    }
    
    let filteredTasks = [...tasks];
    
    if (filter) {
      if (filter.completed !== undefined) {
        filteredTasks = filteredTasks.filter(t => t.completed === filter.completed);
      }
      
      if (filter.category) {
        filteredTasks = filteredTasks.filter(t => t.category === filter.category);
      }
      
      if (filter.priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === filter.priority);
      }
    }
    
    return filteredTasks;
  },

  /**
   * Retrieves a single task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Task>} Task object
   */
  getTask: async (id: string): Promise<Task> => {
    await delay(200);
    
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    return task;
  },

  /**
   * Creates a new task
   * @param {TaskCreate} task - Task data to create
   * @returns {Promise<Task>} Created task object
   */
  createTask: async (task: TaskCreate): Promise<Task> => {
    await delay(500);
    
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      description: task.description,
      completed: task.completed || false,
      priority: task.priority || 1,
      category: task.category,
      due_date: task.due_date,
      notes: task.notes,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      user_id: currentUser.id
    };
    
    tasks.push(newTask);
    
    return newTask;
  },

  /**
   * Updates an existing task
   * @param {string} id - Task ID
   * @param {TaskUpdate} taskUpdate - Task data to update
   * @returns {Promise<Task>} Updated task object
   */
  updateTask: async (id: string, taskUpdate: TaskUpdate): Promise<Task> => {
    await delay(400);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...taskUpdate,
      modified_at: new Date().toISOString()
    };
    
    tasks[taskIndex] = updatedTask;
    
    return updatedTask;
  },

  /**
   * Deletes a task
   * @param {string} id - Task ID
   * @returns {Promise<void>}
   */
  deleteTask: async (id: string): Promise<void> => {
    await delay(300);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
    }
  },

  /**
   * Marks a task as completed
   * @param {string} id - Task ID
   * @returns {Promise<Task>} Updated task object
   */
  completeTask: async (id: string): Promise<Task> => {
    await delay(200);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      completed: true,
      modified_at: new Date().toISOString()
    };
    
    tasks[taskIndex] = updatedTask;
    
    return updatedTask;
  },

  /**
   * Marks a task as not completed
   * @param {string} id - Task ID
   * @returns {Promise<Task>} Updated task object
   */
  uncompleteTask: async (id: string): Promise<Task> => {
    await delay(200);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      completed: false,
      modified_at: new Date().toISOString()
    };
    
    tasks[taskIndex] = updatedTask;
    
    return updatedTask;
  },
};

// Export API services
const apiServices = { authApi, tasksApi };
export default apiServices; 