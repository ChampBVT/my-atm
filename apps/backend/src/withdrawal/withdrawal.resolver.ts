import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { WithdrawInput } from 'src/withdrawal/input/withdraw.input';
import { WithdrawPayload } from 'src/withdrawal/model/withdraw-payload.union';

import { WithdrawalService } from 'src/withdrawal/withdrawal.service';

@Resolver()
export class WithdrawalResolver {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Mutation(() => WithdrawPayload)
  async withdraw(
    @Args() input: WithdrawInput,
  ): Promise<typeof WithdrawPayload> {
    return this.withdrawalService.withdraw(input.pin, input.amount);
  }
}
