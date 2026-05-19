import { describe, expect, it } from 'vitest';
import { fmtMoney, fmtRate, fmtSigned, pnlClass } from '../lib/format';

describe('format helpers', () => {
  it('formats money with two decimals', () => {
    expect(fmtMoney(1234.5)).toBe('1,234.50');
  });
  it('formats rates with five decimals', () => {
    expect(fmtRate(0.9)).toBe('0.90000');
  });
  it('prefixes positive numbers with +', () => {
    expect(fmtSigned(1.2)).toBe('+1.20');
    expect(fmtSigned(-1.2)).toBe('-1.20');
  });
  it('returns coloured class based on sign', () => {
    expect(pnlClass(1)).toContain('green');
    expect(pnlClass(-1)).toContain('red');
    expect(pnlClass(0)).toContain('zinc');
  });
});
