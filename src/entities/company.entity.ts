import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Card } from './card.entity';
import { Approver } from './approver.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  domain: string;

  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, user => user.company)
  users: User[];

  @OneToMany(() => Card, card => card.company)
  cards: Card[];

  @OneToMany(() => Approver, approver => approver.company)
  approvers: Approver[];
}

