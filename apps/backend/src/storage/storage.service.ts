import { UserInputError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { StorageEntity } from 'src/storage/storage.entity';
import { StorageRepository } from 'src/storage/storage.repository';

@Injectable()
export class StorageService {
  constructor(private readonly storageRepository: StorageRepository) {}

  async getCurrentStorage(): Promise<StorageEntity> {
    const storageEntity = await this.storageRepository.findOneBy({});

    if (!storageEntity) {
      throw new UserInputError('Storage not found');
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
