import { Injectable } from '@nestjs/common';
import { CreateDragonDto } from './dto/create-dragon.dto';
import { UpdateDragonDto } from './dto/update-dragon.dto';

@Injectable()
export class DragonsService {
  create(createDragonDto: CreateDragonDto) {
    return 'This action adds a new dragon';
  }

  findAll() {
    return `This action returns all dragons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dragon`;
  }

  update(id: number, updateDragonDto: UpdateDragonDto) {
    return `This action updates a #${id} dragon`;
  }

  remove(id: number) {
    return `This action removes a #${id} dragon`;
  }
}
