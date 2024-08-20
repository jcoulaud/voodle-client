import CustomProvider from '@/app/providers/EmailProvider';
import nextAuth, { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [CustomProvider()],
  pages: {
    signIn: '/',
    verifyRequest: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default nextAuth(authOptions);
