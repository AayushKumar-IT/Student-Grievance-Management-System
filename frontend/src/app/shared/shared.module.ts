import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { GrievanceCardComponent } from './components/grievance-card/grievance-card.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { RiskBadgeComponent } from './components/risk-badge/risk-badge.component';
import { EvidenceViewerComponent } from './components/evidence-viewer/evidence-viewer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    DashboardCardComponent,
    GrievanceCardComponent,
    StatusBadgeComponent,
    RiskBadgeComponent,
    EvidenceViewerComponent,
    LoadingSpinnerComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    DashboardCardComponent,
    GrievanceCardComponent,
    StatusBadgeComponent,
    RiskBadgeComponent,
    EvidenceViewerComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule {}
