import { Controller, Post, UseGuards, Body } from '@nestjs/common';

import { Public } from '../utils/auth.utils';
import { UserAuthDto } from '../dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategies';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() userAuth: UserAuthDto) {
    return this.authService.login(userAuth);
  }

  @Public()
  @Post('register')
  async register(@Body() userAuth: UserAuthDto) {
    return this.authService.register(userAuth);
  }
}
