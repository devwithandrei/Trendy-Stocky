import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the form data with the file
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    try {
      // Update the user's profile image using Clerk's API
      const clerk = await clerkClient();
      await clerk.users.updateUserProfileImage(userId, {
        file: file, // Pass the original File object directly
      });
      
      return NextResponse.json(
        { 
          message: "Profile image updated successfully",
          success: true
        },
        { status: 200 }
      );
    } catch (clerkError) {
      console.error("Clerk API error:", clerkError);
      
      // If we can't update the image via Clerk, let's try an alternative approach
      // For now, we'll just return an error
      return NextResponse.json(
        { 
          message: "Failed to update profile image in Clerk",
          error: String(clerkError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating profile image:", error);
    
    return NextResponse.json(
      { message: "Failed to update profile image", error: String(error) },
      { status: 500 }
    );
  }
}
