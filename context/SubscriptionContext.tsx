import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

export type SubscriptionTier = 'novice' | 'pro' | 'sovereign';

export interface SubscriptionFeatures {
    // Text & Research
    geminiFlash: boolean;
    geminiPro: boolean;
    unlimitedResearch: boolean;
    multiAgentCouncil: boolean;

    // Media Generation
    imageGeneration: boolean;
    imageLimit: number | null; // null = unlimited
    videoGeneration: boolean;
    priorityRendering: boolean;

    // Voice & Audio
    textToSpeech: boolean;
    voiceCloning: boolean;
    emotionalLayering: boolean;

    // Storage & Distribution
    storageLimit: number; // in MB
    nexusBridge: boolean; // Auto-posting to platforms

    // Marketplace & Advanced
    proofOfArchitecture: boolean;
    apiAccess: boolean;

    // Support
    prioritySupport: boolean;
}

interface SubscriptionContextType {
    tier: SubscriptionTier;
    features: SubscriptionFeatures;
    requestCount: number;
    setTier: (tier: SubscriptionTier) => void;
    checkAccess: (feature: keyof SubscriptionFeatures) => boolean;
    incrementRequestCount: () => void;
    resetRequestCount: () => void;
    upgradeRequired: (feature: keyof SubscriptionFeatures) => string | null; // Returns required tier or null
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Define tier features
const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
    novice: {
        geminiFlash: true,
        geminiPro: false,
        unlimitedResearch: false,
        multiAgentCouncil: false,
        imageGeneration: true,
        imageLimit: 5, // 5 images per session
        videoGeneration: false,
        priorityRendering: false,
        textToSpeech: true,
        voiceCloning: false,
        emotionalLayering: false,
        storageLimit: 100, // 100MB
        nexusBridge: false,
        proofOfArchitecture: false,
        apiAccess: false,
        prioritySupport: false,
    },
    pro: {
        geminiFlash: true,
        geminiPro: true,
        unlimitedResearch: true,
        multiAgentCouncil: true,
        imageGeneration: true,
        imageLimit: null, // Unlimited
        videoGeneration: false,
        priorityRendering: true,
        textToSpeech: true,
        voiceCloning: true,
        emotionalLayering: true,
        storageLimit: 10240, // 10GB
        nexusBridge: false,
        proofOfArchitecture: false,
        apiAccess: false,
        prioritySupport: true,
    },
    sovereign: {
        geminiFlash: true,
        geminiPro: true,
        unlimitedResearch: true,
        multiAgentCouncil: true,
        imageGeneration: true,
        imageLimit: null,
        videoGeneration: true,
        priorityRendering: true,
        textToSpeech: true,
        voiceCloning: true,
        emotionalLayering: true,
        storageLimit: 10240, // 10GB
        nexusBridge: true,
        proofOfArchitecture: true,
        apiAccess: true,
        prioritySupport: true,
    },
};

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, updateProfile } = useUser();
    const [tier, setTierState] = useState<SubscriptionTier>('novice');
    const [requestCount, setRequestCount] = useState(0);

    // Initialize tier from user profile
    useEffect(() => {
        if (user?.subscriptionTier) {
            setTierState(user.subscriptionTier as SubscriptionTier);
        } else {
            setTierState('novice');
        }

        // Load request count from session storage
        const savedCount = sessionStorage.getItem('aw-request-count');
        if (savedCount) {
            setRequestCount(parseInt(savedCount, 10));
        }
    }, [user]);

    const setTier = (newTier: SubscriptionTier) => {
        setTierState(newTier);
        if (user) {
            updateProfile({ subscriptionTier: newTier } as any);
        }
    };

    const features = TIER_FEATURES[tier];

    const checkAccess = (feature: keyof SubscriptionFeatures): boolean => {
        return features[feature] as boolean;
    };

    const upgradeRequired = (feature: keyof SubscriptionFeatures): string | null => {
        if (features[feature]) return null;

        // Check which tier provides this feature
        if (TIER_FEATURES.pro[feature]) return 'pro';
        if (TIER_FEATURES.sovereign[feature]) return 'sovereign';

        return null;
    };

    const incrementRequestCount = () => {
        const newCount = requestCount + 1;
        setRequestCount(newCount);
        sessionStorage.setItem('aw-request-count', newCount.toString());
    };

    const resetRequestCount = () => {
        setRequestCount(0);
        sessionStorage.removeItem('aw-request-count');
    };

    return (
        <SubscriptionContext.Provider
            value={{
                tier,
                features,
                requestCount,
                setTier,
                checkAccess,
                incrementRequestCount,
                resetRequestCount,
                upgradeRequired,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within SubscriptionProvider');
    }
    return context;
};
