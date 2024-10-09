import { DefaultSession, User } from 'next-auth';

export interface ExtendedUser extends User {
  id: string;
  username: string;
  email: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: ExtendedUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    email: string;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }
}
