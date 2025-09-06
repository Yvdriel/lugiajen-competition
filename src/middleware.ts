import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
    matcher: [
        // Only run for /admin and its subroutes, and always for API routes
        '/admin/:path*',
        '/(api|trpc)(.*)',
    ],
};
