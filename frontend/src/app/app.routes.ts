import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent),
    pathMatch: 'full'
  },

  // Auth routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register/student',
        loadComponent: () => import('./auth/student-register/student-register.component').then(m => m.StudentRegisterComponent)
      },
      {
        path: 'register/faculty',
        loadComponent: () => import('./auth/faculty-register/faculty-register.component').then(m => m.FacultyRegisterComponent)
      },
      {
        path: 'register/college-admin',
        loadComponent: () => import('./auth/college-admin-register/college-admin-register.component').then(m => m.CollegeAdminRegisterComponent)
      },
      {
        path: 'setup',
        loadComponent: () => import('./auth/super-admin-setup/super-admin-setup.component').then(m => m.SuperAdminSetupComponent)
      }
    ]
  },

  // Student routes
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./student/dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'submit-grievance',
        loadComponent: () => import('./student/submit-grievance/submit-grievance.component').then(m => m.SubmitGrievanceComponent)
      },
      {
        path: 'my-grievances',
        loadComponent: () => import('./student/my-grievances/my-grievances.component').then(m => m.MyGrievancesComponent)
      },
      {
        path: 'grievance/:id',
        loadComponent: () => import('./student/grievance-details/grievance-details.component').then(m => m.GrievanceDetailsComponent)
      },
      {
        path: 'grievance/:id/edit',
        loadComponent: () => import('./student/edit-grievance/edit-grievance.component').then(m => m.EditGrievanceComponent)
      },
      {
        path: 'common-grievances',
        loadComponent: () => import('./student/common-grievances/common-grievances.component').then(m => m.CommonGrievancesComponent)
      }
    ]
  },

  // Faculty routes
  {
    path: 'faculty',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['FACULTY'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./faculty/dashboard/faculty-dashboard.component').then(m => m.FacultyDashboardComponent)
      },
      {
        path: 'assigned-grievances',
        loadComponent: () => import('./faculty/assigned-grievances/assigned-grievances.component').then(m => m.AssignedGrievancesComponent)
      },
      {
        path: 'grievance-review/:id',
        loadComponent: () => import('./faculty/grievance-review/grievance-review.component').then(m => m.GrievanceReviewComponent)
      },
      {
        path: 'incident-validation',
        loadComponent: () => import('./faculty/incident-validation/incident-validation.component').then(m => m.IncidentValidationComponent)
      }
    ]
  },

  // College Admin routes
  {
    path: 'college-admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['COLLEGE_ADMIN'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./college-admin/dashboard/college-admin-dashboard.component').then(m => m.CollegeAdminDashboardComponent)
      },
      {
        path: 'faculty-management',
        loadComponent: () => import('./college-admin/faculty-management/faculty-management.component').then(m => m.FacultyManagementComponent)
      },
      {
        path: 'student-management',
        loadComponent: () => import('./college-admin/student-management/student-management.component').then(m => m.StudentManagementComponent)
      },
      {
        path: 'department-management',
        loadComponent: () => import('./college-admin/department-management/department-management.component').then(m => m.DepartmentManagementComponent)
      },
      {
        path: 'grievance-management',
        loadComponent: () => import('./college-admin/grievance-management/grievance-management.component').then(m => m.GrievanceManagementComponent)
      },
      {
        path: 'resolver-management',
        loadComponent: () => import('./college-admin/resolver-management/resolver-management.component').then(m => m.ResolverManagementComponent)
      }
    ]
  },

  // Super Admin routes
  {
    path: 'super-admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./super-admin/dashboard/super-admin-dashboard.component').then(m => m.SuperAdminDashboardComponent)
      },
      {
        path: 'college-management',
        loadComponent: () => import('./super-admin/college-management/college-management.component').then(m => m.CollegeManagementComponent)
      },
      {
        path: 'faculty-records',
        loadComponent: () => import('./super-admin/faculty-records/faculty-records.component').then(m => m.FacultyRecordsComponent)
      },
      {
        path: 'student-records',
        loadComponent: () => import('./super-admin/student-records/student-records.component').then(m => m.StudentRecordsComponent)
      },
      {
        path: 'token-generator',
        loadComponent: () => import('./super-admin/token-generator/token-generator.component').then(m => m.TokenGeneratorComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./super-admin/reports/reports.component').then(m => m.ReportsComponent)
      }
    ]
  },

  { path: '**', redirectTo: '/auth/login' }
];
