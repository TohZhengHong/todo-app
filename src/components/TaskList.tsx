'use client';

import { useState, useEffect } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';
import { CheckIcon, Cross2Icon, Pencil1Icon, DotsVerticalIcon, CalendarIcon, ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { fetchTasks, updateTask, deleteTask, Task } from '@/utils/api';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Fetch tasks from the API
  useEffect(() => {
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
  }, []);
  
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
          bg: 'var(--color-priority-high-bg)', 
          text: 'var(--color-priority-high-text)',
          icon: <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
        };
      case 'medium': 
        return { 
          bg: 'var(--color-priority-medium-bg)', 
          text: 'var(--color-priority-medium-text)',
          icon: null
        };
      case 'low': 
        return { 
          bg: 'var(--color-priority-low-bg)', 
          text: 'var(--color-priority-low-text)',
          icon: null
        };
      default: 
        return { 
          bg: 'var(--slate-3)', 
          text: 'var(--slate-11)',
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
        <div className="radix-card">
          <div className="p-4 border-b border-slate-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Your Tasks</h2>
              <p className="text-sm text-slate-11">
                {loading ? 'Loading tasks...' : `${tasks.length} tasks, ${tasks.filter(t => t.completed).length} completed`}
              </p>
            </div>
            <Link 
              href="/tasks/new" 
              className="radix-button radix-button-primary"
            >
              Add Task
            </Link>
          </div>
          
          {error && (
            <div className="p-4 bg-red-3 text-red-11 text-sm">
              {error}
              <button 
                onClick={() => window.location.reload()} 
                className="ml-2 underline"
              >
                Retry
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="p-8 text-center text-slate-10 flex flex-col items-center">
              <UpdateIcon className="h-5 w-5 animate-spin mb-2" />
              Loading tasks...
            </div>
          ) : (
            <ul className="divide-y divide-slate-6">
              {tasks.length > 0 ? (
                tasks.map(task => {
                  const priorityStyle = getPriorityStyles(task.priority);
                  const overdue = isOverdue(task.dueDate) && !task.completed;
                  
                  return (
                    <li key={task._id} className="p-4 hover:bg-slate-2 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          <Checkbox.Root
                            className="flex h-5 w-5 appearance-none items-center justify-center rounded-md border border-slate-7 bg-white data-[state=checked]:bg-blue-9 data-[state=checked]:border-blue-9"
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
                                <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-9' : 'text-slate-12'}`}>
                                  {task.title}
                                </p>
                              </Tooltip.Trigger>
                              {task.description && (
                                <Tooltip.Portal>
                                  <Tooltip.Content 
                                    className="max-w-xs bg-slate-12 text-slate-1 px-3 py-2 rounded-md text-xs"
                                    sideOffset={5}
                                  >
                                    {task.description}
                                    <Tooltip.Arrow className="fill-slate-12" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              )}
                            </Tooltip.Root>
                            
                            <div className="flex items-center gap-1 ml-4">
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <Link 
                                    href={`/tasks/${task._id}/edit`}
                                    className="p-1.5 text-slate-9 hover:text-slate-12 hover:bg-slate-3 rounded-md transition-colors"
                                  >
                                    <Pencil1Icon className="h-4 w-4" />
                                  </Link>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content 
                                    className="bg-slate-12 text-slate-1 px-2 py-1 rounded-md text-xs"
                                    sideOffset={5}
                                  >
                                    Edit task
                                    <Tooltip.Arrow className="fill-slate-12" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                              
                              <DropdownMenu.Root>
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <DropdownMenu.Trigger asChild>
                                      <button className="p-1.5 text-slate-9 hover:text-slate-12 hover:bg-slate-3 rounded-md transition-colors">
                                        <DotsVerticalIcon className="h-4 w-4" />
                                      </button>
                                    </DropdownMenu.Trigger>
                                  </Tooltip.Trigger>
                                  <Tooltip.Portal>
                                    <Tooltip.Content 
                                      className="bg-slate-12 text-slate-1 px-2 py-1 rounded-md text-xs"
                                      sideOffset={5}
                                    >
                                      More options
                                      <Tooltip.Arrow className="fill-slate-12" />
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                                
                                <DropdownMenu.Portal>
                                  <DropdownMenu.Content 
                                    className="min-w-[180px] bg-white rounded-md p-1 shadow-md border border-slate-6"
                                    sideOffset={5}
                                  >
                                    <DropdownMenu.Item 
                                      className="text-sm px-2 py-1.5 rounded-md outline-none cursor-default flex items-center hover:bg-slate-3 text-slate-12"
                                      onSelect={() => handleToggleComplete(task._id!)}
                                    >
                                      <CheckIcon className="mr-2 h-4 w-4" />
                                      Mark as {task.completed ? 'incomplete' : 'complete'}
                                    </DropdownMenu.Item>
                                    
                                    <DropdownMenu.Separator className="h-px bg-slate-6 my-1" />
                                    
                                    <DropdownMenu.Item 
                                      className="text-sm px-2 py-1.5 rounded-md outline-none cursor-default flex items-center hover:bg-red-3 text-red-11"
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
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" 
                              style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.text }}
                            >
                              {priorityStyle.icon}
                              {task.priority}
                            </span>
                            
                            <span className={`text-xs flex items-center ${overdue ? 'text-red-11' : 'text-slate-10'}`}>
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
                <li className="p-8 text-center text-slate-10">
                  No tasks found. Click "Add Task" to create your first task.
                </li>
              )}
            </ul>
          )}
        </div>
        
        {/* Delete Task Alert Dialog */}
        <AlertDialog.Root open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-[90vw]">
              <AlertDialog.Title className="text-lg font-semibold text-slate-12 mb-2">
                Delete Task
              </AlertDialog.Title>
              <AlertDialog.Description className="text-slate-11 mb-5">
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialog.Description>
              <div className="flex justify-end gap-3">
                <AlertDialog.Cancel asChild>
                  <button className="px-4 py-2 rounded-md text-slate-12 bg-slate-3 hover:bg-slate-4 transition-colors">
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button 
                    className="px-4 py-2 rounded-md bg-red-9 text-white hover:bg-red-10 transition-colors"
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
          className="bg-white border border-slate-6 rounded-lg shadow-lg p-4 flex items-center gap-3 fixed bottom-4 right-4 w-auto max-w-sm z-50"
        >
          <div className="w-6 h-6 rounded-full bg-green-5 flex items-center justify-center flex-shrink-0">
            <CheckIcon className="h-4 w-4 text-green-11" />
          </div>
          <Toast.Title className="text-sm font-medium text-slate-12">
            {toastMessage}
          </Toast.Title>
          <Toast.Close className="absolute top-2 right-2 p-1 rounded-md text-slate-11 hover:bg-slate-3 hover:text-slate-12">
            <Cross2Icon className="h-4 w-4" />
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Tooltip.Provider>
    </Toast.Provider>
  );
}
