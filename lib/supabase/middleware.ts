import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login' || pathname.startsWith('/login/')
  const isSignupPage = pathname === '/signup' || pathname.startsWith('/signup/')
  const isAuthPage = isLoginPage || isSignupPage
  const isDashboardPage = pathname.startsWith('/dashboard')

  // Allow authenticated users to access login/signup pages
  // The dashboard layout will handle redirecting if profile is missing
  // This prevents redirect loops when profile doesn't exist

  // If no user and trying to access protected routes (dashboard), redirect to login
  // Prevent redirect loops by checking if we're already redirecting
  if (!user && isDashboardPage && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Add a query param to prevent loops if needed
    if (!url.searchParams.has('redirected')) {
      url.searchParams.set('redirected', 'true')
    }
    return NextResponse.redirect(url)
  }

  // Add pathname to headers for dashboard layout to check route access
  if (user && isDashboardPage) {
    supabaseResponse.headers.set('x-pathname', pathname)
  }

  // For all other cases, allow the request to proceed

  // Allow access to login/signup if no user
  // Allow access to dashboard if user exists (let dashboard layout handle role checks)
  // Allow access to root and other public routes

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser to delete cookies,
  // which will log users out.

  return supabaseResponse
}
