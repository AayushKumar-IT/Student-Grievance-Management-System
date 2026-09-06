import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evidence } from '../models/evidence.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EvidenceService {
  private readonly apiUrl = `${environment.apiUrl}/evidence`;

  constructor(private http: HttpClient) {}

  uploadEvidence(grievanceId: number, files: File[]): Observable<Evidence[]> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    return this.http.post<Evidence[]>(`${this.apiUrl}/grievance/${grievanceId}`, formData);
  }

  getEvidenceByGrievance(grievanceId: number): Observable<Evidence[]> {
    return this.http.get<Evidence[]>(`${this.apiUrl}/grievance/${grievanceId}`);
  }

  downloadEvidence(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  deleteEvidence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
