"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Mode = 'students' | 'routes';

type AdminModeContextType = {
    mode: Mode;
    setMode: (mode: Mode) => void;
};

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined);

export function AdminModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<Mode>('students');

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
