import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppSourceData } from "../src/config/db";
import { ConfigModule } from "@nestjs/config";
import { AppService } from './app.service';
import { DragonsModule } from './dragons/dragons.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppSourceData.options),
    DragonsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
