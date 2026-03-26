import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignmentQuestions1783000005000 implements MigrationInterface {
  name = 'AssignmentQuestions1783000005000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."assigment_questions_type_enum" AS ENUM('single_choice', 'multiple_choice', 'short_answer')
    `);
    await queryRunner.query(`
      CREATE TABLE "assigment_questions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "prompt" text NOT NULL,
        "type" "public"."assigment_questions_type_enum" NOT NULL,
        "order_index" integer NOT NULL DEFAULT 1,
        "points" integer NOT NULL DEFAULT 1,
        "required" boolean NOT NULL DEFAULT true,
        "assigment_id" uuid,
        CONSTRAINT "PK_assigment_questions" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "assigment_question_options" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "label" character varying(255) NOT NULL,
        "is_correct" boolean NOT NULL DEFAULT false,
        "order_index" integer NOT NULL DEFAULT 1,
        "question_id" uuid,
        CONSTRAINT "PK_assigment_question_options" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "assigment_questions"
      ADD CONSTRAINT "FK_assigment_questions_assigment"
      FOREIGN KEY ("assigment_id") REFERENCES "assigments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "assigment_question_options"
      ADD CONSTRAINT "FK_assigment_question_options_question"
      FOREIGN KEY ("question_id") REFERENCES "assigment_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assigment_question_options" DROP CONSTRAINT IF EXISTS "FK_assigment_question_options_question"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigment_questions" DROP CONSTRAINT IF EXISTS "FK_assigment_questions_assigment"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "assigment_question_options"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "assigment_questions"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."assigment_questions_type_enum"`);
  }
}
