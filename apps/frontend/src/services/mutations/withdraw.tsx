import { gql } from '@apollo/client';

export const MUTATION_WITHDRAW = gql`
  mutation Withdraw($amount: Float!, $pin: String!) {
    withdraw(amount: $amount, pin: $pin) {
      ... on WithdrawSuccess {
        fiveNotes
        tenNotes
        twentyNotes
      }
      ... on UserError {
        code
        message
      }
    }
  }
`;
