import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caretaker } from '../caretakers/entities/caretaker.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Caretaker)
    private readonly caretakerRepository: Repository<Caretaker>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // 1️⃣ Validación básica para JwtStrategy
  async validateUserById(sub: number) {
    const user = await this.caretakerRepository.findOne({ where: { id: sub } });
    if (!user) return null;
    return user;
  }

  // 2️⃣ Login: generar access + refresh tokens
  async login(user: Caretaker) {
    const payload = { sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET')!,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });

    // Guardar hash del refresh token en BD
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.caretakerRepository.update(user.id, { refreshToken: hashedRefresh });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // 3️⃣ Validar refresh token recibido
  async validateUserByRefreshToken(sub: number, refreshToken: string) {
    const user = await this.caretakerRepository.findOne({ where: { id: sub } });
    if (!user || !user.refreshToken) return null;

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) return null;

    return user;
  }

  // 4️⃣ Refrescar tokens
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.validateUserByRefreshToken(userId, refreshToken);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    return this.login(user); // genera y guarda nuevos tokens
  }

  // 5️⃣ Logout (revocar refresh token)
  async logout(userId: number) {
    // Usamos undefined en lugar de null para no romper el tipo
    await this.caretakerRepository.update(userId, { refreshToken: undefined });
    return { message: 'Logout successful' };
  }
}
