import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GrievanceService } from '../../core/services/grievance.service';
import { GrievanceResponse, GrievanceStatus, GrievanceCategory } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { GrievanceCardComponent } from '../../shared/components/grievance-card/grievance-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-my-grievances',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,
            NavbarComponent, SidebarComponent, GrievanceCardComponent, LoadingSpinnerComponent],
  templateUrl: './my-grievances.component.html',
  styleUrls: ['./my-grievances.component.css']
})
export class MyGrievancesComponent implements OnInit {
  grievances: GrievanceResponse[] = [];
  filtered:   GrievanceResponse[] = [];
  loading = true;
  error   = '';

  searchTerm  = '';
  statusFilter: string = '';
  categoryFilter: string = '';

  statuses:   GrievanceStatus[]  = ['SUBMITTED','UNDER_REVIEW','ASSIGNED','IN_PROGRESS','RESOLVED','REJECTED','CLOSED','ESCALATED'];
  categories: GrievanceCategory[] = ['ACADEMIC','INFRASTRUCTURE','HARASSMENT','FINANCIAL','ADMINISTRATIVE','HOSTEL','TRANSPORTATION','LIBRARY','LABORATORY','OTHER'];

  constructor(private grievanceService: GrievanceService, private router: Router) {}

  ngOnInit(): void {
    this.grievanceService.getMyGrievances().subscribe({
      next: data => {
        this.grievances = data.sort((a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load grievances.'; this.loading = false; }
    });
  }

  applyFilters(): void {
    this.filtered = this.grievances.filter(g => {
      const matchSearch   = !this.searchTerm || g.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus   = !this.statusFilter   || g.status   === this.statusFilter;
      const matchCategory = !this.categoryFilter || g.category === this.categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.categoryFilter = '';
    this.applyFilters();
  }

  goToDetails(id: number): void {
    this.router.navigate(['/student/grievance', id]);
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.statusFilter || this.categoryFilter);
  }
}
