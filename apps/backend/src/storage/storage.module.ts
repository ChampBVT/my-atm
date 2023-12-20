import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageEntity } from 'src/storage/storage.entity';
import { StorageRepository } from 'src/storage/storage.repository';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([StorageEntity])],
  providers: [StorageService, StorageRepository],
  exports: [StorageService],
})
export class StorageModule {}
