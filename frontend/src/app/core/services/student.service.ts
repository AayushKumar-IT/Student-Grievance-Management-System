import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  getStudentsByCollege(collegeId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/college/${collegeId}`);
  }

  getMyProfile(): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/profile`);
  }
}
