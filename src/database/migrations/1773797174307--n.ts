import { MigrationInterface, QueryRunner } from "typeorm";

export class  N1773797174307 implements MigrationInterface {
    name = ' N1773797174307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_user_preferences_user"`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" DROP CONSTRAINT "FK_assigment_submissions_enrollment"`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" RENAME COLUMN "enrollmentId" TO "enrollment_id"`);
        await queryRunner.query(`ALTER TABLE "persons" ALTER COLUMN "birth_place" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" DROP CONSTRAINT "UQ_e022ed149591249aa8641e0e282"`);
        await queryRunner.query(`ALTER TABLE "persons" ALTER COLUMN "nationality" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" DROP CONSTRAINT "UQ_5aa74853d2135e6078ea8d55c05"`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "address" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "persons" DROP CONSTRAINT "UQ_b17cd2cfac02400e9af4fb45572"`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "district"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "district" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "persons" DROP CONSTRAINT "UQ_161e950cfa90bf1aecdc8e34db1"`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "province"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "province" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "persons" DROP CONSTRAINT "UQ_daf1828c724e693c9cff725c075"`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "department"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "department" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "persons" DROP CONSTRAINT "UQ_6545fa46b808c5870a6b27a3adf"`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "phone" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "persons" DROP CONSTRAINT "UQ_68b2f79ca1ccae0180cdd5ff9f6"`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "mobile"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "mobile" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "preferences" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_user_preferences_user" ON "user_preferences" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" ADD CONSTRAINT "FK_06bbd0bede900791911f006c959" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assigment_submissions" DROP CONSTRAINT "FK_06bbd0bede900791911f006c959"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`);
        await queryRunner.query(`DROP INDEX "public"."uq_user_preferences_user"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "preferences" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "mobile"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "mobile" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" ADD CONSTRAINT "UQ_68b2f79ca1ccae0180cdd5ff9f6" UNIQUE ("mobile")`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "phone" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" ADD CONSTRAINT "UQ_6545fa46b808c5870a6b27a3adf" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "department"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "department" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" ADD CONSTRAINT "UQ_daf1828c724e693c9cff725c075" UNIQUE ("department")`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "province"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "province" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" ADD CONSTRAINT "UQ_161e950cfa90bf1aecdc8e34db1" UNIQUE ("province")`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "district"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "district" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" ADD CONSTRAINT "UQ_b17cd2cfac02400e9af4fb45572" UNIQUE ("district")`);
        await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "persons" ADD "address" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" ADD CONSTRAINT "UQ_5aa74853d2135e6078ea8d55c05" UNIQUE ("address")`);
        await queryRunner.query(`ALTER TABLE "persons" ALTER COLUMN "nationality" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "persons" ADD CONSTRAINT "UQ_e022ed149591249aa8641e0e282" UNIQUE ("birth_place")`);
        await queryRunner.query(`ALTER TABLE "persons" ALTER COLUMN "birth_place" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" RENAME COLUMN "enrollment_id" TO "enrollmentId"`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" ADD CONSTRAINT "FK_assigment_submissions_enrollment" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_user_preferences_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
