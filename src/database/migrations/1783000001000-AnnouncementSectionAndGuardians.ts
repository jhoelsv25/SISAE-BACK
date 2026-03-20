import { MigrationInterface, QueryRunner } from 'typeorm';

export class AnnouncementSectionAndGuardians1783000001000 implements MigrationInterface {
  name = 'AnnouncementSectionAndGuardians1783000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."announcements_recipient_enum" RENAME TO "announcements_recipient_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."announcements_recipient_enum" AS ENUM('students', 'teachers', 'guardians', 'all')`);
    await queryRunner.query(`
      ALTER TABLE "announcements"
      ALTER COLUMN "recipient"
      TYPE "public"."announcements_recipient_enum"
      USING "recipient"::text::"public"."announcements_recipient_enum"
    `);
    await queryRunner.query(`DROP TYPE "public"."announcements_recipient_enum_old"`);
    await queryRunner.query(`ALTER TABLE "announcements" ADD COLUMN "sectionId" uuid`);
    await queryRunner.query(`
      ALTER TABLE "announcements"
      ADD CONSTRAINT "FK_announcements_section"
      FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcements" DROP CONSTRAINT "FK_announcements_section"`);
    await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "sectionId"`);
    await queryRunner.query(`ALTER TYPE "public"."announcements_recipient_enum" RENAME TO "announcements_recipient_enum_new"`);
    await queryRunner.query(`CREATE TYPE "public"."announcements_recipient_enum" AS ENUM('students', 'teachers', 'all')`);
    await queryRunner.query(`
      ALTER TABLE "announcements"
      ALTER COLUMN "recipient"
      TYPE "public"."announcements_recipient_enum"
      USING CASE
        WHEN "recipient"::text = 'guardians' THEN 'all'::text
        ELSE "recipient"::text
      END::"public"."announcements_recipient_enum"
    `);
    await queryRunner.query(`DROP TYPE "public"."announcements_recipient_enum_new"`);
  }
}
