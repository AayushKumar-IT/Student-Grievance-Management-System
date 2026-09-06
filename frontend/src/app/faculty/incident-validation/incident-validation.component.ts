import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { GrievanceResponse } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-incident-validation',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent,
            StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './incident-validation.component.html',
  styleUrls: ['./incident-validation.component.css']
})
export class IncidentValidationComponent implements OnInit {
  grievances: GrievanceResponse[] = [];
  loading = true;
  error   = '';

  constructor(private grievanceService: GrievanceService) {}

  ngOnInit(): void {
    this.grievanceService.getAssignedGrievances().subscribe({
      next:  data => {
        // Show grievances that are in progress (where incidents may need validation)
        this.grievances = data.filter(g => g.status === 'IN_PROGRESS' || g.status === 'UNDER_REVIEW');
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load grievances.'; this.loading = false; }
    });
  }
}
