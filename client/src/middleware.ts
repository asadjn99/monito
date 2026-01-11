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

        // 1. Always allow the Admin Login Page
        if (path === "/admin/login") {
          return true; 
        }

        // 2. Protect Admin Pages AND Admin API Routes
        // ⚠️ Added check for "/api/admin"
        if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
           // Must be logged in AND have role 'admin'
           return token?.role === "admin";
        }

        // 3. Allow all other routes (Home, Pets, Checkout, etc.)
        return true;
      },
    },
    pages: {
      // If unauthorized, redirect to login
      signIn: "/admin/login", 
    },
  }
);

export const config = {
  // ⚠️ CRITICAL UPDATE: Add "/api/admin/:path*" to protect your database!
  matcher: [
    "/admin/:path*", 
    "/api/admin/:path*" 
  ],
};