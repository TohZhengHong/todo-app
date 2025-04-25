import TaskForm from '@/components/TaskForm';
import Link from 'next/link';

export default function NewTaskPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create New Task</h1>
          <Link 
            href="/tasks" 
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
          >
            Back to Tasks
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <TaskForm />
        </div>
      </div>
    </div>
  );
}
