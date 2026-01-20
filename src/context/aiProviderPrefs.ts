import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAiPreference } from '../ai/types';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AiPrefsContextType {
    prefs: UserAiPreference;
    updatePrefs: (newPrefs: Partial<UserAiPreference>) => Promise<void>;
    isLoading: boolean;
}

const DEFAULT_PREFS: UserAiPreference = {
    mode: 'auto',
    allowPaidFallback: false,
    disabledProviders: []
};

const AiPrefsContext = createContext<AiPrefsContextType | undefined>(undefined);

export const AiPrefsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [prefs, setPrefs] = useState<UserAiPreference>(DEFAULT_PREFS);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setPrefs(DEFAULT_PREFS);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);

        // Subscribe to real-time changes
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.aiPreference) {
                    setPrefs({ ...DEFAULT_PREFS, ...data.aiPreference });
                }
            } else {
                // Initialize if not exists (or just keep defaults)
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching AI prefs:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const updatePrefs = async (newPrefs: Partial<UserAiPreference>) => {
        if (!user) return;

        const updated = { ...prefs, ...newPrefs };
        setPrefs(updated); // Optimistic update

        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { aiPreference: updated }, { merge: true });
        } catch (error) {
            console.error("Failed to save AI prefs:", error);
            // Revert? For now, we assume success or user retries.
        }
    };

    return (
        <AiPrefsContext.Provider value= {{ prefs, updatePrefs, isLoading }
}>
    { children }
    </AiPrefsContext.Provider>
    );
};

export const useAiPrefs = () => {
    const context = useContext(AiPrefsContext);
    if (!context) {
        throw new Error('useAiPrefs must be used within an AiPrefsProvider');
    }
    return context;
};
