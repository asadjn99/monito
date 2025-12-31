

// // // import { withAuth } from "next-auth/middleware";
// // // import { NextResponse } from "next/server";

// // // export default withAuth(
// // //   function middleware(req) {
// // //     // 1. Check if user is trying to access "/admin"
// // //     if (req.nextUrl.pathname.startsWith("/admin")) {
      
// // //       // 2. Check the user's role from the token
// // //       const token = req.nextauth.token;
      
// // //       // 3. If role is NOT admin, kick them to the homepage
// // //       if (token?.role !== "admin") {
// // //         return NextResponse.redirect(new URL("/", req.url));
// // //       }
// // //     }
// // //     return NextResponse.next();
// // //   },
// // //   {
// // //     callbacks: {
// // //       // This ensures the middleware only runs if the user is authenticated
// // //       authorized: ({ token }) => !!token,
// // //     },
// // //   }
// // // );

// // // // Define which paths this security guard protects
// // // export const config = {
// // //   matcher: ["/admin/:path*"], // Protects everything under /admin
// // // };









// // import { withAuth } from "next-auth/middleware";
// // import { NextResponse } from "next/server";

// // export default withAuth(
// //   function middleware(req) {
// //     const path = req.nextUrl.pathname;
// //     const token = req.nextauth.token;

// //     // 1. If trying to access Admin Dashboard
// //     if (path.startsWith("/admin")) {
      
// //       // EXCEPTION: Allow access to the login page itself
// //       if (path === "/admin/login") {
// //         return NextResponse.next();
// //       }

// //       // If NOT logged in OR NOT an admin, kick them out
// //       if (!token || token.role !== "admin") {
// //         return NextResponse.redirect(new URL("/", req.url));
// //       }
// //     }
// //     return NextResponse.next();
// //   },
// //   {
// //     callbacks: {
// //       // Allow the middleware to run on these pages
// //       authorized: ({ token }) => true, 
// //     },
// //   }
// // );

// // export const config = {
// //   matcher: ["/admin/:path*"],
// // };






// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   // This function runs ONLY if "authorized" returns true below
//   function middleware(req) {
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         const path = req.nextUrl.pathname;

//         // 1. If trying to access Admin Area
//         if (path.startsWith("/admin")) {
//           // Exception: Allow the actual Login Page
//           if (path === "/admin/login") return true;

//           // STRICT CHECK: Must have token AND role must be 'admin'
//           return token?.role === "admin";
//         }

//         // 2. Allow all other routes (Home, Pets, etc.)
//         return true;
//       },
//     },
//     // Redirect to this page if "authorized" returns false
//     pages: {
//       signIn: "/login", 
//     },
//   }
// );

// // Protect these paths
// export const config = {
//   matcher: ["/admin/:path*"],
// };









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

        // 1. If user is trying to access the Admin Login Page, ALWAYS ALLOW
        if (path === "/admin/login") {
          return true; 
        }

        // 2. If trying to access any OTHER /admin page
        if (path.startsWith("/admin")) {
           // Must be logged in AND have role 'admin'
           return token?.role === "admin";
        }

        // 3. Allow all other routes (Home, Pets, etc.)
        return true;
      },
    },
    pages: {
      signIn: "/login", // If rejected, send them to the main Client login
    },
  }
);

// Protect everything starting with /admin
export const config = {
  matcher: ["/layout/:path*"],
};