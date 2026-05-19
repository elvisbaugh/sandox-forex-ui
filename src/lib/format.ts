export const fmtMoney = (n: number, digits = 2) =>
  n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmtRate = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 });

export const fmtSigned = (n: number, digits = 2) => (n >= 0 ? '+' : '') + fmtMoney(n, digits);

export const pnlClass = (n: number) =>
  n > 0 ? 'text-green-400' : n < 0 ? 'text-red-400' : 'text-zinc-400';
