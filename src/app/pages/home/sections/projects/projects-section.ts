import { Component, OnInit, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../../core/portfolio.service';
import { Project } from '../../../../core/projects.service';
import { GlowCardDirective } from '../../../../shared/animations/glow-card.directive';

@Component({
  selector: 'app-projects-section',
  imports: [GlowCardDirective],
  templateUrl: './projects-section.html',
})
export class ProjectsSectionComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  private readonly allProjects = signal<Project[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal(true);
  readonly showAllProjects = signal(false);

  ngOnInit() {
    this.portfolioService.findProjects().subscribe({
      next: (projects) => {
        this.allProjects.set(projects);
        this.updateVisibleProjects();
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

  toggleProjectsView() {
    this.showAllProjects.update((showAllProjects) => !showAllProjects);
    this.updateVisibleProjects();
  }

  private updateVisibleProjects() {
    const projects = this.allProjects();
    this.projects.set(
      this.showAllProjects() ? projects : projects.filter((project) => project.featured),
    );
  }
}
