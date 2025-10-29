import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CaretakersService } from '../caretakers/caretakers.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private caretakersService: CaretakersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const user = await this.caretakersService.create(dto);
      // ocultar password
      // @ts-ignore
      delete user.password;
      return user;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.caretakersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    // ocultar password antes de devolver
    // @ts-ignore
    delete user.password;
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.caretakersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async refresh(userId: string, role: string) {
    const payload = { sub: userId, role };
    return { access_token: this.jwtService.sign(payload) };
  }
}