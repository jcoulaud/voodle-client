import { gql } from '@apollo/client';

export const GET_USER_STRATEGIES = gql`
  query GetUserStrategies {
    userStrategies {
      id
      name
      isActive
      strategyLogic
      maxBetAmount
      pnlUSD
      pnlTON
    }
  }
`;
