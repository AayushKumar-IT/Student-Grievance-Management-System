import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CollegeAdminService } from '../../core/services/college-admin.service';
import { FacultyService } from '../../core/services/faculty.service';
import { GrievanceService } from '../../core/services/grievance.service';
import { GrievanceResponse, GrievanceStatus } from '../../core/models/grievance.model';
import { Faculty } from '../../core/models/faculty.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-grievance-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, SidebarComponent,
            StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './grievance-management.component.html',
  styleUrls: ['./grievance-management.component.css']
})
export class GrievanceManagementComponent implements OnInit {
  grievances: GrievanceResponse[] = [];
  filtered:   GrievanceResponse[] = [];
  faculty:    Faculty[] = [];
  loading = true;
  error   = '';
  success = '';
  searchTerm   = '';
  statusFilter = '';
  assigningId: number | null = null;
  selectedFacultyId: { [key: number]: number } = {};
  statuses: GrievanceStatus[] = ['SUBMITTED','UNDER_REVIEW','ASSIGNED','IN_PROGRESS','RESOLVED','REJECTED'];

  constructor(
    private collegeAdminService: CollegeAdminService,
    private facultyService: FacultyService,
    private grievanceService: GrievanceService
  ) {}

  ngOnInit(): void {
    this.collegeAdminService.getCollegeGrievances().subscribe({
      next: data => { this.grievances = data; this.applyFilters(); this.loading = false; },
      error: () => { this.error = 'Failed to load grievances.'; this.loading = false; }
    });
    this.collegeAdminService.getCollegeFaculty().subscribe({
      next: data => this.faculty = data
    });
  }

  applyFilters(): void {
    this.filtered = this.grievances.filter(g =>
      (!this.searchTerm   || g.title.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.statusFilter || g.status === this.statusFilter)
    );
  }

  assign(grievanceId: number): void {
    const facultyId = this.selectedFacultyId[grievanceId];
    if (!facultyId) return;
    this.error = ''; this.success = '';
    this.collegeAdminService.assignGrievance(grievanceId, facultyId).subscribe({
      next: updated => {
        const idx = this.grievances.findIndex(g => g.id === grievanceId);
        if (idx > -1) this.grievances[idx] = updated;
        this.applyFilters();
        this.success = `Grievance #${grievanceId} assigned successfully.`;
        this.assigningId = null;
      },
      error: err => this.error = err.error?.message ?? 'Assignment failed.'
    });
  }

  clearFilters(): void { this.searchTerm = ''; this.statusFilter = ''; this.applyFilters(); }
  get hasFilters() { return !!(this.searchTerm || this.statusFilter); }
}
