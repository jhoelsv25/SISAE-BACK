import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskComments1783000009000 implements MigrationInterface {
  name = 'CreateTaskComments1783000009000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task_comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "content" text NOT NULL,
        "assigment_id" uuid,
        "user_id" uuid,
        CONSTRAINT "PK_task_comments" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "task_comments"
      ADD CONSTRAINT "FK_task_comments_assigment"
      FOREIGN KEY ("assigment_id") REFERENCES "assigments"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "task_comments"
      ADD CONSTRAINT "FK_task_comments_user"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_comments" DROP CONSTRAINT "FK_task_comments_user"`);
    await queryRunner.query(`ALTER TABLE "task_comments" DROP CONSTRAINT "FK_task_comments_assigment"`);
    await queryRunner.query(`DROP TABLE "task_comments"`);
  }
}
