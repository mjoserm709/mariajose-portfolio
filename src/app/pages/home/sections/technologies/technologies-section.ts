import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../../core/portfolio.service';
import { Technology } from '../../../../core/projects.service';
import { GlowCardDirective } from '../../../../shared/animations/glow-card.directive';

@Component({
  selector: 'app-technologies-section',
  imports: [GlowCardDirective],
  templateUrl: './technologies-section.html',
})
export class TechnologiesSectionComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  readonly technologies = signal<Technology[]>([]);
  readonly stackGroups = computed(() => {
    const technologies = this.technologies();

    return [
      {
        title: 'Frontend',
        description: 'Interfaces dinamicas, componentes reutilizables y estado reactivo.',
        items: this.resolveStackItems(
          technologies,
          ['frontend', 'angular', 'typescript', 'javascript', 'css', 'html'],
        ),
      },
      {
        title: 'Backend',
        description: 'APIs REST, autenticacion, servicios y logica de negocio.',
        items: this.resolveStackItems(
          technologies,
          ['backend', 'nestjs', '.net', 'node', 'api'],
        ),
      },
      {
        title: 'Database',
        description: 'Modelado, consultas, relaciones y persistencia de datos.',
        items: this.resolveStackItems(
          technologies,
          ['database', 'db', 'postgres', 'supabase', 'mongo', 'sql'],
        ),
      },
      {
        title: 'DevOps',
        description: 'Deploy, contenedores, versionado y ambientes cloud.',
        items: this.resolveStackItems(
          technologies,
          ['devops', 'docker', 'render', 'vercel', 'git', 'cloud'],
        ),
      },
    ].filter((group) => group.items.length);
  });

  ngOnInit() {
    this.portfolioService.findTechnologies().subscribe({
      next: (technologies) => this.technologies.set(technologies),
      error: () => this.technologies.set([]),
    });
  }

  private resolveStackItems(
    technologies: Technology[],
    keywords: string[],
  ) {
    const matchedTechnologies = technologies.filter((technology) => {
      const searchableText = `${technology.name} ${technology.category ?? ''}`.toLowerCase();

      return keywords.some((keyword) => searchableText.includes(keyword));
    });
    const seen = new Set<string>();

    return matchedTechnologies.filter((technology) => {
      const key = technology.name.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }
}
