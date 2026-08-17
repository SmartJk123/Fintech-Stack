import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Copy, Check, AlertCircle, Share2 } from 'lucide-react';
import AssetIcon from '@/components/AssetIcon';
import DemoBadge from '@/components/DemoBadge';
import { qrCodeUrl } from '@/lib/utils';
import { ASSETS, WALLET_ACCOUNTS, DEMO_ADDRESSES } from '@/lib/mock/data';

export default function Receive() {
  const [params] = useSearchParams();
  const [asset, setAsset] = useState(params.get('asset') || 'BTC');
  const [copied, setCopied] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Load accounts to know which assets user holds
    setAccounts(WALLET_ACCOUNTS);
  }, []);

  const assetInfo = ASSETS[asset];
  const address = DEMO_ADDRESSES[asset] || 'demo-address';
  const isFiat = assetInfo?.type === 'fiat';

  const handleCopy = () => {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Receive</h1>
          <p className="text-sm text-muted-foreground">Get paid into your EliteWallet account</p>
        </div>
        <DemoBadge />
      </div>

      {/* Asset selector */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(ASSETS).map(code => (
          <button
            key={code}
            onClick={() => setAsset(code)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all',
              asset === code ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/40'
            )}
          >
            <AssetIcon asset={code} size={24} />
            {code}
          </button>
        ))}
      </div>

      {isFiat ? (
        // Fiat receive — show account details for deposit
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <AssetIcon asset={asset} size={48} />
            <div>
              <h2 className="text-lg font-bold">Receive {assetInfo.name}</h2>
              <p className="text-sm text-muted-foreground">via {assetInfo.network}</p>
            </div>
          </div>

          {asset === 'KES' ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium">M-Pesa Paybill</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Paybill No.</span><span className="font-bold">247247</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Account No.</span><span className="font-bold">EW-AMARA-001</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Account Name</span><span className="font-medium">Amara Mwangi</span></div>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-500/30 dark:bg-amber-500/10">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-amber-700 dark:text-amber-400">Use your Account Number as reference. Funds typically arrive instantly. This is a demo paybill.</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="font-medium">Equity Bank Kenya</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Account Name</span><span className="font-medium">EliteWallet Ltd — Amara Mwangi</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Account No.</span><span className="font-bold">0112345678901</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">SWIFT</span><span className="font-medium">EQBLKENA</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Crypto receive — show address + QR
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <AssetIcon asset={asset} size={48} />
            <div>
              <h2 className="text-lg font-bold">Receive {assetInfo.name}</h2>
              <p className="text-sm text-muted-foreground">{assetInfo.network} network</p>
            </div>
          </div>

          {/* QR code */}
          <div className="mt-6 flex flex-col items-center">
            <div className="rounded-2xl border-2 border-border bg-white p-4">
              <img src={qrCodeUrl(address)} alt="Deposit QR code" width="200" height="200" className="rounded-lg" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Scan QR or copy address below</p>
          </div>

          {/* Address */}
          <div className="mt-4">
            <label className="text-sm font-medium text-muted-foreground">Your {asset} address</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-3">
              <code className="flex-1 truncate text-sm font-mono">{address}</code>
              <button onClick={handleCopy} className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Network warning */}
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-500/30 dark:bg-amber-500/10">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-amber-700 dark:text-amber-400">
              <strong>Important:</strong> Only send {asset} using the {assetInfo.network} network. Sending any other asset or using a different network may result in permanent loss of funds.
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={handleCopy} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold hover:bg-muted">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}