import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/api/cron', '/api/login', '/api/signup', '/api/logout'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. If the path is public, let it through
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 2. Read the session cookie
    const token = request.cookies.get('session')?.value;

    // 3. If no cookie, redirect to /login
    if (!token) {
        // ??? build a redirect URL to /login
        const login_page = new URL('/login', request.url);

        return NextResponse.redirect(login_page);
    }

    // 4. Otherwise, let it through — page will validate
    return NextResponse.next();
}

// Configure which paths middleware runs on
export const config = {
    matcher: [
        /* Match everything EXCEPT static files & _next stuff */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};