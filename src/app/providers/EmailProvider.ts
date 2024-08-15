import { print } from 'graphql';
import { Provider } from 'next-auth/providers/index';
import { SEND_MAGIC_LINK } from '../lib/graphql/mutations/auth';

export default function CustomProvider(): Provider {
  return {
    id: 'custom',
    name: 'Custom',
    type: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
    },
    authorize: async (credentials: Record<string, string> | undefined) => {
      if (!credentials?.email) return null;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: print(SEND_MAGIC_LINK),
            variables: { email: credentials.email },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data.sendMagicLink.success) {
            return { id: credentials.email, email: credentials.email };
          } else {
            console.error('Error from backend:', data.data.sendMagicLink.message);
            return null;
          }
        } else {
          const errorData = await response.json();
          console.error('Error from backend:', errorData);
          return null;
        }
      } catch (error) {
        console.error('Error in custom provider:', error);
        return null;
      }
    },
  };
}
