import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeAdminService } from '../../core/services/college-admin.service';
import { FacultyService } from '../../core/services/faculty.service';
import { Faculty } from '../../core/models/faculty.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-resolver-management',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './resolver-management.component.html',
  styleUrls: ['./resolver-management.component.css']
})
export class ResolverManagementComponent implements OnInit {
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

  get resolvers()    { return this.faculty.filter(f => f.isGrievanceResolver); }
  get nonResolvers() { return this.faculty.filter(f => !f.isGrievanceResolver); }

  toggle(f: Faculty): void {
    this.error = ''; this.success = '';
    this.facultyService.toggleResolverStatus(f.id, !f.isGrievanceResolver).subscribe({
      next: updated => {
        const idx = this.faculty.findIndex(x => x.id === f.id);
        if (idx > -1) this.faculty[idx] = updated;
        this.success = `${updated.user.firstName} ${updated.user.lastName} ${updated.isGrievanceResolver ? 'added as' : 'removed from'} resolver.`;
      },
      error: err => this.error = err.error?.message ?? 'Update failed.'
    });
  }
}
