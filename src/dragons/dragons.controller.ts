import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DragonsService } from './dragons.service';
import { CreateDragonDto } from './dto/create-dragon.dto';
import { UpdateDragonDto } from './dto/update-dragon.dto';
import { ListDragonsQueryDto } from './dto/list-dragon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../caretakers/caretaker.enums';

@Controller('dragons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DragonsController {
  constructor(private readonly dragonsService: DragonsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createDragonDto: CreateDragonDto) {
    return this.dragonsService.create(createDragonDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: ListDragonsQueryDto) {
    return this.dragonsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.dragonsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateDragonDto: UpdateDragonDto) {
    return this.dragonsService.update(+id, updateDragonDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.dragonsService.remove(+id);
  }
}
