import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evidence } from '../../../core/models/evidence.model';
import { EvidenceService } from '../../../core/services/evidence.service';

@Component({
  selector: 'app-evidence-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evidence-viewer.component.html',
  styleUrls: ['./evidence-viewer.component.css']
})
export class EvidenceViewerComponent implements OnInit {
  @Input() grievanceId!: number;
  @Input() evidences: Evidence[] = [];
  @Input() allowDelete = false;

  loading = false;

  constructor(private evidenceService: EvidenceService) {}

  ngOnInit(): void {
    if (!this.evidences.length && this.grievanceId) {
      this.loading = true;
      this.evidenceService.getEvidenceByGrievance(this.grievanceId).subscribe({
        next: data => { this.evidences = data; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  download(evidence: Evidence): void {
    this.evidenceService.downloadEvidence(evidence.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = evidence.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  delete(evidence: Evidence): void {
    if (!confirm(`Delete "${evidence.fileName}"?`)) return;
    this.evidenceService.deleteEvidence(evidence.id).subscribe(() => {
      this.evidences = this.evidences.filter(e => e.id !== evidence.id);
    });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  getFileIcon(fileType: string): string {
    if (fileType?.includes('image')) return 'fas fa-image';
    if (fileType?.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType?.includes('word')) return 'fas fa-file-word';
    return 'fas fa-file';
  }
}
