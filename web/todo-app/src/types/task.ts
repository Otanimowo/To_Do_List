export interface Task {
  id: string;
  description: string;
  completed: boolean;
  priority: number;
  due_date?: string;
  category?: string;
  notes?: string;
  created_at: string;
  modified_at: string;
  user_id?: string;
}

export interface TaskCreate {
  description: string;
  completed?: boolean;
  priority?: number;
  due_date?: string;
  category?: string;
  notes?: string;
}

export interface TaskUpdate {
  description?: string;
  completed?: boolean;
  priority?: number;
  due_date?: string;
  category?: string;
  notes?: string;
}

export interface TaskFilter {
  completed?: boolean;
  category?: string;
  priority?: number;
}

export interface TaskContextType extends TaskState {
  getTasks: (filter?: TaskFilter) => Promise<void>;
  getTask: (id: string) => Promise<Task>;
  createTask: (task: TaskCreate) => Promise<Task>;
  updateTask: (id: string, task: TaskUpdate) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<Task>;
  uncompleteTask: (id: string) => Promise<Task>;
  setFilter: (filter: TaskFilter) => void;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: TaskFilter;
} 