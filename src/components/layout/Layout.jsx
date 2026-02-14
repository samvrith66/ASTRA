import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AgentPanel } from '../AgentPanel';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

const Layout = () => {
    const { state, updateState } = useApp();
    const { agentMessages, isAgentThinking } = state;
    const [isAgentOpen, setIsAgentOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // API Key is now handled via .env, no manual check needed

    const steps = [
        { path: '/', label: 'Home' },
        { path: '/profile', label: 'Profile' },
        { path: '/role', label: 'Role' },
        { path: '/analysis', label: 'Analysis' },
        { path: '/roadmap', label: 'Roadmap' },
    ];

    const currentStepIndex = steps.findIndex(s => s.path === location.pathname);

    return (
        <div className="min-h-screen bg-background text-text-primary font-body overflow-x-hidden relative bg-dot-grid">

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-border h-16">
                <div className="container mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold font-display shadow-md shadow-primary/20">CN</div>
                        <span className="font-bold text-lg hidden md:block tracking-tight">CareerNavigator</span>
                    </div>

                    {/* Progress Dots */}
                    {location.pathname !== '/' && (
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map(step => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentStepIndex >= step ? 'bg-primary scale-110' : 'bg-gray-200'
                                        }`}></div>
                                    {step < 4 && <div className={`w-8 h-[2px] mx-1 transition-all duration-300 ${currentStepIndex > step ? 'bg-primary' : 'bg-gray-100'
                                        }`}></div>}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {/* API Key Managed via .env */}
                        {location.pathname !== '/' && (
                            <Button variant="ghost" size="sm" onClick={() => {
                                localStorage.removeItem('career_navigator_progress');
                                localStorage.removeItem('career_demo_mode');
                                localStorage.removeItem('career_profile');
                                localStorage.removeItem('career_role');
                                updateState('profile', null);
                                updateState('selectedRole', null);
                                updateState('analysis', null);
                                updateState('roadmap', null);
                                updateState('agentMessages', []);
                                updateState('isAgentThinking', false);
                                navigate('/');
                            }} className="text-xs text-text-muted hover:text-danger">
                                Reset App
                            </Button>
                        )}
                        <button
                            onClick={() => setIsAgentOpen(true)}
                            className="w-9 h-9 rounded-full bg-white border border-border hover:border-primary flex items-center justify-center transition-all relative shadow-sm group"
                        >
                            <Brain size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
                            {isAgentThinking && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content with Transition */}
            <main className="pt-24 pb-20 container mx-auto px-4 min-h-screen">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* Agent Sidebar */}
            <AgentPanel
                isOpen={isAgentOpen}
                onClose={() => setIsAgentOpen(false)}
                thoughts={agentMessages.map(m => ({ text: m.message, timestamp: m.timestamp, type: m.type }))}
                isThinking={isAgentThinking}
            />
        </div>
    );
};

export default Layout;
