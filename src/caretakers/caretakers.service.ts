import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    const caretaker = await this.repo.findOne({ where: { id } });
    if (!caretaker) {
      throw new NotFoundException('Caretaker not found');
    }
    return caretaker;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.repo.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' }
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async update(id: string, updateData: Partial<Caretaker>) {
    const caretaker = await this.findById(id);
    
    if (updateData.email && updateData.email !== caretaker.email) {
      const exists = await this.repo.findOne({ where: { email: updateData.email } });
      if (exists) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(caretaker, updateData);
    return this.repo.save(caretaker);
  }

  async remove(id: string) {
    const caretaker = await this.findById(id);
    
    // Verificar si el cuidador tiene adopciones activas
    const activeAdoptions = await this.repo.manager.count(Adoption, {
      where: { 
        caretaker: { id },
        releasedAt: null as any
      }
    });

    if (activeAdoptions > 0) {
      throw new ConflictException('Cannot delete caretaker with active adoptions');
    }

    return this.repo.remove(caretaker);
  }

  async findDragonsByCaretaker(
    caretakerId: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const [adoptions, total] = await this.repo.manager.findAndCount(Adoption, {
      where: { 
        caretaker: { id: caretakerId },
        releasedAt: null as any // Solo adopciones activas
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