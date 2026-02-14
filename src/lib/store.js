export const STORAGE_KEYS = {
    PROFILE: 'career_nav_profile',
    ROLE: 'career_nav_role',
    GAP_ANALYSIS: 'career_nav_gaps',
    ROADMAP: 'career_nav_roadmap',
    PROGRESS: 'career_nav_progress'
};

export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Storage Save Error", e);
    }
}

export function loadFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error("Storage Load Error", e);
        return null;
    }
}

export function clearStorage() {
    localStorage.clear();
}
