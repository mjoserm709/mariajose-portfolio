import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Experience } from './portfolio.service';
import { API_BASE_URL } from './api.config';

export type ExperiencePayload = Omit<Experience, 'id'>;

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  constructor(private readonly http: HttpClient) {}

  findAllAdmin() {
    return this.http.get<Experience[]>(`${API_BASE_URL}/experience/admin`);
  }

  create(experience: ExperiencePayload) {
    return this.http.post<Experience>(`${API_BASE_URL}/experience`, experience);
  }

  update(id: string, experience: Partial<ExperiencePayload>) {
    return this.http.put<Experience>(`${API_BASE_URL}/experience/${id}`, experience);
  }

  remove(id: string) {
    return this.http.delete<{ id: string; deleted: boolean }>(`${API_BASE_URL}/experience/${id}`);
  }
}
