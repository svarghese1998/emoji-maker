import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Only allow these routes to be accessed without authentication
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/api/webhooks/clerk"
  ],
  
  // Always redirect to sign-up page if not authenticated
  afterAuth(auth, req, evt) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signUpUrl = new URL('/sign-up', req.url);
      return Response.redirect(signUpUrl);
    }
  }
});

// Stop Middleware running on static files and public folder
export const config = {
  matcher: [
    "/((?!.*\\..*|_next|favicon.ico).*)",
    "/",
    "/(api|trpc)(.*)"
  ]
};