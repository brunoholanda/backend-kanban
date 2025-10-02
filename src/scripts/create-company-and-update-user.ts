import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CompaniesService } from '../modules/companies/companies.service';
import { AuthService } from '../modules/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

async function createCompanyAndUpdateUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const companiesService = app.get(CompaniesService);
  const authService = app.get(AuthService);
  const userRepository = app.get(getRepositoryToken(User));

  try {
    // Criar empresa
    const companyData = {
      name: 'Empresa Teste',
      domain: 'teste.com',
      email: 'contato@teste.com'
    };

    const company = await companiesService.create(companyData);
    console.log('✅ Empresa criada com sucesso!');
    console.log('ID:', company.id);
    console.log('Nome:', company.name);
    console.log('Domínio:', company.domain);

    // Atualizar usuário existente para incluir companyId
    // Primeiro vamos buscar o usuário brunoholanda
    const user = await authService.findUserById('47e207d8-f86c-4aa0-a617-22f03f2b039c');
    
    if (user) {
      // Atualizar o usuário com companyId
      user.companyId = company.id;
      await userRepository.save(user);
      console.log('✅ Usuário brunoholanda atualizado com companyId:', company.id);
    } else {
      console.log('⚠️ Usuário brunoholanda não encontrado');
    }

  } catch (error) {
    if (error.message.includes('já existe')) {
      console.log('⚠️ Empresa já existe!');
    } else {
      console.error('❌ Erro:', error.message);
    }
  } finally {
    await app.close();
  }
}

createCompanyAndUpdateUser();