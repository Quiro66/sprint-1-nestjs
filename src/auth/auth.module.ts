import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Caretaker } from '../caretakers/entities/caretaker.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Caretaker]),

    // JWT asincrónico con configuración desde .env
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET is not defined in your environment variables');

        const expiresInStr = configService.get<string>('JWT_EXPIRATION') || '15m';


        const expiresIn = (() => {
          const match = expiresInStr.match(/^(\d+)([smhd])$/);
          if (!match) return parseInt(expiresInStr); // si solo es número
          const value = parseInt(match[1]);
          const unit = match[2];
          const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
          return value * (multipliers[unit] || 1);
        })();

        return {
          secret,
          signOptions: { expiresIn }, // ✅ number en segundos, TypeScript feliz
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
