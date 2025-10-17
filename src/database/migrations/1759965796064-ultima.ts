import { MigrationInterface, QueryRunner } from "typeorm";

export class Ultima1759965796064 implements MigrationInterface {
    name = 'Ultima1759965796064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_0f675aa04f910fe166f5356e297"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "academicYearId"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "academic_year_id"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "academic_year_id" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_004fc3bfe751aeaf87f927b4a8c" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_004fc3bfe751aeaf87f927b4a8c"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "academic_year_id"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "academic_year_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "academicYearId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_0f675aa04f910fe166f5356e297" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
