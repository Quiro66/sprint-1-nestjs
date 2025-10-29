// src/entities/caretaker.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Adoption } from './adoption.entity';

export enum UserRole {
  ADMIN = 'admin',
  CARETAKER = 'caretaker',
}

@Entity('caretakers')
export class Caretaker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // bcrypt hash

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CARETAKER })
  role: UserRole;

  @OneToMany(() => Adoption, (adoption) => adoption.caretaker)
  adoptions: Adoption[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
