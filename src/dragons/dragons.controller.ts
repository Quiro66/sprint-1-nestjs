import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DragonsService } from './dragons.service';
import { CreateDragonDto } from './dto/create-dragon.dto';
import { UpdateDragonDto } from './dto/update-dragon.dto';

@Controller('dragons')
export class DragonsController {
  constructor(private readonly dragonsService: DragonsService) {}

  @Post()
  create(@Body() createDragonDto: CreateDragonDto) {
    return this.dragonsService.create(createDragonDto);
  }

  @Get()
  findAll() {
    return this.dragonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dragonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDragonDto: UpdateDragonDto) {
    return this.dragonsService.update(+id, updateDragonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dragonsService.remove(+id);
  }
}
