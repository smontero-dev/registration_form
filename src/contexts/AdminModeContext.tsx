"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Mode = 'students' | 'routes';

type AdminModeContextType = {
    mode: Mode;
    setMode: (mode: Mode) => void;
};

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined);

// Helper functions for hash management
const getHashMode = (): Mode => {
    if (typeof window === 'undefined') return 'students';
    const hash = window.location.hash.slice(1); // Remove #
    return hash === 'routes' ? 'routes' : 'students';
};

const setHashMode = (mode: Mode) => {
    if (typeof window === 'undefined') return;
    const newHash = mode === 'students' ? '' : mode;
    window.history.replaceState(null, '', newHash ? `#${newHash}` : window.location.pathname);
};

export function AdminModeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<Mode>('students');

    // Initialize mode from hash on mount
    useEffect(() => {
        const initialMode = getHashMode();
        setModeState(initialMode);
    }, []);

    // Listen for hash changes (browser back/forward)
    useEffect(() => {
        const handleHashChange = () => {
            const newMode = getHashMode();
            setModeState(newMode);
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Enhanced setMode that updates both state and URL hash
    const setMode = (newMode: Mode) => {
        setModeState(newMode);
        setHashMode(newMode);
    };

    return (
        <AdminModeContext.Provider value={{ mode, setMode }}>
            {children}
        </AdminModeContext.Provider>
    );
}

export function useAdminMode() {
    const context = useContext(AdminModeContext);
    if (context === undefined) {
        throw new Error('useAdminMode must be used within an AdminModeProvider');
    }
    return context;
}
