export interface PhishingResult {
  score: number;
  reasons: string[];
  details: {
    keywordMatches: number;
    urlIssues: number;
    sensitiveRequests: number;
    brandImpersonation: boolean;
  };
  confidence: number;
  timestamp: number;
  emailPreview: string;
}

export interface AnalysisHistory {
  id: string;
  result: PhishingResult;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component or string emoji
  unlocked: boolean;
  unlockedAt?: number;
}

export interface UserStats {
  totalAnalyses: number;
  phishingDetected: number;
  safeEmails: number;
  accuracy: number;
  achievements: Achievement[];
}
