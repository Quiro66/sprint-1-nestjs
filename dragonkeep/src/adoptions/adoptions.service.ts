import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adoption } from '../entities/adoption.entity';
import { Dragon } from '../entities/dragon.entity';
import { User } from '../entities/user.entity';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { DragonStatus } from '../common/enums/dragon-status.enum';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(Adoption) private adoptions: Repository<Adoption>,
    @InjectRepository(Dragon) private dragons: Repository<Dragon>,
    @InjectRepository(User) private users: Repository<User>
  ) {}

  async request(caretakerId: string, dto: CreateAdoptionDto) {
    const dragon = await this.dragons.findOne({ where: { id: dto.dragonId } });
    if (!dragon) throw new NotFoundException('Dragón no encontrado');
    if (dragon.status !== DragonStatus.AVAILABLE) throw new BadRequestException('Dragón no disponible');
    const caretaker = await this.users.findOne({ where: { id: caretakerId } });
    if (!caretaker) throw new NotFoundException('Cuidador no encontrado');

    const adoption = this.adoptions.create({ caretaker, dragon });
    return this.adoptions.save(adoption);
  }

  async approve(adoptionId: string) {
    const adoption = await this.adoptions.findOne({ where: { id: adoptionId } });
    if (!adoption) throw new NotFoundException('Adopción no encontrada');

    const dragon = await this.dragons.findOne({ where: { id: adoption.dragon.id } });
    if (!dragon) throw new NotFoundException('Dragón no encontrado');
    if (dragon.status !== DragonStatus.AVAILABLE) {
      throw new BadRequestException('El dragón ya no está disponible');
    }

    dragon.status = DragonStatus.ADOPTED;
    adoption.adoptedAt = new Date();
    await this.dragons.save(dragon);
    await this.adoptions.save(adoption);
    return { approved: true, adoption };
  }

  async release(adoptionId: string, requesterId: string) {
    const adoption = await this.adoptions.findOne({ where: { id: adoptionId } });
    if (!adoption) throw new NotFoundException('Adopción no encontrada');
    if (adoption.caretaker.id !== requesterId) throw new ForbiddenException('No puedes liberar esta adopción');

    const dragon = await this.dragons.findOne({ where: { id: adoption.dragon.id } });
    if (!dragon) throw new NotFoundException('Dragón no encontrado');

    dragon.status = DragonStatus.AVAILABLE;
    adoption.releasedAt = new Date();
    await this.dragons.save(dragon);
    await this.adoptions.save(adoption);
    return { released: true, adoption };
  }

  async listByCaretaker(caretakerId: string, active?: boolean) {
    const qb = this.adoptions.createQueryBuilder('a')
      .leftJoinAndSelect('a.dragon', 'd')
      .leftJoinAndSelect('a.caretaker', 'c')
      .where('c.id = :caretakerId', { caretakerId });

    if (active === true) qb.andWhere('a.releasedAt IS NULL');
    if (active === false) qb.andWhere('a.releasedAt IS NOT NULL');

    qb.orderBy('a.createdAt', 'DESC');
    return qb.getMany();
  }
}
