import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';
import { College, Department } from '../../core/models/college.model';
import { environment } from '../../../environments/environment';


/**
 * Cross-field validator:
 * confirmPassword must match password.
 */
function passwordMatchValidator(
  group: AbstractControl
): ValidationErrors | null {

  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  if (
    password &&
    confirmPassword &&
    password !== confirmPassword
  ) {
    return { passwordMismatch: true };
  }

  return null;
}


@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent implements OnInit {

  form: FormGroup;

  loading = false;

  collegesLoading = false;
  departmentsLoading = false;

  error = '';

  colleges: College[] = [];
  departments: Department[] = [];

  showPassword = false;
  showConfirmPassword = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {

    this.form = this.fb.group({

      firstName: [
        '',
        Validators.required
      ],

      lastName: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ],

      enrollmentNumber: [
        '',
        Validators.required
      ],

      phoneNumber: [
        '',
        Validators.required
      ],

      collegeId: [
        null,
        Validators.required
      ],

      departmentId: [
        null,
        Validators.required
      ],

      year: [
        '',
        Validators.required
      ],

      section: [
        '',
        Validators.required
      ]

    }, {
      validators: passwordMatchValidator
    });
  }


  ngOnInit(): void {

    /*
     * Load colleges when registration page opens.
     */
    this.loadColleges();


    /*
     * When college changes:
     *
     * 1. Clear old departments.
     * 2. Clear selected department.
     * 3. Load departments for selected college.
     */
    this.form
      .get('collegeId')!
      .valueChanges
      .subscribe((collegeId: number | null) => {

        this.departments = [];

        this.form
          .get('departmentId')!
          .setValue(null);

        if (!collegeId) {
          return;
        }

        this.loadDepartments(collegeId);
      });
  }


  retryLoadColleges(): void {
    this.error = '';
    this.loadColleges();
  }

  /**
   * Load all colleges from Spring Boot.
   */
  private loadColleges(): void {

    this.collegesLoading = true;
    this.error = '';

    const url =
      `${environment.apiUrl}/public/colleges`;

    console.log('Loading colleges from:', url);

    this.http
      .get<College[]>(url)
      .subscribe({

        next: (colleges) => {

          console.log('Colleges received:', colleges);

          this.colleges = colleges ?? [];

          this.collegesLoading = false;

          if (this.colleges.length === 0) {
            this.error =
              'No colleges are available. Please start/restart the backend server.';
          }
        },

        error: (err) => {

          console.error(
            'Failed to load colleges:',
            err
          );

          this.colleges = [];

          this.collegesLoading = false;

          this.error =
            'Could not load colleges. Make sure the Spring Boot backend is running on port 2718, then click Retry.';
        }
      });
  }


  /**
   * Load departments for the selected college.
   */
  private loadDepartments(collegeId: number): void {

    this.departmentsLoading = true;

    const url =
      `${environment.apiUrl}/public/colleges/${collegeId}/departments`;

    console.log(
      'Loading departments from:',
      url
    );

    this.http
      .get<Department[]>(url)
      .subscribe({

        next: (departments) => {

          console.log(
            'Departments received:',
            departments
          );

          this.departments =
            departments ?? [];

          this.departmentsLoading = false;
        },

        error: (err) => {

          console.error(
            'Failed to load departments:',
            err
          );

          this.departments = [];

          this.departmentsLoading = false;

          this.error =
            'Could not load departments for the selected college.';
        }
      });
  }


  /**
   * Submit registration form.
   */
  onSubmit(): void {

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    /*
     * Remove confirmPassword because the backend
     * StudentRegistrationRequest does not contain it.
     */
    const {
      confirmPassword,
      ...payload
    } = this.form.value;

    console.log(
      'Student registration payload:',
      payload
    );

    this.authService
      .registerStudent(payload)
      .subscribe({

        next: () => {

          this.authService
            .navigateToDashboard();
        },

        error: (err) => {

          console.error(
            'Registration failed:',
            err
          );

          this.error =
            err.error?.message ??
            'Registration failed. Please check your details and try again.';

          this.loading = false;
        }
      });
  }


  /**
   * Shortcut for form controls.
   */
  get f() {
    return this.form.controls;
  }


  /**
   * Check whether a field is invalid and touched.
   */
  isInvalid(field: string): boolean {

    const control =
      this.form.get(field);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }


  /**
   * Password mismatch status.
   */
  get passwordMismatch(): boolean {

    return !!(
      this.form.errors?.['passwordMismatch'] &&
      this.form.get('confirmPassword')?.touched
    );
  }
}