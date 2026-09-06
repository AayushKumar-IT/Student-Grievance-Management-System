import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DashboardCardComponent } from '../../shared/components/dashboard-card/dashboard-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent,
            DashboardCardComponent, LoadingSpinnerComponent],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  stats:   any = {};
  reports: any = {};
  loading = true;
  userName = '';

  constructor(private superAdminService: SuperAdminService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user ? `${user.firstName} ${user.lastName}` : '';
    this.superAdminService.getDashboardStats().subscribe({
      next:  s => { this.stats = s; this.loading = false; },
      error: () => this.loading = false
    });
    this.superAdminService.getSystemReports().subscribe({
      next: r => this.reports = r
    });
  }
}
