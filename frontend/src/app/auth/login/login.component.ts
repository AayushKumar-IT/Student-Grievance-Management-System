import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type LoginMode = 'email' | 'collegeId';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading      = false;
  error        = '';
  showPassword = false;
  mode: LoginMode = 'email';   // active tab

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email:     ['', [Validators.email]],
      collegeId: [''],
      password:  ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setMode(m: LoginMode): void {
    this.mode  = m;
    this.error = '';
    // clear both identifier fields when switching
    this.loginForm.patchValue({ email: '', collegeId: '' });
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    const pw = this.loginForm.get('password')?.value;
    if (!pw) { this.error = 'Password is required.'; return; }

    if (this.mode === 'email') {
      const email = this.loginForm.get('email')?.value?.trim();
      if (!email) { this.error = 'Email is required.'; return; }
    } else {
      const cid = this.loginForm.get('collegeId')?.value?.trim();
      if (!cid) { this.error = 'College ID is required.'; return; }
    }

    this.loading = true;
    this.error   = '';

    const payload =
      this.mode === 'email'
        ? { email:     this.loginForm.get('email')!.value.trim(),    password: pw }
        : { collegeId: this.loginForm.get('collegeId')!.value.trim(), password: pw };

    this.authService.login(payload).subscribe({
      next:  () => this.authService.navigateToDashboard(),
      error: err => {
        this.error   = err.error?.message ?? 'Invalid credentials. Please try again.';
        this.loading = false;
      }
    });
  }

  get f() { return this.loginForm.controls; }
}
