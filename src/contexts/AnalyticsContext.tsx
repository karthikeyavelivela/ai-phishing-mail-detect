import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AnalysisHistory, UserStats } from '@/types/phishing';

interface AnalyticsContextType {
  history: AnalysisHistory[];
  setHistory: (history: AnalysisHistory[]) => void;
  stats: UserStats;
  setStats: (stats: UserStats) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useLocalStorage<AnalysisHistory[]>('phishing-history', []);
  const [stats, setStats] = useLocalStorage<UserStats>('phishing-stats', {
    totalAnalyses: 0,
    phishingDetected: 0,
    safeEmails: 0,
    accuracy: 100,
    achievements: []
  });

  return (
    <AnalyticsContext.Provider value={{ history, setHistory, stats, setStats }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};
