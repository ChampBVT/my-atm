import { Injectable } from '@nestjs/common';
import { StorageEntity } from 'src/storage/storage.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StorageRepository extends Repository<StorageEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(StorageEntity, dataSource.createEntityManager());
  }

  async updateById(
    id: number,
    bankNotesAmount: Pick<
      StorageEntity,
      'fiveNotes' | 'tenNotes' | 'twentyNotes'
    >,
  ): Promise<void> {
    await this.update(id, {
      fiveNotes: bankNotesAmount.fiveNotes,
      tenNotes: bankNotesAmount.tenNotes,
      twentyNotes: bankNotesAmount.twentyNotes,
    });
  }
}
