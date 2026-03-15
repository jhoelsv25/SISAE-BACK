import { MigrationInterface, QueryRunner } from 'typeorm';

export class BiometricDevice1781000000000 implements MigrationInterface {
  name = 'BiometricDevice1781000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "device_attendance_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "device_user_id" character varying(50) NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
        "status" integer,
        "punch" integer,
        "device_ip" character varying(50) NOT NULL,
        CONSTRAINT "PK_device_attendance_logs" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "device_users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "device_user_id" character varying(50) NOT NULL,
        "name" character varying(150) NOT NULL,
        "role" integer,
        "card_no" character varying(50),
        CONSTRAINT "PK_device_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "biometric" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "ip" character varying(50) NOT NULL,
        "port" integer NOT NULL DEFAULT 4370,
        "timeout" integer NOT NULL DEFAULT 5000,
        "inport" integer NOT NULL DEFAULT 5200,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_biometric" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "biometric"`);
    await queryRunner.query(`DROP TABLE "device_users"`);
    await queryRunner.query(`DROP TABLE "device_attendance_logs"`);
  }
}
