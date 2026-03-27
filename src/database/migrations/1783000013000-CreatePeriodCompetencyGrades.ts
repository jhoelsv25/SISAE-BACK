import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePeriodCompetencyGrades1783000013000 implements MigrationInterface {
  name = 'CreatePeriodCompetencyGrades1783000013000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "period_competency_grades" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "numericScore" numeric(5,2) NOT NULL,
        "literalScore" character varying(20),
        "totalWeight" numeric(7,2) NOT NULL DEFAULT 0,
        "assessmentsCount" integer NOT NULL DEFAULT 0,
        "enrollment_id" uuid,
        "academic_year_id" uuid,
        "period_id" uuid,
        "competency_id" uuid,
        "section_course_id" uuid,
        CONSTRAINT "PK_period_competency_grades_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_period_competency_grades_scope" UNIQUE ("enrollment_id", "period_id", "competency_id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "period_competency_grades"
      ADD CONSTRAINT "FK_period_competency_grades_enrollment"
      FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "period_competency_grades"
      ADD CONSTRAINT "FK_period_competency_grades_academic_year"
      FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "period_competency_grades"
      ADD CONSTRAINT "FK_period_competency_grades_period"
      FOREIGN KEY ("period_id") REFERENCES "academic_periods"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "period_competency_grades"
      ADD CONSTRAINT "FK_period_competency_grades_competency"
      FOREIGN KEY ("competency_id") REFERENCES "competencies"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "period_competency_grades"
      ADD CONSTRAINT "FK_period_competency_grades_section_course"
      FOREIGN KEY ("section_course_id") REFERENCES "section_courses"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "period_competency_grades" DROP CONSTRAINT IF EXISTS "FK_period_competency_grades_section_course"`);
    await queryRunner.query(`ALTER TABLE "period_competency_grades" DROP CONSTRAINT IF EXISTS "FK_period_competency_grades_competency"`);
    await queryRunner.query(`ALTER TABLE "period_competency_grades" DROP CONSTRAINT IF EXISTS "FK_period_competency_grades_period"`);
    await queryRunner.query(`ALTER TABLE "period_competency_grades" DROP CONSTRAINT IF EXISTS "FK_period_competency_grades_academic_year"`);
    await queryRunner.query(`ALTER TABLE "period_competency_grades" DROP CONSTRAINT IF EXISTS "FK_period_competency_grades_enrollment"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "period_competency_grades"`);
  }
}
