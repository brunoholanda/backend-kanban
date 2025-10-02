import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserType } from '../../entities/user.entity';
import { Company } from '../../entities/company.entity';
import { LoginDto, CreateUserDto, AuthResponseDto, GoogleLoginDto } from './dto/auth.dto';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private jwtService: JwtService,
    private companiesService: CompaniesService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { username: user.username, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyId: user.companyId,
        userType: user.userType,
      },
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    // Verificar se o usuário já existe
    const existingUser = await this.usersRepository.findOne({ 
      where: [{ username: createUserDto.username }, { email: createUserDto.email }] 
    });
    
    if (existingUser) {
      throw new ConflictException('Usuário ou email já existe');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Criar usuário
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // Gerar token
    const payload = { username: savedUser.username, sub: savedUser.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        username: savedUser.username,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        companyId: savedUser.companyId,
        userType: savedUser.userType,
      },
    };
  }

  async findUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOrCreateCompanyByDomain(domain: string, userEmail: string): Promise<Company> {
    try {
      // Tentar encontrar empresa existente pelo domínio
      const existingCompany = await this.companiesRepository.findOne({
        where: { domain }
      });

      if (existingCompany) {
        console.log(`🏢 Empresa existente encontrada: ${existingCompany.name} (${domain})`);
        return existingCompany;
      }

      // Criar nova empresa
      console.log(`🆕 Criando nova empresa para domínio: ${domain}`);
      
      const companyData = {
        name: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Company`,
        domain: domain,
        email: `admin@${domain}`,
      };

      const newCompany = this.companiesRepository.create(companyData);
      const savedCompany = await this.companiesRepository.save(newCompany);
      
      console.log(`✅ Empresa criada com sucesso: ${savedCompany.name} (${savedCompany.id})`);
      return savedCompany;

    } catch (error) {
      console.error(`❌ Erro ao criar empresa para domínio ${domain}:`, error.message);
      throw error;
    }
  }

  async validateGoogleUser(googleUser: any): Promise<any> {
    const { email, firstName, lastName } = googleUser;
    
    // Extrair domínio do email
    const emailDomain = email.split('@')[1];
    
    // Verificar se é um domínio corporativo (não gmail.com)
    if (emailDomain === 'gmail.com') {
      throw new BadRequestException('Apenas emails corporativos são permitidos');
    }
    
    // Encontrar ou criar empresa baseada no domínio
    const company = await this.findOrCreateCompanyByDomain(emailDomain, email);
    
    // Verificar se o usuário já existe
    let user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      // Criar novo usuário com dados do Google
      console.log(`🆕 Criando novo usuário para: ${email} (${firstName} ${lastName})`);
      console.log(`🏢 Empresa: ${company.name} (${company.domain})`);
      
      user = this.usersRepository.create({
        username: email, // Usar email como username
        password: '', // Não precisa de senha para login Google
        firstName,
        lastName,
        email,
        isActive: true,
        userType: UserType.SIMPLE, // Padrão para novos usuários
        companyId: company.id, // Associar à empresa
      });
      
      user = await this.usersRepository.save(user);
      console.log(`✅ Usuário criado com sucesso: ${user.id}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🏢 Empresa: ${company.name} (${company.id})`);
    } else {
      console.log(`👤 Usuário existente encontrado: ${email}`);
      console.log(`🏢 Empresa: ${company.name} (${company.domain})`);
      
      // Se o usuário não tem empresa associada, associar agora
      if (!user.companyId) {
        user.companyId = company.id;
        user = await this.usersRepository.save(user);
        console.log(`🔗 Usuário associado à empresa: ${company.name}`);
      }
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async googleLogin(googleUser: any): Promise<AuthResponseDto> {
    const user = await this.validateGoogleUser(googleUser);
    
    const payload = { username: user.username, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyId: user.companyId,
        userType: user.userType,
      },
    };
  }
}
