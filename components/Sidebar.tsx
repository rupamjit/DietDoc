"use client"

import { cn } from '@/lib/utils';
import {  ChefHat, Leaf, Target, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const routes = [
  {
    label: 'Profile',
    icon: User,
    href: '/profile',
    color: 'text-sky-900',
  },
  {
    label: 'Goals',
    icon: Target,
    href: '/goals',
    color: 'text-violet-900',
  },
  {
    label: 'Recipes',
    icon: ChefHat,
    href: '/recipes',
    color: 'text-pink-900',
  }
];

const Sidebar = () => {

    const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gradient-to-b from-blue-400 via-blue-600 to-blue-700 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <Leaf className="h-8 w-8" />
          <h1 className="text-4xl font-bold ml-2"><span className='text-blue-900'>Diet</span>Doc</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'group text-lg flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-white/10 rounded-lg transition',
                pathname === route.href ? 'bg-white/10' : ''
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar