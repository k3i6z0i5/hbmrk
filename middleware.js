import { NextResponse } from 'next/server';

export function middleware(request) {
  // Pass-through middleware, authentication checks are performed directly
  // inside the Route Handlers using the secure standard node.js runtime.
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/manuscripts/:path*'],
};
