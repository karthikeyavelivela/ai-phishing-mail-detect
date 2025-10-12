import { useState } from 'react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface URLHighlighterProps {
  emailText: string;
}

export const URLHighlighter = ({ emailText }: URLHighlighterProps) => {
  const [highlightedURLs, setHighlightedURLs] = useState<string[]>([]);
  
  // Extract all URLs from email
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = emailText.match(urlPattern) || [];
  
  const suspiciousPatterns = [
    /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP addresses
    /\.(tk|ml|ga|cf|gq)\//, // Suspicious TLDs
    /(bit\.ly|tinyurl|goo\.gl)/, // URL shorteners
  ];
  
  const isSuspicious = (url: string) => {
    return suspiciousPatterns.some(pattern => pattern.test(url));
  };
  
  const toggleHighlight = (url: string) => {
    setHighlightedURLs(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };
  
  if (urls.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <Card className="p-4 bg-secondary/30 border-border">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Detected URLs ({urls.length})
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {urls.map((url, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleHighlight(url)}
              className={`w-full text-left p-2 rounded text-xs font-mono transition-all ${
                highlightedURLs.includes(url)
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-background border border-border hover:bg-secondary'
              }`}
            >
              <div className="flex items-start gap-2">
                {isSuspicious(url) && (
                  <AlertTriangle className="w-3 h-3 text-danger flex-shrink-0 mt-0.5" />
                )}
                <span className="break-all">{url}</span>
              </div>
            </motion.button>
          ))}
        </div>
        {highlightedURLs.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Selected URLs will be highlighted in analysis
          </p>
        )}
      </Card>
    </motion.div>
  );
};
