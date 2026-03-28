import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAssignmentPublishSchedule1783000015000 implements MigrationInterface {
  name = 'AddAssignmentPublishSchedule1783000015000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assigments"
      ADD COLUMN IF NOT EXISTS "publish_at" TIMESTAMP WITH TIME ZONE
    `);
    await queryRunner.query(`
      ALTER TABLE "assigments"
      ADD COLUMN IF NOT EXISTS "published_at" TIMESTAMP WITH TIME ZONE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assigments"
      DROP COLUMN IF EXISTS "published_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "assigments"
      DROP COLUMN IF EXISTS "publish_at"
    `);
  }
}
