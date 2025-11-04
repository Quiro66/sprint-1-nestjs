import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DragonsModule } from './dragons/dragons.module';
import { Dragon } from './entities/dragon.entity';
import { Caretaker } from './entities/caretaker.entity';
import { Adoption } from './entities/adoption.entity';
import { AdoptionsModule } from './adoptions/adoptions.module';
import { CaretakersModule } from './caretakers/caretakers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'dragon_db',
      entities: [Dragon, Caretaker, Adoption],
      synchronize: false,
    }),
    DragonsModule,
    AdoptionsModule,
    CaretakersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
