import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { CurrencyPair, PositionDto } from '../api/types';
import { pairLabel } from '../api/types';
import { fmtMoney, fmtRate, fmtSigned, pnlClass } from '../lib/format';

export function PositionsTable() {
  const { data } = useQuery({ queryKey: ['positions'], queryFn: api.getPositions });
  return (
    <div className="rounded-lg border border-zinc-700 bg-bnp-panel overflow-hidden">
      <div className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-700">
        Open positions
      </div>
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-wider text-zinc-400">
          <tr>
            <th className="px-4 py-2 text-left">Pair</th>
            <th className="px-4 py-2 text-right">Qty</th>
            <th className="px-4 py-2 text-right">Avg</th>
            <th className="px-4 py-2 text-right">Mark</th>
            <th className="px-4 py-2 text-right">Unrealised</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((p) => <PositionRow key={p.pair} position={p} />)}
          {data && data.length === 0 && (
            <tr><td colSpan={6} className="text-center text-zinc-500 py-6">No open positions</td></tr>
          )}
        </tbody>
      </table>
      {data && data.length > 0 && (
        <div className="px-4 py-2 text-xs text-zinc-400 border-t border-zinc-800 text-right num">
          Total unrealised:{' '}
          <span className={pnlClass(data.reduce((s, p) => s + p.unrealisedPnL, 0))}>
            {fmtSigned(data.reduce((s, p) => s + p.unrealisedPnL, 0), 4)}
          </span>
          {' · Realised: '}
          <span className={pnlClass(data.reduce((s, p) => s + p.realisedPnL, 0))}>
            {fmtMoney(data.reduce((s, p) => s + p.realisedPnL, 0), 4)}
          </span>
        </div>
      )}
    </div>
  );
}

function PositionRow({ position: p }: { position: PositionDto }) {
  const qc = useQueryClient();
  const close = useMutation({
    mutationFn: (pair: CurrencyPair) => api.closePosition(pair),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['positions'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['account'] });
      qc.invalidateQueries({ queryKey: ['trades'] });
    },
  });
  return (
    <tr className="border-t border-zinc-800">
      <td className="px-4 py-2">{pairLabel(p.pair)}</td>
      <td className={`px-4 py-2 text-right num ${p.quantity >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {p.quantity}
      </td>
      <td className="px-4 py-2 text-right num">{fmtRate(p.averagePrice)}</td>
      <td className="px-4 py-2 text-right num">{fmtRate(p.markPrice)}</td>
      <td className={`px-4 py-2 text-right num ${pnlClass(p.unrealisedPnL)}`}>
        {fmtSigned(p.unrealisedPnL, 4)}
      </td>
      <td className="px-4 py-2 text-right">
        <button
          type="button"
          onClick={() => close.mutate(p.pair)}
          disabled={close.isPending}
          className="text-xs px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 disabled:opacity-50"
          aria-label={`close ${pairLabel(p.pair)} position`}
        >
          {close.isPending ? 'Closing…' : 'Close'}
        </button>
      </td>
    </tr>
  );
}
