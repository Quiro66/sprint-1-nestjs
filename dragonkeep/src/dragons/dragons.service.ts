import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dragon } from '../entities/dragon.entity';
import { CreateDragonDto, ListDragonsQueryDto } from './dto';

@Injectable()
export class DragonsService {
  constructor(@InjectRepository(Dragon) private dragons: Repository<Dragon>) {}

  async create(dto: CreateDragonDto) {
    const exists = await this.dragons.findOne({ where: { name: dto.name } });
    if (exists) throw new BadRequestException('Ya existe un dragón con ese nombre');
    const dragon = this.dragons.create(dto);
    return this.dragons.save(dragon);
  }

  async findAll(q: ListDragonsQueryDto) {
    const qb = this.dragons.createQueryBuilder('d');
    if (q.status) qb.andWhere('d.status = :status', { status: q.status });
    if (q.type) qb.andWhere('d.type = :type', { type: q.type });
    if (q.minAge) qb.andWhere('d.age >= :minAge', { minAge: q.minAge });
    if (q.maxAge) qb.andWhere('d.age <= :maxAge', { maxAge: q.maxAge });
    qb.skip((q.page - 1) * q.limit).take(q.limit).orderBy('d.createdAt', 'DESC');
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: q.page, limit: q.limit };
  }

  async findOne(id: string) {
    const d = await this.dragons.findOne({ where: { id } });
    if (!d) throw new NotFoundException('Dragón no encontrado');
    return d;
  }
}
