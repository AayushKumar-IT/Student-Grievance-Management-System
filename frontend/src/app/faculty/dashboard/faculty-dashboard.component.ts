import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { FacultyService } from '../../core/services/faculty.service';
import { AuthService } from '../../core/services/auth.service';
import { GrievanceResponse } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DashboardCardComponent } from '../../shared/components/dashboard-card/dashboard-card.component';
import { GrievanceCardComponent } from '../../shared/components/grievance-card/grievance-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent,
            DashboardCardComponent, GrievanceCardComponent, LoadingSpinnerComponent],
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css']
})
export class FacultyDashboardComponent implements OnInit {
  grievances: GrievanceResponse[] = [];
  loading = true;
  userName = '';

  get total()      { return this.grievances.length; }
  get pending()    { return this.grievances.filter(g => g.status === 'ASSIGNED' || g.status === 'IN_PROGRESS').length; }
  get resolved()   { return this.grievances.filter(g => g.status === 'RESOLVED').length; }
  get recent()     { return this.grievances.slice(0, 4); }

  constructor(
    private grievanceService: GrievanceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user ? `${user.firstName} ${user.lastName}` : '';
    this.grievanceService.getAssignedGrievances().subscribe({
      next:  data => { this.grievances = data; this.loading = false; },
      error: ()   => this.loading = false
    });
  }

  goToReview(id: number): void { this.router.navigate(['/faculty/grievance-review', id]); }
}
