// Dune Analytics REST API client (browser-compatible, no Node fs dependency)

export class DunePersonaService {
  private apiKey: string;
  private baseUrl = "https://api.dune.com/api/v1";
  private initialized = false;

  constructor() {
    this.apiKey = "";
  }

  init() {
    if (this.initialized) return;
    this.apiKey = process.env.NEXT_PUBLIC_DUNE_API_KEY || process.env.DUNE_API_KEY || "";
    if (!this.apiKey) {
      console.warn("[Dune API] No API key found, will use demo data.");
    }
    this.initialized = true;
  }

  async generatePersona(walletAddress: string): Promise<any> {
    this.init();

    console.log(`[Dune API] Analyzing wallet ${walletAddress}...`);

    if (this.apiKey) {
      try {
        // Execute query via Dune REST API
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

          // Poll for results
          const resultRes = await fetch(`${this.baseUrl}/execution/${executionId}/results`, {
            headers: { "X-Dune-API-Key": this.apiKey },
          });

          if (resultRes.ok) {
            const result = await resultRes.json();
            if (result.result?.rows?.length) {
              const row = result.result.rows[0];
              return {
                persona: row.persona || "Unknown Persona",
                signals: {
                  tradingVolume: row.tradingVolume || "Unknown",
                  avgHoldingTime: row.avgHoldingTime || "Unknown",
                  favoriteDex: row.favoriteDex || "Unknown",
                },
              };
            }
          }
        }
      } catch (err) {
        console.error("[Dune API] Query failed:", err);
      }
    }

    // Demo fallback
    return {
      persona: "Exit Liquidity Human",
      signals: {
        tradingVolume: "Low",
        avgHoldingTime: "3 Hours",
        favoriteDex: "Raydium",
      },
    };
  }
}

export const duneService = new DunePersonaService();
