import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, name } = body;

    console.log("Incoming request body:", body);

    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
        console.error("Unauthorized access attempt");
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user already exists
    let user = await prismadb.user.findFirst({
        where: { email },
    });

    // If user does not exist, create a new user
    if (!user) {
        try {
            console.log("Creating new user with email:", email);
            user = await prismadb.user.create({
                data: {
                    id: userId,
                    email: email ?? "test@example.com",
                    name: name ?? "Test User",
                },
            });
            console.log("User created successfully:", user);
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
        console.log("User already exists:", user);
    }

    return NextResponse.json(user);
}
