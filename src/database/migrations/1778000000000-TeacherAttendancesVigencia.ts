import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeacherAttendancesVigencia1778000000000 implements MigrationInterface {
  name = 'TeacherAttendancesVigencia1778000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teacher_attendances" ADD COLUMN "vigencia" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `UPDATE "teacher_attendances" SET "vigencia" = 1 WHERE "vigencia" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teacher_attendances" DROP COLUMN "vigencia"`,
    );
  }
}
