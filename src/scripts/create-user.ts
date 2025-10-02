import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../modules/auth/auth.service';
import * as bcrypt from 'bcryptjs';

async function createUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    const userData = {
      username: 'brunoholanda',
      password: 'Cc391618*',
      firstName: 'Bruno',
      lastName: 'Holanda',
      email: 'bruno.holanda@example.com',
      companyId: '00000000-0000-0000-0000-000000000000' // Placeholder - será atualizado depois
    };

    const result = await authService.createUser(userData);
    console.log('✅ Usuário criado com sucesso!');
    console.log('Username:', result.user.username);
    console.log('Nome:', result.user.firstName, result.user.lastName);
    console.log('Email:', result.user.email);
    console.log('Token:', result.access_token);
  } catch (error) {
    if (error.message.includes('já existe')) {
      console.log('⚠️ Usuário brunoholanda já existe!');
    } else {
      console.error('❌ Erro ao criar usuário:', error.message);
    }
  } finally {
    await app.close();
  }
}

createUser();
