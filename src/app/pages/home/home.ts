import { Component, OnInit, inject } from '@angular/core';
import { AboutSectionComponent } from './sections/about/about-section';
import { ContactCtaSectionComponent } from './sections/contact-cta/contact-cta-section';
import { EducationSectionComponent } from './sections/education/education-section';
import { ExperienceSectionComponent } from './sections/experience/experience-section';
import { HeroSectionComponent } from './sections/hero/hero-section';
import { ProjectsSectionComponent } from './sections/projects/projects-section';
import { QuickContactSectionComponent } from './sections/quick-contact/quick-contact-section';
import { SiteHeaderComponent } from './sections/site-header/site-header';
import { TechnologiesSectionComponent } from './sections/technologies/technologies-section';
import { HomeDataService } from './home-data.service';

@Component({
  selector: 'app-home',
  imports: [
    AboutSectionComponent,
    ContactCtaSectionComponent,
    EducationSectionComponent,
    ExperienceSectionComponent,
    HeroSectionComponent,
    ProjectsSectionComponent,
    QuickContactSectionComponent,
    SiteHeaderComponent,
    TechnologiesSectionComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private readonly homeDataService = inject(HomeDataService);

  ngOnInit() {
    this.homeDataService.loadProfile();
  }
}
