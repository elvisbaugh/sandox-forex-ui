import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { fmtMoney, fmtSigned, pnlClass } from '../lib/format';

export function AccountHeader() {
  const { data, isError } = useQuery({ queryKey: ['account'], queryFn: api.getAccount });
  return (
    <header className="flex items-center justify-between bg-bnp-panel border-b border-zinc-700 px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-bnp-green" aria-label="brand mark" />
        <h1 className="text-lg font-semibold tracking-wide">FX Sandbox</h1>
        <span className="text-xs text-zinc-400 hidden sm:inline">simulated · in-memory</span>
      </div>
      <div className="flex items-center gap-8 num">
        <Stat label="Cash" value={data ? `$${fmtMoney(data.cash)}` : '—'} />
        <Stat label="Realised P&L" value={data ? fmtSigned(data.realisedPnL) : '—'} cls={data ? pnlClass(data.realisedPnL) : ''} />
        <Stat label="Unrealised P&L" value={data ? fmtSigned(data.unrealisedPnL) : '—'} cls={data ? pnlClass(data.unrealisedPnL) : ''} />
        <Stat label="NAV" value={data ? `$${fmtMoney(data.nav)}` : '—'} />
        <span
          className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : 'bg-bnp-green'}`}
          aria-label={isError ? 'disconnected' : 'connected'}
          title={isError ? 'disconnected' : 'connected'}
        />
      </div>
    </header>
  );
}

function Stat({ label, value, cls = '' }: { label: string; value: string; cls?: string }) {
  return (
    <div className="text-right">
      <div className="text-[10px] uppercase tracking-wider text-zinc-400">{label}</div>
      <div className={`text-sm font-semibold ${cls}`}>{value}</div>
    </div>
  );
}
