import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Caretaker, UserRole } from '../entities/caretaker.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { Adoption } from '../entities/adoption.entity';
import { Dragon } from '../entities/dragon.entity';

@Injectable()
export class CaretakersService {
  constructor(
    @InjectRepository(Caretaker)
    private repo: Repository<Caretaker>,
  ) {}

  async create(dto: RegisterDto, role: UserRole = UserRole.CARETAKER) {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new Error('Email already registered');
    const password = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      fullName: dto.fullName,
      email: dto.email,
      password,
      role,
    });
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findDragonsByCaretaker(
    caretakerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const [adoptions, total] = await this.repo.manager.findAndCount(Adoption, {
      where: { 
        caretaker: { id: caretakerId },
        releasedAt: null // Solo adopciones activas
      },
      relations: ['dragon'],
      take: limit,
      skip: (page - 1) * limit,
      order: { adoptedAt: 'DESC' }
    });

    if (!adoptions.length) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          pages: 0
        }
      };
    }

    return {
      data: adoptions.map(adoption => ({
        id: adoption.dragon.id,
        name: adoption.dragon.name,
        breed: adoption.dragon.breed,
        age: adoption.dragon.age,
        fireType: adoption.dragon.fireType,
        aggressionLevel: adoption.dragon.aggressionLevel,
        adoptedAt: adoption.adoptedAt,
        adoptionId: adoption.id
      })),
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
}