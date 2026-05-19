import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { OrderSide } from '../api/types';
import { useUi } from '../state/store';
import { pairLabel } from '../api/types';

export function OrderTicket() {
  const { selectedPair } = useUi();
  const qc = useQueryClient();
  const [side, setSide] = useState<OrderSide>('Buy');
  const [quantity, setQuantity] = useState('100');
  const [limitPrice, setLimitPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const place = useMutation({
    mutationFn: api.placeOrder,
    onSuccess: () => {
      setError(null);
      setLimitPrice('');
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['positions'] });
      qc.invalidateQueries({ queryKey: ['account'] });
      qc.invalidateQueries({ queryKey: ['trades'] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(quantity);
    const p = Number(limitPrice);
    if (!Number.isFinite(q) || q <= 0) return setError('Quantity must be positive');
    if (!Number.isFinite(p) || p <= 0) return setError('Limit price must be positive');
    place.mutate({ pair: selectedPair, side, quantity: q, limitPrice: p });
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-zinc-700 bg-bnp-panel p-4 space-y-3"
      aria-label="order ticket"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">New order</h2>
        <span className="text-xs text-zinc-400">{pairLabel(selectedPair)}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SideButton current={side} value="Buy" onSelect={setSide} />
        <SideButton current={side} value="Sell" onSelect={setSide} />
      </div>
      <Field label="Quantity">
        <input
          type="number"
          step="any"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="num w-full bg-bnp-dark border border-zinc-700 rounded px-2 py-1.5 focus:outline-none focus:border-bnp-green"
        />
      </Field>
      <Field label="Limit price">
        <input
          type="number"
          step="any"
          min="0"
          value={limitPrice}
          onChange={(e) => setLimitPrice(e.target.value)}
          placeholder="0.00000"
          className="num w-full bg-bnp-dark border border-zinc-700 rounded px-2 py-1.5 focus:outline-none focus:border-bnp-green"
        />
      </Field>
      <button
        type="submit"
        disabled={place.isPending}
        className="w-full bg-bnp-green hover:brightness-110 disabled:opacity-60 rounded py-2 text-sm font-semibold"
      >
        {place.isPending ? 'Placing…' : `Place ${side}`}
      </button>
      {error && <div className="text-xs text-red-400" role="alert">{error}</div>}
    </form>
  );
}

function SideButton({ current, value, onSelect }: { current: OrderSide; value: OrderSide; onSelect: (s: OrderSide) => void }) {
  const active = current === value;
  const tone = value === 'Buy' ? 'bg-green-600' : 'bg-red-600';
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`py-2 rounded text-sm font-semibold ${active ? tone : 'bg-zinc-700 hover:bg-zinc-600'}`}
      aria-pressed={active}
    >
      {value}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
