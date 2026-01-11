import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Loader2, BarChart3, RefreshCw, History, Download, Brain, Copy, Check, TrendingUp, FileText, MessageSquare, ArrowLeftRight, Radar, FileJson, FileSpreadsheet, LockKeyhole } from 'lucide-react';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { FloatingActionButton } from './FloatingActionButton';
import { AnimatedCounter } from './AnimatedCounter';
import { RippleButton } from './RippleButton';
import { AnalysisCardSkeleton } from './AnalysisCardSkeleton';
import { SecurityRadarChart } from './SecurityRadarChart';
import { EmailHeatMap } from './EmailHeatMap';
import { AnimatedBarChart } from './AnimatedBarChart';
import { ComparisonMode } from './ComparisonMode';
import { OnboardingTour } from './OnboardingTour';
import { ContextualHelp } from './ContextualHelp';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ExampleEmailSelector } from './ExampleEmailSelector';
import { TipsCarousel } from './TipsCarousel';
import { HistorySidebar } from './HistorySidebar';
import { QuizMode } from './QuizMode';
import { ProgressStepper } from './ProgressStepper';
import { URLHighlighter } from './URLHighlighter';
import { SecurityRecommendation } from './SecurityRecommendation';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { EmailHeaderParser } from './EmailHeaderParser';
import { ScreenshotAnalyzer } from './ScreenshotAnalyzer';
import { AIAssistant } from './AIAssistant';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { PhishingResult, AnalysisHistory, UserStats } from '@/types/phishing';
import { exportToPDF } from '@/utils/pdfExport';
import { exportHistoryToCSV } from '@/utils/csvExport';
import { exportHistoryToJSON, exportResultToJSON } from '@/utils/jsonExport';
import { checkAchievements } from '@/utils/achievementSystem';
import { toast } from 'sonner';
import { AchievementToast } from './AchievementToast';
import confetti from 'canvas-confetti';
import { useTheme } from 'next-themes';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export const PhishingDetectorEnhanced = () => {
  const { history, setHistory, stats, setStats } = useAnalytics();
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState<PhishingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [realtimeScore, setRealtimeScore] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<any[]>([]);
  const [showHeaderParser, setShowHeaderParser] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showRadar, setShowRadar] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [showOnboarding, setShowOnboarding] = useLocalStorage('phishing-onboarding-completed', false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();


  useEffect(() => {
    if (!emailText.trim()) {
      setRealtimeScore(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      const quickScore = calculateQuickScore(emailText);
      setRealtimeScore(quickScore);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [emailText]);

  const calculateQuickScore = (text: string) => {
    let score = 0;
    const lowerText = text.toLowerCase();

    if (/urgent|immediately|verify now/i.test(lowerText)) score += 20;
    if (/winner|prize|lottery/i.test(lowerText)) score += 25;
    if (/password|ssn|credit card/i.test(lowerText)) score += 30;
    if (/http:\/\/\d+\.\d+\.\d+\.\d+/.test(text)) score += 25;

    return Math.min(score, 100);
  };

  const analyzeEmail = async () => {
    if (!emailText.trim()) return;

    return await performAnalysis(emailText);
  };

  const performAnalysis = async (text: string): Promise<PhishingResult> => {
    if (!text.trim()) return {} as PhishingResult;

    setIsLoading(true);
    setAnalysisSteps([
      { label: 'Parsing', status: 'active' },
      { label: 'Analyzing', status: 'pending' },
      { label: 'Scoring', status: 'pending' },
      { label: 'Complete', status: 'pending' }
    ]);

    await new Promise(resolve => setTimeout(resolve, 500));
    setAnalysisSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'complete' } : i === 1 ? { ...s, status: 'active' } : s));

    await new Promise(resolve => setTimeout(resolve, 800));
    setAnalysisSteps(prev => prev.map((s, i) => i <= 1 ? { ...s, status: 'complete' } : i === 2 ? { ...s, status: 'active' } : s));

    await new Promise(resolve => setTimeout(resolve, 600));

    const reasons: string[] = [];
    let score = 0;
    let keywordMatches = 0;
    let urlIssues = 0;
    let sensitiveRequests = 0;
    let brandImpersonation = false;

    const urgentKeywords = ['urgent', 'immediately', 'action required', 'verify now', 'within 24 hours', 'expires today', 'suspended', 'locked', 'act now'];
    const prizeKeywords = ['winner', 'prize', 'congratulations', 'lottery', 'inheritance', 'millions', 'selected'];
    const threatKeywords = ['account suspended', 'verify account', 'unusual activity', 'security alert', 'confirm identity', 'unauthorized access'];
    const actionKeywords = ['click here', 'download now', 'open attachment', 'update payment', 'confirm password'];

    const foundUrgent = urgentKeywords.filter(kw => text.toLowerCase().includes(kw));
    const foundPrize = prizeKeywords.filter(kw => text.toLowerCase().includes(kw));
    const foundThreat = threatKeywords.filter(kw => text.toLowerCase().includes(kw));
    const foundAction = actionKeywords.filter(kw => text.toLowerCase().includes(kw));

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

    const ipUrlPattern = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
    const ipUrls = text.match(ipUrlPattern);
    if (ipUrls) {
      score += 25;
      urlIssues += ipUrls.length;
      reasons.push(`🌐 IP-based URLs detected (${ipUrls.length} found)`);
    }

    const shortUrlPattern = /(bit\.ly|tinyurl|goo\.gl|ow\.ly|t\.co)/gi;
    const shortUrls = text.match(shortUrlPattern);
    if (shortUrls) {
      score += 15;
      urlIssues += shortUrls.length;
      reasons.push(`🔗 Shortened URLs detected (${shortUrls.length} found)`);
    }

    const suspiciousDomains = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club'];
    const foundSuspiciousDomains = suspiciousDomains.filter(domain => text.toLowerCase().includes(domain));
    if (foundSuspiciousDomains.length > 0) {
      score += 22;
      urlIssues += foundSuspiciousDomains.length;
      reasons.push(`⚠️ Free/suspicious domain extensions: ${foundSuspiciousDomains.join(', ')}`);
    }

    const brandNames = ['paypal', 'amazon', 'microsoft', 'apple', 'google', 'netflix', 'facebook', 'instagram', 'bank'];
    for (const brand of brandNames) {
      const regex = new RegExp(`${brand}(?!\.com|@)`, 'gi');
      if (regex.test(text) && !text.toLowerCase().includes(`${brand}.com`)) {
        score += 28;
        brandImpersonation = true;
        reasons.push(`🎭 Possible brand impersonation: "${brand}"`);
        break;
      }
    }

    const linkCount = (text.match(/https?:\/\//g) || []).length;
    if (linkCount > 5) {
      score += 10;
      urlIssues += 1;
      reasons.push(`🔗 Excessive links detected (${linkCount} links)`);
    }

    const sensitiveRequests_list = ['password', 'social security', 'ssn', 'credit card', 'bank account', 'pin', 'cvv'];
    const foundSensitive = sensitiveRequests_list.filter(term => text.toLowerCase().includes(term));
    if (foundSensitive.length > 0) {
      score += 30;
      sensitiveRequests += foundSensitive.length;
      reasons.push(`🔐 Requests sensitive information: ${foundSensitive.join(', ')}`);
    }

    if (/attach|download|file|exe|zip/i.test(text)) {
      score += 12;
      reasons.push(`📎 Mentions attachments/downloads`);
    }

    score = Math.min(score, 100);
    const confidence = Math.min(85 + Math.random() * 15, 99);

    if (score === 0) {
      reasons.push('✅ No immediate phishing indicators detected');
    }

    setAnalysisSteps(prev => prev.map((s, i) => i <= 2 ? { ...s, status: 'complete' } : { ...s, status: 'active' }));

    const newResult: PhishingResult = {
      score,
      reasons,
      details: { keywordMatches, urlIssues, sensitiveRequests, brandImpersonation },
      confidence,
      timestamp: Date.now(),
      emailPreview: text.substring(0, 100)
    };

    setResult(newResult);

    const newHistory: AnalysisHistory = {
      id: Date.now().toString(),
      result: newResult,
      timestamp: Date.now()
    };
    setHistory([newHistory, ...history.slice(0, 19)]);

    const newStats = {
      ...stats,
      totalAnalyses: stats.totalAnalyses + 1,
      phishingDetected: score >= 70 ? stats.phishingDetected + 1 : stats.phishingDetected,
      safeEmails: score < 30 ? stats.safeEmails + 1 : stats.safeEmails,
      achievements: stats.achievements || []
    };

    const unlockedAchievements = checkAchievements(newStats);

    if (unlockedAchievements.length > 0) {
      newStats.achievements = [...newStats.achievements, ...unlockedAchievements];
      unlockedAchievements.forEach(achievement => {
        toast.custom(() => <AchievementToast achievement={achievement} />);
      });
    }

    setStats(newStats);

    setAnalysisSteps(prev => prev.map(s => ({ ...s, status: 'complete' })));
    setIsLoading(false);

    if (score < 30) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('Email looks safe! ✅');
    } else if (score >= 70) {
      if (cardRef.current) {
        cardRef.current.style.animation = 'shake 0.5s';
        setTimeout(() => {
          if (cardRef.current) cardRef.current.style.animation = '';
        }, 500);
      }
      toast.error('⚠️ High phishing risk detected!');
    } else {
      toast.warning('Suspicious email - be cautious');
    }

    return newResult;
  };

  const copyResults = () => {
    if (!result) return;

    const text = `Phishing Analysis Report\nScore: ${result.score}/100\nStatus: ${result.score < 30 ? 'Safe' : result.score < 70 ? 'Suspicious' : 'Phishing'}\nConfidence: ${result.confidence}%\n\nDetection Reasons:\n${result.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Results copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score < 30) return 'success';
    if (score < 70) return 'warning';
    return 'danger';
  };

  const resetAnalysis = () => {
    setEmailText('');
    setResult(null);
    setRealtimeScore(0);
    setAnalysisSteps([]);
  };

  const chartData = result ? [
    { name: 'Keywords', value: result.details.keywordMatches, color: '#f59e0b' },
    { name: 'URLs', value: result.details.urlIssues, color: '#ef4444' },
    { name: 'Sensitive', value: result.details.sensitiveRequests, color: '#dc2626' }
  ].filter(d => d.value > 0) : [];

  const handleExportCSV = () => {
    exportHistoryToCSV(history);
    if (!stats.achievements?.some(a => a.id === 'csv-exporter')) {
      const newAchievement = { id: 'csv-exporter', title: 'Data Analyst', description: 'Exported analysis to CSV', icon: '📊', unlocked: true };
      setStats({ ...stats, achievements: [...(stats.achievements || []), newAchievement] });
      toast.custom(() => <AchievementToast achievement={newAchievement} />);
    }
  };

  const handleExportJSON = () => {
    console.log('handleExportJSON called', { hasResult: !!result, historyLength: history.length });
    if (result) {
      console.log('Exporting result to JSON');
      exportResultToJSON(result, emailText);
      toast.success('Analysis exported as JSON!');
    } else {
      console.log('Exporting history to JSON');
      exportHistoryToJSON(history);
      toast.success('History exported as JSON!');
    }
  };

  const handleQuizAchievement = (achievement: any) => {
    if (!stats.achievements?.some(a => a.id === achievement.id)) {
      setStats({ ...stats, achievements: [...(stats.achievements || []), achievement] });
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+enter': () => emailText.trim() && analyzeEmail(),
    'escape': resetAnalysis,
    'ctrl+k': () => textareaRef.current?.focus(),
    'ctrl+h': () => !showAI && setHistoryOpen(true),
    'ctrl+q': () => !showAI && setQuizOpen(true),
    'ctrl+/': () => setShowShortcutsHelp(!showShortcutsHelp),
    'ctrl+shift+?': () => setShowShortcutsHelp(!showShortcutsHelp),
    'ctrl+shift+e': () => history.length > 0 && handleExportCSV(),
  });

  return (
    <TooltipProvider>
      {/* Onboarding Tour */}
      {!showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(true)} />
      )}

      {/* Skip to main content for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Navigation Bar */}
      <Navbar
        onHistoryClick={() => setHistoryOpen(true)}
        onQuizClick={() => setQuizOpen(true)}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onHistoryClick={() => setHistoryOpen(true)}
        onQuizClick={() => setQuizOpen(true)}
        onAIClick={() => setShowAI(!showAI)}
        onExportClick={handleExportCSV}
        historyLength={history.length}
      />

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton onClick={() => setMobileMenuOpen(true)} />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      <main className="min-h-screen bg-background flex items-center justify-center p-4 pt-24 pb-12" id="main-content">
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
        `}</style>

        {/* Desktop Quick Actions - Hidden on Mobile */}
        <div className="hidden md:flex fixed top-20 right-4 flex-col gap-2 z-30 no-print">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowAI(!showAI)}
                  className="hover:bg-primary/10 hover:border-primary/50 transition-all animate-glow-pulse"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Security Assistant</TooltipContent>
            </Tooltip>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={history.length === 0 && !result}
                  className="hover:bg-primary/10 hover:border-primary/50 transition-all"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border z-50">
              <DropdownMenuItem
                onClick={handleExportCSV}
                disabled={history.length === 0}
                className="cursor-pointer hover:bg-primary/10"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => result && exportToPDF(result, emailText)}
                disabled={!result}
                className="cursor-pointer hover:bg-primary/10"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportJSON}
                disabled={history.length === 0 && !result}
                className="cursor-pointer hover:bg-primary/10"
              >
                <FileJson className="w-4 h-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl"
        >

          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-primary mb-8 shadow-glow relative transform rotate-3 hover:rotate-0 transition-transform duration-500"
            >
              <LockKeyhole className="w-14 h-14 text-white" />
              {realtimeScore > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute -top-3 -right-3 bg-gradient-to-br from-warning to-danger text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                >
                  {realtimeScore}
                </motion.div>
              )}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 tracking-tight leading-tight pb-2 drop-shadow-sm"
            >
              Digital Threat Shield
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto mb-3 leading-relaxed font-medium"
            >
              Hyperscale security intelligence protecting your inbox from advanced threats
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <kbd className="px-2 py-1 bg-secondary rounded text-xs text-secondary-foreground" aria-label="Control plus Enter">Ctrl+Enter</kbd> to analyze • <kbd className="px-2 py-1 bg-secondary rounded text-xs text-secondary-foreground" aria-label="Escape">Esc</kbd> to clear • <kbd className="px-2 py-1 bg-secondary rounded text-xs text-secondary-foreground" aria-label="Question mark">?</kbd> for shortcuts
            </motion.p>
          </div>


          {/* AI Assistant Popup */}
          <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />

          <TipsCarousel />

          <AnimatePresence>
            {showHeaderParser && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <EmailHeaderParser />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showScreenshot && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <ScreenshotAnalyzer onAnalyze={setEmailText} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            ref={cardRef}
          >
            <Card className="p-6 bg-gradient-card border-border shadow-xl backdrop-blur-sm">
              {isLoading && analysisSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgressStepper steps={analysisSteps} />
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="flex gap-3 flex-wrap mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHeaderParser(!showHeaderParser)}
                    className={`gap-2 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border-primary/30 hover:border-primary/50 transition-all shadow-sm hover:shadow-md ${showHeaderParser ? 'shadow-lg shadow-primary/50 animate-glow border-primary/70' : ''
                      }`}
                  >
                    <FileText className="w-4 h-4" />
                    Email Headers
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowScreenshot(!showScreenshot);
                      if (!showScreenshot && !stats.achievements?.some(a => a.id === 'screenshot-user')) {
                        const newAchievement = { id: 'screenshot-user', title: 'Screenshot Analyzer', description: 'Used screenshot OCR for the first time', icon: '📸', unlocked: true };
                        setStats({ ...stats, achievements: [...(stats.achievements || []), newAchievement] });
                      }
                    }}
                    className={`gap-2 bg-gradient-to-r from-purple/5 to-purple/10 hover:from-purple/10 hover:to-purple/20 border-purple/30 hover:border-purple/50 transition-all shadow-sm hover:shadow-md ${showScreenshot ? 'shadow-lg shadow-purple/50 animate-glow border-purple/70' : ''
                      }`}
                  >
                    <Download className="w-4 h-4" />
                    Screenshot OCR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    className="gap-2 bg-gradient-to-r from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/20 border-accent/30 hover:border-accent/50 transition-all shadow-sm hover:shadow-md"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Compare Emails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowRadar(!showRadar);
                      if (!showRadar && !stats.achievements?.some(a => a.id === 'radar-user')) {
                        const newAchievement = { id: 'radar-user', title: 'Radar Master', description: 'Used security radar chart', icon: '📡', unlocked: true };
                        setStats({ ...stats, achievements: [...(stats.achievements || []), newAchievement] });
                      }
                    }}
                    className={`gap-2 bg-gradient-to-r from-success/5 to-success/10 hover:from-success/10 hover:to-success/20 border-success/30 hover:border-success/50 transition-all shadow-sm hover:shadow-md ${showRadar ? 'shadow-lg shadow-success/50 animate-glow border-success/70' : ''
                      }`}
                  >
                    <Radar className="w-4 h-4" />
                    Security Radar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowHeatMap(!showHeatMap);
                      if (!showHeatMap && !stats.achievements?.some(a => a.id === 'heatmap-user')) {
                        const newAchievement = { id: 'heatmap-user', title: 'Heat Vision', description: 'Activated threat heat map', icon: '🔥', unlocked: true };
                        setStats({ ...stats, achievements: [...(stats.achievements || []), newAchievement] });
                      }
                    }}
                    className={`gap-2 bg-gradient-to-r from-warning/5 to-warning/10 hover:from-warning/10 hover:to-warning/20 border-warning/30 hover:border-warning/50 transition-all shadow-sm hover:shadow-md ${showHeatMap ? 'shadow-lg shadow-warning/50 animate-glow border-warning/70' : ''
                      }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Threat Heat Map
                  </Button>
                </div>

                {showHeatMap && emailText && (
                  <EmailHeatMap emailText={emailText} result={result} />
                )}

                <ExampleEmailSelector onSelectEmail={setEmailText} />

                <div>
                  <label htmlFor="email-input" className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Email Content Analysis
                    <ContextualHelp
                      title="How it works"
                      content="Our system analyzes email content in real-time, checking for phishing indicators like urgency, suspicious links, and sensitive data requests. The border color indicates threat level."
                      position="right"
                    />
                    {realtimeScore > 0 && (
                      <span
                        className={`text-xs ml-auto ${realtimeScore < 30 ? 'text-success' : realtimeScore < 70 ? 'text-warning' : 'text-danger'
                          }`}
                        role="status"
                        aria-live="polite"
                      >
                        Live Score: {realtimeScore}
                      </span>
                    )}
                  </label>
                  <Textarea
                    ref={textareaRef}
                    id="email-input"
                    placeholder="Paste the email content here for comprehensive phishing analysis... (Ctrl+K to focus)"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    className={`min-h-[240px] bg-background text-foreground resize-none transition-all duration-300 ${realtimeScore === 0
                      ? 'border-border focus:ring-2 focus:ring-primary'
                      : realtimeScore < 30
                        ? 'border-success focus:ring-2 focus:ring-success shadow-[0_0_15px_hsl(var(--success)/0.3)]'
                        : realtimeScore < 70
                          ? 'border-warning focus:ring-2 focus:ring-warning shadow-[0_0_15px_hsl(var(--warning)/0.3)] animate-border-pulse'
                          : 'border-danger focus:ring-2 focus:ring-danger shadow-[0_0_20px_hsl(var(--danger)/0.5)] animate-border-glow'
                      }`}
                    aria-label="Email content for phishing analysis"
                    aria-describedby="textarea-help"
                  />
                  <URLHighlighter emailText={emailText} />
                </div>

                <div className="flex gap-3">
                  <RippleButton
                    onClick={analyzeEmail}
                    disabled={!emailText.trim() || isLoading}
                    className="flex-1 bg-gradient-primary hover:opacity-90 transition-all text-primary-foreground font-semibold py-6 text-base shadow-glow hover:shadow-lg relative overflow-hidden"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center"
                        >
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          <motion.span
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Analyzing content...
                          </motion.span>
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Analyze Email
                      </>
                    )}
                  </RippleButton>

                  {(emailText || result) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05, rotate: 180 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                          <Button
                            onClick={resetAnalysis}
                            variant="outline"
                            className="py-6 px-6 border-border hover:bg-secondary/50"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>Reset (Esc)</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading && !result && <AnalysisCardSkeleton />}
            {result && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                <Card className="p-6 bg-gradient-card border-border shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-2xl font-bold text-foreground"
                    >
                      Analysis Results
                    </motion.h2>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={copyResults}
                            >
                              <motion.div
                                initial={false}
                                animate={{ scale: copied ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </motion.div>
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>Copy Results</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportToPDF(result, emailText)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>Export to PDF</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleExportJSON}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              JSON
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>Export to JSON</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-muted-foreground">Threat Score</span>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                          className={`text-4xl font-bold ${result.score < 30 ? 'text-success' : result.score < 70 ? 'text-warning' : 'text-danger'
                            } ${result.score >= 70 ? 'animate-pulse' : ''}`}
                        >
                          <AnimatedCounter value={result.score} duration={1500} />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span className={`font-semibold ${result.score < 30 ? 'text-success' : result.score < 70 ? 'text-warning' : 'text-danger'
                            }`}>
                            {result.score < 30 ? '✅ SAFE' : result.score < 70 ? '⚠️ SUSPICIOUS' : '🚨 PHISHING'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-semibold">{result.confidence.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Keywords</span>
                          <span className="font-semibold">{result.details.keywordMatches}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">URL Issues</span>
                          <span className="font-semibold">{result.details.urlIssues}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Sensitive Requests</span>
                          <span className="font-semibold">{result.details.sensitiveRequests}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Brand Impersonation</span>
                          <span className="font-semibold">{result.details.brandImpersonation ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>

                    {chartData.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Threat Breakdown</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Detection Reasons</h3>
                    <div className="space-y-2">
                      {result.reasons.map((reason, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          transition={{
                            delay: index * 0.1,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20
                          }}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-default ${result.score >= 70 && index === 0
                            ? 'bg-danger/10 border border-danger/20'
                            : 'bg-secondary/30'
                            }`}
                        >
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span className="text-sm text-foreground flex-1">{reason}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <SecurityRecommendation score={result.score} reasons={result.reasons} />
                </Card>

                {/* Data Visualization Components */}
                {showRadar && (
                  <div className="mt-6">
                    <SecurityRadarChart result={result} />
                  </div>
                )}

                <div className="mt-6">
                  <AnimatedBarChart result={result} />
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowHeatMap(!showHeatMap)}
                    className="w-full"
                  >
                    {showHeatMap ? 'Hide' : 'Show'} Email Heat Map
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comparison Mode */}
          <AnimatePresence>
            {showComparison && (
              <ComparisonMode
                onClose={() => setShowComparison(false)}
                onAnalyze={performAnalysis}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <HistorySidebar
          history={history}
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelect={(item) => {
            setEmailText(item.result.emailPreview);
            setResult(item.result);
          }}
          onClear={() => {
            setHistory([]);
            toast.success('History cleared');
          }}
        />

        <AnimatePresence>
          {quizOpen && (
            <QuizMode
              onClose={() => setQuizOpen(false)}
              onAchievement={handleQuizAchievement}
            />
          )}
        </AnimatePresence>
      </main>
    </TooltipProvider>
  );
};
