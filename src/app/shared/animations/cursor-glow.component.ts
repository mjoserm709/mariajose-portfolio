import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-cursor-glow',
  template: `<div class="cursor-glow" [style.transform]="transform()"></div>`,
})
export class CursorGlowComponent {
  readonly transform = signal('translate3d(-999px, -999px, 0)');

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    this.transform.set(`translate3d(${event.clientX - 160}px, ${event.clientY - 160}px, 0)`);
  }
}
