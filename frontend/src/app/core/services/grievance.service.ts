import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrievanceRequest, GrievanceResponse } from '../models/grievance.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GrievanceService {
  private readonly apiUrl = `${environment.apiUrl}/grievances`;

  constructor(private http: HttpClient) {}

  submitGrievance(request: GrievanceRequest, files?: File[]): Observable<GrievanceResponse> {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('grievance', blob);
    if (files) files.forEach(f => formData.append('files', f));
    return this.http.post<GrievanceResponse>(this.apiUrl, formData);
  }

  getAllGrievances(): Observable<GrievanceResponse[]> {
    return this.http.get<GrievanceResponse[]>(this.apiUrl);
  }

  getGrievanceById(id: number): Observable<GrievanceResponse> {
    return this.http.get<GrievanceResponse>(`${this.apiUrl}/${id}`);
  }

  getMyGrievances(): Observable<GrievanceResponse[]> {
    return this.http.get<GrievanceResponse[]>(`${this.apiUrl}/my`);
  }

  getAssignedGrievances(): Observable<GrievanceResponse[]> {
    return this.http.get<GrievanceResponse[]>(`${this.apiUrl}/assigned`);
  }

  getCommonGrievances(): Observable<GrievanceResponse[]> {
    return this.http.get<GrievanceResponse[]>(`${this.apiUrl}/common`);
  }

  updateGrievance(id: number, request: GrievanceRequest): Observable<GrievanceResponse> {
    return this.http.put<GrievanceResponse>(`${this.apiUrl}/${id}`, request);
  }

  updateStatus(id: number, status: string, note?: string): Observable<GrievanceResponse> {
    const params: any = { status };
    if (note) params['note'] = note;
    return this.http.patch<GrievanceResponse>(`${this.apiUrl}/${id}/status`, null, { params });
  }
}
