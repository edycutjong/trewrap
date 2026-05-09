export interface BehavioralSignals {
  tradingVolume: string;
  avgHoldingTime: string;
  favoriteDex: string;
  winRate: string;
  topTradedToken: string;
  totalPnl: string;
}

export class DuneClient {
  private apiKey: string;
  private baseUrl = "https://api.dune.com/api/v1";

  constructor() {
    this.apiKey = process.env.DUNE_API_KEY || process.env.NEXT_PUBLIC_DUNE_API_KEY || "";
  }

  async fetchBehavioralSignals(walletAddress: string): Promise<BehavioralSignals> {
    console.log(`[DuneClient] Fetching signals for ${walletAddress}...`);

    if (this.apiKey) {
      try {
        const executeRes = await fetch(`${this.baseUrl}/query/123456/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Dune-API-Key": this.apiKey,
          },
          body: JSON.stringify({ query_parameters: { wallet: walletAddress } }),
        });

        if (executeRes.ok) {
          const data = await executeRes.json();
          const executionId = data.execution_id;

          const resultRes = await fetch(`${this.baseUrl}/execution/${executionId}/results`, {
            headers: { "X-Dune-API-Key": this.apiKey },
          });

          if (resultRes.ok) {
            const result = await resultRes.json();
            if (result.result?.rows?.length) {
              const row = result.result.rows[0];
              return {
                tradingVolume: row.tradingVolume || "Low",
                avgHoldingTime: row.avgHoldingTime || "3 Hours",
                favoriteDex: row.favoriteDex || "Raydium",
                winRate: row.winRate || "12.4%",
                topTradedToken: row.topTradedToken || "$WIF",
                totalPnl: row.totalPnl || "-$4,250"
              };
            }
          }
        }
      } catch (err) {
        console.error("[DuneClient] Query failed:", err);
      }
    }

    // Demo fallback
    return {
      tradingVolume: "High",
      avgHoldingTime: "4 Minutes",
      favoriteDex: "Raydium",
      winRate: "12.4%",
      topTradedToken: "$WIF",
      totalPnl: "-$4,250"
    };
  }
}

export const duneClient = new DuneClient();
