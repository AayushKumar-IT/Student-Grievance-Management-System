import { User } from './user.model';
import { College } from './college.model';

export interface Student {
  id: number;
  user: User;
  enrollmentNumber: string;
  phoneNumber: string;
  college: College;
  department: { id: number; name: string; code: string };
  year: string;
  section: string;
}

export interface StudentRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  enrollmentNumber: string;
  phoneNumber: string;
  collegeId: number;
  departmentId: number;
  year: string;
  section: string;
  registrationToken: string;
}
