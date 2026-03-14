import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignmentSubmissionEnrollment1780000002000 implements MigrationInterface {
  name = 'AssignmentSubmissionEnrollment1780000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assigment_submissions"
      ADD COLUMN "enrollmentId" uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "assigment_submissions"
      ADD CONSTRAINT "FK_assigment_submissions_enrollment"
      FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assigment_submissions"
      DROP CONSTRAINT "FK_assigment_submissions_enrollment"
    `);

    await queryRunner.query(`
      ALTER TABLE "assigment_submissions"
      DROP COLUMN "enrollmentId"
    `);
  }
}
