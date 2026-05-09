import { describe, it, expect, vi, beforeEach } from 'vitest';
import { simClient } from './dune-client';

global.fetch = vi.fn();

const mockBalancesResponse = {
  wallet_address: 'wallet123',
  balances_count: 3,
  processing_time_ms: 42,
  balances: [
    {
      chain: 'solana',
      address: 'native',
      amount: '2410000000',
      balance: '2.41',
      value_usd: 420.5,
      decimals: 9,
      name: 'Solana',
      symbol: 'SOL',
      price_usd: 174.5,
      liquidity_usd: 500000000,
      program_id: null,
    },
    {
      chain: 'solana',
      address: 'WIF_MINT_ADDRESS',
      amount: '100000000',
      balance: '100',
      value_usd: 340.0,
      decimals: 6,
      name: 'dogwifhat',
      symbol: 'WIF',
      price_usd: 3.4,
      liquidity_usd: 10000000,
      program_id: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    },
    {
      chain: 'solana',
      address: 'BONK_MINT_ADDRESS',
      amount: '99999999999',
      balance: '99999.999999',
      value_usd: 86.82,
      decimals: 5,
      name: 'Bonk',
      symbol: 'BONK',
      price_usd: 0.0000008682,
      liquidity_usd: 5000000,
      program_id: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    },
  ],
};

const mockTransactionsResponse = {
  transactions: [
    {
      address: 'wallet123',
      block_slot: 300000001,
      block_time: 1715200000000000,
      chain: 'solana',
      raw_transaction: {
        blockTime: 1715200000,
        meta: { err: null, fee: 5000, logMessages: [] },
        transaction: { message: { accountKeys: ['wallet123', 'other'] } },
      },
    },
    {
      address: 'wallet123',
      block_slot: 300000000,
      block_time: 1715100000000000,
      chain: 'solana',
      raw_transaction: {
        blockTime: 1715100000,
        meta: { err: null, fee: 5000, logMessages: [] },
        transaction: { message: { accountKeys: ['wallet123'] } },
      },
    },
  ],
};

describe('SimClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns demo fallback if no API key is set', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = '';

    const result = await simClient.fetchBehavioralSignals('wallet123');
    expect(result.portfolioValueUsd).toBe(847.32);
    expect(result.topTokenSymbol).toBe('$WIF');
    expect(result.txCount).toBe(312);

    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('fetches and derives signals from SIM endpoints', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBalancesResponse),
        } as Response)
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTransactionsResponse),
        } as Response)
      );

    const result = await simClient.fetchBehavioralSignals('wallet123');

    // Portfolio = 420.5 + 340.0 + 86.82 = 847.32
    expect(result.portfolioValueUsd).toBeCloseTo(847.32, 1);
    expect(result.solBalance).toBe('2.41');
    expect(result.tokenCount).toBe(2); // WIF + BONK (non-native with value > 0)
    expect(result.topToken).toBe('dogwifhat');
    expect(result.topTokenSymbol).toBe('$WIF');
    expect(result.txCount).toBe(2);
    expect(result.recentActivity).toBeTruthy();

    // Verify correct SIM endpoints were called
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.sim.dune.com/beta/svm/balances/wallet123?limit=50',
      { headers: { 'X-Sim-Api-Key': 'test-sim-key' } }
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.sim.dune.com/beta/svm/transactions/wallet123?limit=50',
      { headers: { 'X-Sim-Api-Key': 'test-sim-key' } }
    );

    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('handles API failure gracefully with fallback', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch).mockImplementation(() => Promise.reject(new Error('Network error')));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await simClient.fetchBehavioralSignals('wallet123');
    expect(result.portfolioValueUsd).toBe(847.32); // Fallback
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('handles balances endpoint HTTP error', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch).mockImplementationOnce(() =>
      Promise.resolve({ ok: false, status: 401 } as Response)
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await simClient.fetchBehavioralSignals('wallet123');
    expect(result.txCount).toBe(312); // Fallback

    consoleSpy.mockRestore();
    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('handles empty balances and transactions', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              wallet_address: 'wallet123',
              balances_count: 0,
              processing_time_ms: 10,
              balances: [],
            }),
        } as Response)
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ transactions: [] }),
        } as Response)
      );

    const result = await simClient.fetchBehavioralSignals('wallet123');
    expect(result.portfolioValueUsd).toBe(0);
    expect(result.solBalance).toBe('0');
    expect(result.tokenCount).toBe(0);
    expect(result.topToken).toBe('None');
    expect(result.topTokenSymbol).toBe('N/A');
    expect(result.txCount).toBe(0);
    expect(result.recentActivity).toBe('No activity');

    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('fetchBalances calls the correct SIM endpoint', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBalancesResponse),
      } as Response)
    );

    const result = await simClient.fetchBalances('testaddr');
    expect(result.balances_count).toBe(3);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.sim.dune.com/beta/svm/balances/testaddr?limit=50',
      { headers: { 'X-Sim-Api-Key': 'test-sim-key' } }
    );

    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('fetchTransactions calls the correct SIM endpoint', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTransactionsResponse),
      } as Response)
    );

    const result = await simClient.fetchTransactions('testaddr');
    expect(result.transactions.length).toBe(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.sim.dune.com/beta/svm/transactions/testaddr?limit=50',
      { headers: { 'X-Sim-Api-Key': 'test-sim-key' } }
    );

    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('fetchBalances throws on HTTP error', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch).mockImplementationOnce(() =>
      Promise.resolve({ ok: false, status: 500 } as Response)
    );

    await expect(simClient.fetchBalances('testaddr')).rejects.toThrow('SIM Balances API error: 500');

    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('fetchTransactions throws on HTTP error', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch).mockImplementationOnce(() =>
      Promise.resolve({ ok: false, status: 429 } as Response)
    );

    await expect(simClient.fetchTransactions('testaddr')).rejects.toThrow('SIM Transactions API error: 429');

    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });

  it('handles balances with null value_usd', async () => {
    const originalApiKey = (simClient as unknown as { apiKey: string }).apiKey;
    (simClient as unknown as { apiKey: string }).apiKey = 'test-sim-key';

    vi.mocked(global.fetch)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              wallet_address: 'wallet123',
              balances_count: 2,
              processing_time_ms: 10,
              balances: [
                {
                  chain: 'solana',
                  address: 'native',
                  amount: '1000000000',
                  balance: '1.0',
                  value_usd: null,
                  decimals: 9,
                  name: 'Solana',
                  symbol: 'SOL',
                  price_usd: 174,
                  liquidity_usd: 500000000,
                  program_id: null,
                },
                {
                  chain: 'solana',
                  address: 'TOKEN_MINT',
                  amount: '100',
                  balance: '100',
                  value_usd: null,
                  decimals: 6,
                  name: 'TestToken',
                  symbol: 'TEST',
                  price_usd: 0,
                  liquidity_usd: 0,
                  program_id: null,
                },
                {
                  chain: 'solana',
                  address: 'TOKEN_MINT_2',
                  amount: '50',
                  balance: '50',
                  value_usd: 10,
                  decimals: 6,
                  name: 'RealToken',
                  symbol: 'REAL',
                  price_usd: 0.2,
                  liquidity_usd: 1000,
                  program_id: null,
                },
              ],
            }),
        } as Response)
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ transactions: [] }),
        } as Response)
      );

    const result = await simClient.fetchBehavioralSignals('wallet123');
    expect(result.portfolioValueUsd).toBe(10); // only RealToken has value
    expect(result.tokenCount).toBe(1); // only RealToken has value_usd > 0
    expect(result.topToken).toBe('RealToken');

    (simClient as unknown as { apiKey: string }).apiKey = originalApiKey;
  });
});
