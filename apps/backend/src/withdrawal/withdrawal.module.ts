import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { ScreenCloudModule } from 'src/common/external/screencloud/screencloud.module';
import { StorageModule } from 'src/storage/storage.module';
import { WithdrawalResolver } from 'src/withdrawal/withdrawal.resolver';
import { WithdrawalService } from 'src/withdrawal/withdrawal.service';

@Module({
  imports: [StorageModule, ScreenCloudModule, AccountModule],
  providers: [WithdrawalService, WithdrawalResolver],
})
export class WithdrawalModule {}
