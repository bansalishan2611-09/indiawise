"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Calculator, ArrowRight, Grid3x3 } from "lucide-react";
import Link from "next/link";
import { performSearch } from "@/lib/calculators/searchLogic";
import { CalculatorDefinition } from "@/lib/calculators/types";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [results, setResults] = useState<CalculatorDefinition[]>([]);
  const [recommendations, setRecommendations] = useState<CalculatorDefinition[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { results, recommendations } = performSearch(query);
    setResults(results);
    setRecommendations(recommendations);
    setSelectedIndex(-1);
  }, [query, isOpen, isMobileOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll on mobile open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const allItems = [...results, ...recommendations];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setIsMobileOpen(false);
      inputRef.current?.blur();
      mobileInputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allItems.length) {
        const item = allItems[selectedIndex];
        navigateTo(`/calculators/${item.categorySlug}/${item.slug}`);
      } else if (results.length > 0) {
        navigateTo(`/calculators/${results[0].categorySlug}/${results[0].slug}`);
      }
    }
  };

  const navigateTo = (path: string) => {
    setIsOpen(false);
    setIsMobileOpen(false);
    setQuery("");
    router.push(path);
  };

  const renderDropdownContent = () => {
    if (!query.trim() && recommendations.length > 0) {
      return (
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-bold tracking-widest uppercase text-muted mb-1">
            Popular Calculators
          </div>
          <ul className="space-y-0.5">
            {recommendations.map((calc, idx) => (
              <li key={calc.slug}>
                <button
                  onClick={() => navigateTo(`/calculators/${calc.categorySlug}/${calc.slug}`)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${selectedIndex === idx ? "bg-alt text-brand" : "hover:bg-alt text-navy"}`}
                >
                  <Calculator className="w-4 h-4 shrink-0 opacity-50" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{calc.name}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="p-2">
        {results.length > 0 && (
          <div className="mb-4">
            <div className="px-3 py-2 text-xs font-bold tracking-widest uppercase text-muted mb-1">
              Search Results
            </div>
            <ul className="space-y-0.5">
              {results.map((calc, idx) => (
                <li key={calc.slug}>
                  <button
                    onClick={() => navigateTo(`/calculators/${calc.categorySlug}/${calc.slug}`)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${selectedIndex === idx ? "bg-brand/5 text-brand" : "hover:bg-alt text-navy"}`}
                  >
                    <Search className="w-4 h-4 shrink-0 opacity-50" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{calc.name}</span>
                      <span className="text-xs text-muted truncate">{calc.shortDescription}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.length === 0 && query.trim() && (
          <div className="px-3 py-4 text-center">
            <p className="text-sm text-navy font-medium">No calculators found for &quot;{query}&quot;</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="px-3 py-2 text-xs font-bold tracking-widest uppercase text-muted mb-1">
              {results.length === 0 ? "Useful Recommendations" : "Recommended Calculators"}
            </div>
            <ul className="space-y-0.5">
              {recommendations.map((calc, idx) => {
                const globalIdx = results.length + idx;
                return (
                  <li key={calc.slug}>
                    <button
                      onClick={() => navigateTo(`/calculators/${calc.categorySlug}/${calc.slug}`)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${selectedIndex === globalIdx ? "bg-alt text-brand" : "hover:bg-alt text-navy"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Grid3x3 className="w-4 h-4 shrink-0 opacity-50" />
                        <span className="font-medium text-sm">{calc.name}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-30" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Search Wrapper */}
      <div className="hidden md:block relative z-50" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search calculators..."
            className="h-10 w-64 lg:w-80 rounded-xl bg-alt pl-10 pr-4 text-sm text-navy outline-none border border-transparent focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-muted/70"
            aria-expanded={isOpen}
            aria-controls="search-dropdown"
            role="combobox"
          />
        </div>

        {isOpen && (
          <div 
            id="search-dropdown"
            className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-border/80 overflow-hidden"
            role="listbox"
          >
            {renderDropdownContent()}
          </div>
        )}
      </div>

      {/* Mobile Search Button */}
      <button 
        className="md:hidden p-2 text-navy hover:bg-alt rounded-full transition-colors"
        onClick={() => {
          setIsMobileOpen(true);
          setTimeout(() => mobileInputRef.current?.focus(), 100);
        }}
        aria-label="Search calculators"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Mobile Search Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden">
          <div className="flex items-center gap-3 p-4 border-b border-border bg-white">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search calculators..."
                className="h-12 w-full rounded-2xl bg-alt pl-11 pr-4 text-base text-navy outline-none border border-transparent focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-muted/70"
              />
            </div>
            <button 
              onClick={() => {
                setIsMobileOpen(false);
                setQuery("");
              }}
              className="p-3 text-navy hover:bg-alt rounded-xl"
            >
              Cancel
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-white p-2">
            {renderDropdownContent()}
          </div>
        </div>
      )}
    </>
  );
}
