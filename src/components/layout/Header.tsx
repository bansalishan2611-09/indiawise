'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calculator, Grid3x3, BookOpen, Info, Search } from 'lucide-react';

const navLinks = [
  { href: '/calculators', label: 'Calculators', icon: Calculator },
  { href: '/categories', label: 'Categories', icon: Grid3x3 },
  { href: '/guides', label: 'Guides', icon: BookOpen },
  { href: '/about', label: 'About', icon: Info },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Detect scroll state for premium translucent header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full print:hidden transition-all duration-200 ease-in-out motion-reduce:transition-none ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-[16px] border-b border-border shadow-[0_4px_20px_rgb(0,0,0,0.03)]' 
          : 'bg-white border-b border-border'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/favicon.png" alt="IndiaWise Icon" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-navy tracking-tight">IndiaWise</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-brand' : 'text-navy hover:text-brand'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/founder" 
              className="px-5 py-2.5 bg-white border border-gray-200 text-navy rounded-xl text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
            >
              The Founder
            </Link>
            <Link 
              href="/contact" 
              className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors shadow-sm"
            >
              Contact Us
            </Link>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="md:hidden p-2 text-navy"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <nav className="relative bg-white border-b border-border shadow-lg">
            <div className="mx-auto max-w-7xl px-4 py-6 space-y-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive ? 'bg-brand/5 text-brand' : 'text-navy hover:bg-alt'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-border mt-4 flex flex-col gap-3">
                <Link
                  href="/founder"
                  className="flex items-center justify-center w-full py-3 bg-white border border-gray-200 text-navy rounded-xl text-base font-semibold hover:bg-gray-50 transition-all shadow-sm"
                >
                  The Founder
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full py-3 rounded-xl text-base font-semibold text-white bg-brand hover:bg-brand-hover transition-colors shadow-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
