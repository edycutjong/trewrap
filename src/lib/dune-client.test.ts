import { describe, it, expect, vi, beforeEach } from 'vitest';
import { duneClient } from './dune-client';

global.fetch = vi.fn();

describe('DuneClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns demo fallback if no API key is set', async () => {
    // Override API key for test
    const originalApiKey = (duneClient as unknown as { apiKey: string }).apiKey;
    (duneClient as unknown as { apiKey: string }).apiKey = '';
    
    const result = await duneClient.fetchBehavioralSignals('wallet123');
    expect(result.tradingVolume).toBe('High');
    expect(result.favoriteDex).toBe('Raydium');
    
    // Restore
    (duneClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('fetches signals successfully with API key', async () => {
    const originalApiKey = (duneClient as unknown as { apiKey: string }).apiKey;
    (duneClient as unknown as { apiKey: string }).apiKey = 'test-key';
    
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ execution_id: 'exec123' })
    } as Response));

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        result: {
          rows: [{
            tradingVolume: 'Massive',
            avgHoldingTime: '1 Hour',
            favoriteDex: 'Orca',
            winRate: '20%',
            topTradedToken: '$BONK',
            totalPnl: '$1000'
          }]
        }
      })
    } as Response));

    const result = await duneClient.fetchBehavioralSignals('wallet123');
    expect(result.tradingVolume).toBe('Massive');
    expect(result.favoriteDex).toBe('Orca');

    (duneClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('handles query failure', async () => {
    const originalApiKey = (duneClient as unknown as { apiKey: string }).apiKey;
    (duneClient as unknown as { apiKey: string }).apiKey = 'test-key';
    
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const result = await duneClient.fetchBehavioralSignals('wallet123');
    // Should fallback
    expect(result.tradingVolume).toBe('High');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
    (duneClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('handles execution endpoint failure', async () => {
    const originalApiKey = (duneClient as unknown as { apiKey: string }).apiKey;
    (duneClient as unknown as { apiKey: string }).apiKey = 'test-key';
    
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({})
    } as Response));
    
    const result = await duneClient.fetchBehavioralSignals('wallet123');
    expect(result.tradingVolume).toBe('High'); // Fallback
    
    (duneClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('handles results endpoint failure', async () => {
    const originalApiKey = (duneClient as unknown as { apiKey: string }).apiKey;
    (duneClient as unknown as { apiKey: string }).apiKey = 'test-key';
    
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ execution_id: 'exec123' })
    } as Response));

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({})
    } as Response));
    
    const result = await duneClient.fetchBehavioralSignals('wallet123');
    expect(result.tradingVolume).toBe('High'); // Fallback
    
    (duneClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('handles empty results data', async () => {
    const originalApiKey = (duneClient as unknown as { apiKey: string }).apiKey;
    (duneClient as unknown as { apiKey: string }).apiKey = 'test-key';
    
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ execution_id: 'exec123' })
    } as Response));

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ result: { rows: [] } })
    } as Response));
    
    const result = await duneClient.fetchBehavioralSignals('wallet123');
    expect(result.tradingVolume).toBe('High'); // Fallback
    
    (duneClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('uses default values when row fields are missing', async () => {
    const originalApiKey = (duneClient as unknown as { apiKey: string }).apiKey;
    (duneClient as unknown as { apiKey: string }).apiKey = 'test-key';
    
    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ execution_id: 'exec123' })
    } as Response));

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        result: {
          rows: [{}] // Empty row object to test defaults
        }
      })
    } as Response));

    const result = await duneClient.fetchBehavioralSignals('wallet123');
    expect(result.tradingVolume).toBe('Low');
    expect(result.favoriteDex).toBe('Raydium');
    expect(result.avgHoldingTime).toBe('3 Hours');

    (duneClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });
});
