import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caretaker } from '../entities/caretaker.entity';
import { Adoption } from '../entities/adoption.entity';
import { Dragon } from '../entities/dragon.entity';
import { CaretakersService } from './caretakers.service';
import { CaretakersController } from './caretakers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Caretaker, Adoption, Dragon])
  ],
  controllers: [CaretakersController],
  providers: [CaretakersService],
  exports: [CaretakersService]
})
export class CaretakersModule {}