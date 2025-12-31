import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  
  providers: [
    // 1. Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });

          const user = await res.json();

          /
          if (res.ok && user) {
            return user;
          }
          return null; // Login failed
        } catch (e) {
          console.error("Login Error:", e);
          return null;
        }
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
      if (user) {
         token.id = user.id;
         // @ts-ignore
         token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };