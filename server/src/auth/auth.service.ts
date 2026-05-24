import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto) {
    const { data, error } = await this.supabaseService.authClient.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
      },
    };
  }

  async getUser(accessToken: string) {
    const { data, error } = await this.supabaseService.authClient.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return {
      id: data.user.id,
      email: data.user.email,
    };
  }
}
