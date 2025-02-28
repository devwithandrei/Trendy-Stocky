"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();

  // Automatically redirect to home after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">Signing Out</h1>
        <p className="mt-2 text-sm text-gray-600">
          You are being signed out of your account
        </p>
        <div className="mt-6">
          <SignOutButton>
            <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Sign Out
            </button>
          </SignOutButton>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          You will be redirected to the home page after signing out
        </p>
      </div>
    </div>
  );
}
