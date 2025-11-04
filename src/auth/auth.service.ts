import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caretaker } from '../caretakers/entities/caretaker.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../caretakers/caretaker.enums';

type JwtPayloadWithRole = { sub: string; role: UserRole };
type ExpiresIn = import('jsonwebtoken').SignOptions['expiresIn'];

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Caretaker)
    private readonly caretakerRepository: Repository<Caretaker>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // ---------------- LOGIN / TOKENS ----------------
  async validateUserById(sub: string) {
    const user = await this.caretakerRepository.findOne({ where: { id: Number(sub) } });
    return user || null;
  }

  async findUserByEmailWithPassword(email: string) {
    return this.caretakerRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'refreshToken'],
    });
  }

  async validatePassword(user: Caretaker, plainPassword: string) {
    if (!user.password) throw new UnauthorizedException('User password not found');
    return bcrypt.compare(plainPassword, user.password);
  }

  async login(user: Caretaker) {
    const payload: JwtPayloadWithRole = { sub: user.id.toString(), role: user.role };

    const accessExpires = (this.configService.get<string>('JWT_EXPIRATION') ?? '15m') as unknown as ExpiresIn;
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET')!,
      expiresIn: accessExpires,
    });

    const refreshExpires = (this.configService.get<string>('JWT_REFRESH_EXPIRATION') ?? '7d') as unknown as ExpiresIn;
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: refreshExpires,
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.caretakerRepository.update(user.id, { refreshToken: hashedRefresh });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async validateUserByRefreshToken(sub: string, refreshToken: string) {
    const user = await this.caretakerRepository.findOne({
      where: { id: Number(sub) },
      select: ['id', 'refreshToken', 'email', 'role', 'password'], // asegurarse de traer refreshToken y password
    });
    if (!user || !user.refreshToken) return null;

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    return isMatch ? user : null;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.validateUserByRefreshToken(userId.toString(), refreshToken);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    return this.login(user);
  }

  async logout(userId: number) {
    await this.caretakerRepository.update(userId, { refreshToken: undefined });
    return { message: 'Logout successful' };
  }

  // ---------------- REGISTER ----------------
  async registerCaretaker(data: { email: string; password: string; name: string }) {
    const { email, password, name } = data;

    // Verificar si ya existe el usuario
    const existingUser = await this.caretakerRepository.findOne({ where: { email } });
    if (existingUser) throw new ConflictException('User already exists with this email');

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo caretaker
    const newUser = this.caretakerRepository.create({
      email,
      password: hashedPassword,
      name,
      role: UserRole.CARETAKER, // rol por defecto
    });

    await this.caretakerRepository.save(newUser);

    // Retornar tokens automáticamente
    return this.login(newUser);
  }
}
