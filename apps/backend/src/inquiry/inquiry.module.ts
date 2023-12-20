import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { InquiryResolver } from 'src/inquiry/inquiry.resolver';

@Module({ imports: [AccountModule], providers: [InquiryResolver] })
export class InquiryModule {}
