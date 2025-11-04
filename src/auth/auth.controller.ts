import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Caretaker } from '../caretakers/entities/caretaker.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Caretaker)
    private readonly caretakerRepository: Repository<Caretaker>,
    private readonly jwtService: JwtService,
  ) {}

  // Trae el usuario incluyendo el password (útil si en la entidad está `select: false`)
  async findUserByEmailWithPassword(email: string) {
    return this.caretakerRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name'],
    });
  }

  // Compara contraseña en claro con el hash almacenado
  async validatePassword(user: { password?: string } | null, plainPassword: string) {
    if (!user || !user.password) return false;
    return bcrypt.compare(plainPassword, user.password);
  }

  // Registro simple: hashea la contraseña antes de guardar
  async registerCaretaker(payload: { email: string; password: string; name: string }) {
    const hashed = await bcrypt.hash(payload.password, 10);
    const entity = this.caretakerRepository.create({
      email: payload.email,
      password: hashed,
      name: payload.name,
    });
    return this.caretakerRepository.save(entity);
  }

  // Genera access y refresh tokens; guarda hash del refresh token en DB
  async login(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.caretakerRepository.update(user.id, { currentHashedRefreshToken: hashedRefresh });

    return { accessToken, refreshToken };
  }

  // Refresca tokens validando el refresh token contra el hash guardado
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.caretakerRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'currentHashedRefreshToken'],
    });
    if (!user || !user.currentHashedRefreshToken) throw new UnauthorizedException('Invalid refresh token');

    const isValid = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const newHashedRefresh = await bcrypt.hash(newRefreshToken, 10);
    await this.caretakerRepository.update(user.id, { currentHashedRefreshToken: newHashedRefresh });

    return { accessToken, refreshToken: newRefreshToken };
  }

  // Logout: elimina el hash de refresh token
  async logout(userId: number) {
    await this.caretakerRepository.update(userId, { currentHashedRefreshToken: null });
    return { success: true };
  }
}
