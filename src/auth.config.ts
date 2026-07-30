import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Edge-safe config: no Prisma/adapter here, since the pg driver adapter
// requires the Node.js runtime and would break middleware (Edge runtime).
// The full config in `auth.ts` extends this with the adapter for route handlers.
export default {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [Credentials({ credentials: { email: {}, password: {} } })],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
