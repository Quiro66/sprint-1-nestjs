import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import { Adoption } from "../../adoptions/entities/adoption.entity";
import { BaseEntity } from "../../shared/base.entity";
import { UserRole } from '../caretaker.enums';
import * as bcrypt from "bcrypt";

@Entity("caretakers")
export class Caretaker extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CARETAKER })
  role: UserRole;

  @OneToMany(() => Adoption, (adoption) => adoption.caretaker)
  adoptions: Adoption[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) return;

    if (this.password.startsWith('$2')) return;
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ name: "current_hashed_refresh_token", nullable: true, select: false })
  currentHashedRefreshToken?: string | null;
}
