import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Adoption } from './entities/adoption.entity';
import { Dragon } from '../dragons/entities/dragon.entity';
import { Caretaker } from '../caretakers/entities/caretaker.entity';
import { AdoptionStatus } from './adoptions.enum';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(Adoption)
    private readonly adoptionRepo: Repository<Adoption>,
    @InjectRepository(Dragon)
    private readonly dragonRepo: Repository<Dragon>,
    private readonly dataSource: DataSource,
  ) {}

  // ---------------- Crear adopción
  async create(caretaker: Caretaker, dragonId: number): Promise<Adoption> {
    // Validar que el dragón exista y esté disponible
    const dragon = await this.dragonRepo.findOne({ where: { id: dragonId } });
    if (!dragon) throw new NotFoundException('Dragon not found');
    if (dragon.status !== 'available') throw new ConflictException('Dragon is not available');

    return await this.dataSource.transaction(async manager => {
      // Bloquear dragón para evitar adopciones simultáneas
      const lockedDragon = await manager.getRepository(Dragon).findOne({
        where: { id: dragonId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!lockedDragon || lockedDragon.status !== 'available') {
        throw new ConflictException('Dragon is already being adopted');
      }

      const adoptionRepo = manager.getRepository(Adoption);

      // Crear adopción
      const adoption = adoptionRepo.create({
        dragon: dragon,       // RelationId
        caretakerId: caretaker.id, // RelationId
        status: AdoptionStatus.PENDING,
        adoptedAt: null,
        releasedAt: null,
      });

      const saved = await adoptionRepo.save(adoption);

      // Recargar la entidad completa con relaciones
      const fullAdoption = await adoptionRepo.findOne({
        where: { id: saved.id },
        relations: ['dragon', 'caretaker'],
      });

      if (!fullAdoption) throw new NotFoundException('Adoption not found after save');
      return fullAdoption;
    });
  }

  // ---------------- Aprobar adopción
  async approve(adoptionId: number): Promise<Adoption> {
    return await this.dataSource.transaction(async manager => {
      const adoption = await manager.findOne(Adoption, {
        where: { id: adoptionId },
        relations: ['dragon'],
      });
      if (!adoption) throw new NotFoundException('Adoption not found');

      const dragon = await manager.findOne(Dragon, {
        where: { id: adoption.dragon.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!dragon) throw new NotFoundException('Dragon not found');
      if (dragon.status !== 'available') throw new ConflictException('Dragon is already adopted');

      dragon.status = 'adopted';
      adoption.status = AdoptionStatus.ADOPTED;
      adoption.adoptedAt = new Date();

      await manager.save(dragon);
      return await manager.save(adoption);
    });
  }

  // ---------------- Liberar adopción
  async release(adoptionId: number, caretaker: Caretaker): Promise<Adoption> {
    return await this.dataSource.transaction(async manager => {
      const adoption = await manager.findOne(Adoption, {
        where: { id: adoptionId },
        relations: ['dragon', 'caretaker'],
      });
      if (!adoption) throw new NotFoundException('Adoption not found');

      if (adoption.caretaker.id !== caretaker.id) {
        throw new ForbiddenException('You cannot release a dragon you did not adopt');
      }

      const dragon = await manager.findOne(Dragon, {
        where: { id: adoption.dragon.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!dragon) throw new NotFoundException('Dragon not found');

      dragon.status = 'available';
      adoption.status = AdoptionStatus.RELEASED;
      adoption.releasedAt = new Date();

      await manager.save(dragon);
      return await manager.save(adoption);
    });
  }

  // ---------------- Listado de adopciones de un cuidador
  async findByCaretaker(caretakerId: number): Promise<Adoption[]> {
    return this.adoptionRepo.find({
      where: { caretakerId }, // RelationId
      relations: ['dragon', 'caretaker'],
    });
  }

  // ---------------- Listado de todas las adopciones (solo admin)
  async findAll(): Promise<Adoption[]> {
    return this.adoptionRepo.find({
      relations: ['dragon', 'caretaker'],
    });
  }

  // ---------------- Obtener adopción por ID
  async findOne(adoptionId: number): Promise<Adoption> {
    const adoption = await this.adoptionRepo.findOne({
      where: { id: adoptionId },
      relations: ['dragon', 'caretaker'],
    });
    if (!adoption) throw new NotFoundException('Adoption not found');
    return adoption;
  }
}
