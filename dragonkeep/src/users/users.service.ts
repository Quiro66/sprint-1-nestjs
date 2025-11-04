import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  findAll(page = 1, limit = 10) {
    return this.users.find({ skip: (page - 1) * limit, take: limit });
  }

  async findOne(id: string) {
    const u = await this.users.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    return u;
  }

  async update(id: string, dto: UpdateUserDto) {
    const u = await this.findOne(id);
    Object.assign(u, dto);
    return this.users.save(u);
  }

  async remove(id: string) {
    const u = await this.findOne(id);
    await this.users.remove(u);
    return { deleted: true };
  }
}
