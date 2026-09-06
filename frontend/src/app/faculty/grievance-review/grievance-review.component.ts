import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { GrievanceResponse, GrievanceStatus } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { EvidenceViewerComponent } from '../../shared/components/evidence-viewer/evidence-viewer.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-grievance-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, SidebarComponent,
            StatusBadgeComponent, RiskBadgeComponent, EvidenceViewerComponent, LoadingSpinnerComponent],
  templateUrl: './grievance-review.component.html',
  styleUrls: ['./grievance-review.component.css']
})
export class GrievanceReviewComponent implements OnInit {
  grievance: GrievanceResponse | null = null;
  loading  = true;
  saving   = false;
  error    = '';
  success  = '';
  id!: number;

  statusForm!: FormGroup;

  nextStatuses: GrievanceStatus[] = ['UNDER_REVIEW','IN_PROGRESS','RESOLVED','REJECTED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private grievanceService: GrievanceService
  ) {}

  goBack(): void { this.router.navigate(['/faculty/assigned-grievances']); }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      note:   ['']
    });
    this.grievanceService.getGrievanceById(this.id).subscribe({
      next:  g  => { this.grievance = g; this.loading = false; },
      error: () => { this.error = 'Could not load grievance.'; this.loading = false; }
    });
  }

  updateStatus(): void {
    if (this.statusForm.invalid) return;
    this.saving = true; this.error = ''; this.success = '';
    const { status, note } = this.statusForm.value;
    this.grievanceService.updateStatus(this.id, status, note).subscribe({
      next: g => {
        this.grievance = g;
        this.success = `Status updated to ${status}.`;
        this.saving  = false;
        this.statusForm.reset();
      },
      error: err => { this.error = err.error?.message ?? 'Update failed.'; this.saving = false; }
    });
  }

  pct(val: number | null): string {
    if (val == null) return '—';
    return `${Math.round(val * 100)}%`;
  }
}
