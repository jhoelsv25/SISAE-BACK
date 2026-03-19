import { MigrationInterface, QueryRunner } from 'typeorm';

export class AcademicYearPeriodCount1782000001000 implements MigrationInterface {
  name = 'AcademicYearPeriodCount1782000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "academic_years"
      ADD COLUMN "period_count" integer NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      UPDATE "academic_years" ay
      SET "period_count" = period_stats.count
      FROM (
        SELECT "academicYearId", COUNT(*)::integer AS count
        FROM "academic_periods"
        GROUP BY "academicYearId"
      ) AS period_stats
      WHERE ay."id" = period_stats."academicYearId"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "academic_years"
      DROP COLUMN "period_count"
    `);
  }
}
