import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Project, ProjectsService } from '../../core/projects.service';
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
  readonly selectedProjectId = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly message = signal('');
  readonly isEditing = computed(() => Boolean(this.selectedProjectId()));

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

  ngOnInit() {
    this.loadProjects();
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

  selectProject(project: Project) {
    this.selectedProjectId.set(project.id);
    this.form.patchValue(project);
  }

  resetForm() {
    this.selectedProjectId.set(null);
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
        this.resetForm();
        this.loadProjects();
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

  logout() {
    this.authService.logout();
    this.toastService.info('Informacion', 'Sesion cerrada.');
    void this.router.navigate(['/admin/login']);
  }
}
