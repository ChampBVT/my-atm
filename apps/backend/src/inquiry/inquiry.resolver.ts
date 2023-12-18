import { ResolveField, Resolver } from '@nestjs/graphql';
import { InquiryNamespace } from 'src/viewer/model/inquiry-namespace.model';

@Resolver(() => InquiryNamespace)
export class InquiryResolver {
  @ResolveField(() => Number)
  balance(): Promise<number> {
    return Promise.resolve(1);
  }
}
