import { MigrationInterface, QueryRunner } from "typeorm";

export class Ultimaversion1759548427540 implements MigrationInterface {
    name = 'Ultimaversion1759548427540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_b260ff500cf388b8c01569a97e1"`);
        await queryRunner.query(`CREATE TABLE "permission_actions" ("permission_id" uuid NOT NULL, "action_id" uuid NOT NULL, CONSTRAINT "PK_5223e9083641ade3fe09c161b0f" PRIMARY KEY ("permission_id", "action_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f6a0d0a3357be97b66e0d817ae" ON "permission_actions" ("permission_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_64ff3c859c13ebc816013a6cd2" ON "permission_actions" ("action_id") `);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "action_id"`);
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "idx_user_username" ON "users" ("username") `);
        await queryRunner.query(`ALTER TABLE "permission_actions" ADD CONSTRAINT "FK_f6a0d0a3357be97b66e0d817aeb" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permission_actions" ADD CONSTRAINT "FK_64ff3c859c13ebc816013a6cd2c" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission_actions" DROP CONSTRAINT "FK_64ff3c859c13ebc816013a6cd2c"`);
        await queryRunner.query(`ALTER TABLE "permission_actions" DROP CONSTRAINT "FK_f6a0d0a3357be97b66e0d817aeb"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_username"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_email"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "action_id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64ff3c859c13ebc816013a6cd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6a0d0a3357be97b66e0d817ae"`);
        await queryRunner.query(`DROP TABLE "permission_actions"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_b260ff500cf388b8c01569a97e1" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
