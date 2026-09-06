import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { GrievanceResponse } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { EvidenceViewerComponent } from '../../shared/components/evidence-viewer/evidence-viewer.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-grievance-details',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    NavbarComponent, SidebarComponent,
    StatusBadgeComponent, RiskBadgeComponent,
    EvidenceViewerComponent, LoadingSpinnerComponent
  ],
  templateUrl: './grievance-details.component.html',
  styleUrls: ['./grievance-details.component.css']
})
export class GrievanceDetailsComponent implements OnInit {
  grievance: GrievanceResponse | null = null;
  loading = true;
  error   = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private grievanceService: GrievanceService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'Invalid grievance ID.'; this.loading = false; return; }

    this.grievanceService.getGrievanceById(id).subscribe({
      next:  g  => { this.grievance = g; this.loading = false; },
      error: () => { this.error = 'Could not load grievance details.'; this.loading = false; }
    });
  }

  goBack(): void {
    this.router.navigate(['/student/my-grievances']);
  }

  /** Format confidence as percentage string, e.g. 0.92 → "92%" */
  pct(val: number | null): string {
    if (val == null) return '—';
    return `${Math.round(val * 100)}%`;
  }

  canEdit(): boolean {
    return this.grievance?.status === 'SUBMITTED';
  }
}
