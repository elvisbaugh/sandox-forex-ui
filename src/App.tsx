import { AccountHeader } from './components/AccountHeader';
import { OrderBookTable } from './components/OrderBookTable';
import { OrderTicket } from './components/OrderTicket';
import { PairList } from './components/PairList';
import { PositionsTable } from './components/PositionsTable';
import { TradesPanel } from './components/TradesPanel';

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <AccountHeader />
      <main className="flex-1 grid grid-cols-12 gap-4 p-4">
        <aside className="col-span-12 lg:col-span-3">
          <PairList />
        </aside>
        <section className="col-span-12 lg:col-span-5 space-y-4">
          <OrderTicket />
          <OrderBookTable />
        </section>
        <section className="col-span-12 lg:col-span-4 space-y-4">
          <PositionsTable />
          <TradesPanel />
        </section>
      </main>
      <footer className="px-4 py-2 text-[10px] text-zinc-500 border-t border-zinc-800 text-center">
        Simulated rates · in-memory state · starts USD&nbsp;10,000
      </footer>
    </div>
  );
}
