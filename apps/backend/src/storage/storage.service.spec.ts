import { Test } from '@nestjs/testing';
import { mocker } from 'src/common/test/mocker';
import { StorageService } from 'src/storage/storage.service';
import { StorageRepository } from 'src/storage/storage.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { StorageEntity } from 'src/storage/storage.entity';

describe(StorageService.name, () => {
  let storageService: StorageService;
  let storageRepository: StorageRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [StorageService],
    })
      .useMocker(mocker)
      .compile();

    storageService = moduleRef.get<StorageService>(StorageService);
    storageRepository = moduleRef.get<StorageRepository>(StorageRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe(StorageService.prototype.getCurrentStorage, () => {
    it('Throw InternalServerErrorException, given current storage is not found', async () => {
      jest.spyOn(storageRepository, 'getCurrent').mockResolvedValue(null);

      expect(storageService.getCurrentStorage()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('Return StorageEntity, given current storage is found', async () => {
      jest.spyOn(storageRepository, 'getCurrent').mockResolvedValue({
        id: 1,
        fiveNotes: 1,
        tenNotes: 2,
        twentyNotes: 3,
        totalValue: 85,
      } as StorageEntity);

      expect(storageService.getCurrentStorage()).resolves.toEqual({
        id: 1,
        fiveNotes: 1,
        tenNotes: 2,
        twentyNotes: 3,
        totalValue: 85,
      });
    });
  });
});
