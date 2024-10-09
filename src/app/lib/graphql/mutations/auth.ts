import { gql } from '@apollo/client';

export const SEND_MAGIC_LINK = gql`
  mutation SEND_MAGIC_LINK($email: String!) {
    sendMagicLink(email: $email) {
      ... on AuthResultBase {
        success
        message
      }
    }
  }
`;

export const VERIFY_MAGIC_LINK = gql`
  mutation VERIFY_MAGIC_LINK($token: String!, $email: String!) {
    verifyMagicLink(token: $token, email: $email) {
      ... on AuthResultBase {
        success
        message
      }
      ... on AuthResultWithMnemonic {
        success
        message
        mnemonic
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      ... on AuthResultBase {
        success
        message
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      ... on AuthResultBase {
        success
        message
      }
    }
  }
`;
