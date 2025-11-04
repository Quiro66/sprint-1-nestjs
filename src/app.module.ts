import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DragonsModule } from './dragons/dragons.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdoptionsModule } from './adoptions/adoptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // asegurarse de que el .env está en la raíz
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'perla',
      database: process.env.DB_NAME || 'dragonkeepdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    // Módulos de negocio
    AuthModule,
    DragonsModule,
    AdoptionsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
