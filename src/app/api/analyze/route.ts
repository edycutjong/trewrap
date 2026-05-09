import { NextResponse } from 'next/server';
import { duneClient } from '@/lib/dune-client';
import { aiPersonaGenerator } from '@/lib/ai-persona';

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    const signals = await duneClient.fetchBehavioralSignals(walletAddress);
    const personaData = aiPersonaGenerator.generate(signals as unknown as Record<string, string | number>);

    return NextResponse.json({
      persona: personaData.persona,
      description: personaData.description,
      stats: signals
    });
  } catch (error) {
    console.error("[API/Analyze] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
