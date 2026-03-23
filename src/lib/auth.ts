import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email/HP", type: "text" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Type", type: "text" }, // "password" or "otp"
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = (credentials.identifier as string).toLowerCase();
        const password = credentials.password as string;
        const loginType = credentials.loginType as string || "password";

        const isPhone = /^\d+$/.test(identifier);

        if (loginType === "otp" && !isPhone) {
          // Handle OTP Verification for Email
          const [tokenData] = await db
            .select()
            .from(verificationTokens)
            .where(eq(verificationTokens.identifier, identifier))
            .limit(1);

          if (!tokenData || tokenData.token !== password || tokenData.expires < new Date()) {
            return null; // Invalid or expired OTP
          }

          // Delete token after successful use
          await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));
        }

        const condition = isPhone
          ? eq(users.phoneNumber, identifier)
          : eq(users.email, identifier);

        const [user] = await db
          .select()
          .from(users)
          .where(condition)
          .limit(1);

        if (!user) {
          return null;
        }

        if (loginType === "password") {
          if (!user.password) return null;
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) return null;
        }

        if (user.status === "disabled") {
          throw new Error("Akun Anda telah dinonaktifkan. Silakan hubungi dukungan.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          phoneNumber: user.phoneNumber,
          status: user.status,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
      : []),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.phoneNumber = (user as any).phoneNumber;
        token.status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).phoneNumber = token.phoneNumber as string;
        (session.user as any).status = token.status as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if user exists, if not create one
        const email = user.email!.toLowerCase();
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (existingUser && existingUser.status === "disabled") {
          return false; // Reject sign in for disabled users
        }

        if (!existingUser) {
          await db.insert(users).values({
            email,
            fullName: user.name || email.split("@")[0],
            password: null, // OAuth users don't have passwords
          });
        }

        // Get the user ID for JWT
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (dbUser) {
          user.id = dbUser.id;
          (user as any).status = dbUser.status;
          (user as any).role = dbUser.role;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
