import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Project, ProjectsService, Technology } from '../../core/projects.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-projects',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-projects.html',
})
export class AdminProjectsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly projects = signal<Project[]>([]);
  readonly technologies = signal<Technology[]>([]);
  readonly selectedProjectId = signal<string | null>(null);
  readonly activeSection = signal<'list' | 'details' | 'technologies' | 'images'>('list');
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly message = signal('');
  readonly iconSearch = signal('');
  readonly isEditing = computed(() => Boolean(this.selectedProjectId()));
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
    { name: 'PostgreSQL', className: 'devicon-postgresql-plain colored' },
    { name: 'SQL Server', className: 'devicon-microsoftsqlserver-plain colored' },
    { name: 'Docker', className: 'devicon-docker-plain colored' },
    { name: 'Git', className: 'devicon-git-plain colored' },
    { name: 'GitHub', className: 'devicon-github-original' },
    { name: 'Python', className: 'devicon-python-plain colored' },
    { name: 'PHP', className: 'devicon-php-plain colored' },
    { name: 'Laravel', className: 'devicon-laravel-original colored' },
    { name: 'Bootstrap', className: 'devicon-bootstrap-plain colored' },
    { name: 'Tailwind CSS', className: 'devicon-tailwindcss-original colored' },
    { name: 'HTML5', className: 'devicon-html5-plain colored' },
    { name: 'CSS3', className: 'devicon-css3-plain colored' },
    { name: 'Sass', className: 'devicon-sass-original colored' },
    { name: 'React', className: 'devicon-react-original colored' },
    { name: 'Vue', className: 'devicon-vuejs-plain colored' },
    { name: 'Vite', className: 'devicon-vitejs-plain colored' },
    { name: 'Firebase', className: 'devicon-firebase-plain colored' },
    { name: 'Supabase', className: 'devicon-supabase-plain colored' },
    { name: 'Vercel', className: 'devicon-vercel-original' },
    { name: 'Linux', className: 'devicon-linux-plain' },
    { name: 'Windows', className: 'devicon-windows11-original colored' },
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

  ngOnInit() {
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

  showSection(section: 'list' | 'details' | 'technologies' | 'images') {
    if ((section === 'technologies' || section === 'images') && !this.selectedProjectId()) {
      this.toastService.info('Informacion', 'Selecciona o crea un proyecto primero.');
      this.activeSection.set('details');
      return;
    }

    this.activeSection.set(section);
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

    this.projectsService.createTechnology(this.newTechnologyForm.getRawValue()).subscribe({
      next: () => {
        this.toastService.success('Exito', 'Tecnologia creada correctamente.');
        this.newTechnologyForm.reset({ name: '', iconClass: '', category: '' });
        this.loadTechnologies();
      },
      error: () => this.toastService.error('Error al guardar', 'No se pudo crear la tecnologia.'),
    });
  }

  selectIcon(iconClass: string) {
    this.newTechnologyForm.patchValue({ iconClass });
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
