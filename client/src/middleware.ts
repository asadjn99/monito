import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // 1. If trying to access the Admin Login Page, ALWAYS ALLOW
        if (path === "/admin/login") {
          return true; 
        }

        // 2. If trying to access any OTHER /admin page (Dashboard, etc.)
        if (path.startsWith("/admin")) {
           // MUST be logged in AND have role 'admin'
           return token?.role === "admin";
        }

        // 3. Allow all other routes (Home, Pets, etc.)
        return true;
      },
    },
    pages: {
      // If they are not authorized, send them here:
      signIn: "/admin/login", 
    },
  }
);

// ✅ FIX: Match all routes starting with /admin
export const config = {
  matcher: ["/admin","/admin/:path*"],
};