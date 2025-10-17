import { MigrationInterface, QueryRunner } from "typeorm";

export class Ultima1759965602357 implements MigrationInterface {
    name = 'Ultima1759965602357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "academic_periods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "academic_year_id" character varying NOT NULL, "academicYearId" uuid, CONSTRAINT "PK_911f414fba24e3855a5ba1f51ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "academic_years" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "year" integer NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_3c0ae310e10702e0aab78f7edae" UNIQUE ("year"), CONSTRAINT "PK_2021b90bfbfa6c9da7df34ca1cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."grades_shift_enum" AS ENUM('morning', 'afternoon', 'night')`);
        await queryRunner.query(`CREATE TABLE "grades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "code" character varying(20), "shift" "public"."grades_shift_enum" NOT NULL DEFAULT 'morning', "academic_year_id" character varying NOT NULL, "academicYearId" uuid, CONSTRAINT "UQ_aed8f750101d1f10aa3d6f78024" UNIQUE ("code"), CONSTRAINT "PK_4740fb6f5df2505a48649f1687b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "capacity" integer, "grade_id" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "gradeId" uuid, CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "academic_periods" ADD CONSTRAINT "FK_5088bdc9208f73265d836d9aa05" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_0f675aa04f910fe166f5356e297" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sections" ADD CONSTRAINT "FK_8eb5f422b2a34cc7bf9039e2231" FOREIGN KEY ("gradeId") REFERENCES "grades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sections" DROP CONSTRAINT "FK_8eb5f422b2a34cc7bf9039e2231"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_0f675aa04f910fe166f5356e297"`);
        await queryRunner.query(`ALTER TABLE "academic_periods" DROP CONSTRAINT "FK_5088bdc9208f73265d836d9aa05"`);
        await queryRunner.query(`DROP TABLE "sections"`);
        await queryRunner.query(`DROP TABLE "grades"`);
        await queryRunner.query(`DROP TYPE "public"."grades_shift_enum"`);
        await queryRunner.query(`DROP TABLE "academic_years"`);
        await queryRunner.query(`DROP TABLE "academic_periods"`);
    }

}
