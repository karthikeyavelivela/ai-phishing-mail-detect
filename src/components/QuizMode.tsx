import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { exampleEmails } from '@/data/exampleEmails';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { AchievementToast } from './AchievementToast';

interface QuizModeProps {
  onClose: () => void;
  onAchievement?: (achievement: any) => void;
}

export const QuizMode = ({ onClose, onAchievement }: QuizModeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const quizEmails = exampleEmails.slice(0, 10);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswered(true);
    
    if (answer === quizEmails[currentQuestion].category) {
      setScore(score + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizEmails.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      // Quiz complete - check for achievements
      if (score === quizEmails.length && onAchievement) {
        const achievement = {
          id: 'quiz-perfect',
          title: 'Quiz Master',
          description: 'Perfect score on phishing quiz!',
          icon: '🎓',
          unlocked: true
        };
        onAchievement(achievement);
        toast.custom(() => <AchievementToast achievement={achievement} />);
      }
      
      if (score >= 4) {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const currentEmail = quizEmails[currentQuestion];
  const isComplete = currentQuestion === quizEmails.length - 1 && answered;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Phishing Quiz</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1}/{quizEmails.length} • Score: {score}
            </div>
          </div>

          {!isComplete ? (
            <>
              <Card className="p-4 bg-secondary/30 mb-4 max-h-48 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{currentEmail.content}</p>
              </Card>

              <p className="text-lg font-semibold mb-4">Is this email safe, suspicious, or phishing?</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {(['safe', 'suspicious', 'phishing'] as const).map((option) => (
                  <Button
                    key={option}
                    onClick={() => !answered && handleAnswer(option)}
                    disabled={answered}
                    variant={
                      answered && selectedAnswer === option
                        ? option === currentEmail.category
                          ? 'default'
                          : 'destructive'
                        : 'outline'
                    }
                    className={`capitalize ${
                      answered && option === currentEmail.category
                        ? 'bg-success hover:bg-success'
                        : ''
                    }`}
                  >
                    {answered && option === currentEmail.category && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {answered && selectedAnswer === option && option !== currentEmail.category && (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {option}
                  </Button>
                ))}
              </div>

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className={`p-4 mb-4 ${
                      selectedAnswer === currentEmail.category
                        ? 'bg-success/10 border-success'
                        : 'bg-danger/10 border-danger'
                    }`}>
                      <p className="font-semibold mb-1">
                        {selectedAnswer === currentEmail.category ? '✅ Correct!' : '❌ Incorrect'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This is a <span className="font-semibold capitalize">{currentEmail.category}</span> email.
                      </p>
                    </Card>

                    <Button onClick={nextQuestion} className="w-full">
                      {currentQuestion < quizEmails.length - 1 ? (
                        <>
                          Next Question
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        'See Results'
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-6xl mb-4">
                {score === quizEmails.length ? '🏆' : score >= 7 ? '🌟' : score >= 5 ? '👍' : '📚'}
              </div>
              <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <p className="text-xl mb-4">
                You scored {score} out of {quizEmails.length}
              </p>
              <p className="text-muted-foreground mb-6">
                {score === quizEmails.length
                  ? 'Perfect! You are a phishing detection master! 🎓'
                  : score >= 7
                  ? 'Excellent! You have great phishing detection skills!'
                  : score >= 5
                  ? 'Good job! Keep practicing to improve.'
                  : 'Keep learning! Review the tips to get better.'}
              </p>
              <Button onClick={onClose} className="w-full">
                Close Quiz
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};
