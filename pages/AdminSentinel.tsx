import React, { useState, useEffect } from 'react';
import { Shield, Eye, BarChart2, DollarSign, Activity, Users } from 'lucide-react';

const AdminSentinel = () => {
    // Simulated live data
    const [metrics, setMetrics] = useState({
        activeModels: 5,
        systemHeat: 42, // percent
        revenue: 12450,
        requests: 890
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                systemHeat: Math.min(100, Math.max(20, prev.systemHeat + (Math.random() * 10 - 5))),
                requests: prev.requests + Math.floor(Math.random() * 5),
                revenue: prev.revenue + (Math.random() > 0.8 ? 25 : 0)
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen pt-24 px-6 bg-black text-white">
            <header className="mb-12 flex items-center justify-between border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center text-red-500">
                        <Shield className="mr-3" /> ADMIN SENTINEL
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Private God-View // Restricted Access</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="px-3 py-1 bg-red-900/20 text-red-500 rounded text-xs font-mono border border-red-900/50 animate-pulse">
                        LIVE MONITORING
                    </div>
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <MetricCard icon={Activity} label="System Heat" value={`${metrics.systemHeat.toFixed(1)}%`} color="text-orange-400" />
                <MetricCard icon={Users} label="Active Sessions" value={metrics.requests.toString()} color="text-blue-400" />
                <MetricCard icon={BarChart2} label="Model Load" value="High" color="text-purple-400" />
                <MetricCard icon={DollarSign} label="Est. Revenue" value={`$${metrics.revenue.toLocaleString()}`} color="text-green-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
                {/* Main Feed */}
                <div className="lg:col-span-2 bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-300 flex items-center">
                        <Eye className="mr-2 w-4 h-4" /> Global Activity Log
                    </h3>
                    <div className="space-y-3 font-mono text-xs overflow-hidden h-full">
                        <LogItem time="Now" user="User_887" action="Generated Video (AnimateDiff)" status="Processing" color="text-yellow-400" />
                        <LogItem time="2s ago" user="User_102" action="Fine-Tuning: Analysis" status="Complete" color="text-green-400" />
                        <LogItem time="5s ago" user="User_554" action="Voice Clone Request" status="Analyzing" color="text-blue-400" />
                        <LogItem time="12s ago" user="User_991" action="Marketplace: Agent Deploy" status="Deployed" color="text-purple-400" />
                        <LogItem time="15s ago" user="User_332" action="Research: Quantum Analysis" status="Complete" color="text-green-400" />
                        <LogItem time="22s ago" user="SYSTEM" action="Auto-Scaling: Node +1" status="Success" color="text-gray-400" />
                        <div className="border-t border-gray-800 my-4"></div>
                        <div className="animate-pulse opacity-50 text-gray-600">Listening to neural stream...</div>
                    </div>
                </div>

                {/* Intelligence Report */}
                <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                        <BrainIcon className="w-24 h-24 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-4 text-red-400">Sentinel Intelligence</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Gemini 2.0 Pro Analysis of current market trends based on user activity.
                    </p>

                    <div className="space-y-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                            <div className="text-xs text-gray-500 uppercase mb-1">Top Trend</div>
                            <div className="text-gray-200 font-bold">"Autonomous Legal Agents"</div>
                            <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[75%]"></div>
                            </div>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                            <div className="text-xs text-gray-500 uppercase mb-1">System Audit</div>
                            <div className="text-gray-200 font-medium text-sm">
                                All protocols nominal. No security breaches detected in the last 24h.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-gray-900/30 border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
        <div>
            <div className="text-gray-500 text-xs uppercase mb-1">{label}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
        </div>
        <div className={`p-3 rounded-full bg-gray-800/50 ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const LogItem = ({ time, user, action, status, color }: any) => (
    <div className="flex items-center justify-between border-b border-gray-800/50 pb-2">
        <div className="flex items-center space-x-3">
            <span className="text-gray-600 w-16">{time}</span>
            <span className="text-gray-400 w-20">{user}</span>
            <span className="text-gray-300">{action}</span>
        </div>
        <span className={`${color}`}>{status}</span>
    </div>
);

const BrainIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 16v-4M12 8h.01M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <path d="M16 8L2 22" />
        <path d="M17.5 15H9" />
    </svg>
);

export default AdminSentinel;
