// ...new file...
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Adoption } from '../entities/adoption.entity';
import { Dragon, DragonStatus } from '../entities/dragon.entity';
import { Caretaker } from '../entities/caretaker.entity';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(Adoption)
    private adoptionRepo: Repository<Adoption>,
    @InjectRepository(Dragon)
    private dragonRepo: Repository<Dragon>,
    @InjectRepository(Caretaker)
    private caretakerRepo: Repository<Caretaker>,
    private dataSource: DataSource,
  ) {}

  async create(caretakerId: string, dragonId: string) {
    const dragon = await this.dragonRepo.findOne({ where: { id: dragonId } });
    if (!dragon) throw new NotFoundException('Dragon not found');
    if (dragon.status !== DragonStatus.AVAILABLE) {
      throw new ConflictException('Dragon is not available for adoption');
    }

    const adoption = this.adoptionRepo.create({ caretakerId, dragonId } as Partial<Adoption>);
    return this.adoptionRepo.save(adoption);
  }

  /**
   * Approve adoption: will set adoptedAt and change dragon status to adopted.
   * This operation uses a transaction to avoid race conditions.
   */
  async approve(adoptionId: string) {
    return this.dataSource.transaction(async (manager) => {
      const adoption = await manager.findOne(Adoption, { where: { id: adoptionId } });
      if (!adoption) throw new NotFoundException('Adoption not found');
      if (adoption.adoptedAt) throw new ConflictException('Adoption already approved');

      const dragon = await manager.findOne(Dragon, { where: { id: adoption.dragonId } });
      if (!dragon) throw new NotFoundException('Dragon not found');
      if (dragon.status !== DragonStatus.AVAILABLE) throw new ConflictException('Dragon is not available');

      // update dragon status and adoption adoptedAt
      await manager.update(Dragon, { id: dragon.id }, { status: DragonStatus.ADOPTED });
      await manager.update(Adoption, { id: adoption.id }, { adoptedAt: new Date() });

      const updatedAdoption = await manager.findOne(Adoption, { where: { id: adoption.id } });
      return updatedAdoption;
    });
  }

  /**
   * Release adoption: only the caretaker who adopted or admin can release.
   */
  async release(adoptionId: string, requester: { sub: string; role: string }) {
    return this.dataSource.transaction(async (manager) => {
      const adoption = await manager.findOne(Adoption, { where: { id: adoptionId } });
      if (!adoption) throw new NotFoundException('Adoption not found');
      if (!adoption.adoptedAt) throw new ConflictException('Adoption not approved yet');
      if (adoption.releasedAt) throw new ConflictException('Adoption already released');

      // only caretaker who adopted or admin can release
      if (requester.role !== 'admin' && requester.sub !== adoption.caretakerId) {
        throw new ForbiddenException('Not allowed to release this adoption');
      }

      const dragon = await manager.findOne(Dragon, { where: { id: adoption.dragonId } });
      if (!dragon) throw new NotFoundException('Dragon not found');

      await manager.update(Adoption, { id: adoption.id }, { releasedAt: new Date() });
      await manager.update(Dragon, { id: dragon.id }, { status: DragonStatus.AVAILABLE });

      const updated = await manager.findOne(Adoption, { where: { id: adoption.id } });
      return updated;
    });
  }
}

