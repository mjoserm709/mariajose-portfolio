import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { AdminLoginComponent } from './pages/admin-login/admin-login';
import { AdminExperienceComponent } from './pages/admin-experience/admin-experience';
import { AdminProjectsComponent } from './pages/admin-projects/admin-projects';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
  },
  {
    path: 'admin/projects',
    component: AdminProjectsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/experience',
    component: AdminExperienceComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    redirectTo: 'admin/projects',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
