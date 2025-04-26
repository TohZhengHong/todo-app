import Link from 'next/link';
import { CheckIcon, CalendarIcon, ClockIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 text-blue-800">TaskMaster</h1>
          <p className="text-xl text-blue-600 max-w-2xl mx-auto">A powerful and intuitive task management application to boost your productivity</p>
        </header>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">Get Started</h2>
              
              <div className="space-y-4">
                <Link href="/tasks" 
                  className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-all transform hover:scale-105 flex items-center justify-center">
                  <CheckIcon className="mr-2 h-5 w-5" />
                  View Tasks
                </Link>
                
                <Link href="/tasks/new" 
                  className="block w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-center transition-all transform hover:scale-105 flex items-center justify-center">
                  <ClockIcon className="mr-2 h-5 w-5" />
                  Create New Task
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center">
                <MixerHorizontalIcon className="mr-2 h-5 w-5" />
                Key Features
              </h2>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Create, edit, and organize tasks with ease</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Set priorities and track task completion</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Manage deadlines with due date tracking</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <CheckIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Filter and search to find tasks quickly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center text-gray-600">
          <p>Start organizing your tasks today and boost your productivity!</p>
        </div>
      </div>
    </div>
  );
}
