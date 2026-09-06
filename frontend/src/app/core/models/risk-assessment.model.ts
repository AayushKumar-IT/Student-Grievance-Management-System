export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskAssessment {
  riskLevel: RiskLevel;
  riskScore: number;
  riskFactors: string;
  recommendations: string;
  requiresImmediateAction: boolean;
}
