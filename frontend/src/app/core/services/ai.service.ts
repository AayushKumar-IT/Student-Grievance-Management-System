import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AIAnalysis } from '../models/ai-analysis.model';
import { RiskAssessment } from '../models/risk-assessment.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  getAnalysis(grievanceId: number): Observable<AIAnalysis> {
    return this.http.get<AIAnalysis>(`${this.apiUrl}/analysis/${grievanceId}`);
  }

  triggerAnalysis(grievanceId: number): Observable<AIAnalysis> {
    return this.http.post<AIAnalysis>(`${this.apiUrl}/analyze/${grievanceId}`, null);
  }

  getRiskAssessment(grievanceId: number): Observable<RiskAssessment> {
    return this.http.get<RiskAssessment>(`${this.apiUrl}/risk/${grievanceId}`);
  }
}
