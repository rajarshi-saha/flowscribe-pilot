export type CheckStatus = 'pass' | 'warning' | 'fail';

export interface PreScreeningCheck {
  name: string;
  status: CheckStatus;
  score?: number;
  details?: string;
}

export interface Manuscript {
  id: string;
  title: string;
  authors: string[];
  submissionDate: string;
  status: 'ready' | 'sent-back' | 'pending-review' | 'ready-for-peer-review' | 'in-review';
  journal: string;
  abstract: string;
  keywords: string[];
  preScreeningChecks: PreScreeningCheck[];
  sentBackReason?: string;
  sentBackDetails?: string;
  assignedEE?: Editor;
  assignedAEs?: Editor[];
  urgency?: 'low' | 'medium' | 'high';
  decisionDeadline?: string;
}

export interface Editor {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  expertise: string[];
  matchPercentage?: number;
  matchReason?: string;
  workload: number;
  pastHandlingHistory?: number;
  isAutoAssigned?: boolean;
}

export interface Reviewer {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  expertise: string[];
  matchPercentage: number;
  matchReason: string;
  workload: number;
  pastReviewHistory: number;
  averageReviewSpeed: string;
  conflictsChecked: boolean;
  inviteStatus?: 'pending' | 'sent' | 'accepted' | 'declined';
}

export interface AIEvaluation {
  journalFit: { score: number; rationale: string };
  scholarlyMerit: { score: number; rationale: string };
  originality: { score: number; rationale: string };
  technicalIntegrity: { score: number; rationale: string };
  riskSensitivity: { score: number; rationale: string };
}
