import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { pairLabel } from '../api/types';
import { fmtRate } from '../lib/format';

export function TradesPanel() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({ queryKey: ['trades'], queryFn: () => api.getTrades(50), enabled: open });
  return (
    <div className="rounded-lg border border-zinc-700 bg-bnp-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-700 flex items-center justify-between"
        aria-expanded={open}
      >
        <span>Recent trades</span>
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-zinc-400 sticky top-0 bg-bnp-panel">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Pair</th>
                <th className="px-4 py-2 text-left">Side</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((t) => (
                <tr key={t.id} className="border-t border-zinc-800">
                  <td className="px-4 py-2 text-zinc-400 text-xs">{new Date(t.executedAt).toLocaleTimeString()}</td>
                  <td className="px-4 py-2">{pairLabel(t.pair)}</td>
                  <td className={`px-4 py-2 ${t.side === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{t.side}</td>
                  <td className="px-4 py-2 text-right num">{t.quantity}</td>
                  <td className="px-4 py-2 text-right num">{fmtRate(t.price)}</td>
                </tr>
              ))}
              {data && data.length === 0 && (
                <tr><td colSpan={5} className="text-center text-zinc-500 py-6">No trades yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
