import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { OrderDto } from '../api/types';
import { pairLabel } from '../api/types';
import { fmtRate } from '../lib/format';

export function OrderBookTable() {
  const { data } = useQuery({ queryKey: ['orders'], queryFn: api.getOrders });
  return (
    <div className="rounded-lg border border-zinc-700 bg-bnp-panel overflow-hidden">
      <div className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-700">
        Orders
      </div>
      <div className="max-h-80 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-wider text-zinc-400 sticky top-0 bg-bnp-panel">
            <tr>
              <Th>Pair</Th>
              <Th>Side</Th>
              <Th align="right">Qty</Th>
              <Th align="right">Limit</Th>
              <Th align="right">Fill</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
            {data && data.length === 0 && (
              <tr><td colSpan={7} className="text-center text-zinc-500 py-6">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: OrderDto }) {
  const qc = useQueryClient();
  const cancel = useMutation({
    mutationFn: () => api.cancelOrder(order.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
  return (
    <tr className="border-t border-zinc-800">
      <Td>{pairLabel(order.pair)}</Td>
      <Td><span className={order.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>{order.side}</span></Td>
      <Td align="right" className="num">{order.quantity}</Td>
      <Td align="right" className="num">{fmtRate(order.limitPrice)}</Td>
      <Td align="right" className="num text-zinc-400">{order.fillPrice != null ? fmtRate(order.fillPrice) : '—'}</Td>
      <Td>
        <StatusBadge status={order.status} />
      </Td>
      <Td align="right">
        {order.status === 'Open' && (
          <button
            type="button"
            onClick={() => cancel.mutate()}
            disabled={cancel.isPending}
            className="text-xs text-zinc-400 hover:text-red-400 underline-offset-2 hover:underline"
            aria-label={`cancel order ${order.id}`}
          >
            Cancel
          </button>
        )}
      </Td>
    </tr>
  );
}

function StatusBadge({ status }: { status: OrderDto['status'] }) {
  const tone =
    status === 'Open' ? 'bg-amber-500/20 text-amber-300' :
    status === 'Filled' ? 'bg-green-500/20 text-green-300' :
    'bg-zinc-500/20 text-zinc-300';
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${tone}`}>{status}</span>;
}

function Th({ children, align = 'left' }: { children?: React.ReactNode; align?: 'left' | 'right' }) {
  return <th className={`px-4 py-2 text-${align}`}>{children}</th>;
}
function Td({ children, align = 'left', className = '' }: { children?: React.ReactNode; align?: 'left' | 'right'; className?: string }) {
  return <td className={`px-4 py-2 text-${align} ${className}`}>{children}</td>;
}
