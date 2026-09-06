import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { GrievanceResponse } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { GrievanceCardComponent } from '../../shared/components/grievance-card/grievance-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-common-grievances',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent,
            GrievanceCardComponent, LoadingSpinnerComponent],
  templateUrl: './common-grievances.component.html',
  styleUrls: ['./common-grievances.component.css']
})
export class CommonGrievancesComponent implements OnInit {
  grievances: GrievanceResponse[] = [];
  loading = true;
  error   = '';

  constructor(private grievanceService: GrievanceService, private router: Router) {}

  ngOnInit(): void {
    this.grievanceService.getCommonGrievances().subscribe({
      next:  data => { this.grievances = data; this.loading = false; },
      error: ()   => { this.error = 'Failed to load common grievances.'; this.loading = false; }
    });
  }

  goToDetails(id: number): void { this.router.navigate(['/student/grievance', id]); }
}
