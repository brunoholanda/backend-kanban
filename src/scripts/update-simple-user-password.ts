import { DataSource } from 'typeorm';
import { User, UserType } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { Approver } from '../entities/approver.entity';
import { Card } from '../entities/card.entity';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

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

async function updateSimpleUserPassword() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado ao banco de dados');

    const userRepository = AppDataSource.getRepository(User);
    
    // Buscar usuário simples
    const simpleUser = await userRepository.findOne({ 
      where: { username: 'usuario.simple' } 
    });
    
    if (simpleUser) {
      // Hash da senha "123456"
      const hashedPassword = await bcrypt.hash('123456', 10);
      simpleUser.password = hashedPassword;
      
      await userRepository.save(simpleUser);
      console.log(`Senha do usuário ${simpleUser.username} atualizada para "123456"`);
    } else {
      console.log('Usuário simples não encontrado');
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Erro:', error);
  }
}

updateSimpleUserPassword();
