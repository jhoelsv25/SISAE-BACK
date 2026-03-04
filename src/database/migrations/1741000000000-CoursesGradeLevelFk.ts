import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoursesGradeLevelFk1741000000000 implements MigrationInterface {
  name = 'CoursesGradeLevelFk1741000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_8cf3e66aec03331d89f46fff9fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_courses_grade_level" FOREIGN KEY ("grade_id") REFERENCES "grade_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_courses_grade_level"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_8cf3e66aec03331d89f46fff9fb" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
