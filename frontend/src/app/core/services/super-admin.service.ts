import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { College } from '../models/college.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private readonly apiUrl = `${environment.apiUrl}/super-admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  getAllColleges(): Observable<College[]> {
    return this.http.get<College[]>(`${this.apiUrl}/colleges`);
  }

  createCollege(college: Partial<College>): Observable<College> {
    return this.http.post<College>(`${this.apiUrl}/colleges`, college);
  }

  updateCollege(id: number, college: Partial<College>): Observable<College> {
    return this.http.put<College>(`${this.apiUrl}/colleges/${id}`, college);
  }

  deleteCollege(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/colleges/${id}`);
  }

  getAllFaculty(collegeId?: number, departmentId?: number): Observable<any[]> {
    let params: any = {};
    if (collegeId)    params['collegeId']    = String(collegeId);
    if (departmentId) params['departmentId'] = String(departmentId);
    return this.http.get<any[]>(`${this.apiUrl}/faculty`, { params });
  }

  getAllStudents(collegeId?: number, departmentId?: number): Observable<any[]> {
    let params: any = {};
    if (collegeId)    params['collegeId']    = String(collegeId);
    if (departmentId) params['departmentId'] = String(departmentId);
    return this.http.get<any[]>(`${this.apiUrl}/students`, { params });
  }

  getDepartmentsByCollege(collegeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departments`, { params: { collegeId: String(collegeId) } });
  }

  getSystemReports(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports`);
  }

  generateToken(role: string, collegeId?: number): Observable<any> {
    const params: any = { role };
    if (collegeId) params['collegeId'] = String(collegeId);
    return this.http.post<any>(`${environment.apiUrl}/tokens/generate`, null, { params });
  }

  getAllTokens(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/tokens`);
  }
}
