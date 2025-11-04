import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DragonStatus } from '../common/enums/dragon-status.enum';
import { DragonType } from '../common/enums/dragon-type.enum';
import { Adoption } from './adoption.entity';

@Entity('dragons')
export class Dragon {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'int' })
  age!: number;

  @Column({ type: 'varchar', length: 20 })
  type!: DragonType;

  @Column({ type: 'varchar', length: 20, default: DragonStatus.AVAILABLE })
  status!: DragonStatus;

  @Column({ nullable: true })
  temperament?: string;

  @OneToMany(() => Adoption, (a) => a.dragon)
  adoptions!: Adoption[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
