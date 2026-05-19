import { create } from 'zustand';
import type { CurrencyPair } from '../api/types';

interface UiState {
  selectedPair: CurrencyPair;
  setPair: (p: CurrencyPair) => void;
}

export const useUi = create<UiState>((set) => ({
  selectedPair: 'EurUsd',
  setPair: (p) => set({ selectedPair: p }),
}));
