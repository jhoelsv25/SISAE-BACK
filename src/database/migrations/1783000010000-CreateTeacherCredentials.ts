import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeacherCredentials1783000010000 implements MigrationInterface {
  name = 'CreateTeacherCredentials1783000010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "teacher_credentials" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "credentialCode" character varying(100) NOT NULL,
        "qrValue" text NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        "issuedAt" TIMESTAMP WITH TIME ZONE,
        "expiresAt" TIMESTAMP WITH TIME ZONE,
        "teacher_id" uuid,
        CONSTRAINT "UQ_teacher_credentials_code" UNIQUE ("credentialCode"),
        CONSTRAINT "UQ_teacher_credentials_teacher" UNIQUE ("teacher_id"),
        CONSTRAINT "PK_teacher_credentials" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "teacher_credentials"
      ADD CONSTRAINT "FK_teacher_credentials_teacher"
      FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "teacher_credentials" DROP CONSTRAINT "FK_teacher_credentials_teacher"`);
    await queryRunner.query(`DROP TABLE "teacher_credentials"`);
  }
}
