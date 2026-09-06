import { User } from './user.model';
import { College } from './college.model';

export interface Faculty {
  id: number;
  user: User;
  employeeId: string;
  phoneNumber: string;
  college: College;
  department: { id: number; name: string; code: string };
  designation: string;
  isGrievanceResolver: boolean;
}

export interface FacultyRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  phoneNumber: string;
  collegeId: number;
  departmentId: number;
  designation: string;
  registrationToken: string;
}
