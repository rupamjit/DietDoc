import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes: / (root) and /sign-in(.*)
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // If the route is not public, protect it (require authentication)
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};