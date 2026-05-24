import { Component, OnInit, inject, signal } from '@angular/core';
import { Experience, PortfolioService } from '../../../../core/portfolio.service';

@Component({
  selector: 'app-experience-section',
  templateUrl: './experience-section.html',
})
export class ExperienceSectionComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  readonly experience = signal<Experience[]>([]);

  ngOnInit() {
    this.portfolioService.getExperience().subscribe({
      next: (experience) => this.experience.set(experience),
      error: () => this.experience.set([]),
    });
  }

  period(item: Experience) {
    const start = item.startDate ? item.startDate.slice(0, 7) : '';
    const end = item.current ? 'Actualidad' : item.endDate?.slice(0, 7) ?? '';

    return [start, end].filter(Boolean).join(' - ');
  }

  descriptionLines(description?: string) {
    return description?.split('\n').filter(Boolean) ?? [];
  }
}
