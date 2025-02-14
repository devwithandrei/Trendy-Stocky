import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to check if path is a static asset
const isAsset = (path: string) => {
  return path.match(/\.(jpg|jpeg|png|gif|ico|css|js|svg)$/i);
};

// Helper function to check if path is an API route
const isApiRoute = (path: string) => {
  return path.startsWith('/api/');
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Always allow static assets and API routes
  if (isAsset(path) || isApiRoute(path)) {
    return NextResponse.next();
  }

  // Define public routes that don't need authentication
  const publicPaths = [
    '/',
    '/product',
    '/cart',
    '/categories',
    '/brands',
    '/color',
    '/size',
    '/_next',
    '/images',
    '/favicon.ico'
  ];

  // Check if the current path starts with any public path
  const isPublicRoute = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, continue as normal
  return NextResponse.next();
}

// Update config to exclude static files and api routes from middleware processing
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};