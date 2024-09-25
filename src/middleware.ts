import { Logger } from 'next-axiom';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const logger = new Logger({ source: 'middleware' });
  logger.middleware(request);

  const publicPaths = ['/', '/login', '/auth/verify'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isAuthenticated = !!accessToken && !!refreshToken;

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  event.waitUntil(logger.flush());

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
