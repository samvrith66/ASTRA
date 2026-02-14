import { motion } from 'framer-motion';

export const GapBar = ({ label, current, max = 100, color = 'bg-primary' }) => {
    const percentage = Math.min((current / max) * 100, 100);

    return (
        <div className="w-full mb-4">
            <div className="flex justify-between text-xs font-label mb-2 text-text-secondary">
                <span>{label}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
};
