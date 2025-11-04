import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('adoptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  @Roles(Role.CARETAKER, Role.ADMIN)
  request(@Req() req: any, @Body() dto: CreateAdoptionDto) {
    const caretakerId = req.user.sub;
    return this.adoptionsService.request(caretakerId, dto);
  }

  @Post(':id/approve')
  @Roles(Role.ADMIN)
  approve(@Param('id') id: string) {
    return this.adoptionsService.approve(id);
  }

  @Patch(':id/release')
  @Roles(Role.CARETAKER, Role.ADMIN)
  release(@Param('id') id: string, @Req() req: any) {
    return this.adoptionsService.release(id, req.user.sub);
  }

  @Get('/caretakers/:id/dragons')
  @Roles(Role.CARETAKER, Role.ADMIN)
  listByCaretaker(@Param('id') id: string, @Query('active') active?: string, @Req() req?: any) {
    // el cuidador solo puede ver su propio listado a menos que sea admin
    if (req.user.role !== Role.ADMIN && req.user.sub !== id) {
      return { error: 'Forbidden' };
    }
    const activeBool = active === undefined ? undefined : active === 'true';
    return this.adoptionsService.listByCaretaker(id, activeBool);
  }
}
