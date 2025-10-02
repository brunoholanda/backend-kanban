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

async function updateUserToAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado ao banco de dados');

    const userRepository = AppDataSource.getRepository(User);
    
    // Buscar o primeiro usuário
    const user = await userRepository.findOne({ where: {} });
    
    if (user) {
      user.userType = UserType.ADMIN;
      await userRepository.save(user);
      console.log(`Usuário ${user.username} atualizado para ADMIN`);
    } else {
      console.log('Nenhum usuário encontrado');
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Erro:', error);
  }
}

updateUserToAdmin();
