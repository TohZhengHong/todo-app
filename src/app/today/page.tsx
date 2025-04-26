'use client';

import { useState, useEffect } from 'react';
import { fetchTasks, Task } from '@/utils/api';
import TaskList from '@/components/TaskList';
import TaskHeader from '@/components/TaskHeader';

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        const allTasks = await fetchTasks();
        
        // Filter tasks due today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTasks = allTasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
        
        setTasks(todayTasks);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskHeader title="Today's Tasks" />
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4">
          {error}
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-6 rounded-lg mt-4 text-center">
          <h3 className="text-lg font-medium mb-2">No tasks due today</h3>
          <p>You don't have any tasks scheduled for today. Enjoy your day!</p>
        </div>
      ) : (
        <TaskList initialTasks={tasks} />
      )}
    </div>
  );
}
