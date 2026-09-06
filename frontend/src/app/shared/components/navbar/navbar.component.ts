import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: LoginResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  logout(): void {
    this.authService.logout();
  }

  getDashboardRoute(): string {
    const role = this.currentUser?.role;
    const map: Record<string, string> = {
      STUDENT: '/student/dashboard',
      FACULTY: '/faculty/dashboard',
      COLLEGE_ADMIN: '/college-admin/dashboard',
      SUPER_ADMIN: '/super-admin/dashboard'
    };
    return role ? map[role] : '/auth/login';
  }
}
