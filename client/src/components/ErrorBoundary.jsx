import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL COMPONENT RENDER ERROR:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#111827] border border-red-200 dark:border-red-900/50 rounded-2xl p-8 shadow-xl space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-full inline-block">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                Something Went Wrong
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A rendering error occurred while displaying this page.
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-mono text-left rounded-xl overflow-x-auto max-h-32 border border-red-100 dark:border-red-900/30">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
