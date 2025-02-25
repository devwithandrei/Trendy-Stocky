import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicPaths = [
  "/",
  "/api/webhook",
  "/api/products",
  "/api/categories",
  "/api/sizes",
  "/api/colors",
  "/api/brands",
  "/api/descriptions",
];

function isPublic(path: string) {
  return publicPaths.some(
    (publicPath) =>
      path.startsWith(publicPath) ||
      path.startsWith("/_next") ||
      path.includes("/static/") ||
      path.endsWith(".ico") ||
      path.endsWith(".png") ||
      path.endsWith(".jpg") ||
      path.endsWith(".svg")
  );
}

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;

  if (isPublic(path)) {
    return NextResponse.next();
  }

  // For API routes, return 401 if not authenticated
  if (path.startsWith('/api/')) {
    try {
      await auth.protect();
      return NextResponse.next();
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // For non-API routes, let the client handle authentication
  // This allows the Clerk modal to handle the auth flow
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/(api|trpc)(.*)",
  ],
};
