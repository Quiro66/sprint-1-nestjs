import { Entity, Column, BeforeInsert, OneToMany } from "typeorm";
import { Adoption } from "../../adoptions/entities/adoption.entity";
import { BaseEntity } from "../../shared/base.entity";
import * as bcrypt from "bcrypt";

@Entity("caretakers")
export class Caretaker extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Adoption, (adoption) => adoption.caretaker)
  adoptions: Adoption[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
