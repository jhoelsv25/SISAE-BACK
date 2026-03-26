import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignmentAssessmentAndResponses1783000007000 implements MigrationInterface {
  name = 'AssignmentAssessmentAndResponses1783000007000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assigments" ADD COLUMN "assessmentId" uuid`);
    await queryRunner.query(`ALTER TABLE "assigment_submissions" ADD COLUMN "response_data" jsonb`);
    await queryRunner.query(`
      ALTER TABLE "assigments"
      ADD CONSTRAINT "FK_assigments_assessment"
      FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assigments" DROP CONSTRAINT "FK_assigments_assessment"`);
    await queryRunner.query(`ALTER TABLE "assigment_submissions" DROP COLUMN "response_data"`);
    await queryRunner.query(`ALTER TABLE "assigments" DROP COLUMN "assessmentId"`);
  }
}
