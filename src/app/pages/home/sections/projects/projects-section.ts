import { Component, OnInit, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../../core/portfolio.service';
import { Project } from '../../../../core/projects.service';

@Component({
  selector: 'app-projects-section',
  templateUrl: './projects-section.html',
})
export class ProjectsSectionComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.portfolioService.findProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects.filter((project) => project.featured));
        this.isLoading.set(false);
      },
      error: () => {
        this.projects.set([]);
        this.isLoading.set(false);
      },
    });
  }

  projectImage(project: Project) {
    const image = project.images?.[0];
    return image?.imageUrl ?? image?.image_url ?? '';
  }
}
