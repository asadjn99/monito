
// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "@/src/lib/prisma";
// import { compare } from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // 1. Google Provider (For Normal Users)
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       // We removed allowDangerousEmailAccountLinking to be "Strict"
//     }),

//     // 2. Credentials (For Admins Only)
//     CredentialsProvider({
//       name: "Admin Login",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//            throw new Error("Invalid inputs");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email }
//         });

//         // Strict Check: Only allow if user exists AND has a password
//         if (!user || !user.password) {
//           throw new Error("No admin account found.");
//         }

//         const isCorrect = await compare(credentials.password, user.password);
//         if (!isCorrect) throw new Error("Invalid password");

//         return user;
//       }
//     })
//   ],
  
//   pages: {
//     signIn: '/login',
//     error: '/login', 
//   },
  
//   session: { strategy: "jwt" },
  
//   callbacks: {
//     async jwt({ token, user }) {
//       // Pass the role to the token so Middleware can read it
//       if (user) token.role = user.role;
//       return token;
//     },
//     async session({ session, token }) {
//       // Pass the role to the session so the Client can read it
//       if (session?.user) session.user.role = token.role;
//       return session;
//     }
//   }
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

















import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/src/lib/prisma"; // Adjust path if needed
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 1. Google Provider (Creates 'User' roles by default)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 2. Credentials Provider (For Admin Only)
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
           throw new Error("Invalid inputs");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Only allow login if user has a password (Admin)
        if (!user || !user.password) {
          throw new Error("Invalid admin credentials");
        }

        const isCorrect = await compare(credentials.password, user.password);
        if (!isCorrect) throw new Error("Invalid password");

        return user;
      }
    })
  ],
  
  pages: {
    signIn: '/login',
    error: '/login', 
  },
  
  session: { strategy: "jwt" },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };