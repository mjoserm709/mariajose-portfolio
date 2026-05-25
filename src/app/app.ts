import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CursorGlowComponent } from './shared/animations/cursor-glow.component';
import { ScrollProgressComponent } from './shared/animations/scroll-progress.component';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [CursorGlowComponent, RouterOutlet, ScrollProgressComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
