# Trewrap — Full Project Brief

## PRD
> **Hook**: "You traded 847 times last quarter. Your average hold time was 4 minutes. You are: Exit Liquidity Human." Trewrap generates Spotify Wrapped-style persona cards from Dune SQL analysis.

**Problem**: Wallet analytics are boring tables. Nobody shares a Dune dashboard. But everyone shares a personality quiz result.

**Solution**: Input wallet → Dune SQL analyzes timing variance, token diversity, MEV exposure, win rate → AI generates a brutally honest "Trader Persona" with a shareable card.

**Core Features**:
1. Wallet input → Dune SQL query execution
2. 5 behavioral signals: timing, diversity, MEV, win rate, diamond-handedness
3. AI persona generator ("Exit Liquidity Human", "Insomniac Ape", "Stablecoin Monk")
4. Shareable card with stats + persona title + roast
5. Leaderboard of most common personas

**Out of Scope**: Historical comparison, portfolio advice, real-time tracking

---

## ARCHITECTURE
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind v4 |
| Data | Dune Analytics API (SQL queries) |
| AI | OpenAI API (persona generation) |
| Sharing | html-to-image (shareable cards) |
| Database | Supabase (cached results, leaderboard) |

**Dune SQL Depth**: 5+ custom queries (timing analysis, token diversity, MEV detection, PnL calculation, hold duration).

---

## BUILD PLAN (3 Days)
- **Day 1**: Dune SQL queries (5 behavioral signals), API integration
- **Day 2**: AI persona generator, shareable card design, leaderboard
- **Day 3**: Polish card aesthetics, demo video, deploy

---

## SUBMISSION
**Demo**: Input vitalik.eth → Dune crunches 10,000 txs → "You are: The Patron Saint of Gas. Average gas per tx: $47. Total burned: $2.1M."

---

## SEED DATA
5 pre-analyzed wallets with cached Dune responses, 12 persona archetypes, sample shareable cards.

---

## UI
Spotify Wrapped aesthetic (dark + vibrant gradients), card reveal animation (flip), stats counter animation, persona title with glow effect, share button.
