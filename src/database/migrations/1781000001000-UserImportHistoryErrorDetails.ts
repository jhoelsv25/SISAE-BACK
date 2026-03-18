import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserImportHistoryErrorDetails1781000001000 implements MigrationInterface {
  name = 'UserImportHistoryErrorDetails1781000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_import_histories"
      ADD COLUMN "error_details" jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_import_histories"
      DROP COLUMN "error_details"
    `);
  }
}
