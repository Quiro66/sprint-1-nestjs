import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../entities/refresh-token.entity';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(RefreshToken) private refreshTokens: Repository<RefreshToken>,
    private jwt: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email ya registrado');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({ email: dto.email, password: hash, role: dto.role, fullName: dto.fullName });
    await this.users.save(user);
    const tokens = await this.issueTokens(user);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');
    const tokens = await this.issueTokens(user);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  async refresh(refreshToken: string) {
    const record = await this.refreshTokens.findOne({ where: { token: refreshToken } });
    if (!record || record.expiresAt < new Date()) throw new UnauthorizedException('Refresh inválido');
    const user = await this.users.findOne({ where: { id: (record as any).user.id } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return this.issueTokens(user);
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES || '1h'
    });
    const token = cryptoRandom();
    const rt = this.refreshTokens.create({
      token,
      user,
      expiresAt: new Date(Date.now() + parseExpiry(process.env.JWT_REFRESH_EXPIRES || '7d'))
    });
    await this.refreshTokens.save(rt);
    return { accessToken, refreshToken: token };
  }
}

function parseExpiry(str: string): number {
  // naive parser: 7d => ms; 1h => ms
  const m = /^([0-9]+)([smhd])$/.exec(str);
  if (!m) return 7 * 24 * 3600 * 1000;
  const n = parseInt(m[1], 10);
  const unit = m[2];
  const mult = unit == 's' ? 1000 : unit == 'm' ? 60000 : unit == 'h' ? 3600000 : 86400000;
  return n * mult;
}

function cryptoRandom(): string {
  // minimal random token
  return Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}
