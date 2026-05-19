import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { api } from '../api/client';
import type { CurrencyPair, RateDto } from '../api/types';
import { PAIRS, pairLabel } from '../api/types';
import { useUi } from '../state/store';
import { fmtRate } from '../lib/format';

export function PairList() {
  const { data } = useQuery({ queryKey: ['rates'], queryFn: api.getRates });
  return (
    <div className="space-y-3">
      {PAIRS.map((p) => (
        <PairTile key={p} pair={p} rate={data?.find((r) => r.pair === p)} />
      ))}
    </div>
  );
}

function PairTile({ pair, rate }: { pair: CurrencyPair; rate?: RateDto }) {
  const { selectedPair, setPair } = useUi();
  const selected = selectedPair === pair;
  const { data: history } = useQuery({
    queryKey: ['history', pair],
    queryFn: () => api.getRateHistory(pair, 60),
  });
  return (
    <button
      type="button"
      onClick={() => setPair(pair)}
      className={`w-full text-left rounded-lg border p-3 transition ${
        selected
          ? 'border-bnp-green bg-bnp-green/10'
          : 'border-zinc-700 bg-bnp-panel hover:border-zinc-500'
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-medium">{pairLabel(pair)}</span>
        <span className="num text-lg">{rate ? fmtRate(rate.mid) : '—'}</span>
      </div>
      <div className="h-12 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history ?? []}>
            <YAxis hide domain={['auto', 'auto']} />
            <Line type="monotone" dataKey="mid" stroke="#009639" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </button>
  );
}
