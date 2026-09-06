import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { College, Department } from '../../core/models/college.model';
import { environment } from '../../../environments/environment';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-faculty-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './faculty-register.component.html',
  styleUrls: ['./faculty-register.component.css']
})
export class FacultyRegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  colleges: College[] = [];
  departments: Department[] = [];

  showPassword        = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      firstName:         ['', Validators.required],
      lastName:          ['', Validators.required],
      email:             ['', [Validators.required, Validators.email]],
      password:          ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:   ['', Validators.required],
      employeeId:        ['', Validators.required],
      phoneNumber:       ['', Validators.required],
      collegeId:         [null, Validators.required],
      departmentId:      [null, Validators.required],
      designation:       ['', Validators.required],
      registrationToken: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.http.get<College[]>(`${environment.apiUrl}/public/colleges`).subscribe({
      next:  colleges => this.colleges = colleges,
      error: ()       => this.error = 'Could not load colleges. Please refresh the page.'
    });

    this.form.get('collegeId')!.valueChanges.subscribe(collegeId => {
      this.departments = [];
      this.form.get('departmentId')!.setValue(null);
      if (collegeId) {
        this.http.get<Department[]>(`${environment.apiUrl}/public/colleges/${collegeId}/departments`).subscribe({
          next:  depts => this.departments = depts,
          error: ()    => this.departments = []
        });
      }
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { confirmPassword, ...payload } = this.form.value;
    this.authService.registerFaculty(payload).subscribe({
      next:  () => this.authService.navigateToDashboard(),
      error: err => {
        this.error = err.error?.message ?? 'Registration failed. Please check your details and try again.';
        this.loading = false;
      }
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  get passwordMismatch(): boolean {
    return !!(this.form.errors?.['passwordMismatch'] && this.form.get('confirmPassword')?.touched);
  }

  get f() { return this.form.controls; }
}
