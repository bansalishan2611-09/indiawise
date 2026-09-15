"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Share2,
  Printer,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
  Lock,
  Zap,
  ChevronDown,
  ChevronUp,
  Compass,
  Wallet,
  Layers,
  User,
  Download,
} from "lucide-react";
import {
  calculateFinancialHealthScore,
  simulateFinancialHealthWhatIf,
  getHealthCategory,
  FinancialHealthInputs,
  CityTier,
  HealthCategory,
  WhatIfDelta,
} from "@/lib/calculators/logic/financial-health-score";
import { formatIndianCurrency } from "@/lib/calculators/formatters";
import { sanitizeShareName, formatShareHeading, formatOwnerNameBadge } from "@/lib/calculators/share-utils";

// Palette helpers for categories
function getCategoryTheme(cat: HealthCategory) {
  switch (cat) {
    case "Financially Strong":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        ring: "text-emerald-500",
        bar: "bg-emerald-500",
        glow: "rgba(16, 185, 129, 0.15)",
        gradient: "from-emerald-500 to-teal-600",
        text: "text-emerald-600",
        border: "border-emerald-200",
      };
    case "Wealth Builder":
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        ring: "text-brand",
        bar: "bg-brand",
        glow: "rgba(37, 99, 235, 0.15)",
        gradient: "from-blue-600 to-indigo-600",
        text: "text-brand",
        border: "border-blue-200",
      };
    case "On Track":
      return {
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        ring: "text-indigo-500",
        bar: "bg-indigo-500",
        glow: "rgba(99, 102, 241, 0.15)",
        gradient: "from-indigo-500 to-violet-600",
        text: "text-indigo-600",
        border: "border-indigo-200",
      };
    case "Needs Attention":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        ring: "text-amber-500",
        bar: "bg-amber-500",
        glow: "rgba(245, 158, 11, 0.15)",
        gradient: "from-amber-500 to-orange-600",
        text: "text-amber-600",
        border: "border-amber-200",
      };
    case "Financially Stretched":
    default:
      return {
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        ring: "text-rose-500",
        bar: "bg-rose-500",
        glow: "rgba(239, 68, 68, 0.15)",
        gradient: "from-rose-500 to-red-600",
        text: "text-rose-600",
        border: "border-rose-200",
      };
  }
}

export default function FinancialHealthExperience() {
  const searchParams = useSearchParams();

  // URL parameters detection
  const modeParam = searchParams.get("mode");
  const rawScoreParam = searchParams.get("score");
  const rawCatParam = searchParams.get("cat");
  const rawNameParam = searchParams.get("name");
  const recipientName = sanitizeShareName(rawNameParam);

  // Shared mode flags
  const isScoreOnlyShared = modeParam === "score_only" || Boolean(rawScoreParam && !searchParams.has("income"));
  const isFullShared = modeParam === "full" || Boolean(rawScoreParam && searchParams.has("income"));
  const isSharedView = isScoreOnlyShared || isFullShared;

  // Score-only derived values
  const scoreOnlyNumber = rawScoreParam ? Math.min(100, Math.max(0, parseInt(rawScoreParam, 10) || 0)) : 0;
  const scoreOnlyMeta = getHealthCategory(scoreOnlyNumber);
  const scoreOnlyCategory = (rawCatParam as HealthCategory) || scoreOnlyMeta.category;
  const scoreOnlyTheme = getCategoryTheme(scoreOnlyCategory);

  // Initial Inputs from URL search params or standard defaults
  const initialInputs: FinancialHealthInputs = useMemo(() => {
    const rawIncome = searchParams.get("income");
    const rawEmi = searchParams.get("emi");
    const rawInv = searchParams.get("investment");
    const rawSav = searchParams.get("savings");
    const rawAge = searchParams.get("age");
    const rawTier = searchParams.get("cityTier");
    const rawExpenses = searchParams.get("expenses");

    return {
      age: rawAge ? Math.min(100, Math.max(18, Number(rawAge) || 28)) : 28,
      cityTier: (rawTier === "tier2" || rawTier === "tier3" ? rawTier : "tier1") as CityTier,
      income: rawIncome ? Math.max(5000, Number(rawIncome) || 100000) : 100000,
      emi: rawEmi !== null && rawEmi !== undefined ? Math.max(0, Number(rawEmi) || 0) : 20000,
      investment: rawInv !== null && rawInv !== undefined ? Math.max(0, Number(rawInv) || 0) : 15000,
      savings: rawSav !== null && rawSav !== undefined ? Math.max(0, Number(rawSav) || 0) : 300000,
      expenses: rawExpenses ? Math.max(0, Number(rawExpenses) || 0) : undefined,
    };
  }, [searchParams]);

  const [inputs, setInputs] = useState<FinancialHealthInputs>(initialInputs);
  const [showCustomExpenses, setShowCustomExpenses] = useState<boolean>(
    Boolean(initialInputs.expenses)
  );

  // Synchronize inputs when searchParams change
  useEffect(() => {
    setInputs(initialInputs);
    setShowCustomExpenses(Boolean(initialInputs.expenses));
  }, [initialInputs]);

  // Raw string states for inputs so user can type freely
  const [rawIncomeStr, setRawIncomeStr] = useState<string>(initialInputs.income.toString());
  const [rawEmiStr, setRawEmiStr] = useState<string>(initialInputs.emi.toString());
  const [rawInvStr, setRawInvStr] = useState<string>(initialInputs.investment.toString());
  const [rawSavStr, setRawSavStr] = useState<string>(initialInputs.savings.toString());
  const [rawAgeStr, setRawAgeStr] = useState<string>(initialInputs.age.toString());
  const [rawExpStr, setRawExpStr] = useState<string>(
    initialInputs.expenses ? initialInputs.expenses.toString() : ""
  );

  // Owner Name for sharing
  const [shareName, setShareName] = useState<string>(recipientName || "");

  // What-If Simulation State
  const [whatIfDelta, setWhatIfDelta] = useState<WhatIfDelta>({
    extraInvestment: 0,
    emiReduction: 0,
    extraSavings: 0,
  });
  const [isWhatIfActive, setIsWhatIfActive] = useState<boolean>(false);

  // Sharing Privacy Option (for owner view)
  const [sharePrivacy, setSharePrivacy] = useState<"score_only" | "full">("score_only");
  const [copySuccess, setCopySuccess] = useState(false);

  // Animated Gauge state
  const [displayScore, setDisplayScore] = useState(isScoreOnlyShared ? scoreOnlyNumber : 0);

  // Input handlers for typing numbers directly
  const handleIncomeInput = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setRawIncomeStr(cleaned);
    const num = Number(cleaned);
    if (!isNaN(num) && num > 0) {
      setInputs((prev) => ({ ...prev, income: Math.min(num, 10000000) }));
    }
  };

  const handleEmiInput = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setRawEmiStr(cleaned);
    const num = Number(cleaned);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, emi: Math.min(num, 5000000) }));
    }
  };

  const handleInvInput = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setRawInvStr(cleaned);
    const num = Number(cleaned);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, investment: Math.min(num, 5000000) }));
    }
  };

  const handleSavInput = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setRawSavStr(cleaned);
    const num = Number(cleaned);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, savings: Math.min(num, 50000000) }));
    }
  };

  const handleAgeInput = (val: string) => {
    setRawAgeStr(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 18 && num <= 100) {
      setInputs((prev) => ({ ...prev, age: num }));
    }
  };

  const handleExpInput = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    setRawExpStr(cleaned);
    const num = Number(cleaned);
    if (!isNaN(num)) {
      setInputs((prev) => ({ ...prev, expenses: num }));
    }
  };

  // Slider change handlers
  const handleIncomeSlider = (val: number) => {
    setInputs((prev) => ({ ...prev, income: val }));
    setRawIncomeStr(val.toString());
  };

  const handleEmiSlider = (val: number) => {
    setInputs((prev) => ({ ...prev, emi: val }));
    setRawEmiStr(val.toString());
  };

  const handleInvSlider = (val: number) => {
    setInputs((prev) => ({ ...prev, investment: val }));
    setRawInvStr(val.toString());
  };

  const handleSavSlider = (val: number) => {
    setInputs((prev) => ({ ...prev, savings: val }));
    setRawSavStr(val.toString());
  };

  // Deterministic Result (calculated client-side)
  const healthResult = useMemo(() => {
    return calculateFinancialHealthScore({
      ...inputs,
      expenses: showCustomExpenses ? inputs.expenses : undefined,
    });
  }, [inputs, showCustomExpenses]);

  // What-If Result
  const whatIfResult = useMemo(() => {
    return simulateFinancialHealthWhatIf(
      {
        ...inputs,
        expenses: showCustomExpenses ? inputs.expenses : undefined,
      },
      whatIfDelta
    );
  }, [inputs, showCustomExpenses, whatIfDelta]);

  // Score Animation
  useEffect(() => {
    const targetScore = isScoreOnlyShared
      ? scoreOnlyNumber
      : isWhatIfActive
      ? whatIfResult.newScore
      : healthResult.score;

    let startTimestamp: number | null = null;
    const duration = 500;
    const initial = displayScore;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(initial + (targetScore - initial) * eased);
      setDisplayScore(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [healthResult.score, whatIfResult.newScore, isWhatIfActive, isScoreOnlyShared, scoreOnlyNumber]);

  // SVG Gauge calculations
  const activeCategory = isScoreOnlyShared
    ? scoreOnlyCategory
    : isWhatIfActive
    ? whatIfResult.newCategory
    : healthResult.category;
  const theme = getCategoryTheme(activeCategory);
  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.72; // 260 deg arc
  const strokeDashoffset = arcLength - (displayScore / 100) * arcLength;

  // Build Share URL
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL("/financial-health-score", window.location.origin);
    const cleanName = sanitizeShareName(shareName);

    if (sharePrivacy === "score_only") {
      url.searchParams.set("mode", "score_only");
      url.searchParams.set("score", healthResult.score.toString());
      url.searchParams.set("cat", healthResult.category);
      if (cleanName) url.searchParams.set("name", cleanName);
    } else {
      url.searchParams.set("mode", "full");
      url.searchParams.set("score", healthResult.score.toString());
      url.searchParams.set("cat", healthResult.category);
      url.searchParams.set("income", inputs.income.toString());
      url.searchParams.set("emi", inputs.emi.toString());
      url.searchParams.set("investment", inputs.investment.toString());
      url.searchParams.set("savings", inputs.savings.toString());
      url.searchParams.set("age", inputs.age.toString());
      url.searchParams.set("cityTier", inputs.cityTier);
      if (showCustomExpenses && inputs.expenses !== undefined) {
        url.searchParams.set("expenses", inputs.expenses.toString());
      }
      if (cleanName) url.searchParams.set("name", cleanName);
    }
    return url.toString();
  }, [sharePrivacy, healthResult.score, healthResult.category, inputs, showCustomExpenses, shareName]);

  const handleCopyLink = async () => {
    try {
      const urlToCopy = isSharedView && typeof window !== "undefined" ? window.location.href : shareUrl;
      await navigator.clipboard.writeText(urlToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window === "undefined") return;
    const cleanName = sanitizeShareName(shareName || recipientName);
    const heading = formatShareHeading(cleanName, "Financial Health Score");
    let text = "";

    if (isScoreOnlyShared) {
      text = `*${heading}:* ${scoreOnlyNumber}/100 (${scoreOnlyCategory})! 🇮🇳\n\n🔒 Personal details kept private.\n\nCalculate yours deterministically here:\n${window.location.href}`;
    } else if (isFullShared) {
      text = `*${heading}:* ${healthResult.score}/100 (${healthResult.category})! 🇮🇳\n\n• *Income:* ${formatIndianCurrency(inputs.income)}\n• *EMIs:* ${formatIndianCurrency(inputs.emi)}\n• *Investments:* ${formatIndianCurrency(inputs.investment)}\n• *Savings:* ${formatIndianCurrency(inputs.savings)}\n\nView snapshot or calculate yours:\n${window.location.href}`;
    } else {
      if (sharePrivacy === "score_only") {
        text = `*${heading}:* ${healthResult.score}/100 (${healthResult.category})! 🇮🇳\n\n🔒 Personal details kept private.\n\nCalculate yours deterministically here:\n${shareUrl}`;
      } else {
        text = `*${heading}:* ${healthResult.score}/100 (${healthResult.category})! 🇮🇳\n\n• *Income:* ${formatIndianCurrency(inputs.income)}\n• *EMIs:* ${formatIndianCurrency(inputs.emi)}\n• *Investments:* ${formatIndianCurrency(inputs.investment)}\n• *Savings:* ${formatIndianCurrency(inputs.savings)}\n\nView snapshot or calculate yours:\n${shareUrl}`;
      }
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleReset = () => {
    const def = {
      age: 28,
      cityTier: "tier1" as CityTier,
      income: 100000,
      emi: 20000,
      investment: 15000,
      savings: 300000,
      expenses: undefined,
    };
    setInputs(def);
    setRawIncomeStr("100000");
    setRawEmiStr("20000");
    setRawInvStr("15000");
    setRawSavStr("300000");
    setRawAgeStr("28");
    setRawExpStr("");
    setShowCustomExpenses(false);
    setIsWhatIfActive(false);
    setWhatIfDelta({ extraInvestment: 0, emiReduction: 0, extraSavings: 0 });
  };

  return (
    <div className="w-full text-navy selection:bg-brand selection:text-white pb-16">

      {/* ========================================================================= */}
      {/* DEDICATED OFFICIAL PRINT / PDF REPORT (Visible ONLY during window.print)   */}
      {/* ========================================================================= */}
      {isScoreOnlyShared ? (
        <div className="hidden print:block w-full max-w-4xl mx-auto p-8 space-y-6 text-slate-900 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 print-avoid-break">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="IndiaWise Logo" className="h-9 w-auto object-contain flex-shrink-0" />
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  {formatShareHeading(recipientName, "Financial Health Report")}
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">Generated using IndiaWise&apos;s deterministic calculation engine.</p>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <div>Date: <strong className="text-slate-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
              <div className="font-semibold text-brand">indiawise.vercel.app</div>
              <div className="text-[10px] text-slate-500">Support: <strong className="text-slate-700">indiawiseofficial@outlook.com</strong></div>
            </div>
          </div>

          {/* Score Hero Section */}
          <div className="flex items-center justify-between p-6 rounded-xl border-2 border-slate-200 bg-white print-avoid-break">
            <div className="flex items-center gap-6">
              <div className="text-center px-6 py-4 bg-slate-900 text-white rounded-xl">
                <span className="text-4xl font-black font-mono tracking-tight">{scoreOnlyNumber}</span>
                <span className="text-xs uppercase tracking-widest text-slate-300 block font-bold">/ 100</span>
              </div>
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-1">
                  {scoreOnlyCategory}
                </div>
                <h2 className="text-base font-bold text-slate-900">{scoreOnlyMeta.headline}</h2>
                <p className="text-xs text-slate-600 max-w-lg mt-1">{scoreOnlyMeta.summary}</p>
              </div>
            </div>
          </div>

          {/* Privacy Protected Notice Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 print-avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Privacy Protected
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This calculation is performed client-side where supported. IndiaWise does not require an account or database to generate this report. The owner chose to share only their health score. Personal financial details (income, loans, investments, savings, and expenses) are strictly excluded from this shared snapshot.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 print-avoid-break">
            <div>Generated using IndiaWise&apos;s deterministic calculation engine.</div>
            <div>IndiaWise • Support: <strong className="text-slate-700 font-mono">indiawiseofficial@outlook.com</strong> • indiawise.vercel.app</div>
          </div>
        </div>
      ) : (
        <div className="hidden print:block w-full max-w-4xl mx-auto p-4 space-y-4 text-slate-900 bg-white">
          {/* Report Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 print-avoid-break">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="IndiaWise Logo" className="h-9 w-auto object-contain flex-shrink-0" />
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  {formatShareHeading(recipientName || shareName, "Financial Health Report")}
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">Generated using IndiaWise&apos;s deterministic calculation engine.</p>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <div>Date: <strong className="text-slate-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
              <div className="font-semibold text-brand">indiawise.vercel.app</div>
              <div className="text-[10px] text-slate-500">Support: <strong className="text-slate-700">indiawiseofficial@outlook.com</strong></div>
            </div>
          </div>

          {/* Financial Profile Summary Bar */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Income</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{formatIndianCurrency(inputs.income)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Monthly EMIs</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{formatIndianCurrency(inputs.emi)}</span>
              <span className="text-[10px] text-slate-500 block">({Math.round(healthResult.normalizedInputs.emiRatio)}% of income)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Investments</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{formatIndianCurrency(inputs.investment)}</span>
              <span className="text-[10px] text-slate-500 block">({Math.round(healthResult.normalizedInputs.investmentRatio)}% allocation)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency Savings</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{formatIndianCurrency(inputs.savings)}</span>
              <span className="text-[10px] text-slate-500 block">({healthResult.normalizedInputs.emergencyMonths ? `${healthResult.normalizedInputs.emergencyMonths} mos runway` : '—'})</span>
            </div>
          </div>

          {/* Score Hero Section */}
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-white">
            <div className="flex items-center gap-6">
              <div className="text-center px-4 py-2 bg-slate-900 text-white rounded-xl">
                <span className="text-3xl font-black font-mono tracking-tight">{healthResult.score}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-300 block font-bold">/ 100</span>
              </div>
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-1">
                  {healthResult.category}
                </div>
                <h2 className="text-base font-bold text-slate-900">{healthResult.categoryHeadline}</h2>
                <p className="text-xs text-slate-600 max-w-lg">{healthResult.summarySentence}</p>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500 space-y-0.5 border-l border-slate-200 pl-4">
              <div>Age: <strong className="text-slate-900">{inputs.age} yrs</strong></div>
              <div>City: <strong className="text-slate-900 uppercase">{inputs.cityTier}</strong></div>
            </div>
          </div>

          {/* The 4 Dimensions Table */}
          <div className="space-y-1.5 print-avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Four Core Financial Dimensions</h3>
            <div className="grid grid-cols-2 gap-3">
              {healthResult.dimensions.map((dim) => {
                let barColor = "bg-emerald-500";
                let badgeColor = "text-emerald-800 bg-emerald-100 border-emerald-300";
                if (dim.status === "good") {
                  barColor = "bg-blue-600";
                  badgeColor = "text-blue-800 bg-blue-100 border-blue-300";
                } else if (dim.status === "fair") {
                  barColor = "bg-amber-500";
                  badgeColor = "text-amber-800 bg-amber-100 border-amber-300";
                } else if (dim.status === "critical") {
                  barColor = "bg-rose-500";
                  badgeColor = "text-rose-800 bg-rose-100 border-rose-300";
                }

                return (
                  <div key={dim.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs print-avoid-break">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{dim.name} ({dim.weight}% weight)</span>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${badgeColor}`}>
                        {dim.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(5, dim.score))}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>{dim.metricLabel}: <strong className="text-slate-900">{dim.metricValue}</strong></span>
                      <span className="capitalize">{dim.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reality Check Findings */}
          <div className="space-y-1.5 print-avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Key Reality Check Findings</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {healthResult.realityChecks.map((rc) => (
                <div key={rc.id} className="p-2.5 rounded-lg border border-slate-200 bg-white print-avoid-break">
                  <div className="font-bold text-slate-900">{rc.headline}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{rc.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="space-y-1.5 print-avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recommended Action Plan</h3>
            <div className="space-y-1 text-xs">
              {healthResult.actionPlan.slice(0, 3).map((action) => (
                <div key={action.id} className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between print-avoid-break">
                  <div>
                    <span className="font-bold text-slate-900">{action.title}</span>
                    <span className="text-[11px] text-slate-600 ml-2">— {action.description}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700 flex-shrink-0">
                    {action.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Disclosures Notice */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed space-y-1.5 print-avoid-break">
            <p>
              <strong className="text-slate-800">Financial Diagnostic & Advisory Notice:</strong> This Financial Health Report is deterministically computed based on self-reported inputs and established Indian financial health benchmarks (debt-to-income limits, emergency fund runway, investment momentum). It is intended solely for personal awareness and educational guidance. It does not constitute certified investment advice, credit evaluation, loan approval, or portfolio management. Consult a certified financial planner or Chartered Accountant for individualized financial decisions.
            </p>
            <p>
              <strong className="text-slate-800">No Guarantee & Accuracy:</strong> IndiaWise does not guarantee any specific financial return or future outcome. Calculations are approximate and based on standard models. For inquiries or support, contact <strong className="text-slate-800 font-mono">indiawiseofficial@outlook.com</strong>.
            </p>
          </div>

          {/* Report Footer */}
          <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between text-[10px] text-slate-500 print-avoid-break">
            <div>Report generated via IndiaWise Financial Health Score.</div>
            <div>IndiaWise • Support: <strong className="text-slate-700 font-mono">indiawiseofficial@outlook.com</strong> • indiawise.vercel.app</div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BROWSER VIEW (print:hidden)                                              */}
      {/* ========================================================================= */}
      <div className="print:hidden">

        {/* ----------------------------------------------------------------------- */}
        {/* CASE 1: SCORE ONLY SHARED VIEW (Genuine Privacy, Zero Inputs in DOM)     */}
        {/* ----------------------------------------------------------------------- */}
        {isScoreOnlyShared ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-xs font-semibold text-navy shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>Shared Financial Health Snapshot</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
                {formatShareHeading(recipientName, "Financial Health Score")}
              </h1>
              <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
                A transparent, calculation-backed diagnostic snapshot generated on IndiaWise.
              </p>
            </div>

            {/* Score Card with Arc Gauge */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-border shadow-sm text-center space-y-6 relative overflow-hidden">
              <div 
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
                style={{ backgroundColor: scoreOnlyTheme.glow }}
              />

              <div className="relative w-52 h-52 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-130" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="13"
                    fill="transparent"
                    strokeDasharray={arcLength}
                    strokeDashoffset="0"
                    className="text-gray-100"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="13"
                    fill="transparent"
                    strokeDasharray={arcLength}
                    strokeDashoffset={strokeDashoffset}
                    className={`${scoreOnlyTheme.ring} transition-all duration-700 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-6xl font-black tracking-tight text-navy font-mono">
                    {displayScore}
                  </span>
                  <span className="text-xs font-bold text-muted uppercase tracking-widest mt-1">
                    out of 100
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${scoreOnlyTheme.badge}`}>
                  <span className={`w-2 h-2 rounded-full ${scoreOnlyTheme.bar}`} />
                  <span>{scoreOnlyCategory}</span>
                </div>
                <h3 className="text-2xl font-bold text-navy tracking-tight">
                  {scoreOnlyMeta.headline}
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
                  {scoreOnlyMeta.summary}
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-alt hover:bg-gray-100 text-navy font-semibold text-xs transition-colors border border-border flex items-center gap-2 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-navy" />
                  <span>Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-alt hover:bg-gray-100 text-navy font-semibold text-xs transition-colors border border-border flex items-center gap-2 shadow-xs"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-navy" />}
                  <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* Genuine Privacy Notice Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
                <Lock className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-navy">Personal Financial Details Kept Private</h4>
                <p className="text-xs text-muted leading-relaxed">
                  The owner chose to share only their health score. Personal financial details (income, loans, investments, savings, and expenses) were kept strictly private and were not transmitted in this link or stored on any server.
                </p>
              </div>
            </div>

            {/* Prominent "Calculate Yours" CTA Card */}
            <div className="bg-gradient-to-br from-navy to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-md text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                <Sparkles className="w-3 h-3" /> 100% Free & Private
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Curious How Your Financial Health Compares?
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Calculate your personal debt burden, emergency buffer, and compounding momentum in 60 seconds with 100% private, deterministic math.
              </p>
              <div className="pt-2">
                <Link
                  href="/financial-health-score"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold text-sm shadow-md transition-all hover:scale-105"
                >
                  <span>Calculate Yours</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : isFullShared ? (
          /* ----------------------------------------------------------------------- */
          /* CASE 2: FULL DETAILS SHARED VIEW (Strict Read-Only Snapshot)            */
          /* ----------------------------------------------------------------------- */
          <div className="w-full space-y-8">
            {/* Top Header */}
            <div className="text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-xs font-semibold text-navy shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>Shared Financial Health Snapshot • Read-Only</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
                {formatShareHeading(recipientName, "Financial Health Score")}
              </h1>
              <p className="text-base text-muted max-w-3xl leading-relaxed">
                Viewing a shared calculation snapshot. Shared parameters are displayed in read-only mode to preserve the calculation.
              </p>
            </div>

            {/* Quick "Calculate Yours" Top Callout */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-brand flex-shrink-0" />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-blue-900 block">
                    Viewing a shared snapshot from {recipientName || "another user"}
                  </span>
                  <span className="text-xs text-blue-700">
                    Want to test your own private income, loans, and emergency reserves?
                  </span>
                </div>
              </div>
              <Link
                href="/financial-health-score"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-xs transition-all flex-shrink-0"
              >
                <span>Calculate Yours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Two-Column Read-Only Snapshot Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (5 cols): Strict Read-Only Parameters Cards */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-border shadow-sm space-y-4">
                <div className="pb-3 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-navy flex items-center gap-2">
                      <Lock className="w-4 h-4 text-brand" /> Shared Parameters
                    </h2>
                    <p className="text-xs text-muted">Read-only snapshot values</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    Read-Only
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-alt/60 border border-border flex justify-between items-center">
                    <span className="text-muted font-semibold">Monthly In-Hand Income</span>
                    <span className="font-mono font-bold text-navy text-sm">{formatIndianCurrency(inputs.income)}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-alt/60 border border-border flex justify-between items-center">
                    <div>
                      <span className="text-muted font-semibold block">Total Monthly EMIs</span>
                      <span className="text-[10px] text-slate-500">({Math.round(healthResult.normalizedInputs.emiRatio)}% of income)</span>
                    </div>
                    <span className="font-mono font-bold text-navy text-sm">{formatIndianCurrency(inputs.emi)}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-alt/60 border border-border flex justify-between items-center">
                    <div>
                      <span className="text-muted font-semibold block">Monthly Investments</span>
                      <span className="text-[10px] text-slate-500">({Math.round(healthResult.normalizedInputs.investmentRatio)}% allocation)</span>
                    </div>
                    <span className="font-mono font-bold text-navy text-sm">{formatIndianCurrency(inputs.investment)}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-alt/60 border border-border flex justify-between items-center">
                    <div>
                      <span className="text-muted font-semibold block">Emergency Savings</span>
                      <span className="text-[10px] text-slate-500">({healthResult.normalizedInputs.emergencyMonths ? `${healthResult.normalizedInputs.emergencyMonths} mos runway` : '—'})</span>
                    </div>
                    <span className="font-mono font-bold text-navy text-sm">{formatIndianCurrency(inputs.savings)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-alt/60 border border-border">
                      <span className="text-muted font-semibold block text-[10px] uppercase">Age</span>
                      <span className="font-mono font-bold text-navy text-sm">{inputs.age} years</span>
                    </div>
                    <div className="p-3 rounded-xl bg-alt/60 border border-border">
                      <span className="text-muted font-semibold block text-[10px] uppercase">City Tier</span>
                      <span className="font-mono font-bold text-navy text-sm uppercase">{inputs.cityTier}</span>
                    </div>
                  </div>

                  {inputs.expenses !== undefined && (
                    <div className="p-3.5 rounded-2xl bg-alt/60 border border-border flex justify-between items-center">
                      <span className="text-muted font-semibold">Custom Monthly Expenses</span>
                      <span className="font-mono font-bold text-navy text-sm">{formatIndianCurrency(inputs.expenses)}</span>
                    </div>
                  )}
                </div>

                {/* Inline CTA in parameter panel */}
                <div className="pt-4 border-t border-border text-center space-y-3">
                  <p className="text-xs text-muted leading-relaxed">
                    Want to run this calculation with your own private numbers?
                  </p>
                  <Link
                    href="/financial-health-score"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <span>Calculate Yours</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column (7 cols): Score Reveal & Dimensions */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Score Hero Card */}
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm overflow-hidden space-y-6">
                  <div 
                    className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[90px] pointer-events-none"
                    style={{ backgroundColor: theme.glow }}
                  />

                  {/* Top Action Toolbar */}
                  <div className="relative z-10 border-b border-border pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-navy">Score Summary</h2>
                      <p className="text-xs text-brand font-semibold mt-0.5">
                        Shared snapshot from {recipientName || "another user"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        type="button"
                        onClick={() => window.print()}
                        suppressHydrationWarning
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-navy text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand transition-colors cursor-pointer"
                        title="Save or print formal PDF report"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save PDF</span>
                      </button>

                      <button 
                        type="button"
                        onClick={handleWhatsAppShare}
                        suppressHydrationWarning
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button 
                        type="button"
                        onClick={handleCopyLink}
                        suppressHydrationWarning
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-navy rounded-xl text-xs font-semibold shadow-xs border border-border hover:bg-gray-50 transition-colors cursor-pointer"
                        title="Copy snapshot link"
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-navy" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                    <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-130" viewBox="0 0 200 200">
                        <circle
                          cx="100"
                          cy="100"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="13"
                          fill="transparent"
                          strokeDasharray={arcLength}
                          strokeDashoffset="0"
                          className="text-gray-100"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="13"
                          fill="transparent"
                          strokeDasharray={arcLength}
                          strokeDashoffset={strokeDashoffset}
                          className={`${theme.ring} transition-all duration-700 ease-out`}
                          strokeLinecap="round"
                        />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-5xl sm:text-6xl font-black tracking-tight text-navy font-mono">
                          {displayScore}
                        </span>
                        <span className="text-xs font-bold text-muted uppercase tracking-widest mt-0.5">
                          out of 100
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 text-center sm:text-left flex-1">
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${theme.bar}`} />
                        <span>{activeCategory}</span>
                      </div>

                      <h3 className="text-2xl font-black text-navy tracking-tight leading-snug">
                        {healthResult.categoryHeadline}
                      </h3>

                      <p className="text-sm text-muted leading-relaxed font-normal">
                        {healthResult.summarySentence}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted">
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-navy">{Math.round(healthResult.normalizedInputs.emiRatio)}%</span> EMI
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-navy">{Math.round(healthResult.normalizedInputs.investmentRatio)}%</span> Invested
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-navy">
                            {healthResult.normalizedInputs.emergencyMonths ? `${healthResult.normalizedInputs.emergencyMonths} mos` : "—"}
                          </span> Runway
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Core Dimensions Breakdown */}
                <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand" /> Transparent Dimensions
                    </h4>
                    <span className="text-[11px] text-muted font-mono">Weights Sum to 100%</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {healthResult.dimensions.map((dim) => {
                      let barColor = "bg-emerald-500";
                      let badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                      if (dim.status === "good") {
                        barColor = "bg-brand";
                        badgeColor = "text-blue-700 bg-blue-50 border-blue-200";
                      } else if (dim.status === "fair") {
                        barColor = "bg-amber-500";
                        badgeColor = "text-amber-700 bg-amber-50 border-amber-200";
                      } else if (dim.status === "critical") {
                        barColor = "bg-rose-500";
                        badgeColor = "text-rose-700 bg-rose-50 border-rose-200";
                      }

                      return (
                        <div key={dim.id} className="p-3.5 rounded-2xl bg-alt/60 border border-border space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-navy">{dim.name}</span>
                            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                              {dim.score}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200/80 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${barColor} transition-all duration-500`}
                              style={{ width: `${Math.min(100, Math.max(5, dim.score))}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-muted">
                            <span>{dim.metricLabel}: <strong className="text-navy font-mono">{dim.metricValue}</strong></span>
                            <span>Weight: {dim.weight}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Sharing Bar */}
                <div className="bg-white rounded-3xl p-5 border border-border shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-muted">
                    Shared snapshot of {recipientName || "this calculation"}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 rounded-xl bg-alt hover:bg-gray-100 text-navy font-semibold text-xs transition-colors border border-border flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-navy" />
                      <span>PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsAppShare}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3.5 py-1.5 rounded-xl bg-alt hover:bg-gray-100 text-navy font-semibold text-xs transition-colors border border-border flex items-center gap-1.5 shadow-xs"
                    >
                      {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-navy" />}
                      <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Reality Check Facts */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-5">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-brand" />
                <div>
                  <h3 className="text-base font-bold text-navy">Reality Check: Numbers in Context</h3>
                  <p className="text-xs text-muted">Concrete benchmarks derived directly from the cashflow math</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {healthResult.realityChecks.map((rc) => (
                  <div
                    key={rc.id}
                    className="p-4 rounded-2xl bg-alt/60 border border-border space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      {rc.type === "positive" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : rc.type === "warning" ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-brand flex-shrink-0" />
                      )}
                      <h5 className="text-xs font-bold text-navy">{rc.headline}</h5>
                    </div>
                    <p className="text-xs text-muted pl-6 leading-relaxed">
                      {rc.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Action Recommendations & Calculate Yours Footer */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-navy">Recommended Next Steps</h3>
                <p className="text-xs text-muted">Deterministic tools to optimize financial dimensions</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {healthResult.actionPlan.map((action) => (
                  <div
                    key={action.id}
                    className="p-4 rounded-2xl bg-alt/60 border border-border flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          action.priority === "high" 
                            ? "bg-red-100 text-red-700 border border-red-200" 
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}>
                          {action.priority}
                        </span>
                        <h4 className="text-xs font-bold text-navy">{action.title}</h4>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{action.description}</p>
                    </div>

                    {action.actionUrl && (
                      <Link
                        href={action.actionUrl}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-semibold self-start transition-all shadow-xs"
                      >
                        <span>{action.actionText || "Open Tool"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Calculate Yours Callout Card */}
            <div className="bg-gradient-to-br from-navy to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-md text-center space-y-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Ready to Check Your Own Financial Standing?
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Calculate your personal score with your own private income, EMIs, and savings. 100% private and client-side.
              </p>
              <div className="pt-2">
                <Link
                  href="/financial-health-score"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold text-sm shadow-md transition-all hover:scale-105"
                >
                  <span>Calculate Yours</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        ) : (
          /* ----------------------------------------------------------------------- */
          /* CASE 3: INTERACTIVE OWNER COCKPIT (Sliders, Inputs, Live What-If)       */
          /* ----------------------------------------------------------------------- */
          <div>
            {/* Hero Section */}
            <section className="relative mb-8 text-left space-y-2">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-xs font-semibold text-navy shadow-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand" />
                  <span>IndiaWise Flagship • 100% Deterministic Engine</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
                  Financial Health Score
                </h1>

                <p className="text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
                  A transparent, calculation-backed diagnosis of your debt burdens, emergency runway, and compounding momentum.
                </p>

                <div className="flex items-center gap-6 text-xs text-muted font-medium pt-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Client-Side Only
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-600" /> Zero Data Stored
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" /> Live What-If
                  </span>
                </div>
              </div>
            </section>

            {/* The Cockpit: Dual Interactive Workspace */}
            <main className="w-full space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Interactive Inputs Cockpit (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-border shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div>
                      <h2 className="text-base font-bold text-navy flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-brand" /> Your Financial Details
                      </h2>
                      <p className="text-xs text-muted">Type in the boxes or drag the sliders</p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-xs font-semibold text-muted hover:text-brand flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-alt border border-border"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Input 1: Monthly Income */}
                  <div className="space-y-2.5 bg-alt/60 p-4 rounded-2xl border border-border">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-navy">
                        Monthly In-Hand Income
                      </label>
                      <div className="relative w-36 sm:w-40 flex-shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-semibold text-xs select-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={rawIncomeStr ? Number(rawIncomeStr).toLocaleString("en-IN") : ""}
                          onChange={(e) => handleIncomeInput(e.target.value)}
                          placeholder="1,00,000"
                          className="w-full pl-7 pr-3 py-1.5 text-right font-mono font-bold text-navy bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm shadow-xs transition-all"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={15000}
                      max={1000000}
                      step={5000}
                      value={inputs.income}
                      onChange={(e) => handleIncomeSlider(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between text-[10px] text-muted font-mono">
                      <span>₹15,000</span>
                      <span>₹5,00,000</span>
                      <span>₹10,00,000+</span>
                    </div>
                  </div>

                  {/* Input 2: Total EMIs */}
                  <div className="space-y-2.5 bg-alt/60 p-4 rounded-2xl border border-border">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-navy block">
                          Total Monthly EMIs
                        </label>
                        <span className="text-[11px] text-muted font-mono">
                          {Math.round(healthResult.normalizedInputs.emiRatio)}% of income
                        </span>
                      </div>
                      <div className="relative w-36 sm:w-40 flex-shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-semibold text-xs select-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={rawEmiStr ? Number(rawEmiStr).toLocaleString("en-IN") : ""}
                          onChange={(e) => handleEmiInput(e.target.value)}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-1.5 text-right font-mono font-bold text-navy bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm shadow-xs transition-all"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(inputs.income, 100000)}
                      step={2500}
                      value={inputs.emi}
                      onChange={(e) => handleEmiSlider(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between text-[10px] text-muted font-mono">
                      <span>₹0</span>
                      <span>₹50,000</span>
                      <span>₹1,00,000+</span>
                    </div>
                  </div>

                  {/* Input 3: Monthly Investments */}
                  <div className="space-y-2.5 bg-alt/60 p-4 rounded-2xl border border-border">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-navy block">
                          Monthly Investments
                        </label>
                        <span className="text-[11px] text-muted font-mono">
                          {Math.round(healthResult.normalizedInputs.investmentRatio)}% of income
                        </span>
                      </div>
                      <div className="relative w-36 sm:w-40 flex-shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-semibold text-xs select-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={rawInvStr ? Number(rawInvStr).toLocaleString("en-IN") : ""}
                          onChange={(e) => handleInvInput(e.target.value)}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-1.5 text-right font-mono font-bold text-navy bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm shadow-xs transition-all"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(inputs.income, 100000)}
                      step={2500}
                      value={inputs.investment}
                      onChange={(e) => handleInvSlider(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between text-[10px] text-muted font-mono">
                      <span>₹0</span>
                      <span>₹50,000</span>
                      <span>₹1,00,000+</span>
                    </div>
                  </div>

                  {/* Input 4: Liquid Emergency Savings */}
                  <div className="space-y-2.5 bg-alt/60 p-4 rounded-2xl border border-border">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-navy block">
                          Liquid Emergency Savings
                        </label>
                        <span className="text-[11px] text-muted font-mono">
                          {healthResult.normalizedInputs.emergencyMonths
                            ? `${healthResult.normalizedInputs.emergencyMonths} mos runway`
                            : "Bank + FD balance"}
                        </span>
                      </div>
                      <div className="relative w-36 sm:w-40 flex-shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-semibold text-xs select-none">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={rawSavStr ? Number(rawSavStr).toLocaleString("en-IN") : ""}
                          onChange={(e) => handleSavInput(e.target.value)}
                          placeholder="0"
                          className="w-full pl-7 pr-3 py-1.5 text-right font-mono font-bold text-navy bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm shadow-xs transition-all"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(inputs.income * 18, 1500000)}
                      step={10000}
                      value={inputs.savings}
                      onChange={(e) => handleSavSlider(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between text-[10px] text-muted font-mono">
                      <span>₹0</span>
                      <span>₹5 Lakh</span>
                      <span>₹15 Lakh+</span>
                    </div>
                  </div>

                  {/* Age & City Tier */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1 bg-alt/60 p-3 rounded-2xl border border-border">
                      <label className="text-xs font-bold text-navy block">Age</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={18}
                          max={100}
                          value={rawAgeStr}
                          onChange={(e) => handleAgeInput(e.target.value)}
                          className="w-full px-2.5 py-1 text-sm font-mono font-bold bg-white border border-border rounded-lg text-navy"
                        />
                        <span className="text-xs text-muted">yrs</span>
                      </div>
                    </div>

                    <div className="space-y-1 bg-alt/60 p-3 rounded-2xl border border-border">
                      <label className="text-xs font-bold text-navy block">City Tier</label>
                      <div className="grid grid-cols-3 gap-1 bg-gray-200/60 p-0.5 rounded-lg text-xs font-semibold">
                        {(['tier1', 'tier2', 'tier3'] as CityTier[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setInputs({ ...inputs, cityTier: t })}
                            className={`py-1 rounded text-center transition-all ${
                              inputs.cityTier === t
                                ? "bg-white text-navy font-bold shadow-xs border border-border"
                                : "text-muted hover:text-navy"
                            }`}
                          >
                            {t === "tier1" ? "T1" : t === "tier2" ? "T2" : "T3"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Optional Custom Expenses Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowCustomExpenses(!showCustomExpenses)}
                      className="text-xs font-medium text-muted hover:text-brand flex items-center justify-between w-full py-1"
                    >
                      <span>{showCustomExpenses ? "Hide living expenses" : "Customize monthly living expenses (optional)"}</span>
                      {showCustomExpenses ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showCustomExpenses && (
                      <div className="mt-2 p-3 bg-alt rounded-xl border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-navy font-medium">Essential Expenses</span>
                          <div className="relative w-32">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted text-xs">₹</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={
                                rawExpStr
                                  ? Number(rawExpStr).toLocaleString("en-IN")
                                  : Math.round(inputs.income * 0.45).toLocaleString("en-IN")
                              }
                              onChange={(e) => handleExpInput(e.target.value)}
                              className="w-full pl-5 pr-2 py-1 text-right font-mono font-bold text-xs bg-white border border-border rounded-lg text-navy"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Live Score Reveal & What-If (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Score Hero Card */}
                  <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm overflow-hidden space-y-6">
                    <div 
                      className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[90px] pointer-events-none transition-all duration-700"
                      style={{ backgroundColor: theme.glow }}
                    />

                    {/* Top Share & Export Toolbar */}
                    <div className="relative z-10 border-b border-border pb-5 space-y-4">
                      {/* Row 1: Heading & Primary Action Buttons */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-lg font-bold text-navy">Score Summary</h2>
                          {shareName.trim() ? (
                            <p className="text-xs text-brand font-semibold mt-0.5">
                              Diagnostic Report for {formatOwnerNameBadge(shareName)}
                            </p>
                          ) : (
                            <p className="text-xs text-muted mt-0.5">
                              Live calculation updated in real time
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button 
                            type="button"
                            onClick={() => window.print()}
                            suppressHydrationWarning
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-navy text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand transition-colors cursor-pointer"
                            title="Save or print formal PDF report"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Save PDF</span>
                          </button>

                          <button 
                            type="button"
                            onClick={handleWhatsAppShare}
                            suppressHydrationWarning
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                            title="Share on WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          <button 
                            type="button"
                            onClick={handleCopyLink}
                            suppressHydrationWarning
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-navy rounded-xl text-xs font-semibold shadow-xs border border-border hover:bg-gray-50 transition-colors cursor-pointer"
                            title="Copy share link"
                          >
                            {copySuccess ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-navy" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Sharing Preferences Strip */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
                        <div className="flex items-center gap-2 flex-1 max-w-sm bg-alt/60 px-3 py-1.5 rounded-xl border border-border shadow-xs">
                          <User className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                          <input 
                            type="text" 
                            placeholder="Your name (optional)" 
                            value={shareName}
                            onChange={(e) => setShareName(e.target.value)}
                            maxLength={30}
                            suppressHydrationWarning
                            className="w-full text-xs bg-transparent border-none p-0 text-navy placeholder:text-muted focus:outline-none focus:ring-0"
                            title="Add your name to personalize WhatsApp, PDF & Public URL"
                          />
                        </div>

                        {/* Privacy Toggle: Score Only vs Full Profile */}
                        <div className="flex items-center self-end sm:self-auto bg-alt p-0.5 rounded-xl border border-border text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setSharePrivacy("score_only")}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                              sharePrivacy === "score_only" 
                                ? "bg-white text-navy font-bold shadow-xs border border-border" 
                                : "text-muted hover:text-navy"
                            }`}
                            title="Recipient only sees the score and category. All salaries, EMIs, and savings remain 100% private."
                          >
                            <Lock className="w-3 h-3 text-emerald-600" />
                            <span>Score Only</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSharePrivacy("full")}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                              sharePrivacy === "full" 
                                ? "bg-white text-navy font-bold shadow-xs border border-border" 
                                : "text-muted hover:text-navy"
                            }`}
                            title="Recipient can see complete profile details for joint/advisor planning."
                          >
                            <span>Full Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Live Score Reveal */}
                    <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                      <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-130" viewBox="0 0 200 200">
                          <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="13"
                            fill="transparent"
                            strokeDasharray={arcLength}
                            strokeDashoffset="0"
                            className="text-gray-100"
                            strokeLinecap="round"
                          />
                          <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="13"
                            fill="transparent"
                            strokeDasharray={arcLength}
                            strokeDashoffset={strokeDashoffset}
                            className={`${theme.ring} transition-all duration-700 ease-out`}
                            strokeLinecap="round"
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-5xl sm:text-6xl font-black tracking-tight text-navy font-mono">
                            {displayScore}
                          </span>
                          <span className="text-xs font-bold text-muted uppercase tracking-widest mt-0.5">
                            out of 100
                          </span>
                          {isWhatIfActive && whatIfResult.scoreDelta !== 0 && (
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1.5 border ${
                              whatIfResult.scoreDelta > 0 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}>
                              {whatIfResult.scoreDelta > 0 ? `+${whatIfResult.scoreDelta}` : whatIfResult.scoreDelta} with What-If
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 text-center sm:text-left flex-1">
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.badge}`}>
                          <span className={`w-2 h-2 rounded-full ${theme.bar}`} />
                          <span>{activeCategory}</span>
                        </div>

                        <h3 className="text-2xl font-black text-navy tracking-tight leading-snug">
                          {healthResult.categoryHeadline}
                        </h3>

                        <p className="text-sm text-muted leading-relaxed font-normal">
                          {healthResult.summarySentence}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted">
                          <span className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-navy">{Math.round(healthResult.normalizedInputs.emiRatio)}%</span> EMI
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-navy">{Math.round(healthResult.normalizedInputs.investmentRatio)}%</span> Invested
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-navy">
                              {healthResult.normalizedInputs.emergencyMonths ? `${healthResult.normalizedInputs.emergencyMonths} mos` : "—"}
                            </span> Runway
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Health Card Mockup */}
                    <div className="relative z-10 bg-gradient-to-br from-navy to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-md overflow-hidden space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          {sanitizeShareName(shareName) 
                            ? `${formatOwnerNameBadge(shareName)} Health Card` 
                            : "IndiaWise Health Card"}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between py-0.5">
                        <div>
                          <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                            {healthResult.score}<span className="text-base text-slate-400 font-normal">/100</span>
                          </div>
                          <div className="text-xs font-bold text-blue-300 mt-0.5">
                            {healthResult.category}
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-slate-400 font-mono">
                          100% Deterministic<br />IndiaWise
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-slate-300">
                        <span>
                          {sharePrivacy === "score_only" 
                            ? "🔒 Privacy Protected: Only your score is visible. No salaries or EMIs disclosed."
                            : "All profile figures included for collaborative planning."}
                        </span>
                        <span className="text-slate-400 font-mono hidden sm:inline">Live Card Preview</span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Core Dimensions Breakdown */}
                  <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-brand" /> Transparent Dimensions
                      </h4>
                      <span className="text-[11px] text-muted font-mono">Weights Sum to 100%</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {healthResult.dimensions.map((dim) => {
                        let barColor = "bg-emerald-500";
                        let badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                        if (dim.status === "good") {
                          barColor = "bg-brand";
                          badgeColor = "text-blue-700 bg-blue-50 border-blue-200";
                        } else if (dim.status === "fair") {
                          barColor = "bg-amber-500";
                          badgeColor = "text-amber-700 bg-amber-50 border-amber-200";
                        } else if (dim.status === "critical") {
                          barColor = "bg-rose-500";
                          badgeColor = "text-rose-700 bg-rose-50 border-rose-200";
                        }

                        return (
                          <div key={dim.id} className="p-3.5 rounded-2xl bg-alt/60 border border-border space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-navy">{dim.name}</span>
                              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                                {dim.score}/100
                              </span>
                            </div>
                            <div className="w-full bg-gray-200/80 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${barColor} transition-all duration-500`}
                                style={{ width: `${Math.min(100, Math.max(5, dim.score))}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-muted">
                              <span>{dim.metricLabel}: <strong className="text-navy font-mono">{dim.metricValue}</strong></span>
                              <span>Weight: {dim.weight}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live What-If Simulator */}
                  <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h4 className="text-sm font-bold text-navy">What-If Score Simulator</h4>
                      </div>
                      {isWhatIfActive && (
                        <button
                          onClick={() => {
                            setWhatIfDelta({ extraInvestment: 0, emiReduction: 0, extraSavings: 0 });
                            setIsWhatIfActive(false);
                          }}
                          className="text-xs text-brand hover:underline font-semibold"
                        >
                          Reset What-If
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-alt/60 border border-border space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Add Monthly SIP</span>
                          <span className="font-mono font-bold text-emerald-600">
                            +{formatIndianCurrency(whatIfDelta.extraInvestment || 0)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50000}
                          step={2500}
                          value={whatIfDelta.extraInvestment || 0}
                          onChange={(e) => {
                            setIsWhatIfActive(true);
                            setWhatIfDelta({ ...whatIfDelta, extraInvestment: Number(e.target.value) });
                          }}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-alt/60 border border-border space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">EMI Reduction</span>
                          <span className="font-mono font-bold text-brand">
                            -{formatIndianCurrency(whatIfDelta.emiReduction || 0)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={Math.min(inputs.emi, 50000)}
                          step={2500}
                          value={whatIfDelta.emiReduction || 0}
                          onChange={(e) => {
                            setIsWhatIfActive(true);
                            setWhatIfDelta({ ...whatIfDelta, emiReduction: Number(e.target.value) });
                          }}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-alt/60 border border-border space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Add Savings</span>
                          <span className="font-mono font-bold text-amber-600">
                            +{formatIndianCurrency(whatIfDelta.extraSavings || 0)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={200000}
                          step={10000}
                          value={whatIfDelta.extraSavings || 0}
                          onChange={(e) => {
                            setIsWhatIfActive(true);
                            setWhatIfDelta({ ...whatIfDelta, extraSavings: Number(e.target.value) });
                          }}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    {isWhatIfActive && (
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-navy">Projected: {whatIfResult.newScore}/100</strong> ({whatIfResult.scoreDelta > 0 ? `+${whatIfResult.scoreDelta}` : whatIfResult.scoreDelta} points)
                          <p className="text-muted text-[11px] mt-0.5">{whatIfResult.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Reality Check Facts */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-5">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-brand" />
                  <div>
                    <h3 className="text-base font-bold text-navy">Reality Check: Your Numbers in Context</h3>
                    <p className="text-xs text-muted">Concrete benchmarks derived directly from your cashflow math</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {healthResult.realityChecks.map((rc) => (
                    <div
                      key={rc.id}
                      className="p-4 rounded-2xl bg-alt/60 border border-border space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        {rc.type === "positive" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : rc.type === "warning" ? (
                          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-brand flex-shrink-0" />
                        )}
                        <h5 className="text-xs font-bold text-navy">{rc.headline}</h5>
                      </div>
                      <p className="text-xs text-muted pl-6 leading-relaxed">
                        {rc.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommended Action Plan (Full-Width) */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-5">
                <div>
                  <h3 className="text-base font-bold text-navy">Recommended Action Plan</h3>
                  <p className="text-xs text-muted">Targeted tools to improve your weakest financial dimensions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {healthResult.actionPlan.map((action) => (
                    <div
                      key={action.id}
                      className="p-4 rounded-2xl bg-alt/60 border border-border flex flex-col justify-between gap-4 transition-all hover:border-gray-300"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            action.priority === "high" 
                              ? "bg-red-100 text-red-700 border border-red-200" 
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {action.priority}
                          </span>
                          <h4 className="text-xs font-bold text-navy">{action.title}</h4>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">{action.description}</p>
                      </div>

                      {action.actionUrl && (
                        <Link
                          href={action.actionUrl}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-semibold self-start transition-all shadow-xs"
                        >
                          <span>{action.actionText || "Open Tool"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </section>

            </main>
          </div>
        )}

      </div>

      {/* Methodology & Explainer Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center space-y-2 text-xs text-muted print:hidden">
        <h4 className="font-bold uppercase tracking-wider text-navy">
          The IndiaWise Deterministic Standard
        </h4>
        <p className="leading-relaxed max-w-lg mx-auto">
          Calculated deterministically using Debt Burden (30%), Investment Rate (25%), Emergency Buffer (25%), and Savings Capacity (20%). 
          Client-side execution only. Zero personal data stored.
        </p>
      </footer>
    </div>
  );
}
