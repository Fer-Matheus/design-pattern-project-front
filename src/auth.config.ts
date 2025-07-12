import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/login",
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
    async session({ session, token }) {
      return { ...session, ...token };
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
      }
      return token;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
