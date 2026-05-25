import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Experience } from './portfolio.service';

export type ExperiencePayload = Omit<Experience, 'id'>;

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  constructor(private readonly http: HttpClient) {}

  findAllAdmin() {
    return this.http.get<Experience[]>('/api/experience/admin');
  }

  create(experience: ExperiencePayload) {
    return this.http.post<Experience>('/api/experience', experience);
  }

  update(id: string, experience: Partial<ExperiencePayload>) {
    return this.http.put<Experience>(`/api/experience/${id}`, experience);
  }

  remove(id: string) {
    return this.http.delete<{ id: string; deleted: boolean }>(`/api/experience/${id}`);
  }
}
