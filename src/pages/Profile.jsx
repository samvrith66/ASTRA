import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, FileText, Upload, CheckCircle, ArrowRight, Loader, File, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { callGemini } from '../utils/gemini';
import * as mammoth from "mammoth";
import toast from 'react-hot-toast';

export default function Profile() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { state, updateState, addAgentMessage } = useApp();

    // Local state for inputs
    const [activeTab, setActiveTab] = useState('github');
    const [githubUser, setGithubUser] = useState('');
    const [githubData, setGithubData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState(0); // 0: Idle, 1: Reading, 2: AI, 3: Done
    const [processingText, setProcessingText] = useState('');
    const [extractedSkills, setExtractedSkills] = useState(state.profile?.skills || []);
    const [linkedinText, setLinkedinText] = useState('');

    // Demo Mode Handler
    useEffect(() => {
        if (searchParams.get('demo') === 'true') {
            // Already handled in Landing, but just in case
        }
    }, [searchParams]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // --- FIX 4: File Upload ---
    // --- FIX 4: File Upload ---
    const [uploading, setUploading] = useState(false);

    const handleResumeUpload = async (file) => {
        setUploading(true);
        setProcessingStep(1);
        setProcessingText('Reading file...');
        setIsProcessing(true);
        addAgentMessage('PROCESS', `Reading resume: ${file.name}`);

        try {
            let text = "";
            console.log("Uploading file:", file.name, file.type);

            if (file.type === "application/pdf") {
                const pdf = await window.pdfjsLib.getDocument(
                    await file.arrayBuffer()
                ).promise;

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map(item => item.str).join(" ");
                }
            }
            else if (file.name.toLowerCase().endsWith(".docx")) {
                console.log("DOCX detected");
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({
                    arrayBuffer
                });

                if (!result || !result.value) {
                    throw new Error("Mammoth returned empty result");
                }

                text = result.value;
                console.log("DOCX text extracted:", text.substring(0, 200));
            }
            else if (file.type === "text/plain") {
                text = await file.text();
            }

            if (!text || text.trim().length < 10) {
                throw new Error("No text extracted from resume");
            }

            console.log("Resume text extracted successfully");

            setProcessingStep(2);
            setProcessingText('Analyzing with AI...');
            addAgentMessage('ANALYZE', `Extracted text (${text.length} chars). Analyzing...`);

            let skills;

            try {
                const response = await callGemini(`
Extract skills from resume.

Return JSON:
{
technical:[],
nonTechnical:[],
experienceLevel:string
}

Resume content:
${text.substring(0, 2000)}
`);
                skills = JSON.parse(response);
            } catch (error) {
                console.warn("Gemini failed, using fallback skill detection", error);

                const fallbackSkills = [];
                const skillKeywords = [
                    "JavaScript", "Python", "Java", "React", "Node", "HTML", "CSS",
                    "MongoDB", "SQL", "Git", "C++", "TensorFlow", "PyTorch", "AWS", "Docker"
                ];

                skillKeywords.forEach(skill => {
                    if (text.toLowerCase().includes(skill.toLowerCase())) {
                        fallbackSkills.push(skill);
                    }
                });

                skills = {
                    technical: fallbackSkills.length > 0 ? fallbackSkills : ["General Technical Skills"],
                    nonTechnical: ["Communication", "Problem Solving"],
                    experienceLevel: "intermediate"
                };

                addAgentMessage('Warning', 'AI unavailable, using keyword extraction.');
            }

            updateState("profile", {
                source: "resume",
                rawText: text,
                skills
            });

            navigate("/role");

        } catch (error) {
            console.error("FULL DOCX ERROR:", error);
            addAgentMessage('ERROR', 'Resume upload failed. Open console (F12) and check error.');
            alert("Resume upload failed. Open console (F12) and check error.");
            setProcessingStep(0);
        }
        setUploading(false);
        setIsProcessing(false);
    };

    // --- FIX 5: GitHub Scan ---
    const handleGithubScan = async () => {
        if (!githubUser.trim()) return;

        setLoading(true);
        addAgentMessage('SCAN', `Scanning GitHub: ${githubUser}`);

        try {
            // Fetch user info
            const userRes = await fetch(`https://api.github.com/users/${githubUser}`);
            if (!userRes.ok) throw new Error('User not found');
            const userData = await userRes.json();
            setGithubData(userData);

            // Fetch repos
            const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`);
            const repos = await reposRes.json();

            // Extract languages
            const languageCount = {};
            repos.forEach(repo => {
                if (repo.language) {
                    languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
                }
            });

            const languages = Object.keys(languageCount).sort((a, b) => languageCount[b] - languageCount[a]);
            const topics = [...new Set(repos.flatMap(r => r.topics || []))];

            // Send to Gemini
            const prompt = `Based on this GitHub profile, extract skills as JSON only, no markdown:
{
  "technical": ["skill1"],
  "nonTechnical": ["skill1"],
  "certifications": [],
  "tools": [],
  "experienceLevel": "beginner|intermediate|advanced"
}
Username: ${githubUser}
Languages used: ${languages.join(', ')}
Topics: ${topics.join(', ')}
Repos: ${repos.slice(0, 10).map(r => r.name + ': ' + r.description).join(', ')}
Bio: ${userData.bio || 'none'}`;

            const response = await callGemini(prompt);
            const skillData = JSON.parse(response);

            // Merge explicit languages
            skillData.technical = [...new Set([...languages, ...(skillData.technical || [])])];

            updateState('profile', {
                source: 'github',
                username: githubUser,
                userData,
                repos: repos.slice(0, 20),
                skills: skillData
            });

            setExtractedSkills(skillData);
            addAgentMessage('ANALYZE', `Found ${skillData.technical.length} skills from ${repos.length} repos`);

        } catch (error) {
            addAgentMessage('ERROR', `GitHub scan failed: ${error.message}`);
            toast.error("GitHub scan failed");
        }

        setLoading(false);
    };

    // --- FIX 6: Continue Button ---
    const handleContinue = () => {
        if (extractedSkills.technical || extractedSkills.nonTechnical) {
            navigate('/role');
        }
    };

    // Helper to count skills
    const skillCount = (extractedSkills.technical?.length || 0) + (extractedSkills.nonTechnical?.length || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen pt-10 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-0 relative"
        >
            {/* Left Content (Sticky) */}
            <div className="bg-white p-8 lg:p-16 flex flex-col justify-center border-r border-border relative overflow-hidden">
                <div className="max-w-md mx-auto relative z-10">
                    <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">Step 01 / 04</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-text-primary">
                        Initialize Your Profile
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed mb-8">
                        The agent needs to understand your DNA. Connect a source to extract your skills, experience, and coding patterns.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
                        {/* Icons decor */}
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"><Github size={16} /></div>
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"><Linkedin size={16} /></div>
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center"><FileText size={16} /></div>
                        </div>
                        <span>Multiple sources supported</span>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className="bg-surface/30 p-8 lg:p-16 flex flex-col items-center justify-center min-h-[600px]">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-border p-2">
                    {/* Tabs */}
                    <div className="flex p-1 bg-surface rounded-xl mb-6">
                        {['github', 'linkedin', 'resume'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 min-h-[200px]">
                        <AnimatePresence mode="wait">
                            {/* GitHub Tab */}
                            {activeTab === 'github' && (
                                <motion.div key="github" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    <div className="relative">
                                        <Github className="absolute left-3 top-3 text-text-muted" size={20} />
                                        <input
                                            value={githubUser}
                                            onChange={e => setGithubUser(e.target.value)}
                                            placeholder="GitHub Username"
                                            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button onClick={handleGithubScan} disabled={loading} className="w-full">
                                            {loading ? <Loader className="animate-spin" /> : 'Scan Repositories'}
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Resume Tab */}
                            {activeTab === 'resume' && (
                                <motion.div key="resume" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    <div className="border-2 border-dashed border-border hover:border-primary rounded-xl p-8 text-center cursor-pointer transition-colors relative overflow-hidden group">
                                        <input
                                            type="file"
                                            accept=".pdf,.docx,.txt"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleResumeUpload(file);
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary group-hover:scale-110 transition-transform">
                                            <Upload size={24} />
                                        </div>
                                        <p className="font-medium">Drop your resume here</p>
                                        <p className="text-xs text-text-muted">PDF, DOCX, TXT</p>
                                    </div>
                                    {processingStep > 0 && (
                                        <div className="space-y-3">
                                            <div className="text-sm font-medium text-primary flex items-center gap-2">
                                                <Loader size={14} className="animate-spin" /> {processingText}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Linkedin Tab */}
                            {activeTab === 'linkedin' && (
                                <motion.div key="linkedin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                    <textarea
                                        value={linkedinText}
                                        onChange={e => setLinkedinText(e.target.value)}
                                        className="w-full h-40 bg-surface border border-border rounded-xl p-4 resize-none"
                                        placeholder="Paste LinkedIn 'About' section..."
                                    />
                                    <Button disabled className="w-full opacity-50 cursor-not-allowed">Coming Soon</Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Detected Skills Preview */}
                    {skillCount > 0 && (
                        <div className="mt-4 p-4 border-t border-border bg-surface/50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-text-muted uppercase">Detected Skills</span>
                                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{skillCount}</span>
                            </div>
                            <motion.div
                                className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: {
                                        transition: { staggerChildren: 0.05 }
                                    }
                                }}
                            >
                                {extractedSkills.technical?.map(s => (
                                    <motion.span
                                        key={s}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        className="text-xs px-2 py-1 bg-white border border-border rounded-md"
                                    >
                                        {s}
                                    </motion.span>
                                ))}
                                {extractedSkills.nonTechnical?.map(s => (
                                    <motion.span
                                        key={s}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        className="text-xs px-2 py-1 bg-secondary/10 border border-secondary/20 rounded-md"
                                    >
                                        {s}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Continue Button */}
                {skillCount > 0 && (
                    <motion.button
                        onClick={handleContinue}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        style={{
                            width: '100%',
                            maxWidth: '512px',
                            padding: '16px',
                            marginTop: '24px',
                            background: '#0a0a0a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        Continue to Role Selection <ArrowRight size={18} />
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
