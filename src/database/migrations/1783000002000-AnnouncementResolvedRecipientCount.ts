import { MigrationInterface, QueryRunner } from 'typeorm';

export class AnnouncementResolvedRecipientCount1783000002000 implements MigrationInterface {
  name = 'AnnouncementResolvedRecipientCount1783000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcements" ADD COLUMN "resolved_recipient_count" integer NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "resolved_recipient_count"`);
  }
}
