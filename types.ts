
export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  risk_flags: string[];
  role_relevance: string;
  experience_level: string;
}

export interface VerificationRecord {
  resume_hash: string;
  ai_score: number;
  wallet_address: string;
  timestamp: number;
  signature: string;
  details: ResumeAnalysis;
}

export enum AppRoute {
  CANDIDATE = 'candidate',
  RECRUITER = 'recruiter',
  HOME = 'home'
}
