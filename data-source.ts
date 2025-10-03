import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'kanban_gmud',
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Nunca usar synchronize em produção
  logging: process.env.NODE_ENV === 'development',
});
