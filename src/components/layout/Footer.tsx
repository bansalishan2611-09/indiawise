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
            <div className="pt-2">
              <a href={`mailto:${siteConfig.email}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                {siteConfig.email}
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Calculators</h4>
            <ul className="space-y-2 text-sm text-gray-400">
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
