import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, Role } from '../models/user.model';
import { StudentRegistrationRequest } from '../models/student.model';
import { FacultyRegistrationRequest } from '../models/faculty.model';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    const saved = this.tokenService.getUser();
    if (saved) this.currentUserSubject.next(saved);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  registerStudent(request: StudentRegistrationRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register/student`, request).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  registerFaculty(request: FacultyRegistrationRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register/faculty`, request).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  registerCollegeAdmin(request: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register/college-admin`, request).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  setupSuperAdmin(request: { email: string; password: string; firstName: string; lastName: string; phoneNumber: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/setup`, request).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  getUserRole(): Role | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  navigateToDashboard(): void {
    const role = this.getUserRole();
    const map: Record<Role, string> = {
      STUDENT: '/student/dashboard',
      FACULTY: '/faculty/dashboard',
      COLLEGE_ADMIN: '/college-admin/dashboard',
      SUPER_ADMIN: '/super-admin/dashboard'
    };
    if (role) this.router.navigate([map[role]]);
  }

  private handleAuth(response: LoginResponse): void {
    this.tokenService.setToken(response.token);
    this.tokenService.setUser(response);
    this.currentUserSubject.next(response);
  }
}
