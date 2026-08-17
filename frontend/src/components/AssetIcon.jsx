import React from 'react';
import { cn } from '@/lib/utils';
import { ASSETS } from '@/lib/mock/services';

// Currency/Asset icon — circular badge with asset color and symbol
/**
 * @param {{ asset: string, size?: number | 'sm' | 'md' | 'lg', className?: string }} props
 */
export default function AssetIcon({ asset, size = 40, className }) {
  const info = ASSETS[asset];
  if (!info) return null;
  const sizes = { sm: 28, md: 40, lg: 56 };
  const s = typeof size === 'number' ? size : sizes[size] || 40;
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white', className)}
      style={{ width: s, height: s, backgroundColor: info.color, fontSize: s * 0.36 }}
    >
      {info.symbol}
    </div>
  );
}
