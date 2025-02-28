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

        // Check if user already exists in our database by Clerk ID
        const existingUserById = await prismadb.user.findUnique({
            where: { id: userId },
        });

        if (existingUserById) {
            return NextResponse.json({ 
                message: "User already registered", 
                user: existingUserById 
            }, { status: 200 });
        }

        // Check if user already exists by email
        const existingUserByEmail = await prismadb.user.findFirst({
            where: { email },
        });

        if (existingUserByEmail) {
            return NextResponse.json({ 
                error: "Email already registered with a different account" 
            }, { status: 409 });
        }

        try {
            // Create a new user
            const newUser = await prismadb.user.create({
                data: {
                    id: userId,
                    email,
                    name: name || "User",
                },
            });

            console.log("User registered successfully:", newUser);
            return NextResponse.json(newUser);
        } catch (error) {
            console.error("Error creating user:", error);
            if ((error as { code?: string }).code === 'P2002') {
                return NextResponse.json({ error: "User already exists" }, { status: 409 });
            }
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    } catch (error) {
        console.error("Unexpected error in register API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
