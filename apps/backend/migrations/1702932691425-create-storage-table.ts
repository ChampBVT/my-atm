import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStorageTable1702932691425 implements MigrationInterface {
  name = 'CreateStorageTable1702932691425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'my-atm',
        'public',
        'storage',
        'GENERATED_COLUMN',
        'total_value',
        '(five_notes * 5) + (ten_notes * 10) + (twenty_notes * 20)',
      ],
    );
    await queryRunner.query(
      `CREATE TABLE "storage" ("id" SERIAL NOT NULL, "five_notes" integer NOT NULL DEFAULT '0', "ten_notes" integer NOT NULL DEFAULT '0', "twenty_notes" integer NOT NULL DEFAULT '0', "total_value" integer GENERATED ALWAYS AS ((five_notes * 5) + (ten_notes * 10) + (twenty_notes * 20)) STORED NOT NULL, CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "storage"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`,
      ['GENERATED_COLUMN', 'total_value', 'my-atm', 'public', 'storage'],
    );
  }
}
