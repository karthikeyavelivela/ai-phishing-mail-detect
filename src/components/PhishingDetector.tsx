import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Loader2, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ExampleEmailSelector } from './ExampleEmailSelector';

interface PhishingResult {
  score: number;
  reasons: string[];
  details: {
    keywordMatches: number;
    urlIssues: number;
    sensitiveRequests: number;
    brandImpersonation: boolean;
  };
}

export const PhishingDetector = () => {
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState<PhishingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeEmail = async () => {
    if (!emailText.trim()) return;

    setIsLoading(true);

    // Enhanced phishing detection with detailed metrics
    await new Promise(resolve => setTimeout(resolve, 1800));

    const reasons: string[] = [];
    let score = 0;
    let keywordMatches = 0;
    let urlIssues = 0;
    let sensitiveRequests = 0;
    let brandImpersonation = false;

    // Advanced suspicious keyword detection
    const urgentKeywords = ['urgent', 'immediately', 'action required', 'verify now', 'within 24 hours', 'expires today', 'suspended', 'locked', 'act now'];
    const prizeKeywords = ['winner', 'prize', 'congratulations', 'lottery', 'inheritance', 'millions', 'selected'];
    const threatKeywords = ['account suspended', 'verify account', 'unusual activity', 'security alert', 'confirm identity', 'unauthorized access'];
    const actionKeywords = ['click here', 'download now', 'open attachment', 'update payment', 'confirm password'];

    const foundUrgent = urgentKeywords.filter(kw => emailText.toLowerCase().includes(kw));
    const foundPrize = prizeKeywords.filter(kw => emailText.toLowerCase().includes(kw));
    const foundThreat = threatKeywords.filter(kw => emailText.toLowerCase().includes(kw));
    const foundAction = actionKeywords.filter(kw => emailText.toLowerCase().includes(kw));

    if (foundUrgent.length > 0) {
      score += foundUrgent.length * 12;
      keywordMatches += foundUrgent.length;
      reasons.push(`⚠️ Creates false urgency: "${foundUrgent.join('", "')}"`);
    }

    if (foundPrize.length > 0) {
      score += foundPrize.length * 18;
      keywordMatches += foundPrize.length;
      reasons.push(`🎰 Suspicious prize claims: "${foundPrize.join('", "')}"`);
    }

    if (foundThreat.length > 0) {
      score += foundThreat.length * 20;
      keywordMatches += foundThreat.length;
      reasons.push(`🚨 Threatening language: "${foundThreat.join('", "')}"`);
    }

    if (foundAction.length > 0) {
      score += foundAction.length * 15;
      keywordMatches += foundAction.length;
      reasons.push(`🔗 Suspicious call-to-action: "${foundAction.join('", "')}"`);
    }

    // Check for IP-based URLs
    const ipUrlPattern = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
    const ipUrls = emailText.match(ipUrlPattern);
    if (ipUrls) {
      score += 25;
      urlIssues += ipUrls.length;
      reasons.push(`🌐 IP-based URLs detected (${ipUrls.length} found) - legitimate sites use domain names`);
    }

    // Check for shortened URLs
    const shortUrlPattern = /(bit\.ly|tinyurl|goo\.gl|ow\.ly|t\.co)/gi;
    const shortUrls = emailText.match(shortUrlPattern);
    if (shortUrls) {
      score += 15;
      urlIssues += shortUrls.length;
      reasons.push(`🔗 Shortened URLs detected (${shortUrls.length} found) - could hide malicious destinations`);
    }

    // Check for suspicious domain patterns
    const suspiciousDomains = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club'];
    const foundSuspiciousDomains = suspiciousDomains.filter(domain => emailText.toLowerCase().includes(domain));
    if (foundSuspiciousDomains.length > 0) {
      score += 22;
      urlIssues += foundSuspiciousDomains.length;
      reasons.push(`⚠️ Free/suspicious domain extensions: ${foundSuspiciousDomains.join(', ')}`);
    }

    // Check for domain spoofing (common brand names with variations)
    const brandNames = ['paypal', 'amazon', 'microsoft', 'apple', 'google', 'netflix', 'facebook', 'instagram', 'bank'];
    for (const brand of brandNames) {
      const regex = new RegExp(`${brand}(?!\.com|@)`, 'gi');
      if (regex.test(emailText) && !emailText.toLowerCase().includes(`${brand}.com`)) {
        score += 28;
        brandImpersonation = true;
        reasons.push(`🎭 Possible brand impersonation: "${brand}" without official domain`);
        break;
      }
    }

    // Check for excessive links
    const linkCount = (emailText.match(/https?:\/\//g) || []).length;
    if (linkCount > 5) {
      score += 10;
      urlIssues += 1;
      reasons.push(`🔗 Excessive links detected (${linkCount} links) - unusual for legitimate emails`);
    }

    // Check for poor grammar indicators
    const grammarIssues = [
      /dear (customer|user|member|sir|madam|friend)(?!\s+\w+)/i,
      /kindly\s+/i,
      /urgent\s+attention/i,
      /dear\s+valued/i,
    ];
    const foundGrammar = grammarIssues.filter(pattern => pattern.test(emailText));
    if (foundGrammar.length > 0) {
      score += 10;
      reasons.push(`📝 Generic/impersonal greetings detected - legitimate companies use your name`);
    }

    // Check for requests for sensitive information
    const sensitiveRequests_list = ['password', 'social security', 'ssn', 'credit card', 'bank account', 'pin', 'cvv', 'security code'];
    const foundSensitive = sensitiveRequests_list.filter(term => emailText.toLowerCase().includes(term));
    if (foundSensitive.length > 0) {
      score += 30;
      sensitiveRequests += foundSensitive.length;
      reasons.push(`🔐 Requests sensitive information: ${foundSensitive.join(', ')} - MAJOR RED FLAG`);
    }

    // Check for misspellings of common words
    const commonMisspellings = ['kindly', 'dear sir/madam', 'beneficiary', 'urgent matter', 'confirm your identity'];
    const foundMisspellings = commonMisspellings.filter(phrase => emailText.toLowerCase().includes(phrase));
    if (foundMisspellings.length > 0) {
      score += 8;
      reasons.push(`🔤 Suspicious phrasing patterns commonly used in scams`);
    }

    // Check for attachments mentions
    if (/attach|download|file|document|pdf|exe|zip/i.test(emailText)) {
      score += 12;
      reasons.push(`📎 Mentions attachments/downloads - verify source before opening`);
    }

    // Cap score at 100
    score = Math.min(score, 100);

    if (score === 0) {
      reasons.push('✅ No immediate phishing indicators detected - email appears safe');
    }

    setResult({
      score,
      reasons,
      details: {
        keywordMatches,
        urlIssues,
        sensitiveRequests,
        brandImpersonation
      }
    });
    setIsLoading(false);
  };

  const resetAnalysis = () => {
    setEmailText('');
    setResult(null);
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'success';
    if (score < 70) return 'warning';
    return 'danger';
  };

  const getScoreIcon = (score: number) => {
    if (score < 30) return CheckCircle2;
    if (score < 70) return AlertTriangle;
    return XCircle;
  };

  const getScoreLabel = (score: number) => {
    if (score < 30) return 'Safe';
    if (score < 70) return 'Suspicious';
    return 'Phishing';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-6 shadow-glow"
          >
            <Shield className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3"
          >
            Phishing Email Detector
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Advanced security analysis to identify phishing attempts, malicious links, and suspicious content
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-card border-border shadow-xl backdrop-blur-sm">
            <div className="space-y-4">
              <ExampleEmailSelector onSelectEmail={setEmailText} />

              <div>
                <label htmlFor="email-input" className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Email Content Analysis
                </label>
                <Textarea
                  id="email-input"
                  placeholder="Paste the email content here for comprehensive phishing analysis..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="min-h-[240px] bg-background border-border text-foreground resize-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={analyzeEmail}
                  disabled={!emailText.trim() || isLoading}
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold py-6 text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing content...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Analyze Email
                    </>
                  )}
                </Button>

                {(emailText || result) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Button
                      onClick={resetAnalysis}
                      variant="outline"
                      className="py-6 px-6 border-border hover:bg-secondary/50"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="mt-6 p-6 bg-gradient-card border-border shadow-xl backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      {(() => {
                        const Icon = getScoreIcon(result.score);
                        const color = getScoreColor(result.score);
                        return (
                          <Icon
                            className={`w-10 h-10 ${color === 'success'
                                ? 'text-success'
                                : color === 'warning'
                                  ? 'text-warning'
                                  : 'text-danger'
                              }`}
                          />
                        );
                      })()}
                    </motion.div>
                  </div>

                  {/* Threat Score Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Threat Score</span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className={`text-3xl font-bold ${getScoreColor(result.score) === 'success'
                            ? 'text-success'
                            : getScoreColor(result.score) === 'warning'
                              ? 'text-warning'
                              : 'text-danger'
                          }`}
                      >
                        {result.score}/100
                      </motion.span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-4 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        className={`h-full rounded-full shadow-lg ${getScoreColor(result.score) === 'success'
                            ? 'bg-success'
                            : getScoreColor(result.score) === 'warning'
                              ? 'bg-warning'
                              : 'bg-danger'
                          }`}
                      />
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center text-base font-semibold text-foreground"
                    >
                      Status: <span className={
                        getScoreColor(result.score) === 'success'
                          ? 'text-success'
                          : getScoreColor(result.score) === 'warning'
                            ? 'text-warning'
                            : 'text-danger'
                      }>{getScoreLabel(result.score)}</span>
                    </motion.p>
                  </div>

                  {/* Detection Metrics Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    <div className="bg-secondary/50 p-3 rounded-lg text-center border border-border">
                      <div className="text-2xl font-bold text-primary">{result.details.keywordMatches}</div>
                      <div className="text-xs text-muted-foreground mt-1">Keywords</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg text-center border border-border">
                      <div className="text-2xl font-bold text-warning">{result.details.urlIssues}</div>
                      <div className="text-xs text-muted-foreground mt-1">URL Issues</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg text-center border border-border">
                      <div className="text-2xl font-bold text-danger">{result.details.sensitiveRequests}</div>
                      <div className="text-xs text-muted-foreground mt-1">Sensitive Data</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg text-center border border-border">
                      <div className="text-2xl font-bold text-accent">
                        {result.details.brandImpersonation ? '⚠️' : '✓'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Brand Check</div>
                    </div>
                  </motion.div>

                  {/* Detection Reasons */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      Detection Reasons
                    </h3>
                    <ul className="space-y-2">
                      {result.reasons.map((reason, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.08 }}
                          className="flex items-start gap-3 text-sm text-foreground bg-secondary/50 p-4 rounded-lg border border-border hover:bg-secondary/70 transition-colors"
                        >
                          <span className="text-primary mt-0.5 text-lg">•</span>
                          <span className="flex-1">{reason}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Security Recommendation */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className={`p-4 rounded-lg border-2 ${getScoreColor(result.score) === 'success'
                        ? 'bg-success/10 border-success'
                        : getScoreColor(result.score) === 'warning'
                          ? 'bg-warning/10 border-warning'
                          : 'bg-danger/10 border-danger'
                      }`}
                  >
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Security Recommendation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getScoreColor(result.score) === 'success'
                        ? 'This email appears safe, but always verify sender addresses and hover over links before clicking.'
                        : getScoreColor(result.score) === 'warning'
                          ? 'Exercise caution with this email. Verify the sender through official channels before taking any action.'
                          : '⚠️ HIGH RISK: Do not click any links, download attachments, or provide any information. Report this as phishing.'}
                    </p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
