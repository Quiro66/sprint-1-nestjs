import { Controller, Post, Body, UseGuards, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';
import { RefreshDto } from './dtos/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.registerCaretaker(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.findUserByEmailWithPassword(body.email);
    const valid = await this.authService.validatePassword(user as any, body.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user as any);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshDto) {
    const decoded = this.jwtService.decode(body.refreshToken) as any;
    const sub = decoded?.sub;
    if (!sub) throw new BadRequestException('Invalid refresh token payload');
    return this.authService.refreshTokens(Number(sub), body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.logout(user.id);
  }
}
