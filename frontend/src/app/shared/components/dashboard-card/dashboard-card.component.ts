import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() icon = 'fas fa-chart-bar';
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
  @Input() subtitle = '';
}
