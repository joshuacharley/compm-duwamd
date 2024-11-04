import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const { compare } = require("bcrypt");

import clientPromise from "@/lib/mongodb";

interface ExtendedUser extends User {
  role?: string;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends ExtendedUser {}
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = await clientPromise;
          const users = client.db("commercial_pm").collection("users");
          const user = await users.findOne({ email: credentials.email });

          if (user && (await compare(credentials.password, user.password))) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        } catch (error) {
          console.error("Error in NextAuth authorize function:", error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as ExtendedUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
