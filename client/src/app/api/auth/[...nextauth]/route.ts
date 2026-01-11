// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     // 1. Google Provider (For Customers)
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     // 2. Credentials Provider (For Admin via Database API)
//     CredentialsProvider({
//       name: "Admin Login",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         try {
//           // Make sure NEXT_PUBLIC_API_URL is set in your .env file (e.g., http://localhost:3000)
//           const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
          
//           const res = await fetch(`${apiUrl}/api/v1/admin/login`, {
//             method: 'POST',
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               email: credentials?.email,
//               password: credentials?.password
//             })
//           });

//           const user = await res.json();

//           // Check if API returned a valid user
//           if (res.ok && user) {
//             return user;
//           }
          
//           return null; // Login failed
//         } catch (e) {
//           console.error("Login Fetch Error:", e);
//           return null;
//         }
//       }
//     })
//   ],
  
//   pages: {
//     signIn: '/login', // Or '/admin/login' if you want a dedicated admin page
//     error: '/login', 
//   },
  
//   session: { strategy: "jwt" },
  
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//          token.id = user.id;
//          // @ts-ignore
//          token.role = user.role || "user";
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session?.user) {
//         // @ts-ignore
//         session.user.id = token.id;
//         // @ts-ignore
//         session.user.role = token.role;
//       }
//       return session;
//     }
//   }
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };





















import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // 👈 1. IMPORT ADAPTER
import prisma from "@/src/lib/prisma"; // 👈 2. IMPORT PRISMA
import { compare } from "bcryptjs"; // 👈 3. IMPORT BCRYPT

export const authOptions: NextAuthOptions = {
  // 4. CONNECT THE ADAPTER (This saves Google users to MongoDB)
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt", // Mandatory when using Credentials + Google together
  },

  providers: [
    // 1. Google Provider (For Customers)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 2. Credentials Provider (Direct DB Check - Faster & Safer)
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Check DB directly (No need to fetch an API)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("User not found or password missing");
        }

        // Verify Password
        const isCorrect = await compare(credentials.password, user.password);

        if (!isCorrect) {
          throw new Error("Invalid password");
        }

        return user;
      }
    })
  ],
  
  pages: {
    signIn: '/login', 
    error: '/login', 
  },
  
  callbacks: {
    // These callbacks make sure the User ID and Role are available in your app
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };