import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Caretaker, UserRole } from '../entities/caretaker.entity';
import { RegisterDto } from '../auth/dto/register.dto';

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
}