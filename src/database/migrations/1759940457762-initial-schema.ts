import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1759940457762 implements MigrationInterface {
    name = 'InitialSchema1759940457762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "entity" character varying(255) NOT NULL, "entity_id" uuid, "before" json, "after" json, "action" character varying(20) NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."profiles_gender_enum" AS ENUM('male', 'female', 'other', 'prefer_not_to_say')`);
        await queryRunner.query(`CREATE TYPE "public"."profiles_blood_type_enum" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')`);
        await queryRunner.query(`CREATE TYPE "public"."profiles_marital_status_enum" AS ENUM('single', 'married', 'divorced', 'widowed')`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "middle_name" character varying(100), "birth_date" date, "gender" "public"."profiles_gender_enum", "document_number" character varying(20), "document_type" character varying(50), "phone_number" character varying(50), "alternative_phone" character varying(50), "address" text, "city" character varying(100), "state" character varying(100), "postal_code" character varying(20), "country" character varying(100), "nationality" character varying(100), "blood_type" "public"."profiles_blood_type_enum", "marital_status" "public"."profiles_marital_status_enum", "occupation" character varying(100), "workplace" character varying(255), "work_phone" character varying(50), "bio" text, "website" character varying(255), "profile_image" character varying(255), "emergency_contact_name" character varying(100), "emergency_contact_phone" character varying(50), "emergency_contact_relation" character varying(100), "medical_conditions" text, "allergies" text, "medications" text, "preferred_language" character varying(100), "religion" character varying(100), "special_needs" text, "notes" text, "is_public" boolean NOT NULL DEFAULT true, "allow_notifications" boolean NOT NULL DEFAULT true, "allow_sms" boolean NOT NULL DEFAULT false, "allow_email_notifications" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "userId" uuid, CONSTRAINT "UQ_34750ab4a6d1e0830d84fa34a8f" UNIQUE ("document_number"), CONSTRAINT "UQ_b4914d605fd119c1046868effcb" UNIQUE ("phone_number"), CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "key" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "is_default" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_577192f12af5677b0f83478994c" UNIQUE ("key"), CONSTRAINT "PK_7bfb822f56be449c0b8adbf83cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "modules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, "key" character varying NOT NULL, "description" text, "order" integer NOT NULL DEFAULT '0', "path" character varying(255), "visibility" character varying(20) NOT NULL DEFAULT 'private', "icon" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "is_system" boolean NOT NULL DEFAULT false, "parent_id" uuid, CONSTRAINT "UQ_a57f2b3bd9ebb022212e634f601" UNIQUE ("key"), CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "key" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "description" text, "action_id" uuid NOT NULL, "module_id" uuid NOT NULL, CONSTRAINT "UQ_017943867ed5ceef9c03edd9745" UNIQUE ("key"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, "description" character varying(255), "is_system" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "username" character varying(50) NOT NULL, "first_name" character varying(100), "last_name" character varying(100), "email" character varying(100), "password" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "last_login" TIMESTAMP WITH TIME ZONE, "profile_picture" character varying(255), "role_id" uuid, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "idx_user_username" ON "users" ("username") `);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "modules" ADD CONSTRAINT "FK_a1bd9c21d7179d0b411dbaf9a55" FOREIGN KEY ("parent_id") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_b260ff500cf388b8c01569a97e1" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_738f46bb9ac6ea356f1915835d0" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_738f46bb9ac6ea356f1915835d0"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_b260ff500cf388b8c01569a97e1"`);
        await queryRunner.query(`ALTER TABLE "modules" DROP CONSTRAINT "FK_a1bd9c21d7179d0b411dbaf9a55"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_username"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "modules"`);
        await queryRunner.query(`DROP TABLE "actions"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TYPE "public"."profiles_marital_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."profiles_blood_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."profiles_gender_enum"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }

}
