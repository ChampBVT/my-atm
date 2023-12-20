import { StorageEntity } from 'src/storage/storage.entity';

export const NOTE_VALUES: Record<
  keyof Pick<StorageEntity, 'fiveNotes' | 'tenNotes' | 'twentyNotes'>,
  number
> = {
  fiveNotes: 5,
  tenNotes: 10,
  twentyNotes: 20,
};
