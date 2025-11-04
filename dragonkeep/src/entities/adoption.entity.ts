import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Dragon } from './dragon.entity';

@Entity('adoptions')
export class Adoption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (u) => u.adoptions, { eager: true })
  caretaker!: User;

  @ManyToOne(() => Dragon, (d) => d.adoptions, { eager: true })
  dragon!: Dragon;

  @Column({ type: 'timestamptz', nullable: true })
  adoptedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  releasedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
