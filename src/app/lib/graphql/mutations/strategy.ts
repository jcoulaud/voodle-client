import { gql } from '@apollo/client';

export const CREATE_STRATEGY = gql`
  mutation CreateStrategy($input: CreateStrategyInput!) {
    createStrategy(input: $input) {
      name
      strategyLogic
      isActive
      maxBetAmount
    }
  }
`;

export const EDIT_STRATEGY = gql`
  mutation EditStrategy($input: EditStrategyInput!) {
    editStrategy(input: $input) {
      id
      name
      isActive
    }
  }
`;
