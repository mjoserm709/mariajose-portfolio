import { Injectable, inject, signal } from '@angular/core';
import { PortfolioService, Profile } from '../../core/portfolio.service';

@Injectable({ providedIn: 'root' })
export class HomeDataService {
  private readonly portfolioService = inject(PortfolioService);

  readonly profile = signal<Profile | null>(null);

  loadProfile() {
    this.portfolioService.getProfile().subscribe({
      next: (profile) => this.profile.set(profile),
      error: () => this.profile.set(null),
    });
  }
}
