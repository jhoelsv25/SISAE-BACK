import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentCredentials1783000011000 implements MigrationInterface {
  name = 'CreateStudentCredentials1783000011000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "student_credentials" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "credentialCode" character varying(100) NOT NULL,
        "qrValue" text NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        "issuedAt" TIMESTAMP WITH TIME ZONE,
        "expiresAt" TIMESTAMP WITH TIME ZONE,
        "student_id" uuid,
        CONSTRAINT "UQ_student_credentials_credential_code" UNIQUE ("credentialCode"),
        CONSTRAINT "REL_student_credentials_student_id" UNIQUE ("student_id"),
        CONSTRAINT "PK_student_credentials_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "student_credentials"
      ADD CONSTRAINT "FK_student_credentials_student_id"
      FOREIGN KEY ("student_id") REFERENCES "students"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "student_credentials" DROP CONSTRAINT IF EXISTS "FK_student_credentials_student_id"
    `);
    await queryRunner.query(`DROP TABLE IF EXISTS "student_credentials"`);
  }
}
