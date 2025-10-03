import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserTypeColumn1700000000001 implements MigrationInterface {
  name = 'FixUserTypeColumn1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a tabela users existe
    const usersTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);

    if (!usersTableExists[0].exists) {
      console.log('Tabela users não existe, criando...');
      await this.createUsersTable(queryRunner);
    } else {
      console.log('Tabela users existe, verificando coluna userType...');
      
      // Verificar se a coluna userType existe
      const userTypeColumnExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'userType'
        )
      `);

      if (!userTypeColumnExists[0].exists) {
        console.log('Coluna userType não existe, adicionando...');
        await queryRunner.query(`
          ALTER TABLE "users" 
          ADD COLUMN "userType" character varying NOT NULL DEFAULT 'simple'
        `);
        
        await queryRunner.query(`
          ALTER TABLE "users" 
          ADD CONSTRAINT "CHK_users_userType" 
          CHECK ("userType" IN ('admin', 'simple'))
        `);
      } else {
        console.log('Coluna userType já existe, pulando...');
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a coluna userType existe antes de remover
    const userTypeColumnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'userType'
      )
    `);

    if (userTypeColumnExists[0].exists) {
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

  private async createUsersTable(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a tabela companies existe primeiro
    const companiesTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'companies'
      )
    `);

    if (!companiesTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "companies" (
          "id" uuid NOT NULL,
          "name" character varying(200) NOT NULL,
          "domain" character varying(100) NOT NULL,
          "email" character varying(200) NOT NULL,
          "isActive" boolean NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_companies_domain" UNIQUE ("domain"),
          CONSTRAINT "PK_companies" PRIMARY KEY ("id")
        )
      `);
    }

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL,
        "username" character varying(100) NOT NULL,
        "password" character varying(255) NOT NULL,
        "firstName" character varying(100) NOT NULL,
        "lastName" character varying(100) NOT NULL,
        "email" character varying(200) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "userType" character varying NOT NULL DEFAULT 'simple',
        "companyId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "CHK_users_userType" CHECK ("userType" IN ('admin', 'simple')),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Adicionar foreign key se não existir
    const fkExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND constraint_name = 'FK_users_companyId'
      )
    `);

    if (!fkExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "users" 
        ADD CONSTRAINT "FK_users_companyId" 
        FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    }
  }
}
