import { Component, computed, inject } from '@angular/core';
import { Toast, ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  readonly toasts = computed(() => this.toastService.toasts());

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }

  icon(type: ToastType) {
    const icons: Record<ToastType, string> = {
      success: 'check',
      error: 'slash',
      warning: 'warning',
      info: 'info',
    };

    return icons[type];
  }

  label(toast: Toast) {
    return `${toast.type}: ${toast.title}`;
  }
}
