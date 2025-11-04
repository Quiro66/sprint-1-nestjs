import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { Adoption } from '../entities/adoption.entity';
import { Dragon } from '../entities/dragon.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adoption, Dragon, User])],
  providers: [AdoptionsService],
  controllers: [AdoptionsController]
})
export class AdoptionsModule {}
