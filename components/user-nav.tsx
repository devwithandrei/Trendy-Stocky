"use client"

import { LogOut, User, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser, SignOutButton } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  const router = useRouter()
  const { user, isSignedIn } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  
  // Force refresh user data when component mounts to ensure latest profile image
  useEffect(() => {
    if (isSignedIn && user) {
      user.reload().catch(error => {
        console.error("Error refreshing user data:", error);
      });
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) return null

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.firstName 
      ? user.firstName[0].toUpperCase()
      : "U"

  const handleNavigate = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative h-9 w-9 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 hover:scale-110">
          <Avatar className="h-full w-full border-2 border-blue-100">
            <AvatarImage 
              src={user?.imageUrl} 
              alt={user?.firstName || "User"} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-5 transition-all duration-200"></span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end">
        <div className="flex items-center gap-3 p-2 mb-1">
          <Avatar className="h-10 w-10 border-2 border-blue-100">
            <AvatarImage 
              src={user?.imageUrl} 
              alt={user?.firstName || "User"} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs leading-none text-gray-500 mt-1">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigate('/profile')} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
              <User className="h-4 w-4" />
            </div>
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/orders')} className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span>My Orders</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton>
          <DropdownMenuItem className="flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Sign out</span>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
