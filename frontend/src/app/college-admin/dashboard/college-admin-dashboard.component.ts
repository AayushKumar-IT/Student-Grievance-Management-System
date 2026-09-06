import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CollegeAdminService } from '../../core/services/college-admin.service';
import { AuthService } from '../../core/services/auth.service';
import { GrievanceResponse } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DashboardCardComponent } from '../../shared/components/dashboard-card/dashboard-card.component';
import { GrievanceCardComponent } from '../../shared/components/grievance-card/grievance-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-college-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent,
            DashboardCardComponent, GrievanceCardComponent, LoadingSpinnerComponent],
  templateUrl: './college-admin-dashboard.component.html',
  styleUrls: ['./college-admin-dashboard.component.css']
})
export class CollegeAdminDashboardComponent implements OnInit {
  stats: any = {};
  grievances: GrievanceResponse[] = [];
  loading = true;
  userName = '';

  get total()    { return this.stats.totalGrievances    ?? 0; }
  get pending()  { return this.stats.pendingGrievances  ?? 0; }
  get resolved() { return this.stats.resolvedGrievances ?? 0; }
  get students() { return this.stats.totalStudents      ?? 0; }
  get faculty()  { return this.stats.totalFaculty       ?? 0; }
  get recent()   { return this.grievances.slice(0, 4); }

  constructor(
    private collegeAdminService: CollegeAdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user ? `${user.firstName} ${user.lastName}` : '';
    this.collegeAdminService.getDashboardStats().subscribe({
      next: s => { this.stats = s; this.loading = false; },
      error: () => this.loading = false
    });
    this.collegeAdminService.getCollegeGrievances().subscribe({
      next: data => this.grievances = data.slice(0, 4)
    });
  }

  goToGrievance(id: number): void { this.router.navigate(['/college-admin/grievance-management']); }
}
