import { MigrationInterface, QueryRunner } from "typeorm";

export class Fix1763779394510 implements MigrationInterface {
    name = 'Fix1763779394510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "learning_modules" DROP CONSTRAINT "FK_9f89b56332a1fb88e59b13fa863"`);
        await queryRunner.query(`ALTER TABLE "learning_modules" RENAME COLUMN "section_course_id_id" TO "section_course_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "person_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_5ed72dcd00d6e5a88c6a6ba3d18" UNIQUE ("person_id")`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "management_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "ugel" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "dre" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "principal" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "district" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "province" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "department" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "logo_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "virtual_classrooms" ALTER COLUMN "access_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "virtual_classrooms" ALTER COLUMN "access_password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "virtual_classrooms" ALTER COLUMN "meeting_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_5ed72dcd00d6e5a88c6a6ba3d18" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "learning_modules" ADD CONSTRAINT "FK_cd838cdfcdd8f036e72e64d4126" FOREIGN KEY ("section_course_id") REFERENCES "section_courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "learning_modules" DROP CONSTRAINT "FK_cd838cdfcdd8f036e72e64d4126"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5ed72dcd00d6e5a88c6a6ba3d18"`);
        await queryRunner.query(`ALTER TABLE "virtual_classrooms" ALTER COLUMN "meeting_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "virtual_classrooms" ALTER COLUMN "access_password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "virtual_classrooms" ALTER COLUMN "access_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "logo_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "department" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "province" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "district" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "principal" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "dre" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "ugel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "institutions" ALTER COLUMN "management_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_5ed72dcd00d6e5a88c6a6ba3d18"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "person_id"`);
        await queryRunner.query(`ALTER TABLE "learning_modules" RENAME COLUMN "section_course_id" TO "section_course_id_id"`);
        await queryRunner.query(`ALTER TABLE "learning_modules" ADD CONSTRAINT "FK_9f89b56332a1fb88e59b13fa863" FOREIGN KEY ("section_course_id_id") REFERENCES "section_courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
