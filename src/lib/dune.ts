import { DuneClient } from "@duneanalytics/client-sdk";

export class DunePersonaService {
  private client: DuneClient | null = null;
  private initialized = false;

  init() {
    if (this.initialized) return;
    
    const apiKey = process.env.NEXT_PUBLIC_DUNE_API_KEY || process.env.DUNE_API_KEY;
    if (apiKey) {
      this.client = new DuneClient(apiKey);
    } else {
      console.warn("[Dune SDK] No API key found, will fall back to mock data.");
    }
    
    this.initialized = true;
  }

  async generatePersona(walletAddress: string): Promise<any> {
    this.init();
    
    console.log(`[Dune SDK] Analyzing wallet ${walletAddress} using Dune SQL...`);
    
    if (this.client) {
      try {
        // Dune execution: We use a placeholder query ID for the hackathon demo, or pass actual parameters
        // Example Query ID for a persona analysis
        const executionResult = await this.client.refresh(123456, { wallet: walletAddress });
        console.log(`[Dune SDK] Analysis complete for ${walletAddress}`);
        
        // Parse the result assuming a standard return format for our persona query
        if (executionResult.result?.rows?.length) {
          const row = executionResult.result.rows[0];
          return {
            persona: row.persona || "Unknown Persona",
            signals: {
              tradingVolume: row.tradingVolume || "Unknown",
              avgHoldingTime: row.avgHoldingTime || "Unknown",
              favoriteDex: row.favoriteDex || "Unknown"
            }
          };
        }
      } catch (err) {
        console.error("[Dune SDK] Query failed:", err);
      }
    }
    
    // Fallback Mock the returned Persona based on SQL query result
    console.log(`[Dune SDK] Falling back to mock analysis for ${walletAddress}`);
    return {
      persona: "Exit Liquidity Human",
      signals: {
        tradingVolume: "Low",
        avgHoldingTime: "3 Hours",
        favoriteDex: "Raydium"
      }
    };
  }
}

export const duneService = new DunePersonaService();

