"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface MainNavProps {
  data: Category[];
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
  const pathname = usePathname();

  // Array of different background colors for the links
  const linkColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    // Add more colors as needed
  ];

  const routes = data.map((route, index) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
    colorClass: linkColors[index % linkColors.length], // Assign a color class based on the index
  }));

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <a
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-black",
            route.active ? "text-black" : "text-neutral-500",
            "inline-block px-3 py-1.5 rounded-lg text-black hover:bg-blue-600", // Removed default background color
            route.colorClass // Apply the assigned color class
          )}
        >
          {route.label}
        </a>
      ))}
    </nav>
  );
};

export default MainNav;