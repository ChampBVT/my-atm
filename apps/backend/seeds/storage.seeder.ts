import { StorageEntity } from 'src/storage/storage.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class StorageSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(StorageEntity);

    await repository.clear();

    const storage = repository.create({
      fiveNotes: 40,
      tenNotes: 20,
      twentyNotes: 10,
    });

    await repository.save(storage);
  }
}
