import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty } from '../models/faculty.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FacultyService {
  private readonly apiUrl = `${environment.apiUrl}/faculty`;

  constructor(private http: HttpClient) {}

  getAllFaculty(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.apiUrl);
  }

  getFacultyById(id: number): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.apiUrl}/${id}`);
  }

  getFacultyByCollege(collegeId: number): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`${this.apiUrl}/college/${collegeId}`);
  }

  getMyProfile(): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.apiUrl}/profile`);
  }

  toggleResolverStatus(id: number, isResolver: boolean): Observable<Faculty> {
    return this.http.patch<Faculty>(`${this.apiUrl}/${id}/resolver`, null, {
      params: { isResolver: String(isResolver) }
    });
  }
}
