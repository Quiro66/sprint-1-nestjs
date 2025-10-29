// src/entities/dragon.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Adoption } from './adoption.entity';

export enum DragonStatus {
  AVAILABLE = 'available',
  ADOPTED = 'adopted',
  INACTIVE = 'inactive',
}

export enum FireType {
  FIRE = 'fire',
  ICE = 'ice',
  EARTH = 'earth',
  STORM = 'storm',
}

@Entity('dragons')
export class Dragon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('int')
  age: number;

  @Column()
  breed: string;

  @Column({ type: 'enum', enum: FireType })
  fireType: FireType;

  @Column('int', { default: 0 })
  aggressionLevel: number;

  @Column({ type: 'enum', enum: DragonStatus, default: DragonStatus.AVAILABLE })
  status: DragonStatus;

  @OneToMany(() => Adoption, (adoption) => adoption.dragon)
  adoptions: Adoption[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
