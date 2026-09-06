import { AIAnalysis } from './ai-analysis.model';
import { RiskAssessment } from './risk-assessment.model';

export type GrievanceCategory =
  | 'ACADEMIC' | 'INFRASTRUCTURE' | 'HARASSMENT' | 'FINANCIAL'
  | 'ADMINISTRATIVE' | 'HOSTEL' | 'TRANSPORTATION' | 'LIBRARY'
  | 'LABORATORY' | 'OTHER';

export type GrievanceType = 'INDIVIDUAL' | 'GROUP' | 'ANONYMOUS';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type GrievanceStatus =
  | 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS'
  | 'RESOLVED' | 'REJECTED' | 'CLOSED' | 'ESCALATED';

export interface GrievanceRequest {
  title: string;
  description: string;
  category: GrievanceCategory;
  type: GrievanceType;
  departmentId?: number;
}

export interface GrievanceResponse {
  id: number;
  title: string;
  description: string;
  category: GrievanceCategory;
  type: GrievanceType;
  priority: Priority;
  status: GrievanceStatus;
  studentName: string;
  studentEnrollment: string;
  collegeName: string;
  departmentName: string;
  assignedFacultyName: string;
  isDuplicate: boolean;
  duplicateOfId: number | null;
  resolutionNote: string;
  submittedAt: string;
  resolvedAt: string | null;
  aiAnalysis: AIAnalysis | null;
  riskAssessment: RiskAssessment | null;
}
