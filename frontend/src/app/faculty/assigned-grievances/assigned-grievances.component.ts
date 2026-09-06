import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { GrievanceResponse, GrievanceStatus } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { GrievanceCardComponent } from '../../shared/components/grievance-card/grievance-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-assigned-grievances',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, SidebarComponent,
            GrievanceCardComponent, LoadingSpinnerComponent, StatusBadgeComponent],
  templateUrl: './assigned-grievances.component.html',
  styleUrls: ['./assigned-grievances.component.css']
})
export class AssignedGrievancesComponent implements OnInit {
  grievances: GrievanceResponse[] = [];
  filtered:   GrievanceResponse[] = [];
  loading = true;
  error   = '';
  searchTerm   = '';
  statusFilter = '';
  statuses: GrievanceStatus[] = ['ASSIGNED','IN_PROGRESS','RESOLVED','REJECTED'];

  constructor(private grievanceService: GrievanceService, private router: Router) {}

  ngOnInit(): void {
    this.grievanceService.getAssignedGrievances().subscribe({
      next:  data => { this.grievances = data; this.applyFilters(); this.loading = false; },
      error: ()   => { this.error = 'Failed to load grievances.'; this.loading = false; }
    });
  }

  applyFilters(): void {
    this.filtered = this.grievances.filter(g =>
      (!this.searchTerm   || g.title.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.statusFilter || g.status === this.statusFilter)
    );
  }

  clearFilters(): void { this.searchTerm = ''; this.statusFilter = ''; this.applyFilters(); }
  goToReview(id: number): void { this.router.navigate(['/faculty/grievance-review', id]); }
  get hasFilters() { return !!(this.searchTerm || this.statusFilter); }
}
