import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set, get) => ({
            // --- Auth / Config ---
            // apiKey is now handled via .env

            // --- Profile ---
            profile: null, // { type: 'github'|'manual'|'resume', data: {...}, skills: [] }
            setProfile: (profile) => set({ profile }),

            // --- Role ---
            selectedRole: null, // { title, ... }
            setSelectedRole: (role) => set({ selectedRole: role }),

            // --- Analysis ---
            analysis: null, // { readinessScore, strengths, gaps, summary, ... }
            setAnalysis: (analysis) => set({ analysis }),

            // --- Roadmap ---
            roadmap: null, // { weeks: [], totalHours, ... }
            setRoadmap: (roadmap) => set({ roadmap }),

            // --- Progress / Gamification ---
            completedDays: [], // ['w1d1', 'w1d2']
            toggleDay: (dayId) => {
                set((state) => {
                    const exists = state.completedDays.includes(dayId);
                    return {
                        completedDays: exists
                            ? state.completedDays.filter(d => d !== dayId)
                            : [...state.completedDays, dayId]
                    };
                });
            },

            // --- Agent State ---
            agentThoughts: [],
            isAgentThinking: false,
            addThought: (text, type = 'info') => set(state => ({
                agentThoughts: [...state.agentThoughts, { text, type, timestamp: new Date() }],
                isAgentThinking: type === 'process'
            })),
            clearThoughts: () => set({ agentThoughts: [] }),

            // --- Reset ---
            resetApp: () => {
                set({
                    profile: null, selectedRole: null,
                    analysis: null, roadmap: null, completedDays: [], agentThoughts: []
                });
            }
        }),
        {
            name: 'career-navigator-storage', // unique name
            partialize: (state) => ({
                profile: state.profile,
                selectedRole: state.selectedRole,
                analysis: state.analysis,
                roadmap: state.roadmap,
                completedDays: state.completedDays,
            }), // Persist API key
        }
    )
);
