import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DragonsService } from './dragons.service';
import { CreateDragonDto, ListDragonsQueryDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('dragons')
@Controller('dragons')
export class DragonsController {
  constructor(private readonly dragonsService: DragonsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateDragonDto) {
    return this.dragonsService.create(dto);
  }

  @Get()
  findAll(@Query() q: ListDragonsQueryDto) {
    return this.dragonsService.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dragonsService.findOne(id);
  }
}
