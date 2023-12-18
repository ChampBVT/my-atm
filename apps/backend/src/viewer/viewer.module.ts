import { Module } from '@nestjs/common';
import { ViewerResolver } from 'src/viewer/viewer.resolver';

@Module({ providers: [ViewerResolver] })
export class ViewerModule {}
