import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ROLES } from '../lib/roles';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { icons, Check, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function Role() {
    const { state, updateState } = useApp();
    const { selectedRole, profile } = state;
    const navigate = useNavigate();

    // Guard clause
    useEffect(() => {
        if (!profile) navigate('/profile');
    }, [profile, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSelect = (role) => {
        updateState('selectedRole', role);
    };

    const handleContinue = () => {
        if (selectedRole) {
            navigate('/analysis');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen pt-12 pb-32"
        >
            <div className="text-center mb-16 px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-display font-bold mb-4"
                >
                    Where do you want to go?
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-text-secondary max-w-xl mx-auto"
                >
                    Select your target role. The agent will map the distance between here and there.
                </motion.p>
            </div>

            {/* Masonry-ish Grid */}
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.values(ROLES).map((role, idx) => {
                        const Icon = icons[role.icon] || icons.Briefcase;
                        const isSelected = selectedRole?.id === role.id;

                        return (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
                                whileHover={{
                                    y: -6,
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                onClick={() => handleSelect(role)}
                                className={`
                                    relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col h-full bg-white
                                    ${isSelected
                                        ? 'border-primary ring-2 ring-primary/20 shadow-xl'
                                        : 'border-border hover:shadow-lg hover:border-primary/50'
                                    }
                                    ${!isSelected && selectedRole ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'}
                                `}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-surface text-text-secondary'}`}>
                                    <Icon size={24} />
                                </div>

                                <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                                <p className="text-sm text-text-secondary mb-4 flex-grow">{role.description}</p>

                                {/* Hover Skill Preview */}
                                <div className="mt-auto border-t border-border pt-4">
                                    <div className="flex flex-wrap gap-1">
                                        {role.skills.technical.slice(0, 3).map(s => (
                                            <span key={s} className="text-[10px] px-2 py-0.5 bg-surface rounded text-text-muted">{s}</span>
                                        ))}
                                        <span className="text-[10px] px-2 py-0.5 text-text-muted">+{role.skills.technical.length - 3} more</span>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="absolute top-4 right-4 text-primary bg-white rounded-full p-1 shadow-sm">
                                        <Check size={20} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Sticky Footer */}
            <motion.div
                animate={{ y: selectedRole ? 0 : 100 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <Button
                        size="lg"
                        onClick={handleContinue}
                        className="shadow-2xl shadow-primary/30 px-12 py-6 text-lg rounded-full"
                    >
                        Begin Gap Analysis <ArrowRight className="ml-2" />
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
