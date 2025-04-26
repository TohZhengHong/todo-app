'use client';

import * as React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CheckIcon, PlusIcon, HomeIcon, CalendarIcon, ClockIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainNavigationMenu() {
  const pathname = usePathname();
  
  return (
    <NavigationMenu.Root className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-blue-100">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/" className="text-2xl font-bold text-blue-800 flex items-center transition-colors hover:text-blue-600">
              <CheckIcon className="mr-2 h-6 w-6" />
              TaskMaster
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        
        <NavigationMenu.List className="flex items-center gap-2">
          <NavigationMenu.Item>
            <NavigationMenu.Link
              asChild
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                pathname === '/' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              <Link href="/" className="flex items-center">
                <HomeIcon className="mr-2 h-4 w-4" />
                Home
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          
          <NavigationMenu.Item>
            <NavigationMenu.Link
              asChild
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                pathname === '/tasks' || pathname.startsWith('/tasks/') && pathname !== '/tasks/new'
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              <Link href="/tasks" className="flex items-center">
                <CheckIcon className="mr-2 h-4 w-4" />
                Tasks
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          
          <NavigationMenu.Item>
            <NavigationMenu.Link
              asChild
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                pathname === '/today' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              <Link href="/today" className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Today
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          
          <NavigationMenu.Item>
            <NavigationMenu.Link
              asChild
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                pathname === '/upcoming' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              <Link href="/upcoming" className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4" />
                Upcoming
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          
          <NavigationMenu.Item>
            <NavigationMenu.Link
              asChild
              className="ml-2 flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow"
            >
              <Link href="/tasks/new" className="flex items-center">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Task
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </div>
    </NavigationMenu.Root>
  );
}
