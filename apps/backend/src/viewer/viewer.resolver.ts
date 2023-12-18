import { Query, ResolveField } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { InquiryNamespace } from 'src/viewer/model/inquiry-namespace.model';
import { Viewer } from 'src/viewer/model/viewer.model';

@Resolver(() => Viewer)
export class ViewerResolver {
  @Query(() => Viewer)
  viewer(): Viewer {
    return new Viewer();
  }

  @ResolveField(() => InquiryNamespace)
  inquiry(): InquiryNamespace {
    return new InquiryNamespace();
  }
}
