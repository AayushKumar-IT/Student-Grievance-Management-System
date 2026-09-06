import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-super-admin-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './super-admin-setup.component.html',
  styleUrls: ['./super-admin-setup.component.css']
})
export class SuperAdminSetupComponent {
  form: FormGroup;
  loading = false;
  error = '';

  showPassword        = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phoneNumber:     ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { confirmPassword, ...payload } = this.form.value;
    this.authService.setupSuperAdmin(payload).subscribe({
      next:  () => this.authService.navigateToDashboard(),
      error: err => {
        this.error = err.error?.message ?? 'Setup failed. A super admin account may already exist.';
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
