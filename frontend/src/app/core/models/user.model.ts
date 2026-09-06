export type Role = 'STUDENT' | 'FACULTY' | 'COLLEGE_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email?: string;       // used for email-mode login
  collegeId?: string;   // used for college-ID-mode login (enrollmentNumber or employeeId)
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  userId: number;
}
