import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'portfolio_access_token';
  readonly accessToken = signal<string | null>(localStorage.getItem(this.tokenKey));

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.session.accessToken);
        this.accessToken.set(response.session.accessToken);
      }),
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.accessToken.set(null);
  }

  isAuthenticated() {
    return Boolean(this.accessToken());
  }
}
