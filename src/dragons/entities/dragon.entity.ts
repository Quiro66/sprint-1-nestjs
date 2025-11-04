import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { DragonStatus, DragonTypes } from "../dragon.enums";
import { Adoption } from "../../adoptions/entities/adoption.entity";

@Entity("dragons")
export class Dragon extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: "enum", enum: DragonTypes })
  type: DragonTypes;

  @Column({
    type: "enum",
    enum: DragonStatus,
    default: DragonStatus.AVAILABLE,
  })
  status: string;

  @Column()
  age: number;

  @OneToMany(() => Adoption, (adoption) => adoption.dragon)
  adoptions: Adoption[];
}
