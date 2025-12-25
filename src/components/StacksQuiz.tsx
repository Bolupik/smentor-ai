import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { CheckCircle, XCircle, BookOpen, Trophy, RotateCcw } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "The Proof of Transfer (PoX) consensus mechanism distinguishes itself from traditional proof-of-work by:",
    options: [
      "Eliminating the need for miners entirely through delegated validation",
      "Recycling Bitcoin's proof-of-work by transferring BTC to STX stackers",
      "Using a hybrid model combining proof-of-stake with proof-of-authority",
      "Anchoring transactions to Ethereum for cross-chain security"
    ],
    correctAnswer: 1,
    explanation: "PoX recycles Bitcoin's existing proof-of-work. STX miners bid Bitcoin, which transfers to STX stackers as yield, while the winning miner produces the next Stacks block. This anchors Stacks to Bitcoin without expending additional energy."
  },
  {
    id: 2,
    question: "Clarity's decidability property fundamentally ensures that:",
    options: [
      "Contracts execute faster through JIT compilation",
      "All possible execution paths can be analyzed before deployment",
      "Smart contracts can be upgraded without migration",
      "Gas fees remain constant regardless of computation"
    ],
    correctAnswer: 1,
    explanation: "Decidability means the behavior of Clarity contracts can be fully analyzed statically before execution. This eliminates an entire class of runtime vulnerabilities since all execution paths are knowable and verifiable upfront."
  },
  {
    id: 3,
    question: "The Nakamoto upgrade's implementation of Bitcoin finality signifies that:",
    options: [
      "Stacks blocks confirm in under 5 seconds on average",
      "Transactions become irreversible once their anchor block is confirmed on Bitcoin",
      "STX can be natively bridged to Bitcoin's UTXO set",
      "Block reorganizations occur independently of Bitcoin's chain"
    ],
    correctAnswer: 1,
    explanation: "With Nakamoto, Stacks transactions inherit Bitcoin's finality. Once the anchoring Bitcoin block achieves sufficient confirmations, the corresponding Stacks transactions cannot be reorganized without also reorganizing Bitcoin itself."
  },
  {
    id: 4,
    question: "sBTC's architectural design eliminates the need for:",
    options: [
      "Transaction fees when moving between L1 and L2",
      "Clarity smart contracts for DeFi applications",
      "Centralized custodians or federated multisig bridges",
      "STX tokens for network security participation"
    ],
    correctAnswer: 2,
    explanation: "sBTC is a decentralized 1:1 Bitcoin peg that operates without trusted third parties. Unlike wrapped Bitcoin solutions requiring custodians, sBTC uses threshold signatures and economic incentives to maintain the peg trustlessly."
  },
  {
    id: 5,
    question: "Dual stacking amplifies yield through the mechanism of:",
    options: [
      "Compounding rewards across multiple stacking cycles automatically",
      "Combining locked STX with sBTC holdings to boost reward rates",
      "Stacking identical amounts on both Stacks mainnet and testnet",
      "Leveraging liquidation cascades in DeFi lending protocols"
    ],
    correctAnswer: 1,
    explanation: "Dual stacking allows users to lock STX tokens while simultaneously holding sBTC. The sBTC holdings directly influence the reward multiplier, enabling yields up to 5% APY compared to base rates of approximately 0.5%."
  },
  {
    id: 6,
    question: "Circle's USDCx integration via xReserve infrastructure provides:",
    options: [
      "Algorithmic stability without traditional collateral",
      "Cross-chain USDC movement without third-party bridge risks",
      "Native Bitcoin-denominated stablecoin functionality",
      "Yield-bearing stable assets through automated arbitrage"
    ],
    correctAnswer: 1,
    explanation: "USDCx leverages Circle's xReserve for cryptographic attestations and CCTP for crosschain transfers. This eliminates the security risks inherent in third-party bridges while maintaining full USDC interoperability across supported chains."
  },
  {
    id: 7,
    question: "In Clarity, the principal type serves the purpose of:",
    options: [
      "Representing the primary key in contract storage",
      "Identifying unique addresses capable of owning assets and calling contracts",
      "Defining the main entry point for contract execution",
      "Specifying the original deployer's privileges"
    ],
    correctAnswer: 1,
    explanation: "The principal type in Clarity represents unique identities on the network. Standard principals represent wallet addresses, while contract principals identify deployed contracts. Both can own assets and participate in transactions."
  },
  {
    id: 8,
    question: "The upcoming Satoshi upgrades roadmap includes fee abstraction, which enables:",
    options: [
      "Zero-fee transactions for verified accounts",
      "Payment of network fees in sBTC rather than STX",
      "Automatic fee optimization through MEV protection",
      "Subsidized transactions for new users"
    ],
    correctAnswer: 1,
    explanation: "Fee abstraction will permit users to pay Stacks network fees using sBTC instead of requiring STX. This significantly improves user experience for Bitcoin-native users entering the ecosystem."
  }
];

interface StacksQuizProps {
  onComplete?: (score: number, total: number) => void;
}

const StacksQuiz = ({ onComplete }: StacksQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const question = quizQuestions[currentQuestion];

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const answerIndex = parseInt(selectedAnswer);
    const correct = answerIndex === question.correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct && !answeredQuestions.has(currentQuestion)) {
      setScore(s => s + 1);
    }
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      setQuizComplete(true);
      onComplete?.(score, quizQuestions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setAnsweredQuestions(new Set());
  };

  if (quizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${percentage >= 70 ? "text-primary" : "text-muted-foreground"}`} />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">Assessment Complete</h2>
          <p className="text-4xl font-black text-primary mb-2">{score} / {quizQuestions.length}</p>
          <p className="text-muted-foreground mb-6">
            {percentage >= 80 
              ? "Exceptional comprehension. You possess the foundational knowledge to navigate this ecosystem with confidence."
              : percentage >= 60
              ? "Commendable effort. A deeper study of the core concepts shall prove beneficial."
              : "The journey of mastery demands persistence. Consider revisiting the foundational topics."}
          </p>
          
          <Button onClick={handleRestart} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Attempt Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 max-w-2xl mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
        </div>
        <span className="text-sm font-medium text-primary">{score} correct</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
        {question.question}
      </h3>

      {/* Options */}
      <RadioGroup
        value={selectedAnswer}
        onValueChange={setSelectedAnswer}
        className="space-y-3"
        disabled={showResult}
      >
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Label
              htmlFor={`option-${index}`}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                showResult
                  ? index === question.correctAnswer
                    ? "border-green-500 bg-green-500/10"
                    : selectedAnswer === String(index)
                    ? "border-destructive bg-destructive/10"
                    : "border-border"
                  : selectedAnswer === String(index)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value={String(index)} id={`option-${index}`} className="mt-0.5" />
              <span className="text-sm leading-relaxed">{option}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>

      {/* Result feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-6 p-4 rounded-lg ${
              isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-destructive/10 border border-destructive/30"
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium mb-1 ${isCorrect ? "text-green-500" : "text-destructive"}`}>
                  {isCorrect ? "Precisely correct." : "Not quite."}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        {!showResult ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedAnswer}
            className="px-6"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="px-6">
            {currentQuestion < quizQuestions.length - 1 ? "Continue" : "View Results"}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default StacksQuiz;
