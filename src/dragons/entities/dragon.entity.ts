import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DragonStatus, DragonTypes } from '../dragon.enums';

@Entity('dragons')
export class Dragon {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ type: 'enum', enum: DragonTypes }) type: DragonTypes;

  @Column({ type: 'enum', enum: DragonStatus, default: DragonStatus.AVAILABLE })
  status: DragonStatus;
}
