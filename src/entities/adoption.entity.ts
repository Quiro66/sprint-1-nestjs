// src/entities/adoption.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Caretaker } from './caretaker.entity';
import { Dragon } from './dragon.entity';

@Entity('adoptions')
export class Adoption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Caretaker, (caretaker) => caretaker.adoptions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'caretakerId' })
  caretaker: Caretaker;

  @Column('uuid')
  caretakerId: string;

  @ManyToOne(() => Dragon, (dragon) => dragon.adoptions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dragonId' })
  dragon: Dragon;

  @Column('uuid')
  dragonId: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  adoptedAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  releasedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}