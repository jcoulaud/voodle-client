import { gql } from '@apollo/client';

export const GET_USER_WALLETS = gql`
  query GetUserWallets {
    getUserWallets {
      blockchain
      address
    }
  }
`;
