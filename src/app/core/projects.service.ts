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
  images?: ProjectImage[];
  technologies?: Technology[];
}

export type ProjectPayload = Omit<Project, 'id' | 'images' | 'technologies'>;

export interface ProjectImage {
  id: string;
  image_url?: string;
  imageUrl?: string;
  alt_text?: string;
  altText?: string;
  sort_order?: number;
  sortOrder?: number;
}

export interface Technology {
  id: string;
  name: string;
  iconClass?: string;
  category?: string;
}

export interface ProjectImagePayload {
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
}

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

  findTechnologies() {
    return this.http.get<Technology[]>('/api/technologies');
  }

  createTechnology(technology: Omit<Technology, 'id'>) {
    return this.http.post<Technology>('/api/technologies', technology);
  }

  addImage(projectId: string, image: ProjectImagePayload) {
    return this.http.post<ProjectImage>(`/api/projects/${projectId}/images`, image);
  }

  removeImage(projectId: string, imageId: string) {
    return this.http.delete<{ id: string; deleted: boolean }>(
      `/api/projects/${projectId}/images/${imageId}`,
    );
  }

  linkTechnology(projectId: string, technologyId: string) {
    return this.http.post(`/api/projects/${projectId}/technologies`, { technologyId });
  }

  unlinkTechnology(projectId: string, technologyId: string) {
    return this.http.delete<{ projectId: string; technologyId: string; deleted: boolean }>(
      `/api/projects/${projectId}/technologies/${technologyId}`,
    );
  }
}
