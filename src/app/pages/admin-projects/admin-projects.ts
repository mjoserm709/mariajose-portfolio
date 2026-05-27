import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ExperienceService } from '../../core/experience.service';
import { Experience } from '../../core/portfolio.service';
import { Project, ProjectsService, Technology } from '../../core/projects.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-projects',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-projects.html',
})
export class AdminProjectsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly experienceService = inject(ExperienceService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly projects = signal<Project[]>([]);
  readonly experience = signal<Experience[]>([]);
  readonly technologies = signal<Technology[]>([]);
  readonly selectedExperienceId = signal<string | null>(null);
  readonly selectedProjectId = signal<string | null>(null);
  readonly selectedTechnologyId = signal<string | null>(null);
  readonly activeModule = signal<'projects' | 'experience'>('projects');
  readonly activeSection = signal<
    'list' | 'details' | 'technologies' | 'images' | 'experience-list' | 'experience-form'
  >('list');
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly message = signal('');
  readonly iconSearch = signal('');
  readonly isEditing = computed(() => Boolean(this.selectedProjectId()));
  readonly isEditingExperience = computed(() => Boolean(this.selectedExperienceId()));
  readonly isEditingTechnology = computed(() => Boolean(this.selectedTechnologyId()));
  readonly selectedProject = computed(
    () => this.projects().find((project) => project.id === this.selectedProjectId()) ?? null,
  );
  readonly deviconOptions = [
    { name: '.NET Core', className: 'devicon-dotnetcore-plain colored' },
    { name: 'C#', className: 'devicon-csharp-plain colored' },
    { name: 'Angular', className: 'devicon-angularjs-plain colored' },
    { name: 'TypeScript', className: 'devicon-typescript-plain colored' },
    { name: 'JavaScript', className: 'devicon-javascript-plain colored' },
    { name: 'NestJS', className: 'devicon-nestjs-plain colored' },
    { name: 'Node.js', className: 'devicon-nodejs-plain colored' },
    { name: 'Express', className: 'devicon-express-original' },
    { name: 'PostgreSQL', className: 'devicon-postgresql-plain colored' },
    { name: 'MySQL', className: 'devicon-mysql-original colored' },
    { name: 'MongoDB', className: 'devicon-mongodb-plain colored' },
    { name: 'Redis', className: 'devicon-redis-plain colored' },
    { name: 'SQL Server', className: 'devicon-microsoftsqlserver-plain colored' },
    { name: 'Docker', className: 'devicon-docker-plain colored' },
    { name: 'Kubernetes', className: 'devicon-kubernetes-plain colored' },
    { name: 'Git', className: 'devicon-git-plain colored' },
    { name: 'GitHub', className: 'devicon-github-original' },
    { name: 'GitLab', className: 'devicon-gitlab-plain colored' },
    { name: 'Python', className: 'devicon-python-plain colored' },
    { name: 'Django', className: 'devicon-django-plain colored' },
    { name: 'FastAPI', className: 'devicon-fastapi-plain colored' },
    { name: 'PHP', className: 'devicon-php-plain colored' },
    { name: 'Laravel', className: 'devicon-laravel-original colored' },
    { name: 'Java', className: 'devicon-java-plain colored' },
    { name: 'Spring', className: 'devicon-spring-original colored' },
    { name: 'Bootstrap', className: 'devicon-bootstrap-plain colored' },
    { name: 'Tailwind CSS', className: 'devicon-tailwindcss-original colored' },
    { name: 'HTML5', className: 'devicon-html5-plain colored' },
    { name: 'CSS3', className: 'devicon-css3-plain colored' },
    { name: 'Sass', className: 'devicon-sass-original colored' },
    { name: 'React', className: 'devicon-react-original colored' },
    { name: 'Vue', className: 'devicon-vuejs-plain colored' },
    { name: 'Next.js', className: 'devicon-nextjs-original' },
    { name: 'Nuxt', className: 'devicon-nuxtjs-plain colored' },
    { name: 'Vite', className: 'devicon-vitejs-plain colored' },
    { name: 'Webpack', className: 'devicon-webpack-plain colored' },
    { name: 'Firebase', className: 'devicon-firebase-plain colored' },
    { name: 'Supabase', className: 'devicon-supabase-plain colored' },
    { name: 'Azure', className: 'devicon-azure-plain colored' },
    { name: 'AWS', className: 'devicon-amazonwebservices-plain-wordmark colored' },
    { name: 'Netlify', className: 'devicon-netlify-plain colored' },
    { name: 'Vercel', className: 'devicon-vercel-original' },
    { name: 'Linux', className: 'devicon-linux-plain' },
    { name: 'Ubuntu', className: 'devicon-ubuntu-plain colored' },
    { name: 'Windows', className: 'devicon-windows11-original colored' },
    { name: 'Visual Studio', className: 'devicon-visualstudio-plain colored' },
    { name: 'VS Code', className: 'devicon-vscode-plain colored' },
    { name: 'Figma', className: 'devicon-figma-plain colored' },
    { name: 'Postman', className: 'devicon-postman-plain colored' },
  ];
  readonly filteredDevicons = computed(() => {
    const search = this.iconSearch().trim().toLowerCase();

    if (!search) {
      return this.deviconOptions;
    }

    return this.deviconOptions.filter((icon) => icon.name.toLowerCase().includes(search));
  });

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(160)]],
    slug: ['', [Validators.required, Validators.maxLength(180)]],
    shortDescription: [''],
    description: [''],
    githubUrl: [''],
    demoUrl: [''],
    status: ['published', [Validators.required]],
    featured: [false],
    sortOrder: [0],
  });

  readonly imageForm = this.formBuilder.nonNullable.group({
    imageUrl: ['', [Validators.required]],
    altText: [''],
    sortOrder: [0],
  });

  readonly technologyForm = this.formBuilder.nonNullable.group({
    technologyId: ['', [Validators.required]],
  });

  readonly newTechnologyForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    iconClass: [''],
    category: [''],
  });

  readonly experienceForm = this.formBuilder.nonNullable.group({
    company: ['', [Validators.required]],
    role: ['', [Validators.required]],
    description: [''],
    startDate: [''],
    endDate: [''],
    current: [false],
    location: [''],
    sortOrder: [0],
  });

  ngOnInit() {
    this.loadExperience();
    this.loadProjects();
    this.loadTechnologies();
  }

  loadProjects() {
    this.isLoading.set(true);
    this.projectsService.findAllAdmin().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.isLoading.set(false);
      },
      error: () => {
        this.message.set('No se pudieron cargar los proyectos.');
        this.toastService.error('Error al cargar', 'No se pudieron obtener los proyectos.');
        this.isLoading.set(false);
      },
    });
  }

  loadTechnologies() {
    this.projectsService.findTechnologies().subscribe({
      next: (technologies) => this.technologies.set(technologies),
      error: () => this.toastService.error('Error al cargar', 'No se pudieron obtener las tecnologias.'),
    });
  }

  loadExperience() {
    this.experienceService.findAllAdmin().subscribe({
      next: (experience) => this.experience.set(experience),
      error: () => this.toastService.error('Error al cargar', 'No se pudo obtener la experiencia.'),
    });
  }

  selectProject(project: Project) {
    this.selectedProjectId.set(project.id);
    this.form.patchValue(project);
    this.imageForm.reset({ imageUrl: '', altText: '', sortOrder: 0 });
    this.technologyForm.reset({ technologyId: '' });
    this.activeSection.set('details');
  }

  resetForm() {
    this.selectedProjectId.set(null);
    this.activeSection.set('details');
    this.form.reset({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      githubUrl: '',
      demoUrl: '',
      status: 'published',
      featured: false,
      sortOrder: 0,
    });
    this.imageForm.reset({ imageUrl: '', altText: '', sortOrder: 0 });
    this.technologyForm.reset({ technologyId: '' });
  }

  showSection(
    section: 'list' | 'details' | 'technologies' | 'images' | 'experience-list' | 'experience-form',
  ) {
    this.activeModule.set(section.startsWith('experience') ? 'experience' : 'projects');

    if ((section === 'technologies' || section === 'images') && !this.selectedProjectId()) {
      this.toastService.info('Informacion', 'Selecciona o crea un proyecto primero.');
      this.activeSection.set('details');
      return;
    }

    this.activeSection.set(section);
  }

  showModule(module: 'projects' | 'experience') {
    this.activeModule.set(module);
    this.activeSection.set(module === 'projects' ? 'list' : 'experience-list');
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Atencion', 'Revisa los campos antes de continuar.');
      return;
    }

    const payload = this.form.getRawValue();
    const selectedId = this.selectedProjectId();
    const request = selectedId
      ? this.projectsService.update(selectedId, payload)
      : this.projectsService.create(payload);

    this.isSaving.set(true);
    this.message.set('');

    request.subscribe({
      next: () => {
        this.message.set(selectedId ? 'Proyecto actualizado.' : 'Proyecto creado.');
        this.toastService.success(
          'Exito',
          selectedId ? 'Proyecto actualizado correctamente.' : 'Proyecto creado correctamente.',
        );
        this.isSaving.set(false);
        this.loadProjects();
        if (!selectedId) {
          this.resetForm();
        }
      },
      error: () => {
        this.message.set('No se pudo guardar el proyecto.');
        this.toastService.error('Error al guardar', 'Ocurrio un problema. Intenta nuevamente.');
        this.isSaving.set(false);
      },
    });
  }

  remove(project: Project) {
    const confirmed = window.confirm(`Eliminar ${project.title}?`);

    if (!confirmed) {
      return;
    }

    this.projectsService.remove(project.id).subscribe({
      next: () => {
        this.message.set('Proyecto eliminado.');
        this.toastService.success('Exito', 'Proyecto eliminado correctamente.');
        this.loadProjects();
        if (this.selectedProjectId() === project.id) {
          this.resetForm();
        }
      },
      error: () => {
        this.message.set('No se pudo eliminar el proyecto.');
        this.toastService.error('Error al eliminar', 'Ocurrio un problema. Intenta nuevamente.');
      },
    });
  }

  addImage() {
    const projectId = this.selectedProjectId();

    if (!projectId) {
      this.toastService.info('Informacion', 'Selecciona un proyecto antes de agregar imagenes.');
      return;
    }

    if (this.imageForm.invalid) {
      this.imageForm.markAllAsTouched();
      this.toastService.warning('Atencion', 'Agrega una URL de imagen valida.');
      return;
    }

    this.projectsService.addImage(projectId, this.imageForm.getRawValue()).subscribe({
      next: () => {
        this.toastService.success('Exito', 'Imagen agregada correctamente.');
        this.imageForm.reset({ imageUrl: '', altText: '', sortOrder: 0 });
        this.loadProjects();
      },
      error: () => this.toastService.error('Error al guardar', 'No se pudo agregar la imagen.'),
    });
  }

  removeImage(imageId: string) {
    const projectId = this.selectedProjectId();

    if (!projectId) {
      return;
    }

    this.projectsService.removeImage(projectId, imageId).subscribe({
      next: () => {
        this.toastService.success('Exito', 'Imagen eliminada correctamente.');
        this.loadProjects();
      },
      error: () => this.toastService.error('Error al eliminar', 'No se pudo eliminar la imagen.'),
    });
  }

  linkTechnology() {
    const projectId = this.selectedProjectId();
    const technologyId = this.technologyForm.value.technologyId;

    if (!projectId) {
      this.toastService.info('Informacion', 'Selecciona un proyecto antes de asociar tecnologias.');
      return;
    }

    if (!technologyId) {
      this.toastService.warning('Atencion', 'Selecciona una tecnologia.');
      return;
    }

    this.projectsService.linkTechnology(projectId, technologyId).subscribe({
      next: () => {
        this.toastService.success('Exito', 'Tecnologia asociada correctamente.');
        this.technologyForm.reset({ technologyId: '' });
        this.loadProjects();
      },
      error: () => this.toastService.error('Error al guardar', 'No se pudo asociar la tecnologia.'),
    });
  }

  unlinkTechnology(technologyId: string) {
    const projectId = this.selectedProjectId();

    if (!projectId) {
      return;
    }

    this.projectsService.unlinkTechnology(projectId, technologyId).subscribe({
      next: () => {
        this.toastService.success('Exito', 'Tecnologia removida correctamente.');
        this.loadProjects();
      },
      error: () => this.toastService.error('Error al eliminar', 'No se pudo remover la tecnologia.'),
    });
  }

  createTechnology() {
    if (this.newTechnologyForm.invalid) {
      this.newTechnologyForm.markAllAsTouched();
      this.toastService.warning('Atencion', 'Agrega el nombre de la tecnologia.');
      return;
    }

    const selectedId = this.selectedTechnologyId();
    const request = selectedId
      ? this.projectsService.updateTechnology(selectedId, this.newTechnologyForm.getRawValue())
      : this.projectsService.createTechnology(this.newTechnologyForm.getRawValue());

    request.subscribe({
      next: () => {
        this.toastService.success(
          'Exito',
          selectedId ? 'Tecnologia actualizada correctamente.' : 'Tecnologia creada correctamente.',
        );
        this.resetTechnologyForm();
        this.loadTechnologies();
        this.loadProjects();
      },
      error: () => this.toastService.error('Error al guardar', 'No se pudo guardar la tecnologia.'),
    });
  }

  selectIcon(iconClass: string) {
    this.newTechnologyForm.patchValue({ iconClass });
  }

  selectTechnology(technology: Technology) {
    this.selectedTechnologyId.set(technology.id);
    this.newTechnologyForm.patchValue({
      name: technology.name,
      iconClass: technology.iconClass ?? '',
      category: technology.category ?? '',
    });
  }

  resetTechnologyForm() {
    this.selectedTechnologyId.set(null);
    this.newTechnologyForm.reset({ name: '', iconClass: '', category: '' });
  }

  removeTechnology(technology: Technology) {
    const confirmed = window.confirm(`Eliminar ${technology.name}?`);

    if (!confirmed) {
      return;
    }

    this.projectsService.removeTechnology(technology.id).subscribe({
      next: () => {
        this.toastService.success('Exito', 'Tecnologia eliminada correctamente.');
        if (this.selectedTechnologyId() === technology.id) {
          this.resetTechnologyForm();
        }
        this.loadTechnologies();
        this.loadProjects();
      },
      error: () =>
        this.toastService.error(
          'Error al eliminar',
          'No se pudo eliminar la tecnologia. Revisa si esta asociada a proyectos.',
        ),
    });
  }

  selectExperience(experience: Experience) {
    this.selectedExperienceId.set(experience.id);
    this.activeModule.set('experience');
    this.experienceForm.patchValue({
      company: experience.company,
      role: experience.role,
      description: experience.description ?? '',
      startDate: experience.startDate ?? '',
      endDate: experience.endDate ?? '',
      current: experience.current,
      location: experience.location ?? '',
      sortOrder: experience.sortOrder,
    });
    this.activeSection.set('experience-form');
  }

  resetExperienceForm() {
    this.selectedExperienceId.set(null);
    this.activeModule.set('experience');
    this.activeSection.set('experience-form');
    this.experienceForm.reset({
      company: '',
      role: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      sortOrder: 0,
    });
  }

  saveExperience() {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      this.toastService.warning('Atencion', 'Empresa y rol son requeridos.');
      return;
    }

    const selectedId = this.selectedExperienceId();
    const payload = this.toExperiencePayload();
    const request = selectedId
      ? this.experienceService.update(selectedId, payload)
      : this.experienceService.create(payload);

    this.isSaving.set(true);

    request.subscribe({
      next: () => {
        this.toastService.success(
          'Exito',
          selectedId ? 'Experiencia actualizada correctamente.' : 'Experiencia creada correctamente.',
        );
        this.isSaving.set(false);
        this.resetExperienceForm();
        this.loadExperience();
      },
      error: () => {
        this.toastService.error('Error al guardar', 'No se pudo guardar la experiencia.');
        this.isSaving.set(false);
      },
    });
  }

  removeExperience(experience: Experience) {
    const confirmed = window.confirm(`Eliminar ${experience.role} en ${experience.company}?`);

    if (!confirmed) {
      return;
    }

    this.experienceService.remove(experience.id).subscribe({
      next: () => {
        this.toastService.success('Exito', 'Experiencia eliminada correctamente.');
        if (this.selectedExperienceId() === experience.id) {
          this.resetExperienceForm();
        }
        this.loadExperience();
      },
      error: () => this.toastService.error('Error al eliminar', 'No se pudo eliminar la experiencia.'),
    });
  }

  experiencePeriod(experience: Experience) {
    const start = experience.startDate || 'Sin inicio';
    const end = experience.current ? 'Actualidad' : experience.endDate || 'Sin fin';

    return `${start} - ${end}`;
  }

  private toExperiencePayload() {
    const payload = this.experienceForm.getRawValue();

    return {
      company: payload.company,
      role: payload.role,
      description: payload.description || undefined,
      startDate: payload.startDate || undefined,
      endDate: payload.current ? undefined : payload.endDate || undefined,
      current: payload.current,
      location: payload.location || undefined,
      sortOrder: payload.sortOrder,
    };
  }

  imageUrl(image: NonNullable<Project['images']>[number]) {
    return image.imageUrl ?? image.image_url ?? '';
  }

  imageAlt(image: NonNullable<Project['images']>[number]) {
    return image.altText ?? image.alt_text ?? 'Imagen del proyecto';
  }

  logout() {
    this.authService.logout();
    this.toastService.info('Informacion', 'Sesion cerrada.');
    void this.router.navigate(['/admin/login']);
  }
}
