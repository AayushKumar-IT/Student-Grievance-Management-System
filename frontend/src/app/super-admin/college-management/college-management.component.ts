import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperAdminService } from '../../core/services/super-admin.service';
import { College } from '../../core/models/college.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-college-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './college-management.component.html',
  styleUrls: ['./college-management.component.css']
})
export class CollegeManagementComponent implements OnInit {
  colleges: College[] = [];
  loading  = true;
  saving   = false;
  error    = '';
  success  = '';
  showForm = false;
  editId: number | null = null;
  form!: FormGroup;

  constructor(private superAdminService: SuperAdminService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:  ['', Validators.required],
      code:  ['', Validators.required],
      state: ['', Validators.required],
      // These are required by the DB but hidden — default values sent automatically
      address:     ['N/A'],
      city:        ['N/A'],
      email:       ['noreply@college.edu'],
      phoneNumber: ['N/A']
    });
    this.load();
  }

  load(): void {
    this.superAdminService.getAllColleges().subscribe({
      next:  data => { this.colleges = data; this.loading = false; },
      error: ()   => { this.error = 'Failed to load colleges.'; this.loading = false; }
    });
  }

  openCreate(): void { this.editId = null; this.form.reset(); this.showForm = true; }
  openEdit(c: College): void {
    this.editId = c.id;
    this.form.patchValue(c);
    this.showForm = true;
  }
  cancel(): void { this.showForm = false; this.editId = null; this.form.reset(); }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true; this.error = ''; this.success = '';
    const obs = this.editId
      ? this.superAdminService.updateCollege(this.editId, this.form.value)
      : this.superAdminService.createCollege(this.form.value);
    obs.subscribe({
      next: c => {
        if (this.editId) {
          const idx = this.colleges.findIndex(x => x.id === this.editId);
          if (idx > -1) this.colleges[idx] = c;
        } else { this.colleges.push(c); }
        this.success = `College "${c.name}" ${this.editId ? 'updated' : 'created'}.`;
        this.cancel(); this.saving = false;
      },
      error: err => { this.error = err.error?.message ?? 'Save failed.'; this.saving = false; }
    });
  }

  delete(c: College): void {
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    this.error = ''; this.success = '';
    this.superAdminService.deleteCollege(c.id).subscribe({
      next: () => { this.colleges = this.colleges.filter(x => x.id !== c.id); this.success = `College "${c.name}" deleted.`; },
      error: err => this.error = err.error?.message ?? 'Delete failed.'
    });
  }

  isInvalid(f: string) { return this.form.get(f)?.invalid && this.form.get(f)?.touched; }
}
