import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Terminal, Cpu, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20); // Speed up slightly
        return () => clearInterval(interval);
    }, [text]);

    return <span>{displayedText}</span>;
};

export const AgentPanel = ({ isOpen, onClose, thoughts, isThinking }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [thoughts, isThinking, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-[#0a0a0a] border-l border-primary/20 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-surface/50 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Brain className="text-primary" size={20} />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#b8ff57]"></span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-display font-bold text-white tracking-wide">NEURAL_FEED</h3>
                                    <p className="text-[10px] font-mono text-primary/70 uppercase tracking-widest">Agent Reasoning</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar" ref={scrollRef}>
                            {thoughts.length === 0 && !isThinking && (
                                <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                                    <Terminal size={48} strokeWidth={1} className="mb-4" />
                                    <p className="font-mono text-xs text-center">Awaiting data input...</p>
                                </div>
                            )}

                            {thoughts.map((thought, index) => (
                                <div key={index} className="relative pl-6 border-l border-white/10 pb-2">
                                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-surface border border-primary/50 rounded-full"></div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-mono px-1 rounded flex items-center gap-1 ${thought.text.includes('Generating') ? 'text-secondary bg-secondary/10' :
                                                thought.text.includes('Analyzing') ? 'text-blue-400 bg-blue-400/10' :
                                                    'text-primary bg-primary/10'
                                            }`}>
                                            <ChevronRight size={8} />
                                            {thought.type || 'LOG'}
                                        </span>
                                        <span className="text-[10px] font-mono text-text-muted">
                                            {thought.timestamp ? new Date(thought.timestamp ? thought.timestamp : Date.now()).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '00:00:00'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-mono text-text-secondary leading-relaxed">
                                        <TypewriterText text={thought.text} />
                                    </p>
                                </div>
                            ))}

                            {isThinking && (
                                <div className="relative pl-6 border-l border-white/10">
                                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-primary rounded-full animate-ping"></div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded">PROCESSING</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5 bg-surface/30">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
                                <Cpu size={12} />
                                <span>SYSTEM STATUS: ONLINE</span>
                                <span className="flex-1"></span>
                                <span>LATENCY: 24ms</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
