import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';
import { Adoption } from './entities/adoption.entity';
import { Dragon } from '../dragons/entities/dragon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adoption, Dragon])],
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
  exports: [AdoptionsService],
})
export class AdoptionsModule {}
