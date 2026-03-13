import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPreferences1780000001000 implements MigrationInterface {
  name = 'UserPreferences1780000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_preferences" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "preferences" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "user_id" uuid,
        CONSTRAINT "PK_user_preferences" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_preferences_user_id" UNIQUE ("user_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "user_preferences"
      ADD CONSTRAINT "FK_user_preferences_user"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_user_preferences_user"
    `);
    await queryRunner.query(`
      DROP TABLE "user_preferences"
    `);
  }
}
