import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email/HP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = credentials.identifier as string;
        const password = credentials.password as string;

        const isPhone = /^\d+$/.test(identifier);
        const condition = isPhone 
          ? eq(users.phoneNumber, identifier) 
          : eq(users.email, identifier);

        const [user] = await db
          .select()
          .from(users)
          .where(condition)
          .limit(1);

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if user exists, if not create one
        const email = user.email!;
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

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
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
});
