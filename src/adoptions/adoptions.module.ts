// ...new file...
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionsController } from './adoptions.controller';
import { AdoptionsService } from './adoptions.service';
import { Adoption } from '../entities/adoption.entity';
import { Dragon } from '../entities/dragon.entity';
import { Caretaker } from '../entities/caretaker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adoption, Dragon, Caretaker])],
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
})
export class AdoptionsModule {}

