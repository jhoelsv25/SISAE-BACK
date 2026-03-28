import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeCredentialColumns1783000014000 implements MigrationInterface {
  name = 'NormalizeCredentialColumns1783000014000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'teacher_credentials' AND column_name = 'credentialCode'
        ) THEN
          ALTER TABLE "teacher_credentials" RENAME COLUMN "credentialCode" TO "credential_code";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'teacher_credentials' AND column_name = 'qrValue'
        ) THEN
          ALTER TABLE "teacher_credentials" RENAME COLUMN "qrValue" TO "qr_value";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'teacher_credentials' AND column_name = 'issuedAt'
        ) THEN
          ALTER TABLE "teacher_credentials" RENAME COLUMN "issuedAt" TO "issued_at";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'teacher_credentials' AND column_name = 'expiresAt'
        ) THEN
          ALTER TABLE "teacher_credentials" RENAME COLUMN "expiresAt" TO "expires_at";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'student_credentials' AND column_name = 'credentialCode'
        ) THEN
          ALTER TABLE "student_credentials" RENAME COLUMN "credentialCode" TO "credential_code";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'student_credentials' AND column_name = 'qrValue'
        ) THEN
          ALTER TABLE "student_credentials" RENAME COLUMN "qrValue" TO "qr_value";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'student_credentials' AND column_name = 'issuedAt'
        ) THEN
          ALTER TABLE "student_credentials" RENAME COLUMN "issuedAt" TO "issued_at";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'student_credentials' AND column_name = 'expiresAt'
        ) THEN
          ALTER TABLE "student_credentials" RENAME COLUMN "expiresAt" TO "expires_at";
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'teacher_credentials' AND column_name = 'credential_code'
        ) THEN
          ALTER TABLE "teacher_credentials" RENAME COLUMN "credential_code" TO "credentialCode";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'teacher_credentials' AND column_name = 'qr_value'
        ) THEN
          ALTER TABLE "teacher_credentials" RENAME COLUMN "qr_value" TO "qrValue";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'teacher_credentials' AND column_name = 'issued_at'
        ) THEN
          ALTER TABLE "teacher_credentials" RENAME COLUMN "issued_at" TO "issuedAt";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'teacher_credentials' AND column_name = 'expires_at'
        ) THEN
          ALTER TABLE "teacher_credentials" RENAME COLUMN "expires_at" TO "expiresAt";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'student_credentials' AND column_name = 'credential_code'
        ) THEN
          ALTER TABLE "student_credentials" RENAME COLUMN "credential_code" TO "credentialCode";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'student_credentials' AND column_name = 'qr_value'
        ) THEN
          ALTER TABLE "student_credentials" RENAME COLUMN "qr_value" TO "qrValue";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'student_credentials' AND column_name = 'issued_at'
        ) THEN
          ALTER TABLE "student_credentials" RENAME COLUMN "issued_at" TO "issuedAt";
        END IF;

        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'student_credentials' AND column_name = 'expires_at'
        ) THEN
          ALTER TABLE "student_credentials" RENAME COLUMN "expires_at" TO "expiresAt";
        END IF;
      END $$;
    `);
  }
}
