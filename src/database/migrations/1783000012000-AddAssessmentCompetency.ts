import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAssessmentCompetency1783000012000 implements MigrationInterface {
  name = 'AddAssessmentCompetency1783000012000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assessments"
      ADD COLUMN IF NOT EXISTS "competency_id" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "assessments"
      ADD CONSTRAINT "FK_assessments_competency_id"
      FOREIGN KEY ("competency_id") REFERENCES "competencies"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assessments" DROP CONSTRAINT IF EXISTS "FK_assessments_competency_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "assessments" DROP COLUMN IF EXISTS "competency_id"
    `);
  }
}
