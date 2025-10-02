import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../entities/company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    // Verificar se já existe uma empresa com o mesmo domínio
    const existingCompany = await this.companiesRepository.findOne({
      where: { domain: createCompanyDto.domain }
    });

    if (existingCompany) {
      throw new ConflictException('Já existe uma empresa com este domínio');
    }

    const company = this.companiesRepository.create(createCompanyDto);
    return this.companiesRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }
    return company;
  }

  async findByDomain(domain: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { domain } });
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    
    // Verificar se o novo domínio já existe (se estiver sendo alterado)
    if (updateCompanyDto.domain && updateCompanyDto.domain !== company.domain) {
      const existingCompany = await this.companiesRepository.findOne({
        where: { domain: updateCompanyDto.domain }
      });
      if (existingCompany) {
        throw new ConflictException('Já existe uma empresa com este domínio');
      }
    }

    Object.assign(company, updateCompanyDto);
    return this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }
}

