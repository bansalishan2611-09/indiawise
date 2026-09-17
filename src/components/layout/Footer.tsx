import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navy text-white mt-12 py-12 print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center p-1.5 shadow-sm">
                <img src="/images/favicon.png" alt="IndiaWise Icon" className="w-full h-full object-contain" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">IndiaWise</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs mt-2">
              Calculate Smarter. Understand Better.
            </p>
            <div className="pt-2 space-y-2">
              <div>
                <a href={`mailto:${siteConfig.email}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {siteConfig.email}
                </a>
              </div>
              {siteConfig.youtube && (
                <div className="pt-1">
                  <a 
                    href={siteConfig.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current text-red-500" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube (@OfficialIndiaWise)</span>
                  </a>
                </div>
              )}
              {siteConfig.quora && (
                <div className="pt-0.5">
                  <a 
                    href={siteConfig.quora} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current text-[#B92B27]" viewBox="0 0 24 24">
                      <path d="M12.784 0c-6.85 0-12.404 5.554-12.404 12.404 0 6.85 5.554 12.404 12.404 12.404 2.508 0 4.836-.745 6.784-2.022l1.97 1.97c.414.414 1.086.414 1.5 0 .414-.414.414-1.086 0-1.5l-1.898-1.898c1.62-1.92 2.598-4.398 2.598-7.054 0-6.85-5.554-12.404-12.404-12.404zm0 20.985c-4.73 0-8.581-3.851-8.581-8.581s3.851-8.581 8.581-8.581 8.581 3.851 8.581 8.581c0 2.05-.722 3.935-1.93 5.424l-2.062-2.062c-.414-.414-1.086-.414-1.5 0-.414.414-.414 1.086 0 1.5l2.09 2.09c-1.46 1.04-3.23 1.63-5.18 1.63z" />
                    </svg>
                    <span>Quora (@IndiaWise)</span>
                  </a>
                </div>
              )}
              {siteConfig.reddit && (
                <div className="pt-0.5">
                  <a 
                    href={siteConfig.reddit} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current text-[#FF4500]" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25 0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm-5.465 3.99a.377.377 0 0 0-.063.528.375.375 0 0 0 .527.063c.8-.57 1.742-.87 2.75-.87s1.95.3 2.75.87a.377.377 0 0 0 .528-.063.375.375 0 0 0-.063-.528c-.917-.655-2.023-1.002-3.215-1.002s-2.298.347-3.214 1.002z"/>
                    </svg>
                    <span>Reddit (u/IndiaWise)</span>
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Calculators</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/financial-health-score" className="text-blue-300 font-medium hover:text-white transition-colors">Financial Health</Link></li>
              <li><Link href="/categories/finance" className="hover:text-white transition-colors">Finance</Link></li>
              <li><Link href="/categories/salary" className="hover:text-white transition-colors">Salary</Link></li>
              <li><Link href="/categories/tax" className="hover:text-white transition-colors">Tax</Link></li>
              <li><Link href="/categories/education" className="hover:text-white transition-colors">Education</Link></li>
              <li><Link href="/categories/business" className="hover:text-white transition-colors">Business</Link></li>
              <li><Link href="/categories/everyday" className="hover:text-white transition-colors">Everyday</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/financial-health-score" className="text-blue-300 font-medium hover:text-white transition-colors">Financial Health Score</Link></li>
              <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
            <h4 className="font-semibold mt-6 mb-4 text-gray-200">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/founder" className="hover:text-white transition-colors">Founder</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/editorial-policy" className="hover:text-white transition-colors">Editorial Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/ai-disclaimer" className="hover:text-white transition-colors">AI Disclaimer</Link></li>
              <li><Link href="/advertising-disclosure" className="hover:text-white transition-colors">Advertising Disclosure</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400 text-center">
          <p>&copy; {currentYear} IndiaWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
