import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Loader, Calendar } from 'lucide-react';
import { RoadmapView } from '../components/RoadmapView';
import toast from 'react-hot-toast';
import { callGemini } from '../utils/gemini';

export default function Roadmap() {
    const { state, updateState, addAgentMessage } = useApp();
    const { profile, selectedRole, analysis } = state;
    // Step 1 - Add Safe Initial State
    const roadmap = state.roadmap || JSON.parse(localStorage.getItem("career_roadmap")) || { weeks: [] };
    // Prevent flash: generate if no existing data in state or local storage
    const [generating, setGenerating] = useState(!(state.roadmap || localStorage.getItem("career_roadmap")));
    const navigate = useNavigate();
    const hasRan = useRef(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!analysis) { navigate('/analysis'); return; }

        // Check if we have valid roadmap data (weeks exist and are not empty)
        if (roadmap && roadmap.weeks && roadmap.weeks.length > 0) {
            setGenerating(false);
            return;
        }

        if (hasRan.current) return;
        hasRan.current = true;

        const generateRoadmap = async () => {
            setGenerating(true);
            addAgentMessage('GENERATE', "Designing 30-day protocol...");

            // Timeout fallback
            const timeoutId = setTimeout(() => {
                if (generating) {
                    setGenerating(false);
                    useFallbackRoadmap();
                    toast.error('Generation timed out - using template');
                }
            }, 20000);

            try {
                const gaps = (analysis?.criticalGaps || []).map(g => (typeof g === 'string' ? g : g.skill)).join(', ') || 'Python, Machine Learning';
                const role = selectedRole.title || 'ML Engineer';
                const level = analysis?.experienceLevel || 'intermediate';

                const roadmapData = await callGemini(`
Generate 30-day roadmap.

Target role: ${role}

Critical gaps:
${gaps}

Return JSON format:
{
weeks:[
{
weekNumber:number,
theme:string,
days:[
{
day:number,
title:string,
focus:string,
resource:{
name:string,
url:string,
type:string,
platform:string
},
task:string,
checkpoint:string,
estimatedMinutes:number
}
]
}
]
}
`);

                // Step 6 - Guarantee Roadmap Structure
                if (!roadmapData.weeks) {
                    roadmapData.weeks = [];
                }

                const progress = JSON.parse(localStorage.getItem('career_navigator_progress') || '{}');

                const finalRoadmap = { ...roadmapData, progress };
                updateState('roadmap', finalRoadmap);
                localStorage.setItem('career_roadmap', JSON.stringify(finalRoadmap));
                addAgentMessage('GENERATE', "Roadmap ready.");

            } catch (error) {
                console.error('Roadmap generation error:', error);
                useFallbackRoadmap();
            } finally {
                clearTimeout(timeoutId);
                setGenerating(false);
            }
        };

        generateRoadmap();
    }, [analysis, roadmap, navigate, updateState, addAgentMessage]);

    const useFallbackRoadmap = () => {
        toast.error('Using pre-built roadmap template');

        // Comprehensive fallback data
        const fallback = {
            weeks: [
                {
                    weekNumber: 1,
                    theme: "Foundations",
                    days: [
                        { day: 1, focus: "Understand ML basics", resource: { title: "Google Crash Course", url: "https://developers.google.com/machine-learning/crash-course" } },
                        { day: 2, focus: "NumPy and Pandas basics", resource: { title: "NumPy Docs", url: "https://numpy.org/learn/" } },
                        { day: 3, focus: "Matplotlib and Seaborn", resource: { title: "Matplotlib Tutorials", url: "https://matplotlib.org/stable/tutorials/index.html" } },
                        { day: 4, focus: "Data manipulation", resource: { title: "Pandas Docs", url: "https://pandas.pydata.org/docs/" } },
                        { day: 5, focus: "Probability and statistics", resource: { title: "Khan Academy", url: "https://www.khanacademy.org/math/statistics-probability" } },
                        { day: 6, focus: "Vectors and matrices", resource: { title: "Linear Algebra", url: "https://www.khanacademy.org/math/linear-algebra" } },
                        { day: 7, focus: "Apply all concepts", resource: { title: "Kaggle", url: "https://www.kaggle.com/" } }
                    ]
                },
                {
                    weekNumber: 2,
                    theme: "Machine Learning Core",
                    days: [
                        { day: 8, focus: "Supervised vs Unsupervised Learning", resource: { title: "Google Crash Course", url: "https://developers.google.com/machine-learning/crash-course" } },
                        { day: 9, focus: "Linear Regression", resource: { title: "Scikit-Learn", url: "https://scikit-learn.org/" } },
                        { day: 10, focus: "Logistic Regression", resource: { title: "Scikit-Learn", url: "https://scikit-learn.org/" } },
                        { day: 11, focus: "Model evaluation metrics", resource: { title: "Scikit-Learn", url: "https://scikit-learn.org/" } },
                        { day: 12, focus: "Train/Test split", resource: { title: "Scikit-Learn", url: "https://scikit-learn.org/" } },
                        { day: 13, focus: "Feature engineering", resource: { title: "Data Prep", url: "https://developers.google.com/machine-learning/data-prep" } },
                        { day: 14, focus: "Mini ML project", resource: { title: "Kaggle", url: "https://www.kaggle.com/" } }
                    ]
                },
                {
                    weekNumber: 3,
                    theme: "Deep Learning",
                    days: [
                        { day: 15, focus: "Neural network basics", resource: { title: "DeepLearning.AI", url: "https://www.deeplearning.ai/" } },
                        { day: 16, focus: "Forward and backpropagation", resource: { title: "CS231n", url: "https://cs231n.github.io/" } },
                        { day: 17, focus: "TensorFlow basics", resource: { title: "TensorFlow", url: "https://www.tensorflow.org/tutorials" } },
                        { day: 18, focus: "PyTorch basics", resource: { title: "PyTorch", url: "https://pytorch.org/tutorials/" } },
                        { day: 19, focus: "Training neural networks", resource: { title: "PyTorch Blitz", url: "https://pytorch.org/tutorials/" } },
                        { day: 20, focus: "Regularization and overfitting", resource: { title: "Overfitting", url: "https://developers.google.com/machine-learning/crash-course/overfitting" } },
                        { day: 21, focus: "Deep learning project", resource: { title: "Kaggle", url: "https://www.kaggle.com/" } }
                    ]
                },
                {
                    weekNumber: 4,
                    theme: "Deployment and MLOps",
                    days: [
                        { day: 22, focus: "Model deployment basics", resource: { title: "FastAPI", url: "https://fastapi.tiangolo.com/" } },
                        { day: 23, focus: "Build ML API", resource: { title: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" } },
                        { day: 24, focus: "Model serialization", resource: { title: "Scikit-Learn", url: "https://scikit-learn.org/" } },
                        { day: 25, focus: "Deploy using FastAPI", resource: { title: "FastAPI", url: "https://fastapi.tiangolo.com/" } },
                        { day: 26, focus: "Intro to MLOps", resource: { title: "MLflow", url: "https://mlflow.org/docs/latest/index.html" } },
                        { day: 27, focus: "Model monitoring", resource: { title: "Neptune.ai", url: "https://neptune.ai/blog/ml-monitoring" } },
                        { day: 28, focus: "Capstone project", resource: { title: "Kaggle", url: "https://www.kaggle.com/" } },
                        { day: 29, focus: "Optimize model", resource: { title: "Scikit-Learn", url: "https://scikit-learn.org/" } },
                        { day: 30, focus: "Deploy portfolio project", resource: { title: "GitHub", url: "https://github.com/" } }
                    ]
                }
            ]
        };

        const progress = JSON.parse(localStorage.getItem('career_navigator_progress') || '{}');
        const finalRoadmap = { ...fallback, progress };

        updateState('roadmap', finalRoadmap);
        localStorage.setItem('career_roadmap', JSON.stringify(finalRoadmap));
    };

    // Toggle day completion
    const toggleDayComplete = (weekNum, dayNum) => {
        const key = `w${weekNum}d${dayNum}`;
        const currentProgress = { ...(roadmap?.progress || {}) };
        currentProgress[key] = !currentProgress[key];

        localStorage.setItem('career_navigator_progress', JSON.stringify(currentProgress));

        if (roadmap) {
            updateState('roadmap', { ...roadmap, progress: currentProgress });
        }

        if (currentProgress[key] && roadmap) {
            const week = roadmap.weeks.find(w => w.weekNumber === weekNum);
            if (week) {
                const allDaysComplete = week.days.every(d => currentProgress[`w${weekNum}d${d.day}`]);
                if (allDaysComplete) {
                    window.confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
                    addAgentMessage('SUCCESS', `Week ${weekNum} completed! Outstanding.`);
                }
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen pt-8 pb-32"
        >
            <AnimatePresence>
                {generating ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-[60vh] text-center"
                    >
                        <div className="w-full max-w-md bg-gray-100 h-2 rounded-full overflow-hidden mb-8 relative">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                            />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Architecting Your Trajectory</h2>
                        <p className="text-text-secondary">Structuring daily checkpoints and resources...</p>
                    </motion.div>
                ) : (
                    roadmap && (
                        <RoadmapView
                            roadmap={roadmap}
                            completedDays={Object.keys(roadmap.progress || {}).filter(k => roadmap.progress[k])}
                            onToggleDay={(dayId, weekNum) => {
                                const dayNum = parseInt(dayId.split('d')[1]);
                                toggleDayComplete(weekNum, dayNum);
                            }}
                        />
                    )
                )}
            </AnimatePresence>
        </motion.div>
    );
}
