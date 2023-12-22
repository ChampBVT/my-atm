import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { AccountPayload } from 'src/account/model/account-payload.union';
import { AccountService } from 'src/account/account.service';
import { InquiryAccountInput } from 'src/inquiry/input/inquiry-account.input';
import { InquiryNamespace } from 'src/viewer/model/inquiry-namespace.model';

@Resolver(() => InquiryNamespace)
export class InquiryResolver {
  constructor(private readonly accountService: AccountService) {}

  @ResolveField(() => AccountPayload)
  async account(
    @Args() input: InquiryAccountInput,
  ): Promise<typeof AccountPayload> {
    return this.accountService.getCurrentAccount(input.pin);
  }
}
