'use client';

import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import * as Toast from '@radix-ui/react-toast';
import * as Switch from '@radix-ui/react-switch';
import { CheckIcon, ChevronDownIcon, CalendarIcon, ExclamationTriangleIcon, BellIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { createTask, updateTask } from '@/utils/api';

interface TaskFormProps {
  taskId?: string;
  initialData?: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    hasReminder?: boolean;
  };
}

export default function TaskForm({ taskId, initialData }: TaskFormProps) {
  const router = useRouter();
  const isEditing = !!taskId;
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate || new Date().toISOString().split('T')[0],
    hasReminder: initialData?.hasReminder || false,
  });
  
  const [errors, setErrors] = useState({
    title: '',
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (name === 'title' && errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };
  
  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({ ...prev, priority: value as 'high' | 'medium' | 'low' }));
  };

  const handleReminderChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, hasReminder: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    const newErrors = { title: '' };
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid) return;
    
    try {
      // Prepare task data for API
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        hasReminder: formData.hasReminder,
        completed: false
      };
      
      if (isEditing && taskId) {
        // Update existing task
        await updateTask(taskId, taskData);
      } else {
        // Create new task
        await createTask(taskData);
      }
      
      // Show success toast
      setToastMessage(isEditing ? 'Task updated successfully!' : 'Task created successfully!');
      setToastOpen(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/tasks');
      }, 1500);
    } catch (error) {
      console.error('Error saving task:', error);
      setToastMessage('Failed to save task. Please try again.');
      setToastOpen(true);
    }
  };

  const getPriorityStyles = (priority: string) => {
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
  
  return (
    <Toast.Provider swipeDirection="right">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label.Root htmlFor="title" className="block text-sm font-medium text-slate-12 mb-1.5">
            Task Title*
          </Label.Root>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-7 ${
              errors.title ? 'border-red-9' : 'border-slate-7'
            }`}
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-11">{errors.title}</p>
          )}
        </div>
        
        <div>
          <Label.Root htmlFor="description" className="block text-sm font-medium text-slate-12 mb-1.5">
            Description
          </Label.Root>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-slate-7 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-7"
            placeholder="Enter task description (optional)"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label.Root htmlFor="priority" className="block text-sm font-medium text-slate-12 mb-1.5">
              Priority
            </Label.Root>
            <Select.Root value={formData.priority} onValueChange={handlePriorityChange}>
              <Select.Trigger
                className="inline-flex w-full items-center justify-between rounded-md border border-slate-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-7 bg-white"
                aria-label="Priority"
              >
                <Select.Value aria-label={formData.priority}>
                  <div className="flex items-center">
                    <span 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2" 
                      style={{ 
                        backgroundColor: getPriorityStyles(formData.priority).bg, 
                        color: getPriorityStyles(formData.priority).text 
                      }}
                    >
                      {getPriorityStyles(formData.priority).icon}
                      {formData.priority}
                    </span>
                    Priority
                  </div>
                </Select.Value>
                <Select.Icon>
                  <ChevronDownIcon className="h-4 w-4 text-slate-11" />
                </Select.Icon>
              </Select.Trigger>
              
              <Select.Portal>
                <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-slate-6">
                  <Select.ScrollUpButton />
                  <Select.Viewport className="p-1">
                    <Select.Item 
                      value="low" 
                      className="flex items-center h-9 px-6 py-0 text-sm rounded-md data-[highlighted]:bg-slate-3 data-[highlighted]:text-slate-12 outline-none cursor-pointer"
                    >
                      <Select.ItemText>
                        <div className="flex items-center">
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2" 
                            style={{ 
                              backgroundColor: getPriorityStyles('low').bg, 
                              color: getPriorityStyles('low').text 
                            }}
                          >
                            low
                          </span>
                          Low Priority
                        </div>
                      </Select.ItemText>
                      <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                        <CheckIcon className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                    
                    <Select.Item 
                      value="medium" 
                      className="flex items-center h-9 px-6 py-0 text-sm rounded-md data-[highlighted]:bg-slate-3 data-[highlighted]:text-slate-12 outline-none cursor-pointer"
                    >
                      <Select.ItemText>
                        <div className="flex items-center">
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2" 
                            style={{ 
                              backgroundColor: getPriorityStyles('medium').bg, 
                              color: getPriorityStyles('medium').text 
                            }}
                          >
                            medium
                          </span>
                          Medium Priority
                        </div>
                      </Select.ItemText>
                      <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                        <CheckIcon className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                    
                    <Select.Item 
                      value="high" 
                      className="flex items-center h-9 px-6 py-0 text-sm rounded-md data-[highlighted]:bg-slate-3 data-[highlighted]:text-slate-12 outline-none cursor-pointer"
                    >
                      <Select.ItemText>
                        <div className="flex items-center">
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2" 
                            style={{ 
                              backgroundColor: getPriorityStyles('high').bg, 
                              color: getPriorityStyles('high').text 
                            }}
                          >
                            {getPriorityStyles('high').icon}
                            high
                          </span>
                          High Priority
                        </div>
                      </Select.ItemText>
                      <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                        <CheckIcon className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          
          <div>
            <Label.Root htmlFor="dueDate" className="block text-sm font-medium text-slate-12 mb-1.5">
              Due Date
            </Label.Root>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CalendarIcon className="h-4 w-4 text-slate-9" />
              </div>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-slate-7 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-7"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center">
            <Switch.Root 
              id="reminder-switch"
              checked={formData.hasReminder}
              onCheckedChange={handleReminderChange}
              className="w-[42px] h-[25px] bg-slate-7 rounded-full relative data-[state=checked]:bg-blue-9 outline-none cursor-pointer"
            >
              <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <Label.Root 
              htmlFor="reminder-switch"
              className="pl-2 text-sm font-medium text-slate-12 flex items-center"
            >
              <BellIcon className="mr-1.5 h-4 w-4 text-slate-10" />
              Set Reminder
            </Label.Root>
          </div>
          {formData.hasReminder && (
            <p className="mt-1 text-xs text-slate-11 pl-[50px]">
              You'll be reminded about this task on the due date
            </p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/tasks')}
            className="radix-button radix-button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="radix-button radix-button-primary"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>

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
    </Toast.Provider>
  );
}
