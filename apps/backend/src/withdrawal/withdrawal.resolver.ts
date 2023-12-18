import { Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class WithdrawalResolver {
  @Mutation(() => Boolean)
  withdraw(): boolean {
    return true;
  }
}
