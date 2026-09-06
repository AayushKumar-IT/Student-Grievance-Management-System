import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { College, Department } from '../../core/models/college.model';
import { Faculty } from '../../core/models/faculty.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-faculty-records',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './faculty-records.component.html',
  styleUrls: ['./faculty-records.component.css']
})
export class FacultyRecordsComponent implements OnInit {
  colleges:    College[]    = [];
  departments: Department[] = [];
  faculty:     Faculty[]    = [];
  filtered:    Faculty[]    = [];

  selectedCollegeId:    number | null = null;
  selectedDepartmentId: number | null = null;
  searchTerm = '';

  loading     = false;
  loadingDept = false;
  error       = '';

  constructor(
    private superAdminService: SuperAdminService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<College[]>(`${environment.apiUrl}/public/colleges`).subscribe({
      next:  data => this.colleges = data,
      error: ()   => this.error = 'Failed to load colleges.'
    });
    this.fetchFaculty();
  }

  onCollegeChange(): void {
    this.selectedDepartmentId = null;
    this.departments = [];
    if (this.selectedCollegeId) {
      this.loadingDept = true;
      this.http.get<Department[]>(`${environment.apiUrl}/public/colleges/${this.selectedCollegeId}/departments`)
        .subscribe({
          next:  depts => { this.departments = depts; this.loadingDept = false; },
          error: ()    => { this.loadingDept = false; }
        });
    }
    this.fetchFaculty();
  }

  onDeptChange(): void { this.fetchFaculty(); }

  fetchFaculty(): void {
    this.loading = true; this.error = '';
    this.superAdminService.getAllFaculty(
      this.selectedCollegeId    ?? undefined,
      this.selectedDepartmentId ?? undefined
    ).subscribe({
      next:  data => { this.faculty = data; this.applySearch(); this.loading = false; },
      error: ()   => { this.error = 'Failed to load faculty.'; this.loading = false; }
    });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase();
    this.filtered = q
      ? this.faculty.filter(f =>
          `${f.user.firstName} ${f.user.lastName} ${f.employeeId} ${f.user.email} ${f.designation}`
            .toLowerCase().includes(q))
      : [...this.faculty];
  }

  clearFilters(): void {
    this.selectedCollegeId    = null;
    this.selectedDepartmentId = null;
    this.departments          = [];
    this.searchTerm           = '';
    this.fetchFaculty();
  }

  get hasFilters(): boolean {
    return !!(this.selectedCollegeId || this.selectedDepartmentId || this.searchTerm);
  }

  collegeName(id: number | null): string {
    return this.colleges.find(c => c.id === id)?.name ?? '';
  }

  deptName(id: number | null): string {
    return this.departments.find(d => d.id === id)?.name ?? '';
  }
}
