import { ApolloError } from '@apollo/client';
import type { ErrorResponse } from '@apollo/client/link/error';

export const formatApolloError = (
  error: ApolloError | ErrorResponse,
): string => {
  const defaultMessage = 'Unexpected error occurred';

  for (const gqlError of error.graphQLErrors || []) {
    if (
      !(typeof gqlError.extensions.originalError === 'object') ||
      !gqlError.extensions.originalError
    )
      continue;

    if (
      'message' in gqlError.extensions.originalError &&
      Array.isArray(gqlError.extensions.originalError.message) &&
      gqlError.extensions.originalError.message
    ) {
      const firstErrorMessage: string | undefined =
        gqlError.extensions.originalError.message[0];

      return firstErrorMessage
        ? firstErrorMessage[0].toLocaleUpperCase() + firstErrorMessage.slice(1)
        : defaultMessage;
    }
  }

  return defaultMessage;
};
