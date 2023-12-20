import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScreenCloudService } from 'src/common/external/screencloud/screencloud.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [ScreenCloudService],
  exports: [ScreenCloudService],
})
export class ScreenCloudModule {}
