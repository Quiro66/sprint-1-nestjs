import { Entity, JoinColumn, ManyToOne, Column, RelationId } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { Caretaker } from "../../caretakers/entities/caretaker.entity";
import { Dragon } from "../../dragons/entities/dragon.entity";
import { AdoptionStatus } from "../adoptions.enum";

@Entity("adoptions")
export class Adoption extends BaseEntity {
  @ManyToOne(() => Caretaker, (caretaker) => caretaker.adoptions, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: "caretaker_id" })
  caretaker: Caretaker;

  @RelationId((adoption: Adoption) => adoption.caretaker)
  caretakerId: number;

  @ManyToOne(() => Dragon, (dragon) => dragon.adoptions, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: "dragon_id" })
  dragon: Dragon;

  @RelationId((adoption: Adoption) => adoption.dragon)
  dragonId: number;

  @Column({ type: 'enum', enum: AdoptionStatus, default: AdoptionStatus.PENDING })
  status: AdoptionStatus;

  @Column({ type: 'timestamp', nullable: true })
  adoptedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt?: Date;
}
