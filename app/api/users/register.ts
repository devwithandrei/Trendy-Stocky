import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, name } = body;

    // Check if user already exists
    const existingUser = await prismadb.user.findFirst({
        where: { email },
    });

    if (existingUser) {
        return new NextResponse("User already exists", { status: 400 });
    }

    try {
        // Create a new user
        const newUser = await prismadb.user.create({
            data: {
                email,
                name,
            },
        });

        return NextResponse.json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}