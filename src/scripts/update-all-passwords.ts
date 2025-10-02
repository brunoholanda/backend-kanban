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

async function updateAllUserPasswords() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado ao banco de dados');

    const userRepository = AppDataSource.getRepository(User);
    
    // Buscar todos os usuários
    const users = await userRepository.find();
    
    console.log('Usuários encontrados:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.userType}) - ${user.email}`);
    });

    // Atualizar senhas para "123456"
    const hashedPassword = await bcrypt.hash('Cc391618*', 10);
    
    for (const user of users) {
      user.password = hashedPassword;
      await userRepository.save(user);
      console.log(`✅ Senha do usuário ${user.username} atualizada para "123456"`);
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Erro:', error);
  }
}

updateAllUserPasswords();
