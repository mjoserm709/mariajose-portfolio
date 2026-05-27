import { Injectable, inject, signal } from '@angular/core';
import { PortfolioService, Profile } from '../../core/portfolio.service';

@Injectable({ providedIn: 'root' })
export class HomeDataService {
  private readonly portfolioService = inject(PortfolioService);

  readonly profile = signal<Profile | null>(null);
  readonly isProfileLoading = signal(true);
  readonly hasProfileError = signal(false);

  loadProfile() {
    this.isProfileLoading.set(true);
    this.hasProfileError.set(false);

    this.portfolioService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.isProfileLoading.set(false);
      },
      error: () => {
        this.profile.set(null);
        this.hasProfileError.set(true);
        this.isProfileLoading.set(false);
      },
    });
  }
}
