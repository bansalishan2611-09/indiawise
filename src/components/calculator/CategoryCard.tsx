import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  name: string;
  description: string;
  slug: string;
  icon: ReactNode;
  count?: number;
  href?: string;
  badge?: string;
}

export default function CategoryCard({ name, description, slug, icon, count, href, badge }: Props) {
  const targetHref = href || `/categories/${slug}`;
  return (
    <Link href={targetHref} className="group bg-white p-6 rounded-3xl border border-border hover:border-brand transition-all duration-200 shadow-sm hover:shadow-md flex items-start gap-4">
      <div className="w-12 h-12 bg-alt rounded-2xl flex items-center justify-center text-navy group-hover:bg-brand group-hover:text-white transition-colors shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-navy text-lg">{name}</h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-brand border border-blue-200 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          {count !== undefined && <span className="text-xs text-muted">{count} tools</span>}
        </div>
        <p className="text-sm text-muted mt-1 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
