import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/boxes') ||
      request.nextUrl.pathname.startsWith('/products') ||
      request.nextUrl.pathname.startsWith('/search') ||
      request.nextUrl.pathname.startsWith('/pallets')) {
    return NextResponse.rewrite(new URL('/', request.url));
  }

  return NextResponse.next();
}