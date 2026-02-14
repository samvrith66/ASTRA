import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Loader, Brain, ArrowRight } from 'lucide-react';
import { GapAnalysis } from '../components/GapAnalysis';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { callGemini } from '../utils/gemini';

export default function Analysis() {
    const { state, updateState, addAgentMessage } = useApp();
    const navigate = useNavigate();
    const hasRan = useRef(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // START STEP 3
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [thinkingStep, setThinkingStep] = useState(0);

    // Initial check for required data
    useEffect(() => {
        const profile = state.profile || JSON.parse(localStorage.getItem('career_profile') || 'null');
        const role = state.selectedRole || localStorage.getItem('career_role') || null;

        if (!profile) {
            navigate('/profile');
        } else if (!role) {
            navigate('/role');
        }
    }, [state.profile, state.selectedRole, navigate]);

    // START STEP 1 & 2
    useEffect(() => {
        // If we already have analysis, don't re-run
        if (state.analysis) {
            setIsAnalyzing(false);
            return;
        }

        const runAnalysis = async () => {
            if (hasRan.current) return;
            hasRan.current = true;

            setIsAnalyzing(true);

            // Thinking loop visual
            const steps = [
                "Mapping skills to role requirements...",
                "Calculating competency vectors...",
                "Identifying critical gaps...",
                "Generating confidence scores..."
            ];
            const interval = setInterval(() => {
                setThinkingStep(prev => (prev + 1) % steps.length);
            }, 2000);

            // START STEP 5: Timeout Fallback
            const timeoutId = setTimeout(() => {
                if (isAnalyzing) {
                    console.log('Timeout reached, using fallback');
                    clearInterval(interval);
                    useFallbackData();
                    setIsAnalyzing(false);
                }
            }, 15000);

            try {
                // Get data from localStorage if state is empty
                const profile = state.profile || JSON.parse(localStorage.getItem('career_profile') || 'null');
                let role = state.selectedRole || localStorage.getItem('career_role') || 'ML Engineer';

                // Handle case where role might be an object or string
                const roleTitle = (typeof role === 'object' && role !== null) ? role.title : role;

                if (!profile) {
                    navigate('/profile');
                    return; // Should be handled by other useEffect, but safety first
                }

                addAgentMessage('ANALYZE', `Starting analysis for ${roleTitle}...`);

                const analysisData = await callGemini(`
Analyze skill gap.

User skills:
${(profile.skills?.technical || []).join(", ")}

Target role:
${roleTitle}

Return JSON format:
{
readinessScore:number,
strengths:[{skill:string,level:string}],
criticalGaps:[{skill:string,priority:string,reason:string,estimatedDays:number}],
niceToHaveGaps:[{skill:string,reason:string}],
experienceLevel:string,
summary:string,
weeklyHoursNeeded:number,
estimatedMonthsToReady:number
}
`);

                updateState('analysis', analysisData);
                localStorage.setItem('career_analysis', JSON.stringify(analysisData));
                addAgentMessage('ANALYZE', `Analysis complete. Readiness: ${analysisData.readinessScore}%`);

            } catch (error) {
                console.error('Analysis error:', error);
                useFallbackData();
            } finally {
                clearInterval(interval);
                clearTimeout(timeoutId);
                setIsAnalyzing(false);
            }
        };

        runAnalysis();
    }, []); // Run once on mount

    const useFallbackData = () => {
        // USE FALLBACK DATA so user is not stuck
        const fallbackAnalysis = {
            readinessScore: 55,
            strengths: [
                { skill: "Programming Fundamentals", level: "proficient" },
                { skill: "Problem Solving", level: "proficient" }
            ],
            criticalGaps: [
                {
                    skill: "PyTorch/TensorFlow", priority: "high",
                    reason: "Core ML framework required", estimatedDays: 14
                },
                {
                    skill: "Machine Learning Theory", priority: "high",
                    reason: "Foundational knowledge needed", estimatedDays: 10
                },
                {
                    skill: "Data Processing with Pandas", priority: "high",
                    reason: "Essential for data manipulation", estimatedDays: 7
                }
            ],
            niceToHaveGaps: [
                { skill: "CUDA Programming", reason: "GPU acceleration" },
                { skill: "MLflow", reason: "Experiment tracking" }
            ],
            experienceLevel: "intermediate",
            summary: "You have a solid programming foundation. Focus on ML-specific frameworks and mathematical concepts to reach your target role.",
            weeklyHoursNeeded: 10,
            estimatedMonthsToReady: 3
        };

        updateState('analysis', fallbackAnalysis);
        localStorage.setItem('career_analysis', JSON.stringify(fallbackAnalysis));
        addAgentMessage('ERROR', 'AI analysis failed — showing estimated results');
        toast.error('AI analysis failed — showing estimated results');
    };

    // START STEP 4
    const analysis = state.analysis || JSON.parse(localStorage.getItem('career_analysis') || 'null');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen pt-12"
        >
            <AnimatePresence mode="wait">
                {isAnalyzing && (
                    <motion.div
                        key="thinking"
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center h-[60vh]"
                    >
                        <div className="relative w-64 h-64 mb-12">
                            <motion.div
                                className="absolute inset-0 border-4 border-primary/20 rounded-full"
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            <motion.div
                                className="absolute inset-4 border-4 border-primary/40 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <Brain size={48} className="text-primary mb-4" />
                                <span className="font-mono font-bold text-lg">AGENT WORKING</span>
                            </div>
                        </div>

                        <motion.div
                            key={thinkingStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xl font-medium text-text-secondary"
                        >
                            {[
                                "Mapping skills...",
                                "Calculating vectors...",
                                "Identifying gaps...",
                                "Finalizing score..."
                            ][thinkingStep]}
                        </motion.div>
                    </motion.div>
                )}

                {!isAnalyzing && analysis && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="container mx-auto px-4"
                    >
                        <GapAnalysis analysis={analysis} targetRole={state.selectedRole || { title: 'Target Role' }} />

                        <div className="flex justify-center mt-12 mb-20">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/roadmap')}
                                    className="text-lg px-12 py-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                                >
                                    Generate 30-Day Roadmap <ArrowRight className="ml-2" />
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {!isAnalyzing && !analysis && (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <h2 className="text-2xl font-bold mb-4">No Analysis Data</h2>
                        <Button onClick={() => window.location.reload()}>Retry Analysis</Button>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
