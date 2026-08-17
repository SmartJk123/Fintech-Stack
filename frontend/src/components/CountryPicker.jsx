import React, { useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNTRIES, flagFromCode, findCountry } from '@/lib/countries';

/**
 * @param {{ value: string, onChange: (value: string) => void, placeholder?: string, className?: string }} props
 */
export default function CountryPicker({ value, onChange, placeholder = 'Select your country', className }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = findCountry(value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q.replace(/\D/g, '')),
    );
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-accent',
            className,
          )}
        >
          {selected ? (
            <>
              <span className="text-2xl leading-none">{flagFromCode(selected.code)}</span>
              <span className="flex-1 font-semibold">{selected.name}</span>
              <span className="text-xs text-muted-foreground">+{selected.dialCode}</span>
            </>
          ) : (
            <span className="flex-1 text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries or code…"
            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No country found.</p>
          ) : (
            filtered.map((c) => {
              const active = value === c.name || value === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.name);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent',
                    active && 'bg-accent',
                  )}
                >
                  <span className="text-xl leading-none">{flagFromCode(c.code)}</span>
                  <span className="flex-1 font-medium">{c.name}</span>
                  <span className="text-xs text-muted-foreground">+{c.dialCode}</span>
                  {active && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
