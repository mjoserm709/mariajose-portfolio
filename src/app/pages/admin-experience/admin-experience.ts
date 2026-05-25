import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ExperienceService } from '../../core/experience.service';
import { Experience } from '../../core/portfolio.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-experience',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-experience.html',
})
export class AdminExperienceComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly experienceService = inject(ExperienceService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly experience = signal<Experience[]>([]);
  readonly selectedExperienceId = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly isEditing = computed(() => Boolean(this.selectedExperienceId()));

  readonly form = this.formBuilder.nonNullable.group({
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
  }

  loadExperience() {
    this.isLoading.set(true);
    this.experienceService.findAllAdmin().subscribe({
      next: (experience) => {
        this.experience.set(experience);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Error al cargar', 'No se pudo obtener la experiencia.');
        this.isLoading.set(false);
      },
    });
  }

  selectExperience(experience: Experience) {
    this.selectedExperienceId.set(experience.id);
    this.form.patchValue({
      company: experience.company,
      role: experience.role,
      description: experience.description ?? '',
      startDate: experience.startDate ?? '',
      endDate: experience.endDate ?? '',
      current: experience.current,
      location: experience.location ?? '',
      sortOrder: experience.sortOrder,
    });
  }

  resetForm() {
    this.selectedExperienceId.set(null);
    this.form.reset({
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

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
        this.resetForm();
        this.loadExperience();
      },
      error: () => {
        this.toastService.error('Error al guardar', 'No se pudo guardar la experiencia.');
        this.isSaving.set(false);
      },
    });
  }

  remove(experience: Experience) {
    const confirmed = window.confirm(`Eliminar ${experience.role} en ${experience.company}?`);

    if (!confirmed) {
      return;
    }

    this.experienceService.remove(experience.id).subscribe({
      next: () => {
        this.toastService.success('Exito', 'Experiencia eliminada correctamente.');
        if (this.selectedExperienceId() === experience.id) {
          this.resetForm();
        }
        this.loadExperience();
      },
      error: () => this.toastService.error('Error al eliminar', 'No se pudo eliminar la experiencia.'),
    });
  }

  period(experience: Experience) {
    const start = experience.startDate || 'Sin inicio';
    const end = experience.current ? 'Actualidad' : experience.endDate || 'Sin fin';

    return `${start} - ${end}`;
  }

  logout() {
    this.authService.logout();
    this.toastService.info('Informacion', 'Sesion cerrada.');
    void this.router.navigate(['/admin/login']);
  }

  private toExperiencePayload() {
    const payload = this.form.getRawValue();

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
}
