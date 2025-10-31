import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Dragon } from '../entities/dragon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDragonDto } from './dto/create-dragon.dto';

@Injectable()
export class DragonsService {
  constructor(
    @InjectRepository(Dragon)
    private dragonRepo: Repository<Dragon>,
  ) {}

  async create(dto: CreateDragonDto): Promise<Dragon> {
    const exists = await this.dragonRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Dragon with that name already exists');
    // asegurar tipo para que create/save retornen un único Dragon
    const dragon = this.dragonRepo.create(dto as Partial<Dragon>);
    return this.dragonRepo.save(dragon) as Promise<Dragon>;
  }

  async findAll(query: any) {
    const qb = this.dragonRepo.createQueryBuilder('dragon');
    if (query.status) qb.andWhere('dragon.status = :status', { status: query.status });
    if (query.fireType) qb.andWhere('dragon.fireType = :fireType', { fireType: query.fireType });
    const page = query.page && parseInt(query.page, 10) > 0 ? parseInt(query.page, 10) : 1;
    const limit = query.limit && parseInt(query.limit, 10) > 0 ? parseInt(query.limit, 10) : 10;
    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('dragon.createdAt', 'DESC');
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const dragon = await this.dragonRepo.findOne({ where: { id } });
    if (!dragon) throw new NotFoundException('Dragon not found');
    return dragon;
  }
}
