import { Controller, Post, Body, UseGuards, Get, Query, Param } from '@nestjs/common';
import { DragonsService } from './dragons.service';
import { CreateDragonDto } from './dto/create-dragon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ListDragonsQueryDto } from './dto/list-dragons-query.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('dragons')
export class DragonsController {
  constructor(private readonly dragonsService: DragonsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateDragonDto) {
    return this.dragonsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'caretaker')
  @Get()
  async findAll(@Query(new ValidationPipe({ transform: true })) query: ListDragonsQueryDto) {
    return this.dragonsService.findAll(query as any);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'caretaker')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dragonsService.findOne(id);
  }
}
