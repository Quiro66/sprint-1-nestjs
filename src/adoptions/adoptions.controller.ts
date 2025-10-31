// ...new file...
import { Controller, Post, Body, UseGuards, Request, Param, Patch } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  // cualquier cuidador autenticado puede solicitar una adopción
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('caretaker')
  @Post()
  async create(@Request() req: any, @Body(new ValidationPipe({ whitelist: true })) dto: CreateAdoptionDto) {
    const caretakerId = req.user.sub;
    return this.adoptionsService.create(caretakerId, dto.dragonId);
  }

  // aprobar: solo admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    return this.adoptionsService.approve(id);
  }

  // liberar: admin o el cuidador que adoptó
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'caretaker')
  @Patch(':id/release')
  async release(@Param('id') id: string, @Request() req: any) {
    return this.adoptionsService.release(id, req.user);
  }
}

