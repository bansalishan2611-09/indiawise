import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  name: string;
  description: string;
  slug: string;
  icon: ReactNode;
  count?: number;
}

export default function CategoryCard({ name, description, slug, icon, count }: Props) {
  return (
    <Link href={`/categories/${slug}`} className="group bg-white p-6 rounded-3xl border border-border hover:border-brand transition-all duration-200 shadow-sm hover:shadow-md flex items-start gap-4">
      <div className="w-12 h-12 bg-alt rounded-2xl flex items-center justify-center text-navy group-hover:bg-brand group-hover:text-white transition-colors shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-navy text-lg">{name}</h3>
          {count !== undefined && <span className="text-xs text-muted">{count} tools</span>}
        </div>
        <p className="text-sm text-muted mt-1 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
