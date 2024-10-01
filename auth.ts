import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/db";

export const { signIn, signOut, auth, handlers } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [GitHub],
	secret: process.env.AUTH_SECRET,
});
