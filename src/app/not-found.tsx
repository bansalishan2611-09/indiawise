import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-[8rem] font-black leading-none select-none mb-4" style={{ color: '#E2E8F0' }}>404</div>
      <h2 className="text-3xl font-bold text-navy mb-3">Page not found</h2>
      <p className="text-muted text-lg mb-10 max-w-md">The page you're looking for doesn't exist or may have been moved.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy/90 transition-colors">
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <Link href="/calculators" className="inline-flex items-center gap-2 bg-white border border-border text-navy px-6 py-3 rounded-xl font-semibold hover:bg-alt transition-colors">
          <Search className="w-4 h-4" /> Browse Calculators
        </Link>
      </div>
    </div>
  );
}
