import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAcademicYearGradeScales1783000006000 implements MigrationInterface {
  name = 'CreateAcademicYearGradeScales1783000006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "academic_year_grade_scales" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "label" character varying(20) NOT NULL,
        "min_score" numeric(5,2) NOT NULL,
        "max_score" numeric(5,2) NOT NULL,
        "order_index" integer NOT NULL DEFAULT 1,
        "academic_year_id" uuid,
        CONSTRAINT "PK_academic_year_grade_scales_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "academic_year_grade_scales"
      ADD CONSTRAINT "FK_academic_year_grade_scales_year"
      FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "academic_year_grade_scales" DROP CONSTRAINT "FK_academic_year_grade_scales_year"`);
    await queryRunner.query(`DROP TABLE "academic_year_grade_scales"`);
  }
}
