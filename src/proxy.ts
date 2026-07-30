import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// Uses the lightweight auth config (no Prisma adapter) since it only needs
// to read the JWT session cookie, not touch the database.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
