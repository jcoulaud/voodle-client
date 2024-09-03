import { gql } from '@apollo/client';

export const ME = gql`
  query ME {
    me {
      username
      email
    }
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($input: EditUserInput!) {
    editUser(input: $input) {
      username
      email
    }
  }
`;
