import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPersonDocumentNumber1783000004000 implements MigrationInterface {
  name = 'AddPersonDocumentNumber1783000004000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "persons" ADD COLUMN IF NOT EXISTS "document_number" character varying(30)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN IF EXISTS "document_number"`);
  }
}
