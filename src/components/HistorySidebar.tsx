import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AnalysisHistory } from '@/types/phishing';
import { ScrollArea } from './ui/scroll-area';

interface HistorySidebarProps {
  history: AnalysisHistory[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: AnalysisHistory) => void;
  onClear: () => void;
}

export const HistorySidebar = ({ history, isOpen, onClose, onSelect, onClear }: HistorySidebarProps) => {
  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-success';
    if (score < 70) return 'text-warning';
    return 'text-danger';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-card border-l border-border z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Analysis History</h2>
                </div>
                <Button size="sm" variant="ghost" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4">
                {history.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No analysis history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card
                          className="p-3 cursor-pointer hover:bg-accent/10 transition-colors"
                          onClick={() => {
                            onSelect(item);
                            onClose();
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-2xl font-bold ${getScoreColor(item.result.score)}`}>
                                  {item.result.score}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {item.result.score < 30 ? 'Safe' : item.result.score < 70 ? 'Suspicious' : 'Phishing'}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.result.emailPreview}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {history.length > 0 && (
                <div className="p-4 border-t border-border">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={onClear}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
