import React from 'react';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

interface PricingTier {
    id: 'novice' | 'pro' | 'sovereign';
    name: string;
    tagline: string;
    price: string;
    priceMonthly?: string;
    features: string[];
    icon: React.FC<any>;
    color: string;
    gradient: string;
    popular?: boolean;
}

const tiers: PricingTier[] = [
    {
        id: 'novice',
        name: 'Novice Architect',
        tagline: 'Start your journey',
        price: 'Free',
        features: [
            'Gemini Flash (Text AI)',
            '5 Images per day',
            'Watermarked outputs',
            'Text-to-speech (basic)',
            '100MB cloud storage',
            'Community support'
        ],
        icon: Sparkles,
        color: 'text-blue-400',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'pro',
        name: 'Pro Architect',
        tagline: 'For serious builders',
        price: '$29',
        priceMonthly: '/month',
        popular: true,
        features: [
            'Everything in Novice, plus:',
            'FLUX high-res images',
            'Unlimited image generation',
            'Voice cloning & emotional TTS',
            'Multi-agent council debates',
            'Priority rendering',
            '10GB cloud storage',
            'Priority support'
        ],
        icon: Zap,
        color: 'text-emerald-400',
        gradient: 'from-emerald-500 to-cyan-500'
    },
    {
        id: 'sovereign',
        name: 'Sovereign',
        tagline: 'God mode unlocked',
        price: '$99',
        priceMonthly: '/month',
        features: [
            'Everything in Pro, plus:',
            'Video generation (AI cinematics)',
            'Nexus Bridge (auto-posting)',
            'Proof of Architecture certificates',
            'API access for integrations',
            'Model tuning & training',
            'White-label options',
            'Dedicated account manager'
        ],
        icon: Crown,
        color: 'text-purple-400',
        gradient: 'from-purple-500 via-pink-500 to-orange-500'
    }
];

interface PricingTableProps {
    showCurrentPlan?: boolean;
}

const PricingTable: React.FC<PricingTableProps> = ({ showCurrentPlan = true }) => {
    const navigate = useNavigate();
    const { tier: currentTier, setTier } = useSubscription();

    const handleSelectPlan = (tierId: 'novice' | 'pro' | 'sovereign') => {
        if (tierId === 'novice') {
            // Downgrade to free (just update context)
            setTier('novice');
            alert('Downgraded to Novice Architect (Free)');
            return;
        }

        // For paid plans, simulate Lemon Squeezy checkout
        // In production, this would open the Lemon Squeezy overlay
        const confirmUpgrade = confirm(
            `Upgrade to ${tierId === 'pro' ? 'Pro Architect' : 'Sovereign'}?\n\n` +
            `In production, this would open the Lemon Squeezy checkout.\n\n` +
            `For this demo, we'll simulate the upgrade.`
        );

        if (confirmUpgrade) {
            setTier(tierId);
            alert(`✅ Successfully upgraded to ${tierId === 'pro' ? 'Pro Architect' : 'Sovereign'}!`);
            navigate('/media-studio'); // Redirect to showcase unlocked features
        }
    };

    return (
        <div className="w-full py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Choose Your Power Level
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Unlock the full potential of ArchiTech-Wize AI
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier) => {
                        const Icon = tier.icon;
                        const isCurrent = currentTier === tier.id;

                        return (
                            <div
                                key={tier.id}
                                className={`relative bg-gradient-to-br from-gray-900 to-black border-2 rounded-3xl p-8 transition-all hover:scale-105 ${tier.popular
                                        ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                                        : 'border-gray-800'
                                    } ${isCurrent ? 'ring-4 ring-white/20' : ''}`}
                            >
                                {/* Popular Badge */}
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                {/* Current Plan Badge */}
                                {isCurrent && showCurrentPlan && (
                                    <div className="absolute -top-4 right-4">
                                        <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">
                                            Current Plan
                                        </div>
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`w-16 h-16 mb-6 rounded-full bg-gradient-to-br ${tier.gradient} p-[2px]`}>
                                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                                        <Icon className={`w-8 h-8 ${tier.color}`} />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                <p className="text-gray-400 text-sm mb-6">{tier.tagline}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    {tier.priceMonthly && (
                                        <span className="text-gray-400 text-lg">{tier.priceMonthly}</span>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-gray-300 text-sm">
                                            <Check className={`mr-2 flex-shrink-0 ${tier.color}`} size={18} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => handleSelectPlan(tier.id)}
                                    disabled={isCurrent}
                                    className={`w-full ${isCurrent
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : `bg-gradient-to-r ${tier.gradient} hover:opacity-90`
                                        } text-white font-bold py-3`}
                                >
                                    {isCurrent ? 'Current Plan' : tier.id === 'novice' ? 'Start Free' : 'Upgrade Now'}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>All paid plans include a 7-day free trial. Cancel anytime.</p>
                    <p className="mt-2">
                        Powered by{' '}
                        <a href="https://lemonsqueezy.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                            Lemon Squeezy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingTable;
