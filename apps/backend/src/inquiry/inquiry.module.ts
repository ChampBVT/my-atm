import { Module } from '@nestjs/common';
import { InquiryResolver } from 'src/inquiry/inquiry.resolver';

@Module({ providers: [InquiryResolver] })
export class InquiryModule {}
