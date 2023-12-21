import { gql } from '@apollo/client';

export const QUERY_INQUIRY_ACCOUNT = gql`
  query InquiryAccount($pin: String!) {
    viewer {
      inquiry {
        account(pin: $pin) {
          ... on Account {
            balance
          }
          ... on UserError {
            code
            message
          }
        }
      }
    }
  }
`;
