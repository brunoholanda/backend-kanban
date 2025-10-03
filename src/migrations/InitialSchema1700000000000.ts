import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a tabela companies já existe
    const companiesExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'companies'
      )
    `);

    if (!companiesExists[0].exists) {
      // Criar tabela companies
      await queryRunner.query(`
        CREATE TABLE "companies" (
          "id" uuid NOT NULL DEFAULT gen_random_uuid(),
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

    // Verificar se a tabela users já existe
    const usersExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);

    if (!usersExists[0].exists) {
      // Criar tabela users
      await queryRunner.query(`
        CREATE TABLE "users" (
          "id" uuid NOT NULL DEFAULT gen_random_uuid(),
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
    }

    // Criar tabela approvers
    await queryRunner.query(`
      CREATE TABLE "approvers" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "firstName" character varying(100) NOT NULL,
        "lastName" character varying(100) NOT NULL,
        "fullName" character varying(200) NOT NULL,
        "companyId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_approvers_fullName" UNIQUE ("fullName"),
        CONSTRAINT "PK_approvers" PRIMARY KEY ("id")
      )
    `);

    // Criar tabela cards
    await queryRunner.query(`
      CREATE TABLE "cards" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(255) NOT NULL,
        "gmudLink" text NOT NULL,
        "executor" character varying(100) NOT NULL,
        "openDate" TIMESTAMP NOT NULL,
        "executionForecast" TIMESTAMP NOT NULL,
        "status" character varying NOT NULL DEFAULT 'aberta',
        "companyId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_cards_status" CHECK ("status" IN ('aberta', 'pendente-aprovacao-1', 'pendente-aprovacao-2', 'pendente-execucao', 'concluido')),
        CONSTRAINT "PK_cards" PRIMARY KEY ("id")
      )
    `);

    // Criar tabela de relacionamento card_approvers
    await queryRunner.query(`
      CREATE TABLE "card_approvers" (
        "cardId" uuid NOT NULL,
        "approverId" uuid NOT NULL,
        CONSTRAINT "PK_card_approvers" PRIMARY KEY ("cardId", "approverId")
      )
    `);

    // Adicionar foreign keys
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "FK_users_companyId" 
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "approvers" 
      ADD CONSTRAINT "FK_approvers_companyId" 
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "cards" 
      ADD CONSTRAINT "FK_cards_companyId" 
      FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "card_approvers" 
      ADD CONSTRAINT "FK_card_approvers_cardId" 
      FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "card_approvers" 
      ADD CONSTRAINT "FK_card_approvers_approverId" 
      FOREIGN KEY ("approverId") REFERENCES "approvers"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign keys
    await queryRunner.query(`ALTER TABLE "card_approvers" DROP CONSTRAINT "FK_card_approvers_approverId"`);
    await queryRunner.query(`ALTER TABLE "card_approvers" DROP CONSTRAINT "FK_card_approvers_cardId"`);
    await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_cards_companyId"`);
    await queryRunner.query(`ALTER TABLE "approvers" DROP CONSTRAINT "FK_approvers_companyId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_companyId"`);

    // Remover tabelas
    await queryRunner.query(`DROP TABLE "card_approvers"`);
    await queryRunner.query(`DROP TABLE "cards"`);
    await queryRunner.query(`DROP TABLE "approvers"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "companies"`);
  }
}