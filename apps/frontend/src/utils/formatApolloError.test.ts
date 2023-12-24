import { formatApolloError } from '@/utils/formatApolloError';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

describe(formatApolloError.name, () => {
  it('returns first error message', () => {
    const error = new ApolloError({
      graphQLErrors: [
        new GraphQLError('GQL ERROR', {
          extensions: {
            originalError: { message: ['first Error', 'second Error'] },
          },
        }),
      ],
    });

    const result = formatApolloError(error);

    expect(result).toBe('First Error');
  });

  it('returns default message, given originalError message is not found', () => {
    const error = new ApolloError({
      graphQLErrors: [
        new GraphQLError('GQL ERROR', {
          extensions: {
            originalError: { message: [] },
          },
        }),
      ],
    });

    const result = formatApolloError(error);

    expect(result).toBe('Unexpected error occurred');
  });

  it('returns default message, given error message is not found', () => {
    const error = new ApolloError({
      graphQLErrors: [new GraphQLError('GQL ERROR')],
    });

    const result = formatApolloError(error);

    expect(result).toBe('Unexpected error occurred');
  });
});
