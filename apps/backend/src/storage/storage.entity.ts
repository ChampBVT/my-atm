import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('storage')
export class StorageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'five_notes', type: 'int', default: 0 })
  fiveNotes: number;

  @Column({ name: 'ten_notes', type: 'int', default: 0 })
  tenNotes: number;

  @Column({ name: 'twenty_notes', type: 'int', default: 0 })
  twentyNotes: number;

  @Column({
    name: 'total_value',
    type: 'int',
    generatedType: 'STORED',
    asExpression: '(five_notes * 5) + (ten_notes * 10) + (twenty_notes * 20)',
  })
  totalValue: number;
}
