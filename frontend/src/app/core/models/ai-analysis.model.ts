import { GrievanceCategory, Priority } from './grievance.model';

export interface AIAnalysis {
  predictedCategory: GrievanceCategory | null;
  categoryConfidence: number | null;
  predictedPriority: Priority | null;
  priorityConfidence: number | null;
  isFakeComplaint: boolean | null;
  fakeConfidence: number | null;
  isDuplicate: boolean | null;
  duplicateOfId: number | null;
  duplicateSimilarityScore: number | null;
  isAnomaly: boolean | null;
  anomalyScore: number | null;
  analysisNotes: string;
}
