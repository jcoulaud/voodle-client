import { gql } from '@apollo/client';

export const CREATE_STRATEGY = gql`
  mutation CreateStrategy($input: CreateStrategyInput!) {
    createStrategy(createStrategyInput: $input) {
      id
      name
      strategy
      userId
      isActive
      createdAt
      updatedAt
    }
  }
`;
