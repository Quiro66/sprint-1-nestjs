import { 
  Controller, 
  Get, 
  Param, 
  UseGuards, 
  Query, 
  ParseIntPipe, 
  DefaultValuePipe,
  ForbiddenException,
  Request
} from '@nestjs/common';
import { CaretakersService } from './caretakers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/caretaker.entity';

@Controller('caretakers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CaretakersController {
  constructor(private readonly caretakersService: CaretakersService) {}

  @Get(':id/dragons')
  @Roles(UserRole.ADMIN, UserRole.CARETAKER)
  async findDragonsByCaretaker(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Request() req
  ) {
    // Solo el propio usuario o un administrador pueden ver los dragones
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('No tienes permiso para ver estos dragones');
    }

    return this.caretakersService.findDragonsByCaretaker(id, page, limit);
  }
}