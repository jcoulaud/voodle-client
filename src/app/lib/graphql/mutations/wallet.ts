import { gql } from '@apollo/client';

export const WALLET_WITHDRAW = gql`
  mutation WithdrawFunds($fromAddress: String!, $toAddress: String!, $amount: String!) {
    withdrawFunds(fromAddress: $fromAddress, toAddress: $toAddress, amount: $amount) {
      success
    }
  }
`;
