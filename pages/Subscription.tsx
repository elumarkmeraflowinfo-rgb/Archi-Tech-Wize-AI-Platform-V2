import React, { useRef, useEffect } from 'react';
import { Crown, Calendar, CreditCard, Download, TrendingUp, Package } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useUser } from '../context/UserContext';
import PricingTable from '../components/PricingTable';
import Button from '../components/Button';

const Subscription = () => {
    const { tier, features, requestCount } = useSubscription();
    const { user } = useUser();

    const tierInfo = {
        novice: { name: 'Novice Architect', color: 'from-blue-500 to-cyan-500' },
        pro: { name: 'Pro Architect', color: 'from-emerald-500 to-cyan-500' },
        sovereign: { name: 'Sovereign', color: 'from-purple-500 via-pink-500 to-orange-500' }
    };

    const currentTierInfo = tierInfo[tier];
    const storageUsed = 45; // Mock data (in MB)
    const storagePercent = (storageUsed / features.storageLimit) * 100;

    const requestRef = useRef<HTMLDivElement>(null);
    const storageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (requestRef.current) {
            const percent = Math.min((requestCount / 5) * 100, 100);
            requestRef.current.style.width = `${percent}%`;
        }
    }, [requestCount]);

    useEffect(() => {
        if (storageRef.current) {
            storageRef.current.style.width = `${storagePercent}%`;
        }
    }, [storagePercent]);

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Subscription Management
                    </h1>
                    <p className="text-gray-400">Manage your ArchiTech-Wize AI subscription and usage</p>
                </header>

                {/* Current Plan Overview */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8 mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{currentTierInfo.name}</h2>
                            <p className="text-gray-400">
                                {tier === 'novice' ? 'Free Plan' : `Active since ${user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}`}
                            </p>
                        </div>
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentTierInfo.color} p-[3px]`}>
                            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                                <Crown className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Requests */}
                        <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">Requests (Session)</span>
                                <TrendingUp className="text-blue-400" size={20} />
                            </div>
                            <div className="text-2xl font-bold">
                                {requestCount} {tier === 'novice' ? '/ 5' : '/ ∞'}
                            </div>
                            {tier === 'novice' && (
                                <div className="mt-2 w-full bg-gray-800 rounded-full h-2">
                                    <div
                                        ref={requestRef}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Storage */}
                        <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">Cloud Storage</span>
                                <Package className="text-emerald-400" size={20} />
                            </div>
                            <div className="text-2xl font-bold">
                                {storageUsed} MB / {features.storageLimit} MB
                            </div>
                            <div className="mt-2 w-full bg-gray-800 rounded-full h-2">
                                <div
                                    ref={storageRef}
                                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all"
                                />
                            </div>
                        </div>

                        {/* Images Generated */}
                        <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">Images Generated</span>
                                <Download className="text-purple-400" size={20} />
                            </div>
                            <div className="text-2xl font-bold">
                                {tier === 'novice' ? `${requestCount} / 5` : '128'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {tier === 'novice' ? 'Today' : 'This month'}
                            </div>
                        </div>
                    </div>

                    {/* Billing Info (for paid plans) */}
                    {tier !== 'novice' && (
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="text-gray-400" size={20} />
                                    <div>
                                        <div className="text-sm text-gray-400">Next billing date</div>
                                        <div className="font-semibold">
                                            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">Amount</div>
                                    <div className="font-semibold text-xl">
                                        {tier === 'pro' ? '$29.00' : '$99.00'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex space-x-3">
                                <Button className="bg-gray-800 hover:bg-gray-700 border-gray-700">
                                    Update Payment Method
                                </Button>
                                <Button className="bg-red-600/20 hover:bg-red-600/30 border-red-600/50 text-red-400">
                                    Cancel Subscription
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Upgrade/Downgrade Options */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        {tier === 'novice' ? 'Upgrade Your Plan' : 'Explore Other Plans'}
                    </h2>
                    <PricingTable showCurrentPlan={true} />
                </div>

                {/* Feature Comparison Table */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8">
                    <h3 className="text-2xl font-bold mb-6">Feature Comparison</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                                    <th className="text-center py-3 px-4 text-blue-400">Novice</th>
                                    <th className="text-center py-3 px-4 text-emerald-400">Pro</th>
                                    <th className="text-center py-3 px-4 text-purple-400">Sovereign</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Text AI (Llama 3.3)', novice: '✓', pro: '✓', sovereign: '✓' },
                                    { name: 'Image Generation (FLUX)', novice: '✓', pro: '✓', sovereign: '✓' },
                                    { name: 'Video Generation (i2vgen-xl)', novice: '✓', pro: '✓', sovereign: '✓' },
                                    { name: 'Voice Synthesis & Cloning', novice: '✓', pro: '✓', sovereign: '✓' },
                                    { name: 'Multi-Agent Council', novice: '✓', pro: '✓', sovereign: '✓' },
                                    { name: '4K AI Upscaling', novice: '✓', pro: '✓', sovereign: '✓' },
                                    { name: 'Image Transformation (img2img)', novice: '✓', pro: '✓', sovereign: '✓' },
                                    { name: 'Priority Rendering', novice: '✗', pro: '✓', sovereign: '✓' },
                                    { name: 'Cloud Storage', novice: '100MB', pro: '10GB', sovereign: '10GB' },
                                    { name: 'Nexus Bridge (Auto-Post)', novice: '✗', pro: '✗', sovereign: '✓' },
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-800/50">
                                        <td className="py-3 px-4 text-gray-300">{row.name}</td>
                                        <td className="text-center py-3 px-4">{row.novice}</td>
                                        <td className="text-center py-3 px-4">{row.pro}</td>
                                        <td className="text-center py-3 px-4">{row.sovereign}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
