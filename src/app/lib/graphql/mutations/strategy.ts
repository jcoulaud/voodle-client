import { gql } from '@apollo/client';

export const CREATE_STRATEGY = gql`
  mutation CreateStrategy($input: CreateStrategyInput!) {
    createStrategy(input: $input) {
      name
      strategy
      isActive
    }
  }
`;
