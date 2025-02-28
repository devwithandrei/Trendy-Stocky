import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware adds compression-related headers to improve performance
export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();
  
  // Add Brotli or gzip compression preference
  response.headers.set('Accept-Encoding', 'br, gzip');
  
  // Set cache control for static assets
  if (request.nextUrl.pathname.match(/\.(js|css|woff2|jpg|png|svg|webp)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return response;
}

// Only apply this middleware to specific paths
export const config = {
  matcher: [
    // Apply to all routes except API routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};