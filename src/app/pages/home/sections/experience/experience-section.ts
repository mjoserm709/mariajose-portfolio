import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Experience, PortfolioService } from '../../../../core/portfolio.service';
import { GlowCardDirective } from '../../../../shared/animations/glow-card.directive';

@Component({
  selector: 'app-experience-section',
  imports: [GlowCardDirective],
  templateUrl: './experience-section.html',
})
export class ExperienceSectionComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  private readonly initialExperienceCount = 2;
  private readonly initialDescriptionLineCount = 3;

  readonly experience = signal<Experience[]>([]);
  readonly showAllExperience = signal(false);
  readonly expandedExperienceIds = signal<Set<string>>(new Set());
  readonly visibleExperience = computed(() =>
    this.showAllExperience()
      ? this.experience()
      : this.experience().slice(0, this.initialExperienceCount),
  );

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

  visibleDescriptionLines(item: Experience) {
    const lines = this.descriptionLines(item.description);

    return this.isExperienceExpanded(item.id)
      ? lines
      : lines.slice(0, this.initialDescriptionLineCount);
  }

  hasMoreDescription(item: Experience) {
    return this.descriptionLines(item.description).length > this.initialDescriptionLineCount;
  }

  hasMoreExperience() {
    return this.experience().length > this.initialExperienceCount;
  }

  isExperienceExpanded(id: string) {
    return this.expandedExperienceIds().has(id);
  }

  toggleExperienceDescription(id: string) {
    this.expandedExperienceIds.update((expandedIds) => {
      const nextExpandedIds = new Set(expandedIds);

      if (nextExpandedIds.has(id)) {
        nextExpandedIds.delete(id);
      } else {
        nextExpandedIds.add(id);
      }

      return nextExpandedIds;
    });
  }

  toggleExperienceList() {
    this.showAllExperience.update((showAllExperience) => !showAllExperience);
  }
}
