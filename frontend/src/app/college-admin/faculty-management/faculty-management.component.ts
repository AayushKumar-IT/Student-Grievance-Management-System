import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollegeAdminService } from '../../core/services/college-admin.service';
import { FacultyService } from '../../core/services/faculty.service';
import { Faculty } from '../../core/models/faculty.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-faculty-management',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './faculty-management.component.html',
  styleUrls: ['./faculty-management.component.css']
})
export class FacultyManagementComponent implements OnInit {
  faculty: Faculty[] = [];
  loading = true;
  error   = '';
  success = '';

  constructor(private collegeAdminService: CollegeAdminService, private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.collegeAdminService.getCollegeFaculty().subscribe({
      next:  data => { this.faculty = data; this.loading = false; },
      error: ()   => { this.error = 'Failed to load faculty.'; this.loading = false; }
    });
  }

  toggleResolver(f: Faculty): void {
    this.error = ''; this.success = '';
    this.facultyService.toggleResolverStatus(f.id, !f.isGrievanceResolver).subscribe({
      next: updated => {
        const idx = this.faculty.findIndex(x => x.id === f.id);
        if (idx > -1) this.faculty[idx] = updated;
        this.success = `${updated.user.firstName} ${updated.user.lastName} resolver status updated.`;
      },
      error: err => this.error = err.error?.message ?? 'Update failed.'
    });
  }
}
