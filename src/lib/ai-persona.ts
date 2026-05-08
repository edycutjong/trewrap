export class AIPersonaGenerator {
  generate(signals: Record<string, string | number>) {
    console.log("[AIPersonaGenerator] Mapping signals to persona...");
    
    // Simulate AI parsing rules
    let persona = "Exit Liquidity Human";
    let description = `You traded heavily. Your average hold time was ${signals.avgHoldingTime}. Your bags are heavy, knees weak, arms are heavy.`;

    if (signals.winRate && parseFloat(String(signals.winRate)) > 50) {
      persona = "Diamond Hands";
      description = `With a win rate of ${signals.winRate}, you know when to hold 'em. You navigate the trenches with diamond resolve.`;
    } else if (signals.avgHoldingTime && String(signals.avgHoldingTime).includes("Seconds")) {
      persona = "Ape Extraordinaire";
      description = `Holding time: ${signals.avgHoldingTime}. You buy high, sell low, and do it faster than anyone else on ${signals.favoriteDex}.`;
    }

    return {
      persona,
      description
    };
  }
}

export const aiPersonaGenerator = new AIPersonaGenerator();
