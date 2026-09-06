import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: Role[] = route.data['roles'];
  const userRole = authService.getUserRole();

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // Redirect to the user's own dashboard
  const dashboardMap: Record<Role, string> = {
    STUDENT: '/student/dashboard',
    FACULTY: '/faculty/dashboard',
    COLLEGE_ADMIN: '/college-admin/dashboard',
    SUPER_ADMIN: '/super-admin/dashboard'
  };

  if (userRole) {
    router.navigate([dashboardMap[userRole]]);
  } else {
    router.navigate(['/auth/login']);
  }
  return false;
};
