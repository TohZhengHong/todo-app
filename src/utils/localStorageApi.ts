/**
 * Local Storage API utility for task management
 * This provides the same interface as the MongoDB API but uses localStorage instead
 */

import { Task } from './api';

// Key for storing tasks in localStorage
const TASKS_STORAGE_KEY = 'taskmaster_tasks';

// Helper to generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Helper to get all tasks from localStorage
const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

// Helper to save tasks to localStorage
const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

/**
 * Fetch all tasks from localStorage
 */
export const fetchLocalTasks = async (): Promise<Task[]> => {
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 300));
  return getTasks();
};

/**
 * Fetch a single task by ID from localStorage
 */
export const fetchLocalTask = async (id: string): Promise<Task> => {
  const tasks = getTasks();
  const task = tasks.find(t => t._id === id);
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  return task;
};

/**
 * Create a new task in localStorage
 */
export const createLocalTask = async (task: Omit<Task, '_id'>): Promise<Task> => {
  const tasks = getTasks();
  
  const newTask: Task = {
    ...task,
    _id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  
  return newTask;
};

/**
 * Update an existing task in localStorage
 */
export const updateLocalTask = async (id: string, taskUpdate: Partial<Task>): Promise<Task> => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t._id === id);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...taskUpdate,
    updatedAt: new Date().toISOString()
  };
  
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  
  return updatedTask;
};

/**
 * Delete a task from localStorage
 */
export const deleteLocalTask = async (id: string): Promise<void> => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(t => t._id !== id);
  
  if (filteredTasks.length === tasks.length) {
    throw new Error('Task not found');
  }
  
  saveTasks(filteredTasks);
};
