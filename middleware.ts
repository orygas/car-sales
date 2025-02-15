import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes using createRouteMatcher
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/cars(.*)',
  '/privacy',
  '/terms',
  '/contact',
  '/support',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/_next/image(.*)',
])

// Apply security headers to the response
function applySecurityHeaders(response: NextResponse) {
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CORS headers for API routes
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_URL || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

export default clerkMiddleware(async (auth, request) => {
  // Block direct GET access to /api/cars
  if (request.nextUrl.pathname.startsWith('/api/cars') && request.method === 'GET') {
    console.warn(`Blocked direct GET access to /api/cars from ${request.url}`)
    return new NextResponse(
      JSON.stringify({ error: 'Direct API access not allowed' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Check if the route is public
  if (!isPublicRoute(request)) {
    // Protect non-public routes
    try {
      await auth.protect()
    } catch {
      // Log authentication failures
      console.warn(`Authentication failed for ${request.url}`)
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Apply security headers to all responses
  const response = NextResponse.next()
  return applySecurityHeaders(response)
})

// Configure middleware matcher
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 