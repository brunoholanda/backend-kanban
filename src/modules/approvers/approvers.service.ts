import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approver } from '../../entities/approver.entity';
import { CreateApproverDto, UpdateApproverDto } from './dto/approver.dto';

@Injectable()
export class ApproversService {
  constructor(
    @InjectRepository(Approver)
    private approversRepository: Repository<Approver>,
  ) {}

  async create(createApproverDto: CreateApproverDto): Promise<Approver> {
    const fullName = `${createApproverDto.firstName.trim()} ${createApproverDto.lastName.trim()}`;
    
    const approver = this.approversRepository.create({
      ...createApproverDto,
      fullName,
    });

    return this.approversRepository.save(approver);
  }

  async findAll(companyId?: string): Promise<Approver[]> {
    const whereCondition = companyId ? { companyId } : {};
    return this.approversRepository.find({
      where: whereCondition,
      order: { fullName: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Approver> {
    const approver = await this.approversRepository.findOne({ where: { id } });
    
    if (!approver) {
      throw new NotFoundException(`Approver with ID ${id} not found`);
    }

    return approver;
  }

  async update(id: string, updateApproverDto: UpdateApproverDto): Promise<Approver> {
    const approver = await this.findOne(id);
    
    const fullName = `${updateApproverDto.firstName.trim()} ${updateApproverDto.lastName.trim()}`;
    
    Object.assign(approver, {
      ...updateApproverDto,
      fullName,
    });

    return this.approversRepository.save(approver);
  }

  async remove(id: string): Promise<void> {
    const approver = await this.findOne(id);
    await this.approversRepository.remove(approver);
  }
}
