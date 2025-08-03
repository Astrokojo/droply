import { clerkMiddleware, createRouteMatcher, } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, request) => {
    //check if user is already authenticated and if so redirect straight to dashboard, skipping sign-up/sign-in.
    const user = await auth();
    const userId = user.userId;
    const url = new URL(request.url);

    if (userId && isPublicRoute(request) && url.pathname !== "/") {
        return NextResponse.redirect(new URL("/dashboard",request.url))
    } 
    
    // Protect all routes except for the ones defined as public routes
    if (!isPublicRoute(request)) {
        await auth.protect()
    }
    
})




export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

//notes:
// A public route is a route that can be accessed by anyone regardless of the user or access level(e.g: the "/dashboard"). 
// A non-public/protected/private route is a route that should only be accessible to a specific user or access level(e.g: "/admin")