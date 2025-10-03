import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: parseInt(configService.get('DATABASE_PORT') || '5432'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Nunca usar synchronize em produção
  logging: configService.get('NODE_ENV') === 'development',
});
