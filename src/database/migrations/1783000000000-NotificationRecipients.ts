import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationRecipients1783000000000 implements MigrationInterface {
  name = 'NotificationRecipients1783000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "notification_recipients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "notification_id" uuid NOT NULL,
        "recipient_id" uuid NOT NULL,
        "is_read" boolean NOT NULL DEFAULT false,
        "read_at" TIMESTAMP WITH TIME ZONE,
        "delivered_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_notification_recipients_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_notification_recipients_notification_recipient" UNIQUE ("notification_id", "recipient_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_notification_recipients_notification" ON "notification_recipients" ("notification_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_notification_recipients_recipient" ON "notification_recipients" ("recipient_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "notification_recipients"
      ADD CONSTRAINT "FK_notification_recipients_notification"
      FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "notification_recipients"
      ADD CONSTRAINT "FK_notification_recipients_user"
      FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      INSERT INTO "notification_recipients" ("notification_id", "recipient_id", "is_read", "read_at", "delivered_at", "created_at", "updated_at")
      SELECT
        n."id",
        n."recipient_id"::uuid,
        COALESCE(n."is_read", false),
        CASE
          WHEN n."read_at"::text IS NOT NULL THEN CURRENT_TIMESTAMP
          ELSE NULL
        END,
        n."created_at",
        n."created_at",
        n."updated_at"
      FROM "notifications" n
      WHERE n."recipient_id" IS NOT NULL
      ON CONFLICT ("notification_id", "recipient_id") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification_recipients" DROP CONSTRAINT "FK_notification_recipients_user"`);
    await queryRunner.query(`ALTER TABLE "notification_recipients" DROP CONSTRAINT "FK_notification_recipients_notification"`);
    await queryRunner.query(`DROP INDEX "public"."idx_notification_recipients_recipient"`);
    await queryRunner.query(`DROP INDEX "public"."idx_notification_recipients_notification"`);
    await queryRunner.query(`DROP TABLE "notification_recipients"`);
  }
}
