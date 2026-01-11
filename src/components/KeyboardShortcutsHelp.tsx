import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export const KeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Ctrl', 'Enter'], description: 'Analyze email' },
    { keys: ['Esc'], description: 'Clear/Reset analysis' },
    { keys: ['Ctrl', 'K'], description: 'Focus search' },
    { keys: ['Ctrl', 'H'], description: 'Toggle history' },
    { keys: ['Ctrl', 'Q'], description: 'Open quiz mode' },
    { keys: ['Ctrl', 'S'], description: 'Toggle stats' },
    { keys: ['Ctrl', '?'], description: 'Show shortcuts' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-30 no-print"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4" />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-16 right-4 z-30"
        >
          <Card className="p-4 w-72 bg-card shadow-xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, i) => (
                      <kbd
                        key={i}
                        className="px-2 py-1 bg-secondary rounded text-xs font-mono text-secondary-foreground"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </>
  );
};
