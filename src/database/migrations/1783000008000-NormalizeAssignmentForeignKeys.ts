import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeAssignmentForeignKeys1783000008000 implements MigrationInterface {
  name = 'NormalizeAssignmentForeignKeys1783000008000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assigment_submissions"
      DROP CONSTRAINT IF EXISTS "FK_assigment_submissions_enrollment"
    `);
    await queryRunner.query(`
      ALTER TABLE "assigment_submissions"
      DROP CONSTRAINT IF EXISTS "FK_06bbd0bede900791911f006c959"
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigment_submissions' AND column_name = 'enrollmentId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigment_submissions' AND column_name = 'enrollment_id'
        ) THEN
          ALTER TABLE "assigment_submissions" RENAME COLUMN "enrollmentId" TO "enrollment_id";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigment_submissions' AND column_name = 'enrollment_id'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.table_constraints
          WHERE table_name = 'assigment_submissions' AND constraint_name = 'FK_assigment_submissions_enrollment_snake'
        ) THEN
          ALTER TABLE "assigment_submissions"
          ADD CONSTRAINT "FK_assigment_submissions_enrollment_snake"
          FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "assigments"
      DROP CONSTRAINT IF EXISTS "FK_assigments_assessment"
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigments' AND column_name = 'assessmentId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigments' AND column_name = 'assessment_id'
        ) THEN
          ALTER TABLE "assigments" RENAME COLUMN "assessmentId" TO "assessment_id";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigments' AND column_name = 'assessment_id'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.table_constraints
          WHERE table_name = 'assigments' AND constraint_name = 'FK_assigments_assessment_snake'
        ) THEN
          ALTER TABLE "assigments"
          ADD CONSTRAINT "FK_assigments_assessment_snake"
          FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "assigments"
      DROP CONSTRAINT IF EXISTS "FK_assigments_assessment_snake"
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigments' AND column_name = 'assessment_id'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigments' AND column_name = 'assessmentId'
        ) THEN
          ALTER TABLE "assigments" RENAME COLUMN "assessment_id" TO "assessmentId";
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigments' AND column_name = 'assessmentId'
        ) THEN
          ALTER TABLE "assigments"
          ADD CONSTRAINT "FK_assigments_assessment"
          FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "assigment_submissions"
      DROP CONSTRAINT IF EXISTS "FK_assigment_submissions_enrollment_snake"
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigment_submissions' AND column_name = 'enrollment_id'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigment_submissions' AND column_name = 'enrollmentId'
        ) THEN
          ALTER TABLE "assigment_submissions" RENAME COLUMN "enrollment_id" TO "enrollmentId";
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'assigment_submissions' AND column_name = 'enrollmentId'
        ) THEN
          ALTER TABLE "assigment_submissions"
          ADD CONSTRAINT "FK_assigment_submissions_enrollment"
          FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
  }
}
