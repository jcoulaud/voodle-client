import { gql } from '@apollo/client';

export const SEND_MAGIC_LINK = gql`
  mutation SEND_MAGIC_LINK($email: String!) {
    sendMagicLink(email: $email) {
      success
      message
    }
  }
`;

export const VERIFY_MAGIC_LINK = gql`
  mutation VERIFY_MAGIC_LINK($token: String!, $email: String!) {
    verifyMagicLink(token: $token, email: $email) {
      success
      message
    }
  }
`;
