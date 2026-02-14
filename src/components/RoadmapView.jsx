import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Flame, Download, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';

const DayCard = ({ day, completed, onToggle }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: completed ? 0.8 : 1, scale: 1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`
                flex flex-col h-full relative group
                rounded-xl border transition-all duration-300 overflow-hidden
                ${completed
                    ? 'bg-surface/50 border-success/20 shadow-none'
                    : 'bg-white border-border hover:border-primary/50 hover:shadow-lg shadow-sm'
                }
            `}
        >
            {/* Status Indicator Bar */}
            <div className={`h-1 w-full ${completed ? 'bg-success' : 'bg-primary/10 group-hover:bg-primary'}`} />

            <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-1 rounded">
                        Day {day.day}
                    </span>
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onToggle(day.day)}
                        className={`
                            w-6 h-6 rounded-full flex items-center justify-center border transition-colors
                            ${completed
                                ? 'bg-success border-success text-white'
                                : 'bg-transparent border-gray-300 text-transparent hover:border-success hover:text-success/20'
                            }
                        `}
                    >
                        <CheckCircle size={14} />
                    </motion.button>
                </div>

                <h4 className={`font-semibold text-sm leading-snug mb-3 flex-grow ${completed ? 'text-muted line-through' : 'text-text-primary'}`}>
                    {day.focus}
                </h4>

                <div className="pt-3 mt-auto border-t border-dashed border-gray-100">
                    <div className="flex items-center justify-between text-xs text-muted">
                        <span>{day.estimatedMinutes || '45'} min</span>
                        {day.resource && (
                            <a
                                href={day.resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
                            >
                                Open Resource <ExternalLink size={10} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const WeekSection = ({ week, completedDays, onToggleDay }) => {
    const [isOpen, setIsOpen] = useState(true);
    const completedInWeek = week.days.filter(d => completedDays.includes(`w${week.weekNumber}d${d.day}`)).length;
    const progress = (completedInWeek / 7) * 100;

    return (
        <div className="mb-8 last:mb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all mb-4 group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        W{week.weekNumber}
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">
                            {week.theme}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-success transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span>{completedInWeek}/7 Completed</span>
                        </div>
                    </div>
                </div>

                <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-gray-50' : ''}`}>
                    <ChevronDown size={20} className="text-muted" />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-2">
                            {(week?.days || []).map((day) => (
                                <DayCard
                                    key={day.day}
                                    day={day}
                                    completed={completedDays.includes(`w${week.weekNumber}d${day.day}`)}
                                    onToggle={(dayNum) => onToggleDay(`w${week.weekNumber}d${dayNum}`, week.weekNumber)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const RoadmapView = ({ roadmap, completedDays, onToggleDay, onGenerate }) => {
    // Full loading guard
    if (!roadmap || !roadmap.weeks) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <h2 className="text-muted animate-pulse">Generating your personalized roadmap...</h2>
            </div>
        );
    }

    const totalDays = 30;
    const completedCount = completedDays.length;
    const streak = completedCount > 0 ? Math.floor(completedCount / 2) : 0; // Simplified streak logic
    const overallProgress = Math.round((completedCount / totalDays) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-border pb-6">
                <div>
                    <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">
                        Career Trajectory
                    </span>
                    <h2 className="text-4xl font-display font-bold text-text-primary mb-2">
                        30-Day Protocol
                    </h2>
                    <p className="text-text-secondary max-w-lg">
                        A structured, daily execute plan to bridge your skill gaps and land your target role.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-border shadow-sm">
                    <div className="text-right px-4 border-r border-border">
                        <div className="text-2xl font-bold text-text-primary leading-none">
                            {overallProgress}%
                        </div>
                        <div className="text-[10px] text-text-muted uppercase font-bold tracking-wide mt-1">
                            Completion
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4">
                        <div className={`p-2 rounded-lg ${streak > 0 ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400'}`}>
                            <Flame size={24} className={streak > 0 ? "animate-pulse" : ""} />
                        </div>
                        <div>
                            <div className="font-bold leading-none text-lg">{streak}</div>
                            <div className="text-[10px] uppercase text-text-muted mt-1">Day Streak</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weeks Grid */}
            <div className="space-y-2">
                {(roadmap?.weeks || []).map((week) => (
                    <WeekSection
                        key={week.weekNumber}
                        week={week}
                        completedDays={completedDays}
                        onToggleDay={onToggleDay}
                    />
                ))}
            </div>

            <div className="mt-16 text-center pb-20 flex justify-center">
                <Button variant="ghost" onClick={() => window.print()} className="flex items-center gap-2">
                    <Download size={16} /> Save / Print Protocol
                </Button>
            </div>
        </motion.div>
    );
};
