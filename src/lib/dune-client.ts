// Dune SIM API client — uses SVM Balances + Transactions endpoints
// Docs: https://docs.sim.dune.com/svm/overview

export interface SimBalance {
  chain: string;
  address: string;
  amount: string;
  balance: string;
  value_usd: number;
  decimals: number;
  name: string;
  symbol: string;
  price_usd: number;
  liquidity_usd: number;
  program_id: string | null;
}

export interface SimBalancesResponse {
  wallet_address: string;
  balances_count: number;
  processing_time_ms: number;
  balances: SimBalance[];
  next_offset?: string;
}

export interface SimTransaction {
  address: string;
  block_slot: number;
  block_time: number;
  chain: string;
  raw_transaction: {
    blockTime: number;
    meta: {
      err: unknown;
      fee: number;
      logMessages?: string[];
    };
    transaction: {
      message: {
        accountKeys: string[];
      };
    };
  };
}

export interface SimTransactionsResponse {
  transactions: SimTransaction[];
  next_offset?: string;
}

export interface BehavioralSignals {
  portfolioValueUsd: number;
  solBalance: string;
  tokenCount: number;
  topToken: string;
  topTokenSymbol: string;
  txCount: number;
  recentActivity: string;
}

export class SimClient {
  private apiKey: string;
  private baseUrl = "https://api.sim.dune.com";

  constructor() {
    this.apiKey = process.env.SIM_API_KEY || process.env.NEXT_PUBLIC_SIM_API_KEY || "";
  }

  async fetchBalances(address: string): Promise<SimBalancesResponse> {
    const res = await fetch(`${this.baseUrl}/beta/svm/balances/${address}?limit=50`, {
      headers: { "X-Sim-Api-Key": this.apiKey },
    });

    if (!res.ok) {
      throw new Error(`SIM Balances API error: ${res.status}`);
    }

    return res.json();
  }

  async fetchTransactions(address: string): Promise<SimTransactionsResponse> {
    const res = await fetch(`${this.baseUrl}/beta/svm/transactions/${address}?limit=50`, {
      headers: { "X-Sim-Api-Key": this.apiKey },
    });

    if (!res.ok) {
      throw new Error(`SIM Transactions API error: ${res.status}`);
    }

    return res.json();
  }

  async fetchBehavioralSignals(walletAddress: string): Promise<BehavioralSignals> {
    console.log(`[SimClient] Fetching SIM data for ${walletAddress}...`);

    if (this.apiKey) {
      try {
        const [balancesData, txData] = await Promise.all([
          this.fetchBalances(walletAddress),
          this.fetchTransactions(walletAddress),
        ]);

        // Derive portfolio value
        const toUsd = (v: number | null | undefined): number => Number(v) || 0;
        const portfolioValueUsd = balancesData.balances.reduce(
          (sum, b) => sum + toUsd(b.value_usd),
          0
        );

        // Find SOL balance
        const solEntry = balancesData.balances.find((b) => b.address === "native");
        const solBalance = solEntry ? solEntry.balance : "0";

        // Token count (non-native, non-zero)
        const tokenCount = balancesData.balances.filter(
          (b) => b.address !== "native" && toUsd(b.value_usd) > 0
        ).length;

        // Top token by USD value (excluding native SOL)
        const nonNative = balancesData.balances.filter((b) => b.address !== "native");
        const sorted = [...nonNative].sort((a, b) => toUsd(b.value_usd) - toUsd(a.value_usd));
        const topToken = sorted.length > 0 ? sorted[0].name : "None";
        const topTokenSymbol = sorted.length > 0 ? `$${sorted[0].symbol}` : "N/A";

        // Transaction count
        const txCount = txData.transactions.length;

        // Recent activity
        const recentActivity =
          txData.transactions.length > 0
            ? new Date(txData.transactions[0].block_time / 1000).toLocaleDateString()
            : "No activity";

        return {
          portfolioValueUsd,
          solBalance,
          tokenCount,
          topToken,
          topTokenSymbol,
          txCount,
          recentActivity,
        };
      } catch (err) {
        console.error("[SimClient] SIM API call failed:", err);
      }
    }

    // Demo fallback — used when no API key or API fails
    return {
      portfolioValueUsd: 847.32,
      solBalance: "2.41",
      tokenCount: 14,
      topToken: "dogwifhat",
      topTokenSymbol: "$WIF",
      txCount: 312,
      recentActivity: "Today",
    };
  }
}

export const simClient = new SimClient();

// Backward-compatible alias used by route.ts
export const duneClient = simClient;
