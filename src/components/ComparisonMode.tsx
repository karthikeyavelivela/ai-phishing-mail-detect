import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { X, ArrowLeftRight, Shield, AlertTriangle } from 'lucide-react';
import { PhishingResult } from '@/types/phishing';

interface ComparisonModeProps {
  onClose: () => void;
  onAnalyze: (text: string) => Promise<PhishingResult>;
}

export const ComparisonMode = ({ onClose, onAnalyze }: ComparisonModeProps) => {
  const [emailA, setEmailA] = useState('');
  const [emailB, setEmailB] = useState('');
  const [resultA, setResultA] = useState<PhishingResult | null>(null);
  const [resultB, setResultB] = useState<PhishingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!emailA.trim() || !emailB.trim()) return;
    
    setLoading(true);
    try {
      const [resA, resB] = await Promise.all([
        onAnalyze(emailA),
        onAnalyze(emailB)
      ]);
      setResultA(resA);
      setResultB(resB);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-success';
    if (score < 70) return 'text-warning';
    return 'text-danger';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="p-6 bg-card border-border shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Side-by-Side Comparison</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Email A */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email A</label>
              <Textarea
                placeholder="Paste first email here..."
                value={emailA}
                onChange={(e) => setEmailA(e.target.value)}
                className="min-h-[200px] mb-4"
              />
              {resultA && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <span className="text-sm font-medium">Threat Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(resultA.score)}`}>
                      {resultA.score}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Keywords</span>
                      <span className="font-semibold">{resultA.details.keywordMatches}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">URL Issues</span>
                      <span className="font-semibold">{resultA.details.urlIssues}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sensitive</span>
                      <span className="font-semibold">{resultA.details.sensitiveRequests}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Email B */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email B</label>
              <Textarea
                placeholder="Paste second email here..."
                value={emailB}
                onChange={(e) => setEmailB(e.target.value)}
                className="min-h-[200px] mb-4"
              />
              {resultB && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <span className="text-sm font-medium">Threat Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(resultB.score)}`}>
                      {resultB.score}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Keywords</span>
                      <span className="font-semibold">{resultB.details.keywordMatches}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">URL Issues</span>
                      <span className="font-semibold">{resultB.details.urlIssues}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sensitive</span>
                      <span className="font-semibold">{resultB.details.sensitiveRequests}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Comparison Summary */}
          {resultA && resultB && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-card rounded-lg border border-border"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Comparison Summary
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Score Difference</p>
                  <p className="text-2xl font-bold">
                    {Math.abs(resultA.score - resultB.score)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Safer Email</p>
                  <p className="text-lg font-semibold">
                    {resultA.score < resultB.score ? 'Email A' : resultB.score < resultA.score ? 'Email B' : 'Equal'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Risk Assessment</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    {Math.max(resultA.score, resultB.score) >= 70 ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-danger" />
                        <span className="text-danger">High Risk Detected</span>
                      </>
                    ) : (
                      <span className="text-success">Manageable Risk</span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-center mt-6">
            <Button
              onClick={handleCompare}
              disabled={!emailA.trim() || !emailB.trim() || loading}
              className="px-8 py-6 text-base bg-gradient-primary"
            >
              {loading ? 'Comparing...' : 'Compare Emails'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
