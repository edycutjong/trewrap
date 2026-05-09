import { describe, it, expect, vi, beforeEach } from 'vitest';
import { duneService } from './dune';

global.fetch = vi.fn();

describe('DunePersonaService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns demo fallback if query fails or no API key is used and API call fails', async () => {
    // The service might initialize with empty API key depending on env
    const result = await duneService.generatePersona('wallet123');
    expect(result.persona).toBe('Exit Liquidity Human');
    expect(result.signals.tradingVolume).toBe('Low');
  });

  it('returns persona on successful API call', async () => {
    (duneService as unknown as { apiKey: string }).apiKey = 'test-key';
    (duneService as unknown as { initialized: boolean }).initialized = true;

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ execution_id: 'exec123' })
    } as Response));

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        result: {
          rows: [{
            persona: 'Chad',
            tradingVolume: 'High',
            avgHoldingTime: '10 Days',
            favoriteDex: 'Meteora'
          }]
        }
      })
    } as Response));

    const result = await duneService.generatePersona('wallet123');
    expect(result.persona).toBe('Chad');
    expect(result.signals.favoriteDex).toBe('Meteora');
  });

  it('handles query failure due to network error', async () => {
    (duneService as unknown as { apiKey: string }).apiKey = 'test-key';
    (duneService as unknown as { initialized: boolean }).initialized = true;

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const result = await duneService.generatePersona('wallet123');
    
    // Should fallback to demo data
    expect(result.persona).toBe('Exit Liquidity Human');
    expect(consoleSpy).toHaveBeenCalledWith('[Dune API] Query failed:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('handles execution endpoint failure', async () => {
    (duneService as unknown as { apiKey: string }).apiKey = 'test-key';
    (duneService as unknown as { initialized: boolean }).initialized = true;

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({})
    } as Response));

    const result = await duneService.generatePersona('wallet123');
    expect(result.persona).toBe('Exit Liquidity Human');
  });

  it('handles results endpoint failure', async () => {
    (duneService as unknown as { apiKey: string }).apiKey = 'test-key';
    (duneService as unknown as { initialized: boolean }).initialized = true;

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ execution_id: 'exec123' })
    } as Response));

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({})
    } as Response));

    const result = await duneService.generatePersona('wallet123');
    expect(result.persona).toBe('Exit Liquidity Human');
  });

  it('handles empty results data', async () => {
    (duneService as unknown as { apiKey: string }).apiKey = 'test-key';
    (duneService as unknown as { initialized: boolean }).initialized = true;

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ execution_id: 'exec123' })
    } as Response));

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ result: { rows: [] } })
    } as Response));

    const result = await duneService.generatePersona('wallet123');
    expect(result.persona).toBe('Exit Liquidity Human');
  });

  it('uses default values when row fields are missing', async () => {
    (duneService as unknown as { apiKey: string }).apiKey = 'test-key';
    (duneService as unknown as { initialized: boolean }).initialized = true;

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ execution_id: 'exec123' })
    } as Response));

    vi.mocked(global.fetch).mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        result: {
          rows: [{}] // Empty row
        }
      })
    } as Response));

    const result = await duneService.generatePersona('wallet123');
    expect(result.persona).toBe('Unknown Persona');
    expect(result.signals.tradingVolume).toBe('Unknown');
    expect(result.signals.avgHoldingTime).toBe('Unknown');
    expect(result.signals.favoriteDex).toBe('Unknown');
  });
});
