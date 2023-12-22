import { Module } from '@nestjs/common';
import { StorageRepository } from 'src/storage/storage.repository';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [],
  providers: [StorageService, StorageRepository],
  exports: [StorageService],
})
export class StorageModule {}
