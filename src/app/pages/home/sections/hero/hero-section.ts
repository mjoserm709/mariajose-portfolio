import { Component, computed, inject } from '@angular/core';
import { HomeDataService } from '../../home-data.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
})
export class HeroSectionComponent {
  private readonly homeDataService = inject(HomeDataService);

  readonly profile = computed(() => this.homeDataService.profile());
  readonly firstName = computed(() => this.profile()?.fullName?.split(' ')[0] ?? 'Maria Jose');
  readonly middleName = computed(() => this.profile()?.fullName?.split(' ')[1] ?? 'Ramirez');
  readonly lastName = computed(
    () => this.profile()?.fullName?.split(' ').slice(2).join(' ') || 'Martinez',
  );
}
