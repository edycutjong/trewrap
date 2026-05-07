> **Revision**: R1 — Consolidated from DeepSeek Deep Think + Gemini Deep Think
> **Track**: Colosseum Frontier — Dune Analytics Data Sidetrack
> **Generated**: 2026-05-06

# 🧠 Ideation Output — Dune Analytics SIM (R1)

---

## 📊 Model Consensus Matrix

| # | Idea | DeepSeek | Gemini | Avg Score | Recommended |
|---|------|----------|--------|-----------|-------------|
| 1 | **Money Graph** (Protocol Interconnect Map) | 93/100 ⭐ | — | 93 | 🥇 DeepSeek Pick |
| 2 | **TrenchWrapped** (AI Bot vs Human Profiler) | — | 96/100 ⭐ | 96 | 🥇 Gemini Pick |
| 3 | **PumpAutopsy** (Survival Curves for Memecoins) | — | 90/100 | 90 | 🥈 Gemini Alt |
| 4 | **Sandwich Sniper** (MEV Forensics) | 91/100 | — | 91 | 🥇 DeepSeek Alt |
| 5 | **Toxic Mint** (Token Launch Risk Scanner) | 90/100 | — | 90 | 🥈 |
| 6 | **ToxicFlow** (Invisible Slippage Tax) | — | 92/100 | 92 | 🥈 |
| 7 | **SybilSankey** (Airdrop Cartel Flow) | — | 91/100 | 91 | 🥈 |
| 8 | **Alpha Tracker** (Smart Money Wallet Intel) | 85/100 | — | 85 | 🥉 |
| 9 | **Gas Wars / BlockSpace Oracle** (Priority Fee) | 84/100 | 85/100 | 84.5 | 🥉 Both models |
| 10 | **Money Graph** overlaps with **SybilSankey** | — | — | — | Merge potential |

---

## 🏆 TOP PICK: TrenchWrapped (Gemini #1 — 96/100)

**"Spotify Wrapped meets the Turing Test"**

### Pitch
User inputs a wallet, Dune fetches transaction history, Python backend analyzes timing variance, AI generates a brutally honest "Trader Persona" (e.g., "MEV Bot", "Exit Liquidity Human", "Insomniac Ape").

### Why Wins
- **Viral consumer hook** — ego + masochism, everyone wants to check their stats
- **Parameterized Queries** — proves dynamic Dune API usage (40% rubric)
- **AI roast** maxes Presentation (30%)
- **Pre-cache top 50 CT influencer wallets** in Supabase for instant demo

### Tech Stack
Next.js, Framer Motion, Python FastAPI, OpenAI API, Supabase, Dune API

### 3-Day Build Plan
| Day | Deliverable |
|-----|-------------|
| 1 | Parameterized SQL (`stddev` on block times), Python API |
| 2 | Feed Dune JSON to OpenAI for roasting persona generation |
| 3 | Next.js UI with slick "Scraping the trenches..." loading animation |

### Flagship SQL
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

### 30s Demo
*Paste Ansem's wallet. Loader finishes. Screen flashes: "99% Human. Persona: Exit Liquidity. Your sleep cycle is 3 hours and you hold 14 dead coins."*

### Risk
Medium — Dune queries can take 15-30s cold. Mitigate with pre-cached influencer wallets.

### Cross-Submit
AI Track, 100xDevs

---

## 🥈 RUNNER-UP: Money Graph (DeepSeek #1 — 93/100)

**"Solana's financial circulatory system"**

### Pitch
Visualize capital flow between Solana DeFi protocols — who feeds whom, where users migrate. Interactive force-directed graph, nodes = protocols (size=TVL flow), edges glow with live value.

### Why Wins
- Nobody shows protocol-level money flow — ultimate ecosystem health map
- Complex SQL: join instructions across programs, infer protocol sequences
- 30% Presentation: interactive D3 force-directed graph is visually magnificent

### Tech Stack
Next.js, Dune API, Python (networkX), D3-force, Supabase

### 3-Day Build Plan
| Day | Deliverable |
|-----|-------------|
| 1 | SQL to extract tx sequences per signer, tag programs, store edges in Supabase |
| 2 | Graph frontend with D3, time slider for flows |
| 3 | Protocol profiles, video with dramatic network growth |

### Flagship SQL
```sql
WITH user_steps AS (
  SELECT signer, tx_id, block_time, program_id,
    LAG(program_id) OVER (PARTITION BY signer ORDER BY block_time, tx_index) AS prev_program
  FROM solana.instruction_calls
  WHERE program_id IN ('9xQeWvG816bUx2EPNM7WU2...', 'KLend...') -- top 20 protocols
)
SELECT prev_program, program_id, COUNT(*) AS flow_count, SUM(amount_usd) AS volume
FROM user_steps
JOIN solana.token_transfers ON ...
WHERE prev_program IS NOT NULL AND program_id != prev_program
GROUP BY 1,2;
```

### 30s Demo
*"Here's Solana's financial circulatory system. Watch how $120M moved from Orca to Kamino this week — that's the yield migration."*

### Risk
Medium — graph can become hairball if not filtered. Limit to top 20 protocols.

---

## 🥉 BACKUP: PumpAutopsy (Gemini #3 — 90/100)

**"Medical-grade survival curves for memecoins"**

### Pitch
Applies Kaplan-Meier survival curves to Pump.fun tokens — mathematical half-life before volume flatlines. Bloomberg-terminal / medical aesthetics.

### Why Wins
- Stunning visualization shifts memecoin meta from tables to clinical curves
- Materialized Views for instant load on massive volume dataset
- Low risk, high polish opportunity — easiest 3-day build

### 3-Day Build Plan
| Day | Deliverable |
|-----|-------------|
| 1 | SQL tracking token birth vs minute volume drops <$10/hr. Materialized View |
| 2 | Next.js UI plotting survival % over time |
| 3 | Polish, parameter overlay, record demo |

### Flagship SQL
```sql
WITH creation AS (
  SELECT token_mint_address, MIN(block_time) as birth
  FROM dex_solana.trades WHERE project = 'pump.fun' GROUP BY 1
), death AS (
  SELECT token_mint_address, MIN(block_time) as flatline
  FROM dex_solana.trades WHERE project = 'pump.fun' AND amount_usd < 10 GROUP BY 1
)
SELECT c.token_mint_address, date_diff('minute', c.birth, d.flatline) as lifespan_mins 
FROM creation c JOIN death d ON c.token_mint_address = d.token_mint_address;
```

### 30s Demo
*"This token died at 14 minutes. Network median is 11 minutes. You bought at 16 minutes."*

---

## 📋 Full Idea Index (DeepSeek)

### 4. Sandwich Sniper — MEV Forensics (91/100)
- Expose sandwich attacks on Solana DEXes in real time
- Multi-CTE queries with LAG/LEAD, token swap ID, profit calc
- "Report Copy-Trader" button with CSV of attacker wallets
- Risk: Medium (noisy data, false positives)

### 5. Toxic Mint — Token Launch Risk Scanner (90/100)
- Detect new SPL tokens, score rug-pull probability in first 15 min
- Gini coefficient on early transfer concentration
- "Pre-Flight Wallet Check" — paste token, get 0-100 risk score
- Risk: Medium (needs labeled scam data)

### 6. Alpha Tracker — Smart Money Intelligence (85/100)
- Identify most profitable traders, alert on new moves
- PnL computation with cost basis from trade history
- Risk: Low (well-trodden, needs extreme polish)

### 7. Gas Wars — Priority Fee Analytics (84/100)
- Map compute unit bloat and priority fees per program
- "Wasted SOL" calculator for wallets
- Risk: Zero (safest build)

## 📋 Full Idea Index (Gemini)

### 8. ToxicFlow — Invisible Slippage Tax (92/100)
- Calculate exact USD lost to MEV sandwiching on Jupiter
- Realized Slippage: delta between execution and median block price
- Aggressive red-themed UI: "You lost $842 this month"
- Risk: High (SQL logic for accurate pricing)

### 9. SybilSankey — Airdrop Cartel Flow (91/100)
- Trace capital from CEX hot wallets to Sybil farm wallets via Sankey diagram
- Use Nivo Sankey (NOT force-directed graph — avoids hairball)
- Risk: High (data wrangling for chart libraries)

### 10. BlockSpace Oracle — Priority Fee Burn (85/100)
- Map compute unit bloat per program
- "Wall of Shame" — wasted SOL delta
- Risk: Zero (safest build, guaranteed finish)

---

## 🎯 Execution Strategy

### Both Models Agree On:
1. **Dune is your backend** — `Next.js ↔ Supabase (cache) ↔ Dune API`
2. **Never execute dynamic queries on page load** — use Materialized Views or build incredible loading UX
3. **Visualization is 50% of the battle** — use Recharts/D3/Tremor, never raw tables
4. **The video is the pitch** — explain the *insight*, not the code
5. **4 subs, 4 prizes** — mathematically guaranteed prize, aim for 1st

### Recommended Build Order:
1. **Primary**: TrenchWrapped (96/100) — viral, AI-powered, max presentation score
2. **Fallback**: PumpAutopsy (90/100) — lowest risk, highest polish ceiling
3. **Ambitious**: Money Graph (93/100) — unique but D3 graph is harder in 3 days

### Kill Decision Framework:
- If Dune's Solana transaction data has good `block_time` granularity → **TrenchWrapped**
- If Pump.fun data is accessible in Dune → **PumpAutopsy**
- If neither → **BlockSpace Oracle** (safest fallback, guaranteed finish)

### Architecture (All Ideas):
```
Next.js ←→ Supabase (API Cache) ←→ Dune API
                ↕
         Python FastAPI (optional: AI/ML layer)
```

### Cross-Submit Targets:
- 100xDevs (DeFi track)
- Jupiter (if applicable)
- AI Track (TrenchWrapped only)
