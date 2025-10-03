import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUuidDefaults1700000000002 implements MigrationInterface {
  name = 'AddUuidDefaults1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se a extensão gen_random_uuid está disponível
    const extensionExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM pg_extension 
        WHERE extname = 'pgcrypto'
      )
    `);

    if (!extensionExists[0].exists) {
      console.log('Instalando extensão pgcrypto para gen_random_uuid...');
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    }

    // Adicionar DEFAULT gen_random_uuid() para todas as tabelas que não têm
    const tables = ['companies', 'users', 'approvers', 'cards'];
    
    for (const table of tables) {
      const tableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        )
      `);

      if (tableExists[0].exists) {
        console.log(`Adicionando DEFAULT gen_random_uuid() para tabela ${table}...`);
        
        // Verificar se a coluna id já tem DEFAULT
        const hasDefault = await queryRunner.query(`
          SELECT column_default 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = '${table}' 
          AND column_name = 'id'
        `);

        if (!hasDefault[0] || !hasDefault[0].column_default) {
          await queryRunner.query(`
            ALTER TABLE "${table}" 
            ALTER COLUMN "id" SET DEFAULT gen_random_uuid()
          `);
          console.log(`✅ DEFAULT gen_random_uuid() adicionado para ${table}`);
        } else {
          console.log(`ℹ️  Tabela ${table} já tem DEFAULT para coluna id`);
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover DEFAULT gen_random_uuid() de todas as tabelas
    const tables = ['companies', 'users', 'approvers', 'cards'];
    
    for (const table of tables) {
      const tableExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        )
      `);

      if (tableExists[0].exists) {
        await queryRunner.query(`
          ALTER TABLE "${table}" 
          ALTER COLUMN "id" DROP DEFAULT
        `);
      }
    }
  }
}
