import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  template: `<div class="scroll-progress" [style.transform]="'scaleX(' + progress() + ')'"></div>`,
})
export class ScrollProgressComponent {
  readonly progress = signal(0);

  @HostListener('window:scroll')
  onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const value = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    this.progress.set(Math.min(Math.max(value, 0), 1));
  }
}
