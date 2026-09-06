import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrievanceStatus } from '../../../core/models/grievance.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [class]="getBadgeClass()">{{ status | titlecase }}</span>`
})
export class StatusBadgeComponent {
  @Input() status!: GrievanceStatus;

  getBadgeClass(): string {
    const map: Record<GrievanceStatus, string> = {
      SUBMITTED:    'badge-submitted',
      UNDER_REVIEW: 'badge-under-review',
      ASSIGNED:     'badge-assigned',
      IN_PROGRESS:  'badge-in-progress',
      RESOLVED:     'badge-resolved',
      REJECTED:     'badge-rejected',
      CLOSED:       'badge-resolved',
      ESCALATED:    'badge-escalated'
    };
    return map[this.status] ?? 'badge-submitted';
  }
}
