import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskLevel } from '../../../core/models/risk-assessment.model';

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [class]="getBadgeClass()">
    <i class="fas fa-exclamation-triangle" *ngIf="riskLevel === 'HIGH' || riskLevel === 'CRITICAL'"></i>
    {{ riskLevel | titlecase }} Risk
  </span>`
})
export class RiskBadgeComponent {
  @Input() riskLevel!: RiskLevel;

  getBadgeClass(): string {
    const map: Record<RiskLevel, string> = {
      LOW:      'badge-low',
      MEDIUM:   'badge-medium',
      HIGH:     'badge-high',
      CRITICAL: 'badge-critical'
    };
    return map[this.riskLevel] ?? 'badge-low';
  }
}
