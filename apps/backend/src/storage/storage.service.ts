import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StorageEntity } from 'src/storage/storage.entity';
import { StorageRepository } from 'src/storage/storage.repository';

@Injectable()
export class StorageService {
  constructor(private readonly storageRepository: StorageRepository) {}

  async getCurrentStorage(): Promise<StorageEntity> {
    const storageEntity = await this.storageRepository.getCurrent();

    if (!storageEntity) {
      throw new InternalServerErrorException('Storage not found');
    }

    return storageEntity;
  }

  async updateCurrentStorageById(
    id: number,
    bankNotesAmount: Pick<
      StorageEntity,
      'fiveNotes' | 'tenNotes' | 'twentyNotes'
    >,
  ): Promise<void> {
    await this.storageRepository.updateById(id, bankNotesAmount);
  }
}
