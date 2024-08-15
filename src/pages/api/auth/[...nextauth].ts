import CustomProvider from '@/app/providers/EmailProvider';
import nextAuth, { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [CustomProvider()],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    verifyRequest: '/',
    error: '/',
  },
};

export default nextAuth(authOptions);
