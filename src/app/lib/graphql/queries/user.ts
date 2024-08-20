import { gql } from '@apollo/client';

export const GET_USER_BY_EMAIL = gql`
  query GET_USER_BY_EMAIL($email: String!) {
    userByEmail(email: $email) {
      id
      username
      email
      emailVerified
      createdAt
      updatedAt
    }
  }
`;
