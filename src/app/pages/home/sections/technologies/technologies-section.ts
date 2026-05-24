import { Component, OnInit, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../../core/portfolio.service';
import { Technology } from '../../../../core/projects.service';

@Component({
  selector: 'app-technologies-section',
  templateUrl: './technologies-section.html',
})
export class TechnologiesSectionComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  readonly technologies = signal<Technology[]>([]);

  ngOnInit() {
    this.portfolioService.findTechnologies().subscribe({
      next: (technologies) => this.technologies.set(technologies),
      error: () => this.technologies.set([]),
    });
  }
}
