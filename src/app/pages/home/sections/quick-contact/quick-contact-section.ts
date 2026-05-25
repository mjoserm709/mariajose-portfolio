import { Component, computed, inject } from '@angular/core';
import { GlowCardDirective } from '../../../../shared/animations/glow-card.directive';
import { HomeDataService } from '../../home-data.service';

@Component({
  selector: 'app-quick-contact-section',
  imports: [GlowCardDirective],
  templateUrl: './quick-contact-section.html',
})
export class QuickContactSectionComponent {
  private readonly homeDataService = inject(HomeDataService);

  readonly profile = computed(() => this.homeDataService.profile());
}
