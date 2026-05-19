export type CurrencyPair = 'EurUsd' | 'GbpUsd' | 'UsdChf';
export type OrderSide = 'Buy' | 'Sell';
export type OrderStatus = 'Open' | 'Filled' | 'Cancelled';

export const PAIRS: CurrencyPair[] = ['EurUsd', 'GbpUsd', 'UsdChf'];

export const pairLabel = (p: CurrencyPair) =>
  ({ EurUsd: 'EUR/USD', GbpUsd: 'GBP/USD', UsdChf: 'USD/CHF' }[p]);

export interface RateDto {
  pair: CurrencyPair;
  mid: number;
  timestamp: string;
}

export interface OrderDto {
  id: string;
  pair: CurrencyPair;
  side: OrderSide;
  quantity: number;
  limitPrice: number;
  status: OrderStatus;
  createdAt: string;
  filledAt: string | null;
  fillPrice: number | null;
  cancelledAt: string | null;
}

export interface PositionDto {
  pair: CurrencyPair;
  quantity: number;
  averagePrice: number;
  markPrice: number;
  unrealisedPnL: number;
  realisedPnL: number;
}

export interface AccountSummaryDto {
  cash: number;
  realisedPnL: number;
  unrealisedPnL: number;
  nav: number;
}

export interface TradeDto {
  id: string;
  orderId: string;
  pair: CurrencyPair;
  side: OrderSide;
  quantity: number;
  price: number;
  executedAt: string;
}

export interface PlaceOrderRequest {
  pair: CurrencyPair;
  side: OrderSide;
  quantity: number;
  limitPrice: number;
}

export interface ModifyOrderRequest {
  quantity: number;
  limitPrice: number;
}
