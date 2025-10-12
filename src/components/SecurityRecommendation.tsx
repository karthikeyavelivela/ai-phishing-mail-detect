import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SecurityRecommendationProps {
  score: number;
  reasons: string[];
}

export const SecurityRecommendation = ({ score, reasons }: SecurityRecommendationProps) => {
  const getRecommendation = () => {
    if (score < 30) {
      return {
        icon: CheckCircle,
        title: '✅ Email Appears Safe',
        color: 'success',
        recommendations: [
          'Still verify the sender\'s email address matches official communications',
          'Hover over any links before clicking to check destinations',
          'Be cautious of unexpected attachments',
          'Report suspicious emails to your IT department'
        ]
      };
    } else if (score < 70) {
      return {
        icon: AlertTriangle,
        title: '⚠️ Exercise Caution',
        color: 'warning',
        recommendations: [
          'Do not click any links or download attachments',
          'Verify sender identity through official channels',
          'Look for signs of spoofed email addresses',
          'Report to your security team if from work email',
          'Delete the email if you don\'t recognize the sender'
        ]
      };
    } else {
      return {
        icon: XCircle,
        title: '🚨 High Risk - Likely Phishing',
        color: 'danger',
        recommendations: [
          'DO NOT click any links or open attachments',
          'DO NOT provide any personal information',
          'DO NOT reply to this email',
          'Report this as phishing to your email provider',
          'Delete the email immediately',
          'Change passwords if you\'ve already clicked links',
          'Enable two-factor authentication on affected accounts'
        ]
      };
    }
  };

  const recommendation = getRecommendation();
  const Icon = recommendation.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6"
    >
      <Card className={`p-6 border-2 ${
        recommendation.color === 'success' 
          ? 'bg-success/10 border-success' 
          : recommendation.color === 'warning'
          ? 'bg-warning/10 border-warning'
          : 'bg-danger/10 border-danger'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <Icon className={`w-6 h-6 flex-shrink-0 ${
            recommendation.color === 'success' 
              ? 'text-success' 
              : recommendation.color === 'warning'
              ? 'text-warning'
              : 'text-danger'
          }`} />
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{recommendation.title}</h3>
            <p className="text-sm text-muted-foreground">
              Based on {reasons.length} detection indicator{reasons.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm mb-2">Recommended Actions:</h4>
          <ul className="space-y-2">
            {recommendation.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <span className={`mt-0.5 ${
                  recommendation.color === 'success' 
                    ? 'text-success' 
                    : recommendation.color === 'warning'
                    ? 'text-warning'
                    : 'text-danger'
                }`}>•</span>
                <span>{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {score >= 70 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-danger" />
              <span className="font-semibold text-danger">
                This email shows multiple high-risk indicators. Treat as malicious.
              </span>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
