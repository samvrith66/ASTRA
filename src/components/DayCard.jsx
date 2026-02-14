import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { Check, ExternalLink, ChevronRight } from 'lucide-react';
import { Badge } from './ui/Badge';

export const DayCard = ({ dayData, isCompleted, onToggleComplete }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="relative h-[300px] perspective-1000 group">
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                onClick={() => !isFlipped && setIsFlipped(true)}
            >
                {/* Front Face */}
                <Card className={`absolute inset-0 backface-hidden flex flex-col justify-between cursor-pointer ${isCompleted ? 'bg-success/5 border-success/30' : ''}`}>
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant="primary">Day {dayData.day}</Badge>
                            {isCompleted && <Check className="text-success" size={20} />}
                        </div>
                        <h4 className="text-lg font-bold mb-2 line-clamp-3">{dayData.focus}</h4>
                        <div className="w-10 h-1 bg-primary rounded-full mb-4" />
                    </div>

                    <div className="mt-auto flex justify-between items-center text-sm text-text-secondary group-hover:text-primary transition-colors">
                        <span>View Details</span>
                        <ChevronRight size={16} />
                    </div>
                </Card>

                {/* Back Face */}
                <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-surface/95 flex flex-col h-full border-primary/30">
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="mb-4">
                            <span className="text-xs font-label text-secondary block mb-1">LEARN</span>
                            <a
                                href={dayData.resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold hover:text-primary flex items-center gap-2 group/link"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {dayData.resource.title}
                                <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                        </div>

                        <div className="mb-4">
                            <span className="text-xs font-label text-secondary block mb-1">DO</span>
                            <p className="text-sm text-text-secondary">{dayData.project}</p>
                        </div>

                        <div>
                            <span className="text-xs font-label text-secondary block mb-1">CHECKPOINT</span>
                            <p className="text-sm text-text-secondary">{dayData.checkpoint}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-auto">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsFlipped(false);
                            }}
                            className="text-xs text-text-secondary hover:text-white"
                        >
                            Back
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete();
                            }}
                            className={`text-xs px-3 py-1.5 rounded-md font-bold transition-colors ${isCompleted
                                    ? 'bg-success/20 text-success hover:bg-success/30'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {isCompleted ? 'Completed' : 'Mark Done'}
                        </button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};
