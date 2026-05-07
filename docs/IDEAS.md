# 💡 Dune — Selected Idea

> **Decision**: Trewrap (confirmed 2026-05-07)
> **Source**: Gemini Deep Think #1 pick (96/100)

---

## ✅ SELECTED: Trewrap — Wallet Persona Profiler via Dune SQL

| Field | Value |
|-------|-------|
| **Name** | Trewrap |
| **One-liner** | Spotify Wrapped meets the Turing Test: input a Solana wallet → Dune SQL analyzes timing variance, token diversity, MEV exposure → AI generates a brutally honest "Trader Persona" (e.g., "Exit Liquidity Human", "Insomniac Ape") |
| **Target Track** | Primary: **Dune** (1st: 1-year SIM plan, ~$3,600 value) |
| **Docs Distance** | 🟢 Novel — Not a simple dashboard embed |
| **Winner Archetype** | Capability-unlock — "Your wallet now has a personality test" |
| **SDK Surface Area** | 3+ — Dune API (parameterized queries), complex SQL (window functions, stddev), materialized views |
| **Production Plan** | Vercel deployment, pre-cached top 50 CT influencer wallets in Supabase |
| **Difficulty** | Medium (5/10) |
| **Tech Stack** | Next.js 16, Dune API, OpenAI API, Framer Motion, Supabase, Tailwind v4 |

---

## Gate Check

| Gate | Result |
|------|--------|
| ❌ Emotional Hook Test | ✅ PASS — "You think you're a 'diamond hands' trader? Your wallet says you panic-sold 14 times in January" |
| ❌ Docs Distance = 🔴 | ✅ PASS — 🟢 Not a dashboard, it's a consumer ego product |
| ❌ Winner Archetype = Visualization only | ✅ PASS — Capability-unlock (wallet personality analysis) |
| ❌ Scope = Wide+Shallow | ✅ PASS — ONE flow: Input wallet → SQL analysis → AI roast → Share card |
| ❌ Rubric Alignment < 70% | ✅ PASS — Parameterized queries = 40% rubric, AI presentation = 30% |

---

## Flagship SQL

```sql
WITH tx_lags AS (
  SELECT signer, block_time,
         date_diff('second', lag(block_time) OVER (PARTITION BY signer ORDER BY block_time), block_time) AS seconds_since_last_tx
  FROM solana.transactions 
  WHERE block_time > NOW() - INTERVAL '7' DAY AND signer = '{{wallet_address}}'
)
SELECT signer, 
       approx_percentile(seconds_since_last_tx, 0.5) AS median_speed, 
       stddev(seconds_since_last_tx) AS timing_variance
FROM tx_lags GROUP BY signer;
```

## Why This Wins

1. **Viral consumer hook** — ego + masochism, everyone wants to check their stats
2. **Parameterized Queries** — proves dynamic Dune API usage (40% rubric)
3. **AI roast maximizes Presentation** (30% rubric)
4. **Pre-cache top 50 CT influencer wallets** for instant demo

## Runner-Up Ideas

| Rank | Idea | Score | Why Not |
|------|------|-------|---------|
| #2 | PumpAutopsy (Memecoin Survival Curves) | 90/100 | Less viral, more analytical |
| #3 | SandwichSniper (MEV Forensics) | 91/100 | Niche audience |
