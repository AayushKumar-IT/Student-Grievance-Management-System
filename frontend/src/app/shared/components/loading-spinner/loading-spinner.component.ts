import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-wrapper" [class.overlay]="overlay">
      <div class="spinner"></div>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 2rem; gap: 1rem;
    }
    .spinner-wrapper.overlay {
      position: fixed; inset: 0; background: rgba(255,255,255,0.8);
      z-index: 9999;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner-message { font-size: 0.875rem; color: var(--text-secondary); }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = '';
  @Input() overlay = false;
}
