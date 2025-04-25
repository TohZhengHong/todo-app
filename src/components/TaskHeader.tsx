'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface TaskHeaderProps {
  title: string;
}

export default function TaskHeader({ title }: TaskHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">{title}</h1>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            className="py-2 pl-10 pr-4 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs.Root defaultValue="all" className="w-full sm:w-auto">
          <Tabs.List className="flex space-x-1 rounded-md bg-gray-100 p-1">
            <Tabs.Trigger
              value="all"
              className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium leading-none data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              All
            </Tabs.Trigger>
            <Tabs.Trigger
              value="active"
              className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium leading-none data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              Active
            </Tabs.Trigger>
            <Tabs.Trigger
              value="completed"
              className="flex-1 rounded-md px-3 py-1.5 text-sm font-medium leading-none data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
            >
              Completed
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sort by:</span>
          <Select.Root value={sortBy} onValueChange={setSortBy}>
            <Select.Trigger
              className="inline-flex items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              aria-label="Sort by"
            >
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200">
                <Select.ScrollUpButton />
                <Select.Viewport className="p-1">
                  <Select.Item value="dueDate" className="flex items-center h-8 px-6 py-0 text-sm rounded-md data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 outline-none cursor-pointer">
                    <Select.ItemText>Due Date</Select.ItemText>
                    <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                      <CheckIcon className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                  
                  <Select.Item value="priority" className="flex items-center h-8 px-6 py-0 text-sm rounded-md data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 outline-none cursor-pointer">
                    <Select.ItemText>Priority</Select.ItemText>
                    <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                      <CheckIcon className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                  
                  <Select.Item value="alphabetical" className="flex items-center h-8 px-6 py-0 text-sm rounded-md data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 outline-none cursor-pointer">
                    <Select.ItemText>Alphabetical</Select.ItemText>
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
      </div>
    </div>
  );
}
