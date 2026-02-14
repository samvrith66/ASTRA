import { motion } from 'framer-motion';
import { icons } from 'lucide-react';
import { Check } from 'lucide-react';

export const RoleCard = ({ role, isSelected, onClick }) => {
    const Icon = icons[role.icon] || icons.Briefcase;

    return (
        <motion.div
            whileHover={{ y: -5, borderColor: 'var(--accent-blue)' }}
            className={`relative p-6 rounded-xl border transition-all cursor-pointer h-full flex flex-col bg-card hover:shadow-md ${isSelected
                    ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                    : 'border-border'
                }`}
            onClick={onClick}
        >
            {isSelected && (
                <div className="absolute top-4 right-4 text-primary">
                    <Check size={20} />
                </div>
            )}

            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isSelected ? 'bg-primary text-white' : 'bg-surface text-text-secondary'
                }`}>
                <Icon size={24} />
            </div>

            <h3 className="text-lg font-bold text-text-primary mb-2">
                {role.title}
            </h3>

            <p className="text-text-secondary text-sm mb-6 flex-grow">
                {role.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
                {role.skills.technical.slice(0, 3).map((skill) => (
                    <span
                        key={skill}
                        className="text-xs px-2 py-1 rounded bg-surface border border-border text-text-muted"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};
