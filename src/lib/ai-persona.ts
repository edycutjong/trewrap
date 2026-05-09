import type { BehavioralSignals } from './dune-client';

export class AIPersonaGenerator {
  generate(signals: BehavioralSignals) {
    console.log("[AIPersonaGenerator] Mapping SIM signals to persona...");

    const { portfolioValueUsd, tokenCount, txCount, topTokenSymbol, solBalance } = signals;

    // Ghost Wallet — no activity at all
    if (txCount === 0 || portfolioValueUsd === 0) {
      return {
        persona: "Ghost Wallet",
        description: `This wallet is a phantom. ${txCount === 0 ? "Zero transactions." : `Portfolio value: $${portfolioValueUsd.toFixed(2)}.`} Nothing to see here — maybe a burner, maybe a forgotten seed phrase.`,
      };
    }

    // Diamond Hands — high value, focused portfolio
    if (portfolioValueUsd > 10000 && tokenCount < 5) {
      return {
        persona: "Diamond Hands",
        description: `Portfolio: $${portfolioValueUsd.toLocaleString()}. Only ${tokenCount} tokens. ${solBalance} SOL stacked. You picked your bets and you're riding them to Valhalla or zero.`,
      };
    }

    // Degen Ape — high activity, many tokens
    if (txCount > 30 && tokenCount > 20) {
      return {
        persona: "Degen Ape",
        description: `${txCount} transactions. ${tokenCount} different tokens. Top bag: ${topTokenSymbol}. You ape into everything that moves — no DYOR, just vibes and copium.`,
      };
    }

    // Paper Hands — lots of tokens but low value (sold everything)
    if (tokenCount > 10 && portfolioValueUsd < 100) {
      return {
        persona: "Paper Hands",
        description: `${tokenCount} tokens but only $${portfolioValueUsd.toFixed(2)} left. You bought the top and panic sold the bottom on every single one. Classic.`,
      };
    }

    // Default fallback — Exit Liquidity Human
    return {
      persona: "Exit Liquidity Human",
      description: `Portfolio: $${portfolioValueUsd.toFixed(2)}. ${txCount} transactions. Top token: ${topTokenSymbol}. You traded heavily and provided exit liquidity to smarter wallets. Thank you for your service.`,
    };
  }
}

export const aiPersonaGenerator = new AIPersonaGenerator();
