import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollegeAdminService } from '../../core/services/college-admin.service';
import { Student } from '../../core/models/student.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  students: Student[] = [];
  loading = true;
  error   = '';

  constructor(private collegeAdminService: CollegeAdminService) {}

  ngOnInit(): void {
    this.collegeAdminService.getCollegeStudents().subscribe({
      next:  data => { this.students = data; this.loading = false; },
      error: ()   => { this.error = 'Failed to load students.'; this.loading = false; }
    });
  }
}
