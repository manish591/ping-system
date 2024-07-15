import { SessionStrategy } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { db } from "@/prisma/src";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  session: { strategy: "jwt" as SessionStrategy },
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      if(account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if(token?.accessToken) {
        session.userId = token.sub;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  }
} satisfies NextAuthOptions;

declare module "next-auth" {
  interface Session {
    accessToken?: string
    userId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}