'use client';

import { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';
import { CheckIcon, Cross2Icon, Pencil1Icon, DotsVerticalIcon, CalendarIcon, ExclamationTriangleIcon, UpdateIcon, PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { fetchTasks, updateTask, deleteTask, Task } from '@/utils/api';

interface TaskListProps {
  initialTasks?: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialTasks);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Fetch tasks from the API if initialTasks is not provided
  useEffect(() => {
    if (initialTasks) {
      // If initialTasks is provided, use it directly
      setTasks(initialTasks);
      setLoading(false);
      return;
    }
    
    const getTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    getTasks();
  }, [initialTasks]);
  
  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;
      
      const updatedTask = await updateTask(taskId, { completed: !task.completed });
      
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      
      setToastMessage(`Task marked as ${updatedTask.completed ? 'completed' : 'active'}`);
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to update task:', err);
      setToastMessage('Failed to update task status');
      setToastOpen(true);
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      setTaskToDelete(null);
      
      setToastMessage('Task deleted successfully');
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setToastMessage('Failed to delete task');
      setToastOpen(true);
    }
  };
  
  const getPriorityStyles = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': 
        return { 
          bg: '#FEE2E2', // red-100 
          text: '#DC2626', // red-600
          icon: <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
        };
      case 'medium': 
        return { 
          bg: '#FEF3C7', // amber-100 
          text: '#D97706', // amber-600
          icon: null
        };
      case 'low': 
        return { 
          bg: '#DBEAFE', // blue-100 
          text: '#2563EB', // blue-600
          icon: null
        };
      default: 
        return { 
          bg: '#F3F4F6', // gray-100 
          text: '#4B5563', // gray-600
          icon: null
        };
    }
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    return taskDate < today;
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Tooltip.Provider>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 border-b border-blue-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-blue-800">Your Tasks</h2>
              <p className="text-sm text-blue-600">
                {loading ? 'Loading tasks...' : `${tasks.length} tasks, ${tasks.filter(t => t.completed).length} completed`}
              </p>
            </div>
            <Link 
              href="/tasks/new" 
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-all flex items-center shadow-sm hover:shadow"
            >
              <CheckIcon className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm border-l-4 border-red-500 m-4 rounded">
              {error}
              <button 
                onClick={() => window.location.reload()} 
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="p-8 text-center text-blue-600 flex flex-col items-center">
              <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              Loading your tasks...
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {tasks.length > 0 ? (
                tasks.map(task => {
                  const priorityStyle = getPriorityStyles(task.priority);
                  const overdue = isOverdue(task.dueDate) && !task.completed;
                  
                  return (
                    <li key={task._id} className="p-5 hover:bg-blue-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          <Checkbox.Root
                            className="flex h-5 w-5 appearance-none items-center justify-center rounded-md border border-blue-300 bg-white data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-colors hover:border-blue-400"
                            checked={task.completed}
                            onCheckedChange={() => handleToggleComplete(task._id!)}
                            id={`task-${task._id}`}
                          >
                            <Checkbox.Indicator>
                              <CheckIcon className="h-4 w-4 text-white" />
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {task.title}
                                </p>
                              </Tooltip.Trigger>
                              {task.description && (
                                <Tooltip.Portal>
                                  <Tooltip.Content 
                                    className="max-w-xs bg-gray-800 text-white px-3 py-2 rounded-md text-xs shadow-lg"
                                    sideOffset={5}
                                  >
                                    {task.description}
                                    <Tooltip.Arrow className="fill-gray-800" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              )}
                            </Tooltip.Root>
                            
                            <div className="flex items-center gap-1 ml-4">
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <Link 
                                    href={`/tasks/${task._id}/edit`}
                                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                                  >
                                    <Pencil1Icon className="h-4 w-4" />
                                  </Link>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content 
                                    className="bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg"
                                    sideOffset={5}
                                  >
                                    Edit task
                                    <Tooltip.Arrow className="fill-gray-800" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                              
                              <DropdownMenu.Root>
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <DropdownMenu.Trigger asChild>
                                      <button className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                                        <DotsVerticalIcon className="h-4 w-4" />
                                      </button>
                                    </DropdownMenu.Trigger>
                                  </Tooltip.Trigger>
                                  <Tooltip.Portal>
                                    <Tooltip.Content 
                                      className="bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg"
                                      sideOffset={5}
                                    >
                                      More options
                                      <Tooltip.Arrow className="fill-gray-800" />
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                                
                                <DropdownMenu.Portal>
                                  <DropdownMenu.Content 
                                    className="min-w-[180px] bg-white rounded-lg p-1 shadow-lg border border-gray-100"
                                    sideOffset={5}
                                  >
                                    <DropdownMenu.Item 
                                      className="text-sm px-2 py-1.5 rounded-md outline-none cursor-default flex items-center hover:bg-blue-50 text-gray-700 hover:text-blue-700"
                                      onSelect={() => handleToggleComplete(task._id!)}
                                    >
                                      <CheckIcon className="mr-2 h-4 w-4" />
                                      Mark as {task.completed ? 'incomplete' : 'complete'}
                                    </DropdownMenu.Item>
                                    
                                    <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
                                    
                                    <DropdownMenu.Item 
                                      className="text-sm px-2 py-1.5 rounded-md outline-none cursor-default flex items-center hover:bg-red-50 text-red-600"
                                      onSelect={() => setTaskToDelete(task._id!)}
                                    >
                                      <Cross2Icon className="mr-2 h-4 w-4" />
                                      Delete task
                                    </DropdownMenu.Item>
                                  </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                              </DropdownMenu.Root>
                            </div>
                          </div>
                          
                          <div className="mt-1.5 flex items-center gap-2">
                            <span 
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" 
                              style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.text }}
                            >
                              {priorityStyle.icon}
                              {task.priority}
                            </span>
                            
                            <span className={`text-xs flex items-center ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {overdue && '⚠ Overdue: '}
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="p-8 text-center text-gray-500">
                  <div className="bg-blue-50 rounded-lg p-6 inline-block">
                    <p className="text-blue-700 mb-4">No tasks found</p>
                    <Link 
                      href="/tasks/new"
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-all inline-flex items-center"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Your First Task
                    </Link>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
        
        {/* Delete Task Alert Dialog */}
        <AlertDialog.Root open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl max-w-md w-[90vw]">
              <AlertDialog.Title className="text-xl font-bold text-gray-800 mb-2">
                Delete Task
              </AlertDialog.Title>
              <AlertDialog.Description className="text-gray-600 mb-5">
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialog.Description>
              <div className="flex justify-end gap-3">
                <AlertDialog.Cancel asChild>
                  <button className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium">
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button 
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium shadow-sm"
                    onClick={() => taskToDelete && handleDeleteTask(taskToDelete)}
                  >
                    Delete
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
        
        {/* Toast Notification */}
        <Toast.Root 
          open={toastOpen} 
          onOpenChange={setToastOpen}
          className="bg-white border border-gray-100 rounded-xl shadow-xl p-4 flex items-center gap-3 fixed bottom-4 right-4 w-auto max-w-sm z-50"
        >
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckIcon className="h-5 w-5 text-green-600" />
          </div>
          <Toast.Title className="text-sm font-medium text-gray-800">
            {toastMessage}
          </Toast.Title>
          <Toast.Close className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Cross2Icon className="h-4 w-4" />
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Tooltip.Provider>
    </Toast.Provider>
  );
}
