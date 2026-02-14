import { motion } from 'framer-motion';
import { RoleCard } from './RoleCard';
import { ROLES } from '../lib/roles';

export const RoleSelector = ({ selectedRole, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
        >
            <div className="text-center mb-10">
                <span className="text-primary text-xs font-bold tracking-widest uppercase mb-2 block">Step 2</span>
                <h2 className="text-3xl font-bold text-text-primary mb-2">Select Your Path</h2>
                <p className="text-text-secondary">Choose a target role to analyze gaps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(ROLES).map((role, index) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <RoleCard
                            role={role}
                            isSelected={selectedRole?.id === role.id}
                            onClick={() => onSelect(role)}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
