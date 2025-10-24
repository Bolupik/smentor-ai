import { motion } from "framer-motion";
import aiCharacter from "@/assets/ai-character.jpg";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden border-b border-primary/30 bg-card/30 backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 animate-gradient-shift" />
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary animate-float"
              style={{ boxShadow: "var(--shadow-glow-lg)" }}
            >
              <img 
                src={aiCharacter} 
                alt="DeFi Guide" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Stacks DeFi Guide
              </h1>
              <p className="text-muted-foreground">
                Your autonomous AI companion for mastering DeFi on Stacks
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Chat Interface */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex-1 container mx-auto max-w-5xl flex flex-col"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <ChatInterface />
      </motion.main>
    </div>
  );
};

export default Index;
