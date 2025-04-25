'use client';

import { useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CheckIcon, Cross2Icon, Pencil1Icon, DotsVerticalIcon, CalendarIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

// Task type definition
type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
};

// Mock data for initial development
const initialTasks: Task[] = [
  { id: '1', title: 'Complete project proposal', description: 'Finish the quarterly project proposal with budget estimates', completed: false, priority: 'high', dueDate: '2025-05-01' },
  { id: '2', title: 'Review team updates', description: 'Go through weekly team updates and provide feedback', completed: true, priority: 'medium', dueDate: '2025-04-28' },
  { id: '3', title: 'Schedule client meeting', description: 'Arrange a follow-up meeting with the client to discuss project progress', completed: false, priority: 'high', dueDate: '2025-04-30' },
  { id: '4', title: 'Update documentation', description: 'Update the user documentation with the latest features', completed: false, priority: 'low', dueDate: '2025-05-05' },
];

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setTaskToDelete(null);
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
    <Tooltip.Provider>
      <div className="radix-card">
        <div className="p-4 border-b border-slate-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Your Tasks</h2>
            <p className="text-sm text-slate-11">{tasks.length} tasks, {tasks.filter(t => t.completed).length} completed</p>
          </div>
          <Link 
            href="/tasks/new" 
            className="radix-button radix-button-primary"
          >
            Add Task
          </Link>
        </div>
        
        <ul className="divide-y divide-slate-6">
          {tasks.length > 0 ? (
            tasks.map(task => {
              const priorityStyle = getPriorityStyles(task.priority);
              const overdue = isOverdue(task.dueDate) && !task.completed;
              
              return (
                <li key={task.id} className="p-4 hover:bg-slate-2 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <Checkbox.Root
                        className="flex h-5 w-5 appearance-none items-center justify-center rounded-md border border-slate-7 bg-white data-[state=checked]:bg-blue-9 data-[state=checked]:border-blue-9"
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id)}
                        id={`task-${task.id}`}
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
                                href={`/tasks/${task.id}/edit`}
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
                                <DropdownMenu.Item className="text-sm px-2 py-1.5 rounded-md outline-none cursor-default flex items-center hover:bg-slate-3 text-slate-12">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  Change due date
                                </DropdownMenu.Item>
                                
                                <DropdownMenu.Separator className="h-px bg-slate-6 my-1" />
                                
                                <DropdownMenu.Item 
                                  className="text-sm px-2 py-1.5 rounded-md outline-none cursor-default flex items-center hover:bg-red-3 text-red-11"
                                  onSelect={() => setTaskToDelete(task.id)}
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
    </Tooltip.Provider>
  );
}
