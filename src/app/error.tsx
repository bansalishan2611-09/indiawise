'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-navy mb-2">Something went wrong</h2>
      <p className="text-muted mb-8 max-w-md">An unexpected error occurred. Please try again or go back to the homepage.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs bg-red-50 text-red-700 p-4 rounded-xl mb-6 max-w-lg text-left overflow-auto">{error.message}</pre>
      )}
      <button onClick={reset} className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-hover transition-colors">
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}
