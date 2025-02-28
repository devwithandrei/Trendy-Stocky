import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        // Get authenticated user from Clerk
        const { userId } = await auth();
        if (!userId) {
            console.error("Unauthorized access attempt");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get full user details from Clerk
        const user = await currentUser();
        if (!user) {
            console.error("User not found in Clerk");
            return new NextResponse("User not found", { status: 404 });
        }

        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
            console.error("No email address found for user");
            return new NextResponse("No email address found", { status: 400 });
        }

        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

        // Check if user already exists in our database
        let dbUser = await prismadb.user.findUnique({
            where: { id: userId },
        });

        // If user does not exist in our database, create a new user
        if (!dbUser) {
            try {
                console.log("Creating new user with Clerk ID:", userId);
                dbUser = await prismadb.user.create({
                    data: {
                        id: userId,
                        email,
                        name: name || "User",
                    },
                });
                console.log("User created successfully:", dbUser);
            } catch (error) {
                console.error("Error creating user:", error);
                if ((error as { code?: string }).code === 'P2002') {
                    console.log("User already exists with this email:", email);
                    return NextResponse.json({ error: "User already exists." }, { status: 409 });
                }
                console.error("Failed to create user due to unexpected error:", error);
                return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
            }
        } else {
            // Update user information if it has changed
            if (dbUser.email !== email || (name && dbUser.name !== name)) {
                dbUser = await prismadb.user.update({
                    where: { id: userId },
                    data: {
                        email,
                        name: name || dbUser.name,
                    },
                });
                console.log("User updated successfully:", dbUser);
            } else {
                console.log("User already exists and is up to date:", dbUser);
            }
        }

        return NextResponse.json(dbUser);
    } catch (error) {
        console.error("Unexpected error in login API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
