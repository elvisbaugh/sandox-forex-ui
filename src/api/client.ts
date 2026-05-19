import type {
  AccountSummaryDto,
  ModifyOrderRequest,
  OrderDto,
  PlaceOrderRequest,
  PositionDto,
  RateDto,
  TradeDto,
  CurrencyPair,
} from './types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5140').replace(/\/$/, '');

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.detail ?? body?.title ?? JSON.stringify(body);
    } catch {
      detail = await res.text();
    }
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getRates: () => http<RateDto[]>('/api/v1/rates'),
  getRateHistory: (pair: CurrencyPair, n = 60) =>
    http<RateDto[]>(`/api/v1/rates/${pair}/history?n=${n}`),
  getOrders: () => http<OrderDto[]>('/api/v1/orders'),
  placeOrder: (req: PlaceOrderRequest) =>
    http<OrderDto>('/api/v1/orders', { method: 'POST', body: JSON.stringify(req) }),
  cancelOrder: (id: string) => http<OrderDto>(`/api/v1/orders/${id}`, { method: 'DELETE' }),
  modifyOrder: (id: string, req: ModifyOrderRequest) =>
    http<OrderDto>(`/api/v1/orders/${id}`, { method: 'PATCH', body: JSON.stringify(req) }),
  getPositions: () => http<PositionDto[]>('/api/v1/positions'),
  closePosition: (pair: CurrencyPair) =>
    http<OrderDto>(`/api/v1/positions/${pair}/close`, { method: 'POST' }),
  getAccount: () => http<AccountSummaryDto>('/api/v1/account'),
  getTrades: (limit = 50) => http<TradeDto[]>(`/api/v1/trades?limit=${limit}`),
};
