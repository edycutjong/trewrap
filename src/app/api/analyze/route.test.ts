import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { duneClient } from '@/lib/dune-client';
import { aiPersonaGenerator } from '@/lib/ai-persona';
import type { BehavioralSignals } from '@/lib/dune-client';

vi.mock('@/lib/dune-client', () => ({
  duneClient: {
    fetchBehavioralSignals: vi.fn()
  }
}));

vi.mock('@/lib/ai-persona', () => ({
  aiPersonaGenerator: {
    generate: vi.fn()
  }
}));

describe('Analyze API Route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 400 if wallet address is missing', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({})
    });
    
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing wallet address');
  });

  it('returns persona data successfully', async () => {
    const mockSignals: BehavioralSignals = {
      portfolioValueUsd: 847.32,
      solBalance: '2.41',
      tokenCount: 14,
      topToken: 'dogwifhat',
      topTokenSymbol: '$WIF',
      txCount: 312,
      recentActivity: 'Today',
    };
    vi.mocked(duneClient.fetchBehavioralSignals).mockResolvedValue(mockSignals);
    vi.mocked(aiPersonaGenerator.generate).mockReturnValue({
      persona: 'Exit Liquidity Human',
      description: 'You are exit liquidity.'
    });

    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ walletAddress: 'wallet123' })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.persona).toBe('Exit Liquidity Human');
    expect(data.description).toBe('You are exit liquidity.');
    expect(data.stats).toEqual(mockSignals);
  });

  it('returns 500 on internal error', async () => {
    vi.mocked(duneClient.fetchBehavioralSignals).mockRejectedValue(new Error('Internal'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ walletAddress: 'wallet123' })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal Server Error');
    
    consoleSpy.mockRestore();
  });
});
