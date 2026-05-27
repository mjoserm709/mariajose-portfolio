import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project, Technology } from './projects.service';
import { API_BASE_URL } from './api.config';

export interface Profile {
  id: string;
  fullName: string;
  title?: string;
  bio?: string;
  location?: string;
  email?: string;
  whatsapp?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  avatarUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  location?: string;
  sortOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  level?: number;
  sortOrder: number;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  constructor(private readonly http: HttpClient) {}

  findProjects() {
    return this.http.get<Project[]>(`${API_BASE_URL}/projects`);
  }

  findTechnologies() {
    return this.http.get<Technology[]>(`${API_BASE_URL}/technologies`);
  }

  getProfile() {
    return this.http.get<Profile | null>(`${API_BASE_URL}/portfolio/profile`);
  }

  getExperience() {
    return this.http.get<Experience[]>(`${API_BASE_URL}/experience`);
  }

  getSkills() {
    return this.http.get<Skill[]>(`${API_BASE_URL}/portfolio/skills`);
  }
}
