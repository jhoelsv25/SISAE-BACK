import { MigrationInterface, QueryRunner } from "typeorm";

export class Final20271773540459609 implements MigrationInterface {
    name = 'Final20271773540459609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_user_preferences_user"`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" DROP CONSTRAINT "FK_assigment_submissions_enrollment"`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" RENAME COLUMN "enrollmentId" TO "enrollment_id"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "preferences" SET DEFAULT '{}'::jsonb`);
        await queryRunner.query(`ALTER TABLE "biometric" DROP COLUMN "ip"`);
        await queryRunner.query(`ALTER TABLE "biometric" ADD "ip" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_users" DROP COLUMN "device_user_id"`);
        await queryRunner.query(`ALTER TABLE "device_users" ADD "device_user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "device_users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_users" DROP COLUMN "card_no"`);
        await queryRunner.query(`ALTER TABLE "device_users" ADD "card_no" character varying`);
        await queryRunner.query(`ALTER TABLE "device_attendance_logs" DROP COLUMN "device_user_id"`);
        await queryRunner.query(`ALTER TABLE "device_attendance_logs" ADD "device_user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_attendance_logs" DROP COLUMN "device_ip"`);
        await queryRunner.query(`ALTER TABLE "device_attendance_logs" ADD "device_ip" character varying NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uq_user_preferences_user" ON "user_preferences" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" ADD CONSTRAINT "FK_06bbd0bede900791911f006c959" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assigment_submissions" DROP CONSTRAINT "FK_06bbd0bede900791911f006c959"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`);
        await queryRunner.query(`DROP INDEX "public"."uq_user_preferences_user"`);
        await queryRunner.query(`ALTER TABLE "device_attendance_logs" DROP COLUMN "device_ip"`);
        await queryRunner.query(`ALTER TABLE "device_attendance_logs" ADD "device_ip" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_attendance_logs" DROP COLUMN "device_user_id"`);
        await queryRunner.query(`ALTER TABLE "device_attendance_logs" ADD "device_user_id" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_users" DROP COLUMN "card_no"`);
        await queryRunner.query(`ALTER TABLE "device_users" ADD "card_no" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "device_users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "device_users" ADD "name" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device_users" DROP COLUMN "device_user_id"`);
        await queryRunner.query(`ALTER TABLE "device_users" ADD "device_user_id" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "biometric" DROP COLUMN "ip"`);
        await queryRunner.query(`ALTER TABLE "biometric" ADD "ip" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ALTER COLUMN "preferences" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" RENAME COLUMN "enrollment_id" TO "enrollmentId"`);
        await queryRunner.query(`ALTER TABLE "assigment_submissions" ADD CONSTRAINT "FK_assigment_submissions_enrollment" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_user_preferences_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
