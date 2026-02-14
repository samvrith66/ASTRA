import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [state, setState] = useState(() => {
        try {
            const demoProfile = localStorage.getItem('career_profile');
            const demoRole = localStorage.getItem('career_role');
            const savedProgress = localStorage.getItem('career_navigator_progress');

            // Parse demo role which might be a string or object depending on legacy vs new
            let parsedRole = null;
            if (demoRole) {
                try {
                    parsedRole = JSON.parse(demoRole);
                } catch (e) {
                    parsedRole = { title: demoRole, id: demoRole.toLowerCase().replace(/ /g, '-') };
                }
            }

            return {
                profile: demoProfile ? JSON.parse(demoProfile) : null,
                selectedRole: parsedRole || null,
                analysis: null,
                // Step 7 - Fix Initial State in Context
                roadmap: JSON.parse(localStorage.getItem("career_roadmap")) || { weeks: [] },
                agentMessages: [],
                isAgentThinking: false
            };
        } catch (e) {
            console.error("Failed to load state from local storage", e);
            return {
                profile: null,
                selectedRole: null,
                analysis: null,
                roadmap: null,
                agentMessages: [],
                isAgentThinking: false
            };
        }
    });

    const updateState = (key, value) => {
        setState(prev => ({ ...prev, [key]: value }));
        try {
            // Persist critical state to localStorage with career_ prefix
            if (key === 'profile') localStorage.setItem('career_profile', JSON.stringify(value));
            if (key === 'selectedRole') localStorage.setItem('career_role', JSON.stringify(value));
            if (key === 'roadmap') localStorage.setItem('career_navigator_progress', JSON.stringify(value?.progress || {}));
        } catch (e) {
            console.error("Failed to save state to local storage", e);
        }
    };

    const addAgentMessage = (type, message) => {
        setState(prev => ({
            ...prev,
            agentMessages: [...prev.agentMessages, {
                id: Date.now(),
                type,
                message,
                timestamp: new Date().toLocaleTimeString()
            }]
        }));
    };

    return (
        <AppContext.Provider value={{ state, updateState, addAgentMessage }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
