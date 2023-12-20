import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountTable1703015057040 implements MigrationInterface {
  name = 'CreateAccountTable1703015057040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" SERIAL NOT NULL, "balance" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
