import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dragon } from './entities/dragon.entity';
import { CreateDragonDto } from './dto/create-dragon.dto';
import { UpdateDragonDto } from './dto/update-dragon.dto';
import { ListDragonsQueryDto } from './dto/list-dragon.dto';

@Injectable()
export class DragonsService {
  constructor(
    @InjectRepository(Dragon)
    private readonly dragonRepository: Repository<Dragon>,
  ) {}

  async create(createDragonDto: CreateDragonDto): Promise<Dragon> {
    const { name } = createDragonDto;

    const existing = await this.dragonRepository.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException(`Dragon with name "${name}" already exists`);
    }

    const dragon = this.dragonRepository.create(createDragonDto);
    return this.dragonRepository.save(dragon);
  }

  async findAll(query: ListDragonsQueryDto): Promise<{ data: Dragon[]; total: number }> {
    const { status, type, minAge, maxAge, page = 1, limit = 10 } = query;

    const qb = this.dragonRepository.createQueryBuilder('dragon');

    if (status) qb.andWhere('dragon.status = :status', { status });
    if (type) qb.andWhere('dragon.type = :type', { type });
    if (minAge) qb.andWhere('dragon.age >= :minAge', { minAge });
    if (maxAge) qb.andWhere('dragon.age <= :maxAge', { maxAge });

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Dragon> {
    const dragon = await this.dragonRepository.findOne({
      where: { id },
      relations: ['adoptions', 'adoptions.caretaker'], // asume relación en la entidad
    });

    if (!dragon) throw new NotFoundException(`Dragon #${id} not found`);

    return dragon;
  }

  async update(id: number, updateDragonDto: UpdateDragonDto): Promise<Dragon> {
    const dragon = await this.dragonRepository.findOne({ where: { id } });
    if (!dragon) throw new NotFoundException(`Dragon #${id} not found`);

    if (updateDragonDto.name && updateDragonDto.name !== dragon.name) {
      const existing = await this.dragonRepository.findOne({ where: { name: updateDragonDto.name } });
      if (existing) throw new ConflictException(`Dragon with name "${updateDragonDto.name}" already exists`);
    }

    Object.assign(dragon, updateDragonDto);
    return this.dragonRepository.save(dragon);
  }

  async remove(id: number): Promise<void> {
    const dragon = await this.dragonRepository.findOne({ where: { id } });
    if (!dragon) throw new NotFoundException(`Dragon #${id} not found`);

    await this.dragonRepository.remove(dragon);
  }
}
