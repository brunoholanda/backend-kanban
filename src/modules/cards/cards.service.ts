import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Card, CardStatus } from '../../entities/card.entity';
import { Approver } from '../../entities/approver.entity';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
    @InjectRepository(Approver)
    private approversRepository: Repository<Approver>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const approvers = await this.approversRepository.findBy({
      id: In(createCardDto.approverIds)
    });

    const card = this.cardsRepository.create({
      title: createCardDto.title,
      gmudLink: createCardDto.gmudLink,
      executor: createCardDto.executor,
      openDate: new Date(createCardDto.openDate),
      executionForecast: new Date(createCardDto.executionForecast),
      status: createCardDto.status || CardStatus.ABERTA,
      companyId: createCardDto.companyId,
      approvers,
    });

    return this.cardsRepository.save(card);
  }

  async findAll(companyId?: string): Promise<Card[]> {
    const whereCondition = companyId ? { companyId } : {};
    return this.cardsRepository.find({
      where: whereCondition,
      relations: ['approvers'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatus(status: CardStatus, companyId?: string): Promise<Card[]> {
    const whereCondition = companyId ? { status, companyId } : { status };
    return this.cardsRepository.find({
      where: whereCondition,
      relations: ['approvers'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      where: { id },
      relations: ['approvers']
    });
    
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.findOne(id);
    
    if (updateCardDto.approverIds) {
      const approvers = await this.approversRepository.findBy({
        id: In(updateCardDto.approverIds)
      });
      card.approvers = approvers;
    }

    Object.assign(card, {
      title: updateCardDto.title ?? card.title,
      gmudLink: updateCardDto.gmudLink ?? card.gmudLink,
      executor: updateCardDto.executor ?? card.executor,
      openDate: updateCardDto.openDate ? new Date(updateCardDto.openDate) : card.openDate,
      executionForecast: updateCardDto.executionForecast ? new Date(updateCardDto.executionForecast) : card.executionForecast,
      status: updateCardDto.status ?? card.status,
    });

    return this.cardsRepository.save(card);
  }

  async remove(id: string): Promise<void> {
    const card = await this.findOne(id);
    await this.cardsRepository.remove(card);
  }

  async updateStatus(id: string, status: CardStatus): Promise<Card> {
    const card = await this.findOne(id);
    card.status = status;
    return this.cardsRepository.save(card);
  }
}
