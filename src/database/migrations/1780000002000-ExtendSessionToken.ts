import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendSessionToken1780000002000 implements MigrationInterface {
  name = 'ExtendSessionToken1780000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sessions"
      ALTER COLUMN "session_token" TYPE text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sessions"
      ALTER COLUMN "session_token" TYPE character varying(255)
    `);
  }
}
