import { getAllCalculators } from "./registry";
import { CalculatorDefinition } from "./types";

export interface SearchResultItem {
  type: "result" | "recommendation";
  item: CalculatorDefinition;
  score?: number;
}

export function performSearch(query: string) {
  const allCalculators = getAllCalculators();
  const q = query.toLowerCase().trim();
  
  if (!q) {
    // Empty state: Popular calculators
    const popularSlugs = ["home-loan-emi", "sip-calculator", "income-tax-calculator", "in-hand-salary-calculator", "gst-calculator", "fd-calculator", "rd-calculator", "age-calculator", "bmi-calculator"];
    return {
      results: [],
      recommendations: allCalculators.filter(c => popularSlugs.includes(c.slug)).slice(0, 5)
    };
  }

  const results: SearchResultItem[] = [];
  
  for (const calc of allCalculators) {
    let score = 0;
    const nameStr = calc.name.toLowerCase();
    const shortDescStr = calc.shortDescription.toLowerCase();
    const catStr = calc.category.toLowerCase();
    
    // 1. Exact Name
    if (nameStr === q) score += 100;
    else if (nameStr.includes(q)) score += 50;
    
    // 3. Keyword Match
    const keywordMatch = calc.keywords.some(k => k.toLowerCase() === q);
    const keywordPartialMatch = calc.keywords.some(k => k.toLowerCase().includes(q));
    if (keywordMatch) score += 40;
    else if (keywordPartialMatch) score += 20;
    
    // 4. Category
    if (catStr === q) score += 30;
    else if (catStr.includes(q)) score += 15;
    
    // 5. Description
    if (shortDescStr.includes(q)) score += 10;
    
    if (score > 0) {
      results.push({ type: "result", item: calc, score });
    }
  }

  // Sort results by score
  results.sort((a, b) => (b.score || 0) - (a.score || 0));

  const resultItems = results.map(r => r.item);
  
  // Recommendations: Related calculators of the top results, or same category
  const recommendationItems: CalculatorDefinition[] = [];
  
  if (resultItems.length > 0) {
    const topResult = resultItems[0];
    
    // Explicit related
    if (topResult.relatedCalculators) {
      for (const relSlug of topResult.relatedCalculators) {
        const found = allCalculators.find(c => c.slug === relSlug);
        if (found && !resultItems.includes(found) && !recommendationItems.includes(found)) {
          recommendationItems.push(found);
        }
      }
    }
    
    // Same category
    for (const calc of allCalculators) {
      if (calc.categorySlug === topResult.categorySlug && !resultItems.includes(calc) && !recommendationItems.includes(calc)) {
        recommendationItems.push(calc);
      }
    }
  } else {
    // "xyzabc" case: No results, show popular
    const popularSlugs = ["home-loan-emi", "sip-calculator", "in-hand-salary-calculator", "gst-calculator"];
    for (const pSlug of popularSlugs) {
      const found = allCalculators.find(c => c.slug === pSlug);
      if (found) recommendationItems.push(found);
    }
  }

  return {
    results: resultItems.slice(0, 5),
    recommendations: recommendationItems.slice(0, 5)
  };
}
