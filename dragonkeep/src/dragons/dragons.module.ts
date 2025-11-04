import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DragonsService } from './dragons.service';
import { DragonsController } from './dragons.controller';
import { Dragon } from '../entities/dragon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dragon])],
  providers: [DragonsService],
  controllers: [DragonsController],
  exports: [DragonsService]
})
export class DragonsModule {}
