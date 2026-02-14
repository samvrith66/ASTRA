import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Brain, Target, Compass, ChevronDown } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// Typewriter Component
const Typewriter = ({ text }) => {
    const [display, setDisplay] = useState('');

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplay(text.substring(0, i + 1));
            i++;
            if (i > text.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <span className="inline-block relative">
            {display}
            <span className="ml-1 inline-block w-[3px] h-[1em] bg-primary animate-pulse align-middle"></span>
        </span>
    );
};

// Counter Component
const Counter = ({ value, label, suffix = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                {isInView ? value : 0}{suffix}
            </div>
            <div className="text-sm font-mono text-text-secondary uppercase tracking-wider">{label}</div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.4, ease: "easeOut" }}
        whileHover={{
            y: -6,
            scale: 1.02,
            transition: { duration: 0.2 }
        }}
        className="bg-white p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all"
    >
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-text-secondary leading-relaxed">{desc}</p>
    </motion.div>
);

export default function Landing() {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen"
        >
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full shadow-sm text-sm font-medium text-text-secondary"
                    >
                        <Brain size={16} className="text-primary" />
                        <span>AI-Powered Career Architect</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold text-text-primary mb-8 leading-tight max-w-4xl">
                        <Typewriter text="Your Career. Engineered by AI." />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed"
                    >
                        Not generic advice. A living, adapting roadmap built from YOUR profile.
                        Bridge the gap between where you are and where you want to go.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate('/profile')}
                                className="text-lg px-8 py-6 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                            >
                                Start My Journey <ArrowRight className="ml-2" />
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                    localStorage.setItem('career_demo_mode', 'true');
                                    localStorage.setItem('career_profile', JSON.stringify({
                                        source: 'demo',
                                        fileName: null,
                                        rawText: '',
                                        skills: {
                                            technical: ["Python", "JavaScript", "React", "HTML", "CSS", "Git", "SQL", "Node.js"],
                                            nonTechnical: ["Communication", "Problem Solving", "Teamwork"],
                                            certifications: [],
                                            experienceLevel: "intermediate"
                                        }
                                    }));
                                    localStorage.setItem('career_role', JSON.stringify({ title: "ML Engineer", id: "ml-engineer" }));
                                    navigate('/analysis');
                                }}
                                className="text-lg px-8 py-6 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white"
                            >
                                Try Demo Mode
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Background Decor */}
                <motion.div style={{ y: y1 }} className="absolute -z-10 top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] mix-blend-multiply opacity-70"></motion.div>
                <motion.div style={{ y: y1 }} className="absolute -z-10 bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] mix-blend-multiply opacity-70"></motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-muted"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-y border-border bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <Counter value="30" label="Day Roadmap" suffix="" />
                    <Counter value="100" label="Personalized" suffix="%" />
                    <Counter value="2.0" label="Gemini Model" suffix=" Flash" />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-display font-bold mb-4">Precision Engineering</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Our agent works like a senior engineer, deconstructing your profile and reconstructing it for your target role.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Brain}
                            title="Profile Analysis"
                            desc="We scan your GitHub, parse your resume, and understand your experience level instantly."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Target}
                            title="Skill Gap Detection"
                            desc="We identify exactly what you're missing for your target role—down to the specific library."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Compass}
                            title="Adaptive Roadmap"
                            desc="A 30-day curriculum that evolves as you complete tasks. No wasted time on what you already know."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
