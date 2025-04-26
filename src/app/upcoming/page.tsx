'use client';

import { useState, useEffect } from 'react';
import { fetchTasks, Task } from '@/utils/api';
import TaskList from '@/components/TaskList';
import TaskHeader from '@/components/TaskHeader';

export default function UpcomingPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        const allTasks = await fetchTasks();
        
        // Filter tasks due in the next 7 days (excluding today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const upcomingTasks = allTasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate > today && taskDate <= nextWeek;
        });
        
        // Sort by due date (ascending)
        upcomingTasks.sort((a, b) => 
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        
        setTasks(upcomingTasks);
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
      <TaskHeader title="Upcoming Tasks" />
      
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
          <h3 className="text-lg font-medium mb-2">No upcoming tasks</h3>
          <p>You don't have any tasks scheduled for the next 7 days.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700">Showing tasks due in the next 7 days</p>
          </div>
          <TaskList initialTasks={tasks} />
        </div>
      )}
    </div>
  );
}
