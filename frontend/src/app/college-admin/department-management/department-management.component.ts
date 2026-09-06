import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollegeAdminService } from '../../core/services/college-admin.service';
import { Department } from '../../core/models/college.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css']
})
export class DepartmentManagementComponent implements OnInit {
  departments: Department[] = [];
  loading = true;
  saving  = false;
  error   = '';
  success = '';
  showForm = false;
  form!: FormGroup;

  constructor(private collegeAdminService: CollegeAdminService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({ name: ['', Validators.required], code: ['', Validators.required] });
    this.load();
  }

  load(): void {
    this.collegeAdminService.getDepartments().subscribe({
      next:  data => { this.departments = data; this.loading = false; },
      error: ()   => { this.error = 'Failed to load departments.'; this.loading = false; }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true; this.error = ''; this.success = '';
    this.collegeAdminService.createDepartment(this.form.value).subscribe({
      next: dept => {
        this.departments.push(dept);
        this.success = `Department "${dept.name}" created.`;
        this.form.reset(); this.showForm = false; this.saving = false;
      },
      error: err => { this.error = err.error?.message ?? 'Failed to create.'; this.saving = false; }
    });
  }

  isInvalid(f: string) { return this.form.get(f)?.invalid && this.form.get(f)?.touched; }
}
