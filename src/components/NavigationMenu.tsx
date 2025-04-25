'use client';

import * as React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon, CheckIcon, PlusIcon, HomeIcon, CalendarIcon, ClockIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainNavigationMenu() {
  const pathname = usePathname();
  
  return (
    <NavigationMenu.Root className="relative flex w-full justify-between px-4 py-3 border-b border-slate-6">
      <div className="flex items-center">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/" className="text-xl font-semibold text-blue-11 flex items-center">
              <CheckIcon className="mr-2 h-5 w-5" />
              Todo App
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </div>
      
      <NavigationMenu.List className="flex items-center gap-1 md:gap-2">
        <NavigationMenu.Item>
          <NavigationMenu.Link
            asChild
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              pathname === '/' 
                ? 'bg-blue-3 text-blue-11' 
                : 'text-slate-11 hover:bg-slate-3'
            }`}
          >
            <Link href="/">
              <HomeIcon className="mr-1.5 h-4 w-4" />
              Home
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        
        <NavigationMenu.Item>
          <NavigationMenu.Link
            asChild
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              pathname === '/tasks' 
                ? 'bg-blue-3 text-blue-11' 
                : 'text-slate-11 hover:bg-slate-3'
            }`}
          >
            <Link href="/tasks">
              <CheckIcon className="mr-1.5 h-4 w-4" />
              Tasks
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        
        <NavigationMenu.Item>
          <NavigationMenu.Link
            asChild
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              pathname === '/today' 
                ? 'bg-blue-3 text-blue-11' 
                : 'text-slate-11 hover:bg-slate-3'
            }`}
          >
            <Link href="/today">
              <CalendarIcon className="mr-1.5 h-4 w-4" />
              Today
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        
        <NavigationMenu.Item>
          <NavigationMenu.Link
            asChild
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              pathname === '/upcoming' 
                ? 'bg-blue-3 text-blue-11' 
                : 'text-slate-11 hover:bg-slate-3'
            }`}
          >
            <Link href="/upcoming">
              <ClockIcon className="mr-1.5 h-4 w-4" />
              Upcoming
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        
        <NavigationMenu.Item>
          <NavigationMenu.Link
            asChild
            className="ml-2 flex items-center px-3 py-2 text-sm rounded-md bg-blue-9 text-white hover:bg-blue-10 transition-colors"
          >
            <Link href="/tasks/new">
              <PlusIcon className="mr-1.5 h-4 w-4" />
              New Task
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
