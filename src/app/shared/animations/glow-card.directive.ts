import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appGlowCard]',
})
export class GlowCardDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    this.elementRef.nativeElement.classList.add('interactive-glow');
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();

    element.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
    element.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
  }
}
