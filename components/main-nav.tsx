"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Category } from '@/types';
import Link from 'next/link';

interface MainNavProps {
  categories?: Category[];
  storeId: string;
}

const MainNav: React.FC<MainNavProps> = ({ categories, storeId }) => {
  const pathname = usePathname();

  const linkColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    // Add more colors as needed
  ];

  const routes = categories?.map((category, index) => ({
    href: `/category/${category.name.toLowerCase()}?storeId=${storeId}`,
    label: category.name,
    active: pathname === `/category/${category.name.toLowerCase()}?storeId=${storeId}`,
    colorClass: linkColors[index % linkColors.length],
  })) || [];

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-black',
            route.active ? 'text-black' : 'text-neutral-500',
            'inline-block px-3 py-1.5 rounded-lg text-black hover:bg-blue-600',
            route.colorClass
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;