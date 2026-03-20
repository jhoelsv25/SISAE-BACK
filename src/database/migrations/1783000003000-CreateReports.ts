import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReports1783000003000 implements MigrationInterface {
  name = 'CreateReports1783000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."reports_type_enum" AS ENUM(
        'academic',
        'attendance',
        'payments',
        'behavior',
        'enrollment',
        'custom',
        'other'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."reports_format_enum" AS ENUM(
        'pdf',
        'xlsx',
        'csv'
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        "name" character varying(150) NOT NULL,
        "description" text,
        "type" "public"."reports_type_enum" NOT NULL,
        "format" "public"."reports_format_enum",
        "generated_at" TIMESTAMPTZ,
        "download_url" character varying(255),
        "created_by" character varying(120),
        "parameters" jsonb,
        CONSTRAINT "PK_reports_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TYPE "public"."reports_format_enum"`);
    await queryRunner.query(`DROP TYPE "public"."reports_type_enum"`);
  }
}
