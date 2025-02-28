"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  Camera, Settings, ShoppingBag, Mail, Calendar, User as UserIcon, 
  Upload, X, ImageIcon, Eye, EyeOff, Lock, ShieldCheck, 
  AlertTriangle, CheckCircle, ChevronDown, ChevronUp, LogOut
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  // Photo upload state
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    // Clean up the URL when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.firstName 
      ? user.firstName[0].toUpperCase()
      : "U";

  // Photo upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdatePhoto = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    
    setIsUploadingPhoto(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Send the image to a server endpoint
      const response = await fetch('/api/users/update-profile-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Profile photo updated successfully!");
        
        // Force reload the user data from Clerk
        try {
          await user?.reload();
          // Clear the preview since we'll use the updated Clerk image
          clearSelectedFile();
        } catch (reloadError) {
          console.error("Error reloading user data:", reloadError);
          // If reload fails, fall back to page refresh
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        throw new Error(data.message || 'Failed to update profile image');
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error(error instanceof Error ? error.message : "There was a problem updating your photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Password change handlers
  const validatePasswordForm = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Password must include an uppercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "Password must include a number";
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      newErrors.newPassword = "Password must include a special character";
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // In a real implementation, we would call an API to change the password
      // For now, we'll simulate a successful password change
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Password changed successfully!");
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("There was a problem updating your password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("There was a problem signing out");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:py-12 max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">My Profile</h1>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Back to Shop
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto bg-red-50 hover:bg-red-100 border-red-100 text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <Card className="p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col items-center">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <Avatar className="h-28 w-28 border-4 border-blue-100 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <AvatarImage 
                    src={previewUrl || user?.imageUrl} 
                    alt={user?.firstName || "User"} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <button 
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200"
                >
                  <Camera size={18} />
                </button>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {selectedFile && (
                <div className="flex gap-2 mb-4">
                  <Button 
                    onClick={handleUpdatePhoto}
                    disabled={isUploadingPhoto}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isUploadingPhoto ? "Uploading..." : "Save Photo"}
                  </Button>
                  <Button 
                    onClick={clearSelectedFile}
                    variant="outline"
                    disabled={isUploadingPhoto}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              
              <h2 className="text-xl font-semibold text-center">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-500 mb-6 text-center">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              
              <div className="w-full space-y-3 mt-2">
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between bg-amber-50 hover:bg-amber-100 border-amber-100 text-amber-600"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                  </div>
                  {showPasswordChange ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
                
                {showPasswordChange && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={`w-full px-4 py-2 border ${passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full px-4 py-2 border ${passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-2 border ${passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          type="submit"
                          disabled={isChangingPassword}
                          className="w-full flex items-center justify-center bg-amber-600 hover:bg-amber-700"
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          {isChangingPassword ? "Changing..." : "Change Password"}
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-600 mt-2">
                        <div className="flex items-center">
                          <AlertTriangle className="h-3 w-3 text-amber-600 mr-1" />
                          <span className="font-medium">Password Requirements:</span>
                        </div>
                        <ul className="mt-1 space-y-1 pl-4">
                          {[
                            "At least 8 characters",
                            "Include uppercase letter",
                            "Include number",
                            "Include special character"
                          ].map((req, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </form>
                  </div>
                )}
                
                <Link href="/orders" className="block w-full">
                  <Button className="w-full flex items-center justify-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    View My Orders
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-100">Account Information</h2>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 shrink-0 mx-auto sm:mx-0">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="text-lg font-medium">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 shrink-0 mx-auto sm:mx-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-lg font-medium break-all">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 shrink-0 mx-auto sm:mx-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="text-lg font-medium">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) 
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="mt-6">
            <Card className="p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-600">
                View your recent orders and activity on your account.
              </p>
              <div className="mt-4">
                <Link href="/orders">
                  <Button variant="outline" className="bg-white hover:bg-gray-50">
                    View Activity
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
