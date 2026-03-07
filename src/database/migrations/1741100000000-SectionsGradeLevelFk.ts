import { MigrationInterface, QueryRunner } from 'typeorm';

export class SectionsGradeLevelFk1741100000000 implements MigrationInterface {
  name = 'SectionsGradeLevelFk1741100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sections" DROP CONSTRAINT IF EXISTS "FK_8eb5f422b2a34cc7bf9039e2231"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" ADD CONSTRAINT "FK_sections_grade_level" FOREIGN KEY ("gradeId") REFERENCES "grade_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sections" DROP CONSTRAINT IF EXISTS "FK_sections_grade_level"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" ADD CONSTRAINT "FK_8eb5f422b2a34cc7bf9039e2231" FOREIGN KEY ("gradeId") REFERENCES "grades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
