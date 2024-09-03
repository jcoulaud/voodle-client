import { gql } from '@apollo/client';

export const GET_USER_WALLETS = gql`
  query GetUserWallets {
    getUserWallets {
      blockchain
      address
    }
  }
`;

export const GET_WALLET_PRIVATE_KEY = gql`
  query GetWalletPrivateKey($address: String!) {
    getWalletPrivateKey(address: $address)
  }
`;
