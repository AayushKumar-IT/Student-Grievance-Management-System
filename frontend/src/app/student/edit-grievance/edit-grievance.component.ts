import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GrievanceService } from '../../core/services/grievance.service';
import { GrievanceResponse, GrievanceCategory, GrievanceType } from '../../core/models/grievance.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-edit-grievance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './edit-grievance.component.html',
  styleUrls: ['./edit-grievance.component.css']
})
export class EditGrievanceComponent implements OnInit {
  form!: FormGroup;
  grievance!: GrievanceResponse;
  loading  = true;
  saving   = false;
  error    = '';
  success  = '';
  id!: number;

  categories: GrievanceCategory[] = ['ACADEMIC','INFRASTRUCTURE','HARASSMENT','FINANCIAL',
    'ADMINISTRATIVE','HOSTEL','TRANSPORTATION','LIBRARY','LABORATORY','OTHER'];
  types: GrievanceType[] = ['INDIVIDUAL','GROUP','ANONYMOUS'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private grievanceService: GrievanceService
  ) {}

  goBack(): void { this.router.navigate(['/student/grievance', this.id]); }
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.grievanceService.getGrievanceById(this.id).subscribe({
      next: g => {
        this.grievance = g;
        if (g.status !== 'SUBMITTED') {
          this.error = 'Only grievances with status SUBMITTED can be edited.';
          this.loading = false;
          return;
        }
        this.form = this.fb.group({
          title:       [g.title,       [Validators.required, Validators.minLength(10)]],
          description: [g.description, [Validators.required, Validators.minLength(30)]],
          category:    [g.category,    Validators.required],
          type:        [g.type,        Validators.required]
        });
        this.loading = false;
      },
      error: () => { this.error = 'Could not load grievance.'; this.loading = false; }
    });
  }

  onSubmit(): void {
    if (!this.form || this.form.invalid) return;
    this.saving = true; this.error = ''; this.success = '';
    this.grievanceService.updateGrievance(this.id, this.form.value).subscribe({
      next: () => {
        this.success = 'Grievance updated successfully.';
        this.saving  = false;
        setTimeout(() => this.router.navigate(['/student/grievance', this.id]), 1200);
      },
      error: err => { this.error = err.error?.message ?? 'Update failed.'; this.saving = false; }
    });
  }

  get f() { return this.form?.controls; }
  isInvalid(field: string) { return this.form?.get(field)?.invalid && this.form?.get(field)?.touched; }
}
