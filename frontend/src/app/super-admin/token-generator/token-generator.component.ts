import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { College } from '../../core/models/college.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-token-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './token-generator.component.html',
  styleUrls: ['./token-generator.component.css']
})
export class TokenGeneratorComponent implements OnInit {
  form!: FormGroup;
  colleges: College[] = [];
  tokens: any[] = [];
  loading  = false;
  saving   = false;
  error    = '';
  generated: string | null = null;

  roles = ['STUDENT', 'FACULTY', 'COLLEGE_ADMIN'];

  constructor(private superAdminService: SuperAdminService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      role:      ['FACULTY', Validators.required],
      collegeId: [null]
    });
    this.superAdminService.getAllColleges().subscribe(data => this.colleges = data);
    this.loadTokens();
  }

  loadTokens(): void {
    this.loading = true;
    this.superAdminService.getAllTokens().subscribe({
      next:  data => {
        this.tokens = data
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  generate(): void {
    if (this.form.invalid) return;
    this.saving = true; this.error = ''; this.generated = null;
    const { role, collegeId } = this.form.value;
    this.superAdminService.generateToken(role, collegeId ?? undefined).subscribe({
      next: t => {
        this.generated = t.token;
        this.saving    = false;
        this.tokens.unshift(t);
      },
      error: err => { this.error = err.error?.message ?? 'Failed to generate token.'; this.saving = false; }
    });
  }

  dismissGenerated(): void { this.generated = null; }

  copy(token: string): void {
    navigator.clipboard.writeText(token).then(() => {
      this.copiedToken = token;
      setTimeout(() => this.copiedToken = null, 2000);
    });
  }

  isExpired(t: any): boolean { return new Date(t.expiresAt) < new Date(); }
  isActive(t: any): boolean  { return !t.used && !this.isExpired(t); }

  /** Returns a human-readable "X days / X hours left" string */
  timeLeft(t: any): string {
    if (t.used)            return 'Used';
    const now  = new Date().getTime();
    const exp  = new Date(t.expiresAt).getTime();
    const diff = exp - now;
    if (diff <= 0)         return 'Expired';
    const days  = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const mins  = Math.floor((diff % 3_600_000)  / 60_000);
    if (days  > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${mins}m left`;
    return `${mins}m left`;
  }

  copiedToken: string | null = null;
}
