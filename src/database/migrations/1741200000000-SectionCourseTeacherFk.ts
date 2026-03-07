import { MigrationInterface, QueryRunner } from 'typeorm';

export class SectionCourseTeacherFk1741200000000 implements MigrationInterface {
  name = 'SectionCourseTeacherFk1741200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "section_courses" ADD COLUMN "teacherId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "section_courses" ADD CONSTRAINT "FK_section_courses_teacher" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "section_courses" DROP CONSTRAINT "FK_section_courses_teacher"`,
    );
    await queryRunner.query(
      `ALTER TABLE "section_courses" DROP COLUMN "teacherId"`,
    );
  }
}
