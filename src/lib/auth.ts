import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { subscription: true },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          storeName: user.storeName,
          storeId: user.storeId,
          apiKey: user.apiKey,
          subscriptionStatus: user.subscription?.status ?? 'inactive',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.storeName = (user as any).storeName;
        token.storeId = (user as any).storeId;
        token.apiKey = (user as any).apiKey;
        token.subscriptionStatus = (user as any).subscriptionStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).storeName = token.storeName;
        (session.user as any).storeId = token.storeId;
        (session.user as any).apiKey = token.apiKey;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
