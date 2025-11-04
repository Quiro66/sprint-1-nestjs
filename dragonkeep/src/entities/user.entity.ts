import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { Adoption } from './adoption.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', length: 20, default: Role.CARETAKER })
  role!: Role;

  @Column({ nullable: true })
  fullName?: string;

  @OneToMany(() => Adoption, (a) => a.caretaker)
  adoptions!: Adoption[];

  @OneToMany(() => RefreshToken, (rt) => rt.user, { cascade: true })
  refreshTokens!: RefreshToken[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
