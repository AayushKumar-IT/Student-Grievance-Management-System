import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { College, Department } from '../../core/models/college.model';
import { Student } from '../../core/models/student.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-student-records',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './student-records.component.html',
  styleUrls: ['./student-records.component.css']
})
export class StudentRecordsComponent implements OnInit {
  colleges:    College[]    = [];
  departments: Department[] = [];
  students:    Student[]    = [];
  filtered:    Student[]    = [];

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
    // Load college list for dropdown (public endpoint — no auth needed)
    this.http.get<College[]>(`${environment.apiUrl}/public/colleges`).subscribe({
      next:  data => this.colleges = data,
      error: ()   => this.error = 'Failed to load colleges.'
    });

    // Load all students initially
    this.fetchStudents();
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
    this.fetchStudents();
  }

  onDeptChange(): void { this.fetchStudents(); }

  fetchStudents(): void {
    this.loading = true; this.error = '';
    this.superAdminService.getAllStudents(
      this.selectedCollegeId  ?? undefined,
      this.selectedDepartmentId ?? undefined
    ).subscribe({
      next:  data => { this.students = data; this.applySearch(); this.loading = false; },
      error: ()   => { this.error = 'Failed to load students.'; this.loading = false; }
    });
  }

  applySearch(): void {
    const q = this.searchTerm.toLowerCase().trim();
    this.filtered = q
      ? this.students.filter(s =>
          `${s.user.firstName} ${s.user.lastName} ${s.enrollmentNumber} ${s.user.email}`
            .toLowerCase().includes(q))
      : [...this.students];
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.applySearch();
  }

  clearFilters(): void {
    this.selectedCollegeId    = null;
    this.selectedDepartmentId = null;
    this.departments          = [];
    this.searchTerm           = '';
    this.fetchStudents();
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
