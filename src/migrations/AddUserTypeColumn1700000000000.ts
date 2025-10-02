import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTypeColumn1700000000000 implements MigrationInterface {
  name = 'AddUserTypeColumn1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "userType" character varying NOT NULL DEFAULT 'simple'
    `);
    
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "CHK_users_userType" 
      CHECK ("userType" IN ('admin', 'simple'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP CONSTRAINT "CHK_users_userType"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "userType"
    `);
  }
}
