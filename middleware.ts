import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicPaths = [
  "/",
  "/api/webhook",
  "/api/products",
  "/product",
  "/api/categories",
  "/api/sizes",
  "/api/colors",
  "/api/brands",
  "/api/descriptions",
  "/sign-out",
];

// Additional dynamic paths that should be public
const publicPathPrefixes = [
  "/product/",
  "/api/products/"
];

// Clerk auth paths
const clerkPublicPaths = [
  "/sign-in(.*)",
  "/sign-up(.*)"
];

function isPublic(path: string) {
  // Check exact matches
  if (publicPaths.includes(path)) {
    return true;
  }

  // Check prefixes for dynamic routes
  if (publicPathPrefixes.some(prefix => path.startsWith(prefix))) {
    return true;
  }

  // Check Clerk auth paths with regex patterns
  if (clerkPublicPaths.some(pattern => {
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  })) {
    return true;
  }

  // Check static assets
  return path.startsWith("/_next") ||
    path.includes("/static/") ||
    path.endsWith(".ico") ||
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".svg");
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
    /*
     * Exceptions:
     * 1. /_next (Next.js internals)
     * 2. /api/uploadthing (uploadthing route)
     * 3. /api/cron (server cron route)
     */
    '/((?!.+\\..*|_next|api/uploadthing|api/cron).*)',
    '/(api|trpc)(.*)',
  ],
};
