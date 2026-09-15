export interface GuideSection {
  heading: string;
  content: string[];
  callout?: {
    title: string;
    text: string;
    type?: 'tip' | 'info' | 'caution';
  };
}

export interface GuideArticle {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  primaryCalculator: {
    name: string;
    href: string;
    cta: string;
  };
  relatedCalculators: {
    name: string;
    href: string;
  }[];
  sections: GuideSection[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const guidesData: Record<string, GuideArticle> = {
  'how-home-loan-emi-is-calculated': {
    slug: 'how-home-loan-emi-is-calculated',
    title: 'How Home Loan EMI Is Calculated: Formula, Mechanics & Examples',
    seoTitle: 'How Home Loan EMI Is Calculated — Formula, Mechanics & Amortization',
    description: 'Understand the mathematical formula behind home loan EMIs in India. Learn how interest and principal amortization work over 20–30 year tenures.',
    category: 'Home Loans',
    readTime: '6 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'Home Loan EMI Calculator',
      href: '/calculators/finance/home-loan-emi',
      cta: 'Calculate Your Home Loan EMI',
    },
    relatedCalculators: [
      { name: 'Personal Loan EMI Calculator', href: '/calculators/finance/personal-loan-emi' },
      { name: 'In-Hand Salary Calculator', href: '/calculators/salary/in-hand-salary' },
      { name: 'Financial Health Score', href: '/financial-health-score' },
    ],
    sections: [
      {
        heading: 'What Is an Equated Monthly Instalment (EMI)?',
        content: [
          'An Equated Monthly Instalment (EMI) is a fixed payment amount made by a borrower to a bank or financial institution on a specified date each calendar month.',
          'Every EMI consists of two distinct parts: the principal repayment component and the interest charge component. While the total monthly EMI remains constant throughout a fixed-rate loan tenure, the internal proportion changes dramatically over time.',
        ],
      },
      {
        heading: 'The Standard Mathematical EMI Formula',
        content: [
          'Indian banks and housing finance companies (HFCs) calculate monthly EMI using the standard reducing-balance formula:',
          'EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
          'Where:',
          '• P = Principal loan amount borrowed (in ₹)',
          '• r = Monthly interest rate (Annual interest rate divided by 12 months, then divided by 100)',
          '• n = Loan tenure in months (Number of years × 12)',
        ],
        callout: {
          title: 'Understanding the Monthly Rate',
          text: 'If your annual home loan rate is 8.5% p.a., the monthly rate r is 8.5 / (12 × 100) = 0.0070833. Compounding this over 240 months (20 years) creates the exact repayment schedule.',
          type: 'info',
        },
      },
      {
        heading: 'The Amortization Curve: Why Early EMIs Are Mostly Interest',
        content: [
          'Because interest is calculated each month on the remaining outstanding principal balance, the interest portion is highest during the first few years of the loan.',
          'In a typical 20-year home loan at 8.5%, over 60% of your EMI in year 1 goes toward interest charges alone. As the outstanding principal is gradually paid down, the interest share shrinks and the principal repayment portion increases exponentially toward the final years.',
        ],
      },
      {
        heading: 'How Extra Prepayments Slash Total Interest Outflow',
        content: [
          'Making an extra prepayment directly reduces the principal balance. Since future interest is calculated only on the remaining principal, even small regular prepayments or paying an extra EMI each year can shave years off your loan tenure and save lakhs of rupees in interest outflow.',
        ],
        callout: {
          title: 'Practical Prepayment Tip',
          text: 'Use the What-If slider on our Home Loan EMI Calculator to test how an extra ₹2,000 or ₹5,000 monthly prepayment reduces your loan tenure and total interest.',
          type: 'tip',
        },
      },
    ],
    faqs: [
      {
        question: 'Does increasing loan tenure decrease total interest?',
        answer: 'No. Increasing loan tenure reduces your monthly EMI amount, but significantly increases the total interest you pay over the lifetime of the loan.',
      },
      {
        question: 'Can I prepay floating rate home loans without penalty in India?',
        answer: 'Yes. Under Reserve Bank of India (RBI) regulations, banks and housing finance companies are not permitted to levy prepayment penalties on floating-rate home loans availed by individual borrowers.',
      },
      {
        question: 'What is the reducing balance method?',
        answer: 'Under the reducing balance method, interest is calculated only on the unpaid balance of the loan at the end of each period, rather than on the original principal amount.',
      },
    ],
  },

  'emi-vs-income-loan-affordability': {
    slug: 'emi-vs-income-loan-affordability',
    title: 'EMI vs Income: How Much Loan Can You Actually Afford?',
    seoTitle: 'EMI vs Income Affordability — Safe DTI Thresholds & Loan Eligibility',
    description: 'Learn how Indian lenders assess loan affordability using the Fixed Obligation to Income Ratio (FOIR) and Debt-to-Income (DTI) ratio. Determine your safe borrowing limit.',
    category: 'Home Loans',
    readTime: '5 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'Home Loan EMI Calculator',
      href: '/calculators/finance/home-loan-emi',
      cta: 'Check Your Loan Affordability',
    },
    relatedCalculators: [
      { name: 'In-Hand Salary Calculator', href: '/calculators/salary/in-hand-salary' },
      { name: 'Financial Health Score', href: '/financial-health-score' },
      { name: 'Personal Loan EMI Calculator', href: '/calculators/finance/personal-loan-emi' },
    ],
    sections: [
      {
        heading: 'The 40% EMI Golden Rule',
        content: [
          'A widely recognized benchmark in personal finance is that your total monthly debt obligations (all EMIs combined) should ideally not exceed 40% of your net monthly take-home income.',
          'If your net take-home salary is ₹1,00,000 per month, your total cumulative EMIs—including home loan, car loan, and personal loan—should ideally stay under ₹40,000. This leaves ₹60,000 for living expenses, healthcare, lifestyle, and disciplined investments.',
        ],
      },
      {
        heading: 'What Is FOIR (Fixed Obligation to Income Ratio)?',
        content: [
          'When you apply for a loan in India, banks calculate your Fixed Obligation to Income Ratio (FOIR).',
          'FOIR measures the percentage of your monthly income that is already committed to fixed debts and rent. Most banks cap permissible FOIR at 50% to 60% for high-income earners and 40% to 50% for entry-level earners.',
        ],
        callout: {
          title: 'Impact of Existing EMIs',
          text: 'Having outstanding personal loans or high credit card dues directly reduces the maximum home loan amount you qualify for, because banks factor them into your total FOIR.',
          type: 'caution',
        },
      },
      {
        heading: 'The 3x / 4x Annual CTC Salary Rule of Thumb',
        content: [
          'For prudent home loan borrowing, many financial advisors recommend keeping the total home loan principal within 3 to 4 times your gross annual household income.',
          'For a household earning ₹15 Lakhs annually, a loan of ₹45 to ₹60 Lakhs generally ensures that monthly EMIs remain comfortably manageable without squeezing your emergency fund or retirement goals.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens if my DTI ratio exceeds 50%?',
        answer: 'A DTI ratio above 50% puts severe pressure on your monthly budget, limits your ability to invest for the future, and leads lenders to reject new credit applications or charge higher interest rates.',
      },
      {
        question: 'Does a co-applicant increase loan eligibility?',
        answer: 'Yes. Adding an earning co-applicant (such as a spouse) allows the bank to combine both incomes, effectively lowering the household FOIR and qualifying you for a higher loan amount.',
      },
    ],
  },

  'sip-vs-fd-investment-comparison': {
    slug: 'sip-vs-fd-investment-comparison',
    title: 'SIP vs FD: Which Is Better for Your Financial Goals?',
    seoTitle: 'SIP vs FD Comparison — Returns, Risk, Liquidity & Taxation in India',
    description: 'Compare Systematic Investment Plans (SIPs) in mutual funds with Fixed Deposits (FDs). Understand returns, market risks, liquidity, inflation impact, and goal matching.',
    category: 'Investments',
    readTime: '6 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'SIP Calculator',
      href: '/calculators/finance/sip-calculator',
      cta: 'Explore SIP Growth Projections',
    },
    relatedCalculators: [
      { name: 'Fixed Deposit (FD) Calculator', href: '/calculators/finance/fd-calculator' },
      { name: 'Recurring Deposit (RD) Calculator', href: '/calculators/finance/rd-calculator' },
      { name: 'Financial Health Score', href: '/financial-health-score' },
    ],
    sections: [
      {
        heading: 'Two Different Tools for Two Different Jobs',
        content: [
          'Fixed Deposits (FDs) and Systematic Investment Plans (SIPs) in mutual funds are not direct competitors; they serve entirely different purposes in a well-constructed Indian financial portfolio.',
          'An FD provides capital preservation and guaranteed returns. A mutual fund SIP is a disciplined vehicle for equity or hybrid wealth generation designed to beat inflation over multi-year horizons.',
        ],
      },
      {
        heading: 'Inflation and Real Returns',
        content: [
          'Nominal interest on a Fixed Deposit does not reflect actual purchasing power. When headline inflation is 5% to 6%, an FD offering 7% yields a real post-inflation return of only 1% to 2% (before taxes).',
          'Equity mutual funds experience market fluctuations in the short term, but historically offer the potential for higher inflation-beating growth over 7–10 year periods due to corporate earnings growth.',
        ],
        callout: {
          title: 'Matching Strategy to Time Horizon',
          text: 'Short-term goals (under 3 years) such as an emergency fund or upcoming wedding require capital safety — choose FDs or RDs. Long-term goals (7+ years) like retirement or higher education benefit from equity SIP compounding.',
          type: 'tip',
        },
      },
      {
        heading: 'Rupee Cost Averaging in SIPs',
        content: [
          'One of the greatest mathematical strengths of a monthly SIP is rupee cost averaging. When the stock market dips, your fixed monthly allocation buys more mutual fund units. When the market rises, you buy fewer units. Over time, this smooths out market volatility without requiring you to time entry and exit points.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are SIP returns guaranteed like Fixed Deposits?',
        answer: 'No. Mutual fund investments are subject to market risks and returns fluctuate based on portfolio asset performance. FDs offer fixed, guaranteed interest rates agreed upon at deposit inception.',
      },
      {
        question: 'Can I withdraw money from an FD or SIP at any time?',
        answer: 'Most open-ended mutual fund SIPs can be paused, stopped, or redeemed anytime (subject to exit loads or capital gains taxes). FDs can be broken prematurely, usually with a 0.5%–1% interest penalty.',
      },
    ],
  },

  'how-much-emergency-fund-should-you-have': {
    slug: 'how-much-emergency-fund-should-you-have',
    title: 'Emergency Fund Sizing in India: The 3 to 6 Months Rule',
    seoTitle: 'Emergency Fund Guide — How Much Savings Do You Need in India?',
    description: 'Determine the exact size of your emergency fund. Learn how to calculate monthly baseline survival expenses and where to park liquid reserves safely.',
    category: 'Personal Finance',
    readTime: '5 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'Financial Health Score',
      href: '/financial-health-score',
      cta: 'Check Your Emergency Buffer',
    },
    relatedCalculators: [
      { name: 'Fixed Deposit (FD) Calculator', href: '/calculators/finance/fd-calculator' },
      { name: 'Recurring Deposit (RD) Calculator', href: '/calculators/finance/rd-calculator' },
      { name: 'In-Hand Salary Calculator', href: '/calculators/salary/in-hand-salary' },
    ],
    sections: [
      {
        heading: 'Why an Emergency Fund Comes Before Any Investment',
        content: [
          'An emergency fund is your financial shock absorber. Without dedicated liquid savings, unexpected events like medical emergencies, temporary job loss, or sudden home repairs force people to break long-term investments at market lows or take high-interest personal loans.',
          'Your emergency fund protects your investments so they can compound uninterrupted.',
        ],
      },
      {
        heading: 'Calculating Your Baseline Monthly Survival Expense',
        content: [
          'Your emergency fund should not be based on your total salary, but on your essential monthly outflows:',
          '• Rent / Home maintenance',
          '• Fixed loan EMIs (home, auto, personal)',
          '• Essential groceries, utilities, and medicines',
          '• Insurance premiums (health, term life)',
          '• Children school/daycare essentials',
          'Discretionary expenses like dining out, entertainment, and vacation savings are excluded from baseline calculations.',
        ],
        callout: {
          title: 'Target Sizing Rules',
          text: 'Dual-income salaried families with stable jobs: 3 to 4 months of essential expenses. Single-income families or freelancers/entrepreneurs: 6 to 9 months of essential expenses.',
          type: 'info',
        },
      },
      {
        heading: 'Where Should You Keep Your Emergency Fund?',
        content: [
          'The primary goal of an emergency fund is liquidity and capital preservation, NOT high returns. Suitable parking spots include:',
          '1. High-yield savings bank accounts (instant access).',
          '2. Sweep-in Fixed Deposits (instant liquidity with higher interest).',
          '3. Liquid mutual funds or overnight funds from established AMCs.',
          'Never lock emergency reserves in real estate, equity shares, or lock-in instruments.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should I invest my emergency fund in the stock market?',
        answer: 'No. The stock market can experience sharp drawdowns precisely during broader economic downturns when you are most likely to need emergency cash. Emergency funds must prioritize safety and immediate liquidity.',
      },
      {
        question: 'How often should I review my emergency fund?',
        answer: 'Review your emergency fund at least once a year or whenever your essential expenses increase, such as moving to a higher rent apartment, taking a new EMI, or expanding your family.',
      },
    ],
  },

  'understanding-income-tax': {
    slug: 'understanding-income-tax',
    title: 'Understanding Indian Income Tax: New vs Old Tax Regime Guide',
    seoTitle: 'Understanding Indian Income Tax — New vs Old Regime Differences',
    description: 'Learn how Indian income tax calculations work. Understand taxable income, gross total deductions, standard deduction, and Section 87A rebate mechanics.',
    category: 'Tax',
    readTime: '7 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'Income Tax Calculator',
      href: '/calculators/tax/income-tax-calculator',
      cta: 'Compare Old vs New Tax Regime',
    },
    relatedCalculators: [
      { name: 'In-Hand Salary Calculator', href: '/calculators/salary/in-hand-salary' },
      { name: 'GST Calculator', href: '/calculators/tax/gst-calculator' },
      { name: 'Financial Health Score', href: '/financial-health-score' },
    ],
    sections: [
      {
        heading: 'The Dual Tax Regime System in India',
        content: [
          'Individual taxpayers in India can choose between two distinct tax systems when filing their Income Tax Return (ITR): the New Tax Regime (the default regime) and the Old Tax Regime.',
          'The New Regime features simplified, lower tax slab rates across income brackets, but disallows most exemptions and deductions. The Old Regime retains higher slab rates, but permits significant deductions such as Section 80C (EPF, PPF, ELSS), Section 80D (health insurance), HRA (House Rent Allowance), and home loan interest under Section 24(b).',
        ],
      },
      {
        heading: 'How Taxable Income Is Derived',
        content: [
          'Income tax is calculated not on your gross salary or CTC, but on your Net Taxable Income:',
          'Gross Total Income − Applicable Exemptions − Standard Deduction − Chapter VI-A Deductions = Net Taxable Income.',
          'Under the verified New Regime rules implemented in IndiaWise:',
          '• Standard Deduction of ₹75,000 is available to all salaried employees.',
          '• Tax rebate under Section 87A provides full tax relief up to the net taxable limit of ₹7,00,000 (meaning net taxable income up to ₹7.75 Lakhs for salaried individuals results in zero net tax payable).',
        ],
        callout: {
          title: 'The Breakeven Deduction Benchmark',
          text: 'For most salaried professionals earning above ₹15 Lakhs, the Old Regime only becomes beneficial if your total eligible deductions (HRA + 80C + 80D + home loan interest) exceed ₹3.75 to ₹4 Lakhs.',
          type: 'info',
        },
      },
      {
        heading: 'Health and Education Cess',
        content: [
          'A statutory Health and Education Cess of 4% is levied on the total income tax amount calculated before final payment. Surcharge applies additionally only to high-net-worth individuals earning above ₹50 Lakhs annually.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I switch between the New and Old Tax Regime every year?',
        answer: 'Salaried individuals with no business or professional income can switch between the New and Old Regime each financial year when filing their ITR. Individuals with business/professional income can only opt out of the New Regime once.',
      },
      {
        question: 'What is Section 87A rebate?',
        answer: 'Section 87A provides a tax rebate to individual residents whose taxable income does not exceed statutory thresholds, effectively reducing their net tax liability to zero.',
      },
    ],
  },

  'ctc-vs-in-hand-salary-explained': {
    slug: 'ctc-vs-in-hand-salary-explained',
    title: 'CTC vs In-Hand Salary: Why Your Take-Home Is Lower Than Your Offer',
    seoTitle: 'CTC vs In-Hand Salary Explained — Monthly Take-Home Pay Breakdown',
    description: 'Understand the difference between Cost to Company (CTC), Gross Salary, and Net In-Hand Take-Home Pay in India. Learn about PF, Gratuity, HRA, and TDS deductions.',
    category: 'Salary',
    readTime: '6 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'In-Hand Salary Calculator',
      href: '/calculators/salary/in-hand-salary',
      cta: 'Calculate Your In-Hand Salary',
    },
    relatedCalculators: [
      { name: 'Income Tax Calculator', href: '/calculators/tax/income-tax-calculator' },
      { name: 'Home Loan EMI Calculator', href: '/calculators/finance/home-loan-emi' },
      { name: 'Financial Health Score', href: '/financial-health-score' },
    ],
    sections: [
      {
        heading: 'Cost to Company (CTC) vs In-Hand Pay',
        content: [
          'Your Cost to Company (CTC) represents the total annual expense your employer incurs to employ you. It includes not only the money transferred into your bank account, but also employer contributions to retirement funds, insurance, statutory benefits, and variable bonuses.',
          'Your Net In-Hand Salary is the actual disposable income deposited into your bank account every month after all mandatory and voluntary deductions.',
        ],
      },
      {
        heading: 'Key Components in an Indian Salary Slip',
        content: [
          'An Indian salary structure typically includes:',
          '1. Basic Salary: The core taxable foundation (usually 40% to 50% of CTC).',
          '2. House Rent Allowance (HRA): Provided to cover rental accommodation costs.',
          '3. Special Allowance: A balancing figure to absorb the remaining CTC allocation.',
          '4. Employee Provident Fund (EPF): 12% of Basic salary contributed by the employee (and matched by employer).',
          '5. Professional Tax (PT): A state-level tax capped at ₹200–₹208/month in most states.',
          '6. Tax Deducted at Source (TDS): Monthly income tax deducted by the employer based on your projected annual tax.',
        ],
        callout: {
          title: 'Employer PF & Gratuity in CTC',
          text: 'Many offer letters include the employer 12% PF contribution and 4.81% statutory gratuity inside the headline CTC number, reducing the monthly gross payroll figure.',
          type: 'caution',
        },
      },
    ],
    faqs: [
      {
        question: 'Why is EPF deducted from both employer and employee?',
        answer: 'The Employees Provident Fund Act mandates a 12% deduction from the employee basic pay, matched by a 12% contribution from the employer (split between EPF and EPS retirement pension).',
      },
      {
        question: 'Can I choose to not deduct PF to increase my take-home pay?',
        answer: 'EPF is mandatory for employees whose basic salary at joining is up to ₹15,000 per month. For higher basic salaries, opting out is only possible if you have never been an existing EPF member.',
      },
    ],
  },

  'debt-to-income-ratio-explained': {
    slug: 'debt-to-income-ratio-explained',
    title: 'Debt-to-Income (DTI) Ratio: What It Is & Why It Matters',
    seoTitle: 'Debt-to-Income (DTI) Ratio Explained — Safe Debt Limits for Indians',
    description: 'Learn how your Debt-to-Income (DTI) ratio affects loan approvals, credit scores, and long-term financial security. Calculate your debt burden percentage.',
    category: 'Personal Finance',
    readTime: '5 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'Financial Health Score',
      href: '/financial-health-score',
      cta: 'Check Your Debt Burden Pillar',
    },
    relatedCalculators: [
      { name: 'Home Loan EMI Calculator', href: '/calculators/finance/home-loan-emi' },
      { name: 'Personal Loan EMI Calculator', href: '/calculators/finance/personal-loan-emi' },
      { name: 'Student Loan Calculator', href: '/calculators/finance/student-loan-calculator' },
    ],
    sections: [
      {
        heading: 'What Is the Debt-to-Income (DTI) Ratio?',
        content: [
          'Your Debt-to-Income (DTI) ratio is the percentage of your gross or net monthly income that goes directly toward servicing debt obligations each month.',
          'Formula: DTI = (Total Monthly EMIs & Debt Payments / Monthly Take-Home Income) × 100',
          'It is one of the most critical metrics used by financial institutions in India and globally to evaluate your credit risk before approving home, auto, or personal loans.',
        ],
      },
      {
        heading: 'Safe DTI Thresholds',
        content: [
          '• Under 20% (Healthy): Excellent financial flexibility. You have strong capacity to save, invest, and handle emergency contingencies.',
          '• 20% to 35% (Manageable): Standard manageable range for homeowners with an active mortgage. Living expenses and investments can proceed comfortably.',
          '• 36% to 50% (Caution): High debt burden. Sudden unexpected expenses or income disruptions can trigger financial distress.',
          '• Over 50% (Critical Danger): Severe debt overload. Lenders will generally decline new credit and debt restructuring or aggressive prepayments are urgent.',
        ],
        callout: {
          title: 'Weight in IndiaWise Financial Health Score',
          text: 'In the IndiaWise Financial Health Score, Debt Burden accounts for up to 50 points of your total 100-point score, reflecting the foundational importance of debt control.',
          type: 'info',
        },
      },
    ],
    faqs: [
      {
        question: 'Does credit card debt count toward DTI?',
        answer: 'Yes. Minimum monthly payments or ongoing credit card EMIs must be included in your monthly debt calculation alongside formal bank loans.',
      },
      {
        question: 'How can I quickly lower my DTI ratio?',
        answer: 'The fastest ways to lower DTI are paying off high-interest short-term debts (credit card balances, personal loans), consolidating loans, or increasing household monthly income.',
      },
    ],
  },

  'how-to-improve-your-financial-health-score': {
    slug: 'how-to-improve-your-financial-health-score',
    title: 'How to Improve Your Financial Health Score: Actionable 5-Step Guide',
    seoTitle: 'How to Improve Your Financial Health Score — 5-Step Actionable Guide',
    description: 'Practical steps to boost your IndiaWise Financial Health Score. Learn how reducing debt, building emergency runway, and increasing SIP investments lifts your score.',
    category: 'Personal Finance',
    readTime: '6 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'Financial Health Score',
      href: '/financial-health-score',
      cta: 'Diagnose Your Score Now',
    },
    relatedCalculators: [
      { name: 'SIP Calculator', href: '/calculators/finance/sip-calculator' },
      { name: 'Home Loan EMI Calculator', href: '/calculators/finance/home-loan-emi' },
      { name: 'Fixed Deposit (FD) Calculator', href: '/calculators/finance/fd-calculator' },
    ],
    sections: [
      {
        heading: 'Understanding the 4 Dimensions of Financial Health',
        content: [
          'The IndiaWise Financial Health Score evaluates your cashflow across four mathematically distinct dimensions:',
          '1. Debt Burden (0–50 points): Evaluates your total monthly EMI obligations relative to your net monthly income.',
          '2. Investment Rate (0–25 points): Measures what percentage of income is channeled into systematic compounding investments.',
          '3. Emergency Buffer (0–15 points): Measures how many months of essential living expenses you hold in liquid cash or deposits.',
          '4. Savings Capacity (0–10 points): Assesses your net discretionary surplus remaining after all fixed commitments.',
        ],
      },
      {
        heading: 'Step 1: Cap Your Total EMIs Under 35%',
        content: [
          'Because Debt Burden accounts for half of the total score, paying down high-interest personal loans and credit cards immediately unlocks significant score improvements. Prioritize prepaying loans with interest rates above 10% first (the avalanche method).',
        ],
      },
      {
        heading: 'Step 2: Build a 3-Month Minimum Emergency Reserve',
        content: [
          'Holding zero or negligible liquid savings caps your Emergency Buffer pillar at zero points and leaves your finances vulnerable. Building up at least 3 months of basic living expenses in high-yield savings or sweep-in FDs instantly secures 10 to 15 pillar points.',
        ],
      },
      {
        heading: 'Step 3: Automate a 15% to 20% Monthly Investment Rate',
        content: [
          'Investing systematically via automated monthly SIPs on your salary day guarantees that wealth accumulation occurs before discretionary lifestyle spending takes place.',
        ],
        callout: {
          title: 'Use the What-If Simulator',
          text: 'Open the What-If panel inside the Financial Health Score to simulate how an extra ₹5,000 in monthly SIPs or saving ₹50,000 in emergency reserves immediately lifts your health category from Fair to Good.',
          type: 'tip',
        },
      },
    ],
    faqs: [
      {
        question: 'Is the Financial Health Score stored in a database?',
        answer: 'No. All calculations are executed 100% client-side in your browser. IndiaWise does not require login, does not create an account, and does not store your salary or debt figures.',
      },
      {
        question: 'What is considered a Good Financial Health Score?',
        answer: 'A score of 70 to 84 is categorized as Good, indicating balanced debt levels, active compounding investments, and an adequate safety cushion. Scores of 85 and above are categorized as Excellent.',
      },
    ],
  },
  'personal-finance-101': {
    slug: 'personal-finance-101',
    title: 'Personal Finance 101: The Complete Guide to Money, Budgeting & Wealth for Indians',
    seoTitle: 'Personal Finance 101: Complete Money & Budgeting Guide | IndiaWise',
    description: 'A masterclass on budgeting, emergency funds, debt elimination, tax saving, and compounding investments built specifically for Indian professionals and families.',
    category: 'Personal Finance',
    readTime: '7 min read',
    publishedAt: '2026-09-01',
    author: 'Ishan Bansal, Founder of IndiaWise',
    primaryCalculator: {
      name: 'Financial Health Score',
      href: '/financial-health-score',
      cta: 'Diagnose Your Financial Health Free',
    },
    relatedCalculators: [
      { name: 'Home Loan EMI Calculator', href: '/calculators/finance/home-loan-emi' },
      { name: 'SIP Calculator', href: '/calculators/finance/sip-calculator' },
      { name: 'In-Hand Salary Calculator', href: '/calculators/salary/in-hand-salary-calculator' },
      { name: 'Income Tax Calculator', href: '/calculators/tax/income-tax-calculator' },
    ],
    sections: [
      {
        heading: 'The 50/30/20 Rule Adapted for India',
        content: [
          'Budgeting is the bedrock of personal financial freedom. In India, where lifestyle inflation and urbanization expenses are high, the classic 50/30/20 framework serves as an excellent starting point.',
          '50% of your net in-hand salary covers Needs (rent, groceries, utilities, school fees, essential EMIs). 30% covers Wants (dining out, travel, subscriptions, shopping). 20% goes strictly towards Savings & Investments (SIPs, PPF, emergency fund reserves).',
        ],
        callout: {
          title: 'Pay Yourself First',
          text: 'Never save whatever remains after spending. Instead, automate your 20% investment on the day your salary hits your bank account, and spend what remains.',
          type: 'tip',
        },
      },
      {
        heading: 'Eliminate High-Interest Debt First',
        content: [
          'Credit card balances (36–42% annual interest) and personal loans (12–20% interest) act as financial parasites. No investment in India reliably yields 40% guaranteed returns. Therefore, paying off toxic debt is mathematically identical to earning a guaranteed, risk-free return of 36–42%.',
          'Keep your total loan commitments (FOIR / Debt-to-Income) strictly below 35% of your in-hand salary to ensure you never fall into a debt trap.',
        ],
      },
      {
        heading: 'Build an Unshakeable Emergency Cushion',
        content: [
          'An emergency fund protects you from liquidating long-term investments during unexpected life shocks, such as job transitions or medical emergencies.',
          'Maintain 3 to 6 months of non-negotiable household expenses in high-liquidity bank accounts, sweep-in fixed deposits, or liquid mutual funds.',
        ],
      },
      {
        heading: 'Harness the Compounding Engine: Start SIPs Early',
        content: [
          'Compounding does its most miraculous work in the final years of an investment journey. A ₹10,000 monthly SIP compounding at 12% p.a. grows to ₹23 Lakh in 10 years, but explodes to nearly ₹1 Crore in 20 years.',
          'The biggest risk to an Indian investor is not market volatility; it is inflation eroding the purchasing power of cash kept idle in low-yield savings accounts.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the first step in personal finance in India?',
        answer: 'The first step is securing adequate pure term life insurance and health insurance, followed by building a 3-month emergency fund before taking any equity or market risks.',
      },
      {
        question: 'How much of my salary should go towards EMIs?',
        answer: 'Banks generally allow up to 40-50%, but financial planners strongly advise keeping total monthly EMIs under 30-35% of your net in-hand salary.',
      },
      {
        question: 'Which is better for beginners: SIP or FD?',
        answer: 'Bank FDs offer capital certainty and are great for short-term goals (< 3 years). SIPs in equity mutual funds beat inflation over 5+ years and are essential for long-term wealth creation.',
      },
    ],
  },
};

export function getAllGuides(): GuideArticle[] {
  return Object.values(guidesData);
}

export function getGuide(slug: string): GuideArticle | undefined {
  return guidesData[slug];
}
