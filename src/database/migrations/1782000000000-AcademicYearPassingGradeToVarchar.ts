import { MigrationInterface, QueryRunner } from 'typeorm';

export class AcademicYearPassingGradeToVarchar1782000000000 implements MigrationInterface {
  name = 'AcademicYearPassingGradeToVarchar1782000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "academic_years"
      ALTER COLUMN "passing_grade" TYPE character varying(50)
      USING "passing_grade"::character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "academic_years"
      ALTER COLUMN "passing_grade" TYPE integer
      USING NULLIF(regexp_replace("passing_grade", '[^0-9-]', '', 'g'), '')::integer
    `);
  }
}
