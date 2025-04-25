import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Todo App</h1>
        <p className="text-xl text-gray-600">Manage your tasks efficiently</p>
      </header>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
          
          <div className="space-y-4">
            <Link href="/tasks" className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center transition-colors">
              View Tasks
            </Link>
            
            <Link href="/tasks/new" className="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-center transition-colors">
              Create New Task
            </Link>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Features:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Add, edit, and delete tasks</li>
              <li>Mark tasks as complete</li>
              <li>Organize tasks into lists</li>
              <li>Set due dates and priorities</li>
              <li>Search and filter tasks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
