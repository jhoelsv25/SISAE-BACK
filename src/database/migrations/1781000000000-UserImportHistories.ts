import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserImportHistories1781000000000 implements MigrationInterface {
  name = 'UserImportHistories1781000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."user_import_histories_status_enum"
      AS ENUM('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED')
    `);
    await queryRunner.query(`
      CREATE TABLE "user_import_histories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "job_id" character varying(100) NOT NULL,
        "file_name" character varying(255) NOT NULL,
        "total_rows" integer NOT NULL DEFAULT '0',
        "processed_rows" integer NOT NULL DEFAULT '0',
        "created_rows" integer NOT NULL DEFAULT '0',
        "failed_rows" integer NOT NULL DEFAULT '0',
        "status" "public"."user_import_histories_status_enum" NOT NULL DEFAULT 'QUEUED',
        "started_at" TIMESTAMP WITH TIME ZONE,
        "finished_at" TIMESTAMP WITH TIME ZONE,
        "user_id" uuid,
        CONSTRAINT "UQ_user_import_histories_job_id" UNIQUE ("job_id"),
        CONSTRAINT "PK_user_import_histories_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "user_import_histories"
      ADD CONSTRAINT "FK_user_import_histories_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_import_histories" DROP CONSTRAINT "FK_user_import_histories_user_id"
    `);
    await queryRunner.query(`DROP TABLE "user_import_histories"`);
    await queryRunner.query(`DROP TYPE "public"."user_import_histories_status_enum"`);
  }
}
