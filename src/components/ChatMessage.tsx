import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import aiCharacter from "@/assets/ai-character.png";
import VoiceControls from "./VoiceControls";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className={`flex gap-4 mb-6 ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      {isAssistant && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary flex-shrink-0 shadow-lg shadow-primary/20"
        >
          <img src={aiCharacter} alt="Stacks AI Guide" className="w-full h-full object-cover" />
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, x: isAssistant ? -10 : 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className={`max-w-[80%] md:max-w-[70%] ${
          isAssistant
            ? "bg-card/80 backdrop-blur-sm border border-border/50 text-card-foreground rounded-2xl rounded-tl-sm shadow-lg"
            : "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-lg shadow-primary/20"
        } px-5 py-4`}
      >
        {isAssistant ? (
          <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-primary">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  
                  return !isInline ? (
                    <pre className="bg-muted/80 rounded-lg p-4 overflow-x-auto my-3 text-sm border border-border/50">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-3">{children}</h3>,
                p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-3 space-y-1 list-disc list-inside">{children}</ul>,
                ol: ({ children }) => <ol className="mb-3 space-y-1 list-decimal list-inside">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        )}
        {isAssistant && content.length > 20 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-3 border-t border-border/30 flex justify-end"
          >
            <VoiceControls text={content} />
          </motion.div>
        )}
      </motion.div>
      {!isAssistant && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 border border-border/50"
        >
          <span className="text-xs font-bold text-foreground">YOU</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;