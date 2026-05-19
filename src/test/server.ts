import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { AccountSummaryDto, OrderDto, PositionDto, RateDto, TradeDto, PlaceOrderRequest } from '../api/types';

const API = 'http://localhost:5140';

interface State {
  orders: OrderDto[];
  positions: PositionDto[];
  account: AccountSummaryDto;
  rates: RateDto[];
  trades: TradeDto[];
}

export const createState = (): State => ({
  orders: [],
  positions: [],
  account: { cash: 10_000, realisedPnL: 0, unrealisedPnL: 0, nav: 10_000 },
  rates: [
    { pair: 'EurUsd', mid: 0.92, timestamp: new Date().toISOString() },
    { pair: 'GbpUsd', mid: 0.79, timestamp: new Date().toISOString() },
    { pair: 'UsdChf', mid: 0.91, timestamp: new Date().toISOString() },
  ],
  trades: [],
});

export function makeServer(state: State) {
  return setupServer(
    http.get(`${API}/api/v1/rates`, () => HttpResponse.json(state.rates)),
    http.get(`${API}/api/v1/rates/:pair/history`, () => HttpResponse.json([])),
    http.get(`${API}/api/v1/orders`, () => HttpResponse.json(state.orders)),
    http.get(`${API}/api/v1/positions`, () => HttpResponse.json(state.positions)),
    http.get(`${API}/api/v1/account`, () => HttpResponse.json(state.account)),
    http.get(`${API}/api/v1/trades`, () => HttpResponse.json(state.trades)),
    http.post(`${API}/api/v1/orders`, async ({ request }) => {
      const body = (await request.json()) as PlaceOrderRequest;
      const order: OrderDto = {
        id: crypto.randomUUID(),
        pair: body.pair,
        side: body.side,
        quantity: body.quantity,
        limitPrice: body.limitPrice,
        status: 'Filled',
        createdAt: new Date().toISOString(),
        filledAt: new Date().toISOString(),
        fillPrice: body.limitPrice,
        cancelledAt: null,
      };
      state.orders = [order, ...state.orders];
      state.positions = [{
        pair: body.pair,
        quantity: body.side === 'Buy' ? body.quantity : -body.quantity,
        averagePrice: body.limitPrice,
        markPrice: body.limitPrice,
        unrealisedPnL: 0,
        realisedPnL: 0,
      }];
      return HttpResponse.json(order, { status: 201 });
    }),
  );
}
