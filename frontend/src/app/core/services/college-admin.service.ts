import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Department } from '../models/college.model';
import { Faculty } from '../models/faculty.model';
import { Student } from '../models/student.model';
import { GrievanceResponse } from '../models/grievance.model';

@Injectable({ providedIn: 'root' })
export class CollegeAdminService {
  private readonly apiUrl = `${environment.apiUrl}/college-admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  createDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departments`, department);
  }

  getCollegeFaculty(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`${this.apiUrl}/faculty`);
  }

  getCollegeStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }

  getCollegeGrievances(): Observable<GrievanceResponse[]> {
    return this.http.get<GrievanceResponse[]>(`${this.apiUrl}/grievances`);
  }

  assignGrievance(grievanceId: number, facultyId: number): Observable<GrievanceResponse> {
    return this.http.post<GrievanceResponse>(`${this.apiUrl}/grievances/${grievanceId}/assign`, null, {
      params: { facultyId: String(facultyId) }
    });
  }
}
