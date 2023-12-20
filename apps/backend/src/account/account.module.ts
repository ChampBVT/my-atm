import { Module } from '@nestjs/common';
import { AccountRepository } from 'src/account/account.repository';
import { AccountService } from 'src/account/account.service';
import { ScreenCloudModule } from 'src/common/external/screencloud/screencloud.module';

@Module({
  imports: [ScreenCloudModule],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
