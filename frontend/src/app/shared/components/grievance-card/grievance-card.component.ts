import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GrievanceResponse } from '../../../core/models/grievance.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { RiskBadgeComponent } from '../risk-badge/risk-badge.component';

@Component({
  selector: 'app-grievance-card',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, RiskBadgeComponent],
  templateUrl: './grievance-card.component.html',
  styleUrls: ['./grievance-card.component.css']
})
export class GrievanceCardComponent {
  @Input() grievance!: GrievanceResponse;
  @Input() showActions = true;
  @Output() viewDetails = new EventEmitter<number>();
}
