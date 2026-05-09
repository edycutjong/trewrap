import { describe, it, expect } from 'vitest';
import { aiPersonaGenerator } from './ai-persona';
import type { BehavioralSignals } from './dune-client';

const baseSignals: BehavioralSignals = {
  portfolioValueUsd: 500,
  solBalance: '2.0',
  tokenCount: 5,
  topToken: 'dogwifhat',
  topTokenSymbol: '$WIF',
  txCount: 10,
  recentActivity: 'Today',
};

describe('AIPersonaGenerator', () => {
  it('generates Ghost Wallet for zero txCount', () => {
    const result = aiPersonaGenerator.generate({ ...baseSignals, txCount: 0 });
    expect(result.persona).toBe('Ghost Wallet');
  });

  it('generates Ghost Wallet for zero portfolio value', () => {
    const result = aiPersonaGenerator.generate({ ...baseSignals, portfolioValueUsd: 0 });
    expect(result.persona).toBe('Ghost Wallet');
  });

  it('generates Diamond Hands for high value + low diversity', () => {
    const result = aiPersonaGenerator.generate({ ...baseSignals, portfolioValueUsd: 15000, tokenCount: 3 });
    expect(result.persona).toBe('Diamond Hands');
  });

  it('generates Degen Ape for high activity + high diversity', () => {
    const result = aiPersonaGenerator.generate({ ...baseSignals, txCount: 50, tokenCount: 25 });
    expect(result.persona).toBe('Degen Ape');
  });

  it('generates Paper Hands for many tokens + low value', () => {
    const result = aiPersonaGenerator.generate({ ...baseSignals, tokenCount: 15, portfolioValueUsd: 50 });
    expect(result.persona).toBe('Paper Hands');
  });

  it('generates default Exit Liquidity Human', () => {
    const result = aiPersonaGenerator.generate(baseSignals);
    expect(result.persona).toBe('Exit Liquidity Human');
  });

  it('description includes portfolio value', () => {
    const result = aiPersonaGenerator.generate(baseSignals);
    expect(result.description).toContain('500.00');
  });

  it('Ghost Wallet description mentions zero transactions', () => {
    const result = aiPersonaGenerator.generate({ ...baseSignals, txCount: 0 });
    expect(result.description).toContain('Zero transactions');
  });

  it('Ghost Wallet description mentions portfolio value when txCount > 0 but value is 0', () => {
    const result = aiPersonaGenerator.generate({ ...baseSignals, portfolioValueUsd: 0, txCount: 5 });
    expect(result.description).toContain('$0.00');
  });
});
