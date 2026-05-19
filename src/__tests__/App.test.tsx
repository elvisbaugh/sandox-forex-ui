import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';
import { createState, makeServer } from '../test/server';

const state = createState();
const server = makeServer(state);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  state.orders.length = 0;
  state.positions.length = 0;
});
afterAll(() => server.close());

function renderApp() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <App />
    </QueryClientProvider>,
  );
}

describe('App integration', () => {
  it('shows account header with starting nav', async () => {
    renderApp();
    expect(await screen.findByText('Cash')).toBeInTheDocument();
    const navValues = await screen.findAllByText('$10,000.00');
    expect(navValues.length).toBeGreaterThanOrEqual(2); // cash + nav
  });

  it('places a buy order and shows it in the order book + positions', async () => {
    const user = userEvent.setup();
    renderApp();

    // Wait for rates to load (EUR/USD header + tile).
    await screen.findAllByText('EUR/USD');

    // Fill in limit price (default qty is 100, default side is Buy, default pair USD/EUR).
    const limitInput = screen.getByLabelText(/limit price/i);
    await user.clear(limitInput);
    await user.type(limitInput, '0.92');

    await user.click(screen.getByRole('button', { name: /place buy/i }));

    // Order shows in book.
    await waitFor(() => {
      const filledBadges = screen.getAllByText(/filled/i);
      expect(filledBadges.length).toBeGreaterThan(0);
    });

    // Position appears (qty 100, USD/EUR row in positions table).
    await waitFor(() => {
      expect(screen.queryByText(/no open positions/i)).not.toBeInTheDocument();
    });
  });
});
