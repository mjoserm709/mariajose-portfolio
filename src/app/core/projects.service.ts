import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  githubUrl?: string;
  demoUrl?: string;
  status: string;
  featured: boolean;
  sortOrder: number;
}

export type ProjectPayload = Omit<Project, 'id'>;

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private readonly http: HttpClient) {}

  findAllAdmin() {
    return this.http.get<Project[]>('/api/projects/admin');
  }

  create(project: ProjectPayload) {
    return this.http.post<Project>('/api/projects', project);
  }

  update(id: string, project: Partial<ProjectPayload>) {
    return this.http.put<Project>(`/api/projects/${id}`, project);
  }

  remove(id: string) {
    return this.http.delete<{ id: string; deleted: boolean }>(`/api/projects/${id}`);
  }
}
