import { DataSource } from 'typeorm';
import { User, UserType } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { Approver } from '../entities/approver.entity';
import { Card } from '../entities/card.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'kanban_gmud',
  entities: [User, Company, Approver, Card],
  synchronize: false,
  logging: true,
});

async function createSimpleUser() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado ao banco de dados');

    const userRepository = AppDataSource.getRepository(User);
    const companyRepository = AppDataSource.getRepository(Company);
    
    // Buscar uma company existente
    const company = await companyRepository.findOne({ where: {} });
    
    if (!company) {
      console.log('Nenhuma company encontrada');
      return;
    }

    // Criar usuário simples
    const simpleUser = userRepository.create({
      username: 'usuario.simple',
      password: '$2b$10$example.hash', // Hash de exemplo
      firstName: 'Usuário',
      lastName: 'Simples',
      email: 'usuario.simple@example.com',
      userType: UserType.SIMPLE,
      companyId: company.id,
    });

    await userRepository.save(simpleUser);
    console.log(`Usuário simples criado: ${simpleUser.username}`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Erro:', error);
  }
}

createSimpleUser();
