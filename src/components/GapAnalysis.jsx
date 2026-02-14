import { motion } from 'framer-motion';
import { Check, AlertTriangle, TrendingUp } from 'lucide-react';

export const GapAnalysis = ({ analysis, targetRole }) => {
    if (!analysis) return null;

    const readinessScore = analysis?.readinessScore || 0;
    const scoreColor = readinessScore > 70 ? 'text-success' : readinessScore > 40 ? 'text-secondary' : 'text-danger';
    const ringColor = readinessScore > 70 ? '#10b981' : readinessScore > 40 ? '#f59e0b' : '#ef4444';
    const summary = analysis?.summary || "No summary available.";
    const experienceLevel = analysis?.experienceLevel || "Unknown";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto"
        >
            <div className="text-center mb-10">
                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">Analysis Report</span>
                <h2 className="text-3xl font-bold text-text-primary mb-2">Gap Analysis</h2>
                <p className="text-text-secondary">Where you stand vs {targetRole?.title}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                    className="bg-card border border-border p-8 rounded-xl flex flex-col items-center justify-center text-center shadow-sm"
                >
                    <h3 className="text-lg font-bold text-text-primary mb-4">Readiness Score</h3>
                    <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke={ringColor}
                                strokeWidth="8"
                                fill="transparent"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: 351, strokeDashoffset: 351 }}
                                animate={{ strokeDashoffset: 351 - (351 * (readinessScore / 100)) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <span className={`text-2xl font-bold ${scoreColor}`}>{readinessScore}%</span>
                            </motion.div>
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary">{experienceLevel} Level</p>
                </motion.div>

                {/* Details */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                        className="bg-card border border-border p-6 rounded-xl shadow-sm"
                    >
                        <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                            Agent Assessment
                        </h4>
                        <p className="text-text-secondary leading-relaxed text-sm">
                            {summary}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                            className="bg-card border border-border p-6 rounded-xl shadow-sm"
                        >
                            <h5 className="text-sm font-bold text-success mb-4 uppercase">Strengths</h5>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: { transition: { staggerChildren: 0.05 } }
                                }}
                                className="flex flex-col gap-2"
                            >
                                {(analysis.strengths || []).map((item, i) => (
                                    <motion.div
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        className="flex justify-between items-center px-3 py-2 bg-green-50 text-green-700 text-xs rounded border border-green-100"
                                    >
                                        <span className="font-semibold">{item.skill || item}</span>
                                        {item.level && <span className="opacity-75 text-[10px] uppercase">{item.level}</span>}
                                    </motion.div>
                                ))}
                                {(!analysis.strengths || analysis.strengths.length === 0) && (
                                    <span className="text-text-muted text-xs italic">No specific strengths identified.</span>
                                )}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                            className="bg-card border border-border p-6 rounded-xl shadow-sm"
                        >
                            <h5 className="text-sm font-bold text-danger mb-4 uppercase">Critical Gaps</h5>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: { transition: { staggerChildren: 0.05 } }
                                }}
                                className="flex flex-col gap-2"
                            >
                                {(analysis.criticalGaps || []).map((item, i) => (
                                    <motion.div
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        className="flex flex-col px-3 py-2 bg-red-50 text-red-700 text-xs rounded border border-red-100"
                                    >
                                        <div className="flex justify-between w-full mb-1">
                                            <span className="font-bold">{item.skill || item}</span>
                                            {item.estimatedDays && <span className="opacity-75">{item.estimatedDays} days</span>}
                                        </div>
                                        {item.reason && <span className="opacity-90 italic text-[10px]">{item.reason}</span>}
                                    </motion.div>
                                ))}
                                {(!analysis.criticalGaps || analysis.criticalGaps.length === 0) && (
                                    <span className="text-text-muted text-xs italic">No critical gaps identified.</span>
                                )}
                            </motion.div>
                        </motion.div>

                        {(analysis.niceToHaveGaps && analysis.niceToHaveGaps.length > 0) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                                className="bg-card border border-border p-6 rounded-xl shadow-sm md:col-span-2"
                            >
                                <h5 className="text-sm font-bold text-secondary mb-4 uppercase">Recommended for Growth</h5>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.niceToHaveGaps.map((item, i) => (
                                        <div key={i} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-100 flex items-center gap-2">
                                            <span className="font-semibold">{item.skill || item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
