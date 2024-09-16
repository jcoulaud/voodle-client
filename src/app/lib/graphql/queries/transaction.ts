import { gql } from '@apollo/client';

export const GET_USER_TRANSACTIONS = gql`
  query GetUserTransactions($page: Int!, $limit: Int!) {
    getUserTransactions(page: $page, limit: $limit) {
      data {
        id
        type
        amount_token
        amount_ton
        price_in_usd
        status
        created_at
      }
      total
      page
      limit
    }
  }
`;
