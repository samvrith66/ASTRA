import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trophy } from 'lucide-react';
import { DayCard } from './DayCard';
import confetti from 'canvas-confetti';

export const WeekSection = ({ weekData, completedDays, onToggleDay }) => {
    const [isOpen, setIsOpen] = useState(weekData.week === 1); // Default open first week

    const weekCompletedCount = weekData.days.filter(d => completedDays.includes(d.day)).length;
    const isWeekComplete = weekCompletedCount === weekData.days.length;

    const handleWeekComplete = () => {
        if (!isWeekComplete && weekCompletedCount === weekData.days.length - 1) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#b8ff57', '#ff9a3c', '#ffffff']
            });
        }
    };

    return (
        <div className="mb-8 border border-white/5 rounded-2xl overflow-hidden bg-surface/30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isWeekComplete ? 'bg-success text-black' : 'bg-primary/10 text-primary'}`}>
                        <span className="font-display font-bold text-xl">0{weekData.week}</span>
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg">{weekData.theme}</h3>
                        <p className="text-sm text-text-secondary">{weekCompletedCount} / {weekData.days.length} Completed</p>
                    </div>
                </div>
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {weekData.days.map((day) => (
                                <DayCard
                                    key={day.day}
                                    dayData={day}
                                    isCompleted={completedDays.includes(day.day)}
                                    onToggleComplete={() => {
                                        onToggleDay(day.day);
                                        handleWeekComplete();
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
