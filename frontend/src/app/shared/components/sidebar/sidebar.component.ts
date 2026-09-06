import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  navItems: NavItem[] = [];
  userRole: Role | null = null;

  private navMap: Record<Role, NavItem[]> = {
    STUDENT: [
      { label: 'Dashboard',          icon: 'fas fa-home',          route: '/student/dashboard' },
      { label: 'Submit Grievance',   icon: 'fas fa-plus-circle',   route: '/student/submit-grievance' },
      { label: 'My Grievances',      icon: 'fas fa-list',          route: '/student/my-grievances' },
      { label: 'Common Grievances',  icon: 'fas fa-users',         route: '/student/common-grievances' }
    ],
    FACULTY: [
      { label: 'Dashboard',          icon: 'fas fa-home',          route: '/faculty/dashboard' },
      { label: 'Assigned Grievances',icon: 'fas fa-tasks',         route: '/faculty/assigned-grievances' },
      { label: 'Incident Validation',icon: 'fas fa-check-circle',  route: '/faculty/incident-validation' }
    ],
    COLLEGE_ADMIN: [
      { label: 'Dashboard',          icon: 'fas fa-home',          route: '/college-admin/dashboard' },
      { label: 'Grievance Mgmt',     icon: 'fas fa-clipboard-list',route: '/college-admin/grievance-management' },
      { label: 'Faculty Mgmt',       icon: 'fas fa-chalkboard-teacher', route: '/college-admin/faculty-management' },
      { label: 'Student Mgmt',       icon: 'fas fa-user-graduate', route: '/college-admin/student-management' },
      { label: 'Department Mgmt',    icon: 'fas fa-building',      route: '/college-admin/department-management' },
      { label: 'Resolver Mgmt',      icon: 'fas fa-user-shield',   route: '/college-admin/resolver-management' }
    ],
    SUPER_ADMIN: [
      { label: 'Dashboard',          icon: 'fas fa-home',          route: '/super-admin/dashboard' },
      { label: 'College Mgmt',       icon: 'fas fa-university',    route: '/super-admin/college-management' },
      { label: 'Faculty Records',    icon: 'fas fa-chalkboard-teacher', route: '/super-admin/faculty-records' },
      { label: 'Student Records',    icon: 'fas fa-user-graduate', route: '/super-admin/student-records' },
      { label: 'Token Generator',    icon: 'fas fa-key',           route: '/super-admin/token-generator' },
      { label: 'Reports',            icon: 'fas fa-chart-bar',     route: '/super-admin/reports' }
    ]
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userRole = user?.role ?? null;
      this.navItems = this.userRole ? this.navMap[this.userRole] : [];
    });
  }
}
