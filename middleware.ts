import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/cars",
    "/api/cars",
    "/api/cars/:id",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 