import { Module } from '@nestjs/common';
import { DragonsService } from './dragons.service';
import { DragonsController } from './dragons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dragon } from '../entities/dragon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dragon])],
  providers: [DragonsService],
  controllers: [DragonsController],
  exports: [DragonsService],
})
export class DragonsModule {}
