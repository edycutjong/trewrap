import { describe, it, expect } from 'vitest';
import { aiPersonaGenerator } from './ai-persona';

describe('AIPersonaGenerator', () => {
  it('generates Diamond Hands persona', () => {
    const result = aiPersonaGenerator.generate({ winRate: '60' });
    expect(result.persona).toBe('Diamond Hands');
  });

  it('generates Ape Extraordinaire persona', () => {
    const result = aiPersonaGenerator.generate({ avgHoldingTime: '45 Seconds', favoriteDex: 'Raydium' });
    expect(result.persona).toBe('Ape Extraordinaire');
  });

  it('generates default Exit Liquidity Human persona', () => {
    const result = aiPersonaGenerator.generate({ avgHoldingTime: '2 Days' });
    expect(result.persona).toBe('Exit Liquidity Human');
  });
});
