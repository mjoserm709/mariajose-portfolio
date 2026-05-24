import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  me(@Headers('authorization') authorization?: string) {
    const token = authorization?.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    return this.authService.getUser(token);
  }
}
