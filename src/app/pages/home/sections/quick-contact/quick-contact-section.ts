import { Component, computed, inject } from '@angular/core';
import { HomeDataService } from '../../home-data.service';

@Component({
  selector: 'app-quick-contact-section',
  templateUrl: './quick-contact-section.html',
})
export class QuickContactSectionComponent {
  private readonly homeDataService = inject(HomeDataService);

  readonly profile = computed(() => this.homeDataService.profile());
}
