import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-submit-grievance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './submit-grievance.component.html',
  styleUrls: ['./submit-grievance.component.css']
})
export class SubmitGrievanceComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';
  selectedFiles: File[] = [];

  categories = ['ACADEMIC','INFRASTRUCTURE','HARASSMENT','FINANCIAL',
                'ADMINISTRATIVE','HOSTEL','TRANSPORTATION','LIBRARY','LABORATORY','OTHER'];
  types = ['INDIVIDUAL','GROUP','ANONYMOUS'];

  constructor(private fb: FormBuilder, private grievanceService: GrievanceService, private router: Router) {
    this.form = this.fb.group({
      title:       ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      category:    ['', Validators.required],
      type:        ['INDIVIDUAL', Validators.required],
      departmentId:[null]
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.selectedFiles = Array.from(input.files);
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.grievanceService.submitGrievance(this.form.value, this.selectedFiles).subscribe({
      next: res => {
        this.success = 'Grievance submitted successfully!';
        setTimeout(() => this.router.navigate(['/student/grievance', res.id]), 1500);
      },
      error: err => {
        this.error = err.error?.message ?? 'Failed to submit grievance.';
        this.loading = false;
      }
    });
  }

  get f() { return this.form.controls; }
  get charCount() { return (this.form.get('description')?.value ?? '').length; }
}
