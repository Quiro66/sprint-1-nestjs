import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { Caretaker } from "../../caretakers/entities/caretaker.entity";
import { Dragon } from "../../dragons/entities/dragon.entity";

@Entity("adoptions")
export class Adoption extends BaseEntity {
  @Column()
  caretakerId: number; // caretaker foreing key
  @Column()
  dragonId: number; // dragon foreing key
  @ManyToOne(() => Caretaker, (caretaker) => caretaker.adoptions)
  @JoinColumn({ name: "caretaker_id" })
  caretaker: Caretaker;
  @ManyToOne(() => Dragon, (dragon) => dragon.adoptions)
  dragon: Dragon;
}
