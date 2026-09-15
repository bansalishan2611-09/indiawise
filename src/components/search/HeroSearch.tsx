"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Search, TrendingUp, ChevronRight } from "lucide-react";

// In Phase 2/3, this will be fetched from the calculator engine
const calculators = [
  { name: "Financial Health Score", href: "/financial-health-score", category: "Financial Health" },
  { name: "Home Loan EMI", href: "/calculators/finance/home-loan-emi", category: "Finance" },
  { name: "Personal Loan EMI", href: "/calculators/finance/personal-loan-emi", category: "Finance" },
  { name: "SIP Calculator", href: "/calculators/finance/sip-calculator", category: "Finance" },
  { name: "FD Calculator", href: "/calculators/finance/fd-calculator", category: "Finance" },
  { name: "GST Calculator", href: "/calculators/tax/gst-calculator", category: "Tax" },
  { name: "Income Tax", href: "/calculators/tax/income-tax", category: "Tax" },
  { name: "In-Hand Salary", href: "/calculators/salary/in-hand-salary", category: "Salary" },
  { name: "Percentage Calculator", href: "/calculators/education/percentage", category: "Education" },
  { name: "Age Calculator", href: "/calculators/everyday/age", category: "Everyday" },
  { name: "CAGR Calculator", href: "/calculators/finance/cagr-calculator", category: "Finance" },
];

const topSearches = ["Home Loan EMI", "GST Calculator", "SIP Calculator", "In-Hand Salary"];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  const filteredResults = query
    ? calculators.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl mx-auto mt-10 relative group z-50">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition duration-500"></div>
      
      <form onSubmit={handleSearch} className="relative flex items-center bg-white rounded-2xl p-2 shadow-xl ring-1 ring-border focus-within:ring-2 focus-within:ring-brand transition-all">
        <div className="pl-4 pr-2 text-brand">
          <Search className="w-6 h-6" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Try 'Home Loan EMI' or 'GST'..." 
          suppressHydrationWarning
          className="w-full py-4 px-2 bg-transparent text-navy text-xl focus:outline-none placeholder:text-gray-400 font-medium"
        />
        <button 
          type="submit"
          suppressHydrationWarning
          className="bg-brand text-white px-8 py-4 rounded-xl hover:bg-brand-hover transition-colors font-semibold shadow-md whitespace-nowrap text-lg"
        >
          Search
        </button>
      </form>

      {/* Autocomplete / Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {!query && (
            <div className="p-4">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Top Searched
              </h3>
              <ul className="space-y-1">
                {topSearches.map((term, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                        setIsFocused(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-alt text-navy font-medium flex items-center justify-between transition-colors"
                    >
                      <span>{term}</span>
                      <Search className="w-4 h-4 text-muted opacity-50" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {query && filteredResults.length > 0 && (
            <div className="p-2">
              <ul className="space-y-1">
                {filteredResults.map((calc, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(calc.href);
                        setIsFocused(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-alt text-navy flex items-center justify-between transition-colors group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-brand rounded-lg group-hover/item:bg-brand group-hover/item:text-white transition-colors">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-navy">{calc.name}</div>
                          <div className="text-xs text-muted">{calc.category} Calculator</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted group-hover/item:text-brand transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {query && filteredResults.length === 0 && (
            <div className="p-8 text-center text-muted">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>No calculators found for "{query}"</p>
              <button onClick={() => handleSearch()} className="text-brand font-medium mt-2 hover:underline">
                Search all articles instead
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
