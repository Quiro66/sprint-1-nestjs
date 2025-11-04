import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import type { CreateAdoptionDto } from './dto/create-adoption.dto';
import type { UpdateAdoptionDto } from './dto/update-adoption.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: Request, @Body() createAdoptionDto: CreateAdoptionDto) {
    // req.user viene provisto por Passport/JWT; lo tipamos como cualquier para no depender de la entidad exacta aquí
    const caretaker = req.user as any;
    return this.adoptionsService.create(caretaker, createAdoptionDto.dragonId);
  }

  @Get()
  findAll() {
    return this.adoptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdoptionDto: UpdateAdoptionDto) {
    return this.adoptionsService.update(+id, updateAdoptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionsService.remove(+id);
  }
}
