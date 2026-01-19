import React, { ReactNode } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Lock, Zap, Crown } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface GatekeeperProps {
    children: ReactNode;
    requiredTier: 'pro' | 'sovereign';
    feature?: string; // Feature name for display
    blur?: boolean; // Whether to blur children or hide completely
}

const Gatekeeper: React.FC<GatekeeperProps> = ({
    children,
    requiredTier,
    feature = 'this feature',
    blur = true
}) => {
    const { tier, upgradeRequired } = useSubscription();
    const navigate = useNavigate();

    const tierOrder = { novice: 0, pro: 1, sovereign: 2 };
    const hasAccess = tierOrder[tier] >= tierOrder[requiredTier];

    if (hasAccess) {
        return <>{children}</>;
    }

    const handleUpgrade = () => {
        navigate('/subscription');
    };

    const tierNames = {
        pro: 'Pro Architect',
        sovereign: 'Sovereign'
    };

    const tierColors = {
        pro: 'from-emerald-500 to-cyan-500',
        sovereign: 'from-purple-500 via-pink-500 to-orange-500'
    };

    const tierIcons = {
        pro: Zap,
        sovereign: Crown
    };

    const TierIcon = tierIcons[requiredTier];

    return (
        <div className="relative">
            {/* Blurred/Hidden Content */}
            <div className={blur ? 'filter blur-md pointer-events-none select-none' : 'hidden'}>
                {children}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
                <div className="max-w-md w-full mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8 shadow-2xl text-center">
                    {/* Icon */}
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${tierColors[requiredTier]} p-[2px]`}>
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                            <TierIcon className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 text-white">
                        {tierNames[requiredTier]} Required
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 mb-6">
                        Unlock <span className="text-white font-semibold">{feature}</span> by upgrading to{' '}
                        <span className={`font-bold bg-gradient-to-r ${tierColors[requiredTier]} bg-clip-text text-transparent`}>
                            {tierNames[requiredTier]}
                        </span>
                    </p>

                    {/* Features Preview */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 text-left text-sm">
                        <div className="font-semibold text-gray-300 mb-2">
                            What you'll get:
                        </div>
                        {requiredTier === 'pro' ? (
                            <ul className="space-y-1 text-gray-400">
                                <li>📦 10GB cloud storage</li>
                                <li>⚡ Priority rendering</li>
                                <li>🔒 Advanced project security</li>
                                <li>📁 Bulk export capabilities</li>
                            </ul>
                        ) : (
                            <ul className="space-y-1 text-gray-400">
                                <li>🌐 Nexus Bridge (auto-posting)</li>
                                <li>🔐 Proof of Architecture certificates</li>
                                <li>🔌 API access</li>
                                <li>👑 Everything in Pro + God Mode</li>
                            </ul>
                        )}
                    </div>

                    {/* CTA */}
                    <Button
                        onClick={handleUpgrade}
                        className={`w-full bg-gradient-to-r ${tierColors[requiredTier]} hover:opacity-90 transition-opacity text-white font-bold py-3`}
                    >
                        <Lock className="mr-2" size={18} />
                        Upgrade to {tierNames[requiredTier]}
                    </Button>

                    {/* Current Tier */}
                    <div className="mt-4 text-xs text-gray-500">
                        Current tier: <span className="text-gray-400 capitalize">{tier}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gatekeeper;
