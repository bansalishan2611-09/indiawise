'use client';
import { useEffect, useRef } from 'react';

interface AdContainerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdContainer({ slot, format = 'auto', className }: AdContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense error:', e);
    }
  }, [clientId]);

  if (!clientId) {
    return (
      <div className={`min-h-[90px] bg-alt rounded-2xl border border-dashed border-border flex items-center justify-center ${className || ''}`}>
        <span className="text-xs text-muted">Ad Space</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={`min-h-[90px] overflow-hidden ${className || ''}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
