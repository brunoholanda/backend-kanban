import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Approver } from './approver.entity';
import { Company } from './company.entity';

export enum CardStatus {
  ABERTA = 'aberta',
  PENDENTE_APROVACAO_1 = 'pendente-aprovacao-1',
  PENDENTE_APROVACAO_2 = 'pendente-aprovacao-2',
  PENDENTE_EXECUCAO = 'pendente-execucao',
  CONCLUIDO = 'concluido'
}

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  gmudLink: string;

  @Column({ type: 'varchar', length: 100 })
  executor: string;

  @Column({ type: 'timestamp' })
  openDate: Date;

  @Column({ type: 'timestamp' })
  executionForecast: Date;

  @Column({ 
    type: 'enum', 
    enum: CardStatus, 
    default: CardStatus.ABERTA 
  })
  status: CardStatus;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @ManyToOne(() => Company, company => company.cards)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToMany(() => Approver)
  @JoinTable({
    name: 'card_approvers',
    joinColumn: { name: 'cardId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'approverId', referencedColumnName: 'id' }
  })
  approvers: Approver[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
