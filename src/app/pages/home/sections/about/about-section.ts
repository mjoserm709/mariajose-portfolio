import { Component } from '@angular/core';
import { GlowCardDirective } from '../../../../shared/animations/glow-card.directive';

@Component({
  selector: 'app-about-section',
  imports: [GlowCardDirective],
  templateUrl: './about-section.html',
})
export class AboutSectionComponent {}
