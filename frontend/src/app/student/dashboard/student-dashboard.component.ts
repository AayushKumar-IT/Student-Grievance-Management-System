import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { AuthService } from '../../core/services/auth.service';
import { GrievanceResponse, GrievanceStatus } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DashboardCardComponent } from '../../shared/components/dashboard-card/dashboard-card.component';
import { GrievanceCardComponent } from '../../shared/components/grievance-card/grievance-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent,
            DashboardCardComponent, GrievanceCardComponent, LoadingSpinnerComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  grievances: GrievanceResponse[] = [];
  loading = true;
  userName = '';

  get totalGrievances() { return this.grievances.length; }
  get pendingGrievances() { return this.grievances.filter(g => g.status !== 'RESOLVED' && g.status !== 'REJECTED').length; }
  get resolvedGrievances() { return this.grievances.filter(g => g.status === 'RESOLVED').length; }
  get recentGrievances() { return this.grievances.slice(0, 3); }

  constructor(private grievanceService: GrievanceService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user ? `${user.firstName} ${user.lastName}` : '';
    this.grievanceService.getMyGrievances().subscribe({
      next: data => { this.grievances = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  goToDetails(id: number): void {
    this.router.navigate(['/student/grievance', id]);
  }
}
