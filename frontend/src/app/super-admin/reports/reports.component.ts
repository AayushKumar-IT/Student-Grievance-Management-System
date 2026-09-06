import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DashboardCardComponent } from '../../shared/components/dashboard-card/dashboard-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent,
            DashboardCardComponent, LoadingSpinnerComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: any = {};
  stats:   any = {};
  loading = true;
  error   = '';

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    this.superAdminService.getSystemReports().subscribe({
      next:  r => { this.reports = r; },
      error: () => this.error = 'Failed to load reports.'
    });
    this.superAdminService.getDashboardStats().subscribe({
      next:  s => { this.stats = s; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get resolutionRate(): string {
    const total    = this.reports.totalGrievances    ?? 0;
    const resolved = this.reports.resolvedGrievances ?? 0;
    if (!total) return '0%';
    return `${Math.round((resolved / total) * 100)}%`;
  }
}
