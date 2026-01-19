import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    constructor(props: Props) {
        super(props);
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>

                        <h2 className="text-2xl font-bold font-display text-slate-900 mb-3">System Malfunction</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Our automated architects successfully caught an unexpected error.
                        </p>

                        {this.state.error && (
                            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left overflow-auto max-h-32">
                                <code className="text-xs font-mono text-slate-500 block">
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={this.handleReload}
                                className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                <RefreshCcw size={18} /> Reload System
                            </button>
                            <a
                                href="/"
                                className="w-full py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Home size={18} /> Return Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
