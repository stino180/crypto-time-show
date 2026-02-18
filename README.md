# Bitcoin Clock Dashboard

A real-time Bitcoin statistics dashboard inspired by [usdebtclock.org](https://www.usdebtclock.org/) with a **retro/analog** aesthetic (nixie tubes, vintage gauges, warm amber tones).

## Features

- **Retro / Nixie Tube Display** - Dark theme with warm orange glowing numbers, brass-framed cards, vintage control-panel feel
- **Real-Time Data** - Live price, hashrate, block height, fees, and mempool from CoinGecko and Mempool.space (no API keys)
- **Smooth Numbers** - Values animate only when they change (no glitchy flicker)
- **30-Day Price Chart** - BTC/USD area chart with high/low and vintage styling
- **3D Globe** - Rotating globe with orange country outlines, BTC-holding countries filled, drag/zoom

## Stats Displayed

### Hero Section
- Remaining BTC to Mine (countdown to 21M)
- Halving Countdown Timer (to April 2028)
- Current Price & Sats per Dollar

### Scarcity Section
- Total Supply Cap (21M)
- Mined Supply
- Lost/Locked Supply (estimated)
- Satoshi's Coins
- Zombie Coins (10+ years dormant)
- Inflation Rate (BTC vs USD)
- Liquid vs Illiquid Supply

### Network Health (Live)
- Hashrate (EH/s)
- Block Height
- Mempool Size
- Fee Estimates (Fast/Medium/Slow)
- Difficulty Adjustment Countdown

### Ownership Distribution
- Governments
- Institutions/ETFs
- Exchanges
- Retail
- ETF Daily Flows

### Global Context
- Bitcoin vs Gold Market Cap
- BTC per Human
- Wholecoiner Count
- Nation-State Adoption
- Mining Renewable Energy %

### Network Resilience (Decentralization)
- Total Reachable Nodes (~17,700+ running Bitcoin Core)
- Node Count by Country (Top 3: USA, Germany, France)
- 51% Attack Cost (annual cost in billions USD)

### Hard Assets Comparison
- BTC vs Global Real Estate ($370T)
- BTC vs Global M2 Fiat Supply ($105T)
- Sats per Median House (with historical comparison)

### Censorship Resistance
- Transactions (24h)
- Block Space Utilization %
- Value Settled (24h in billions USD)

### Energy & Environment
- Bitcoin Energy Usage (TWh/yr)
- Traditional Banking Energy (TWh/yr)
- BTC vs Banking Efficiency
- Methane Mitigated (tons CO2/yr)

### Social & Adoption Pulse
- Non-Zero Addresses (estimated users)
- Lightning Network Capacity (BTC)
- Lightning Channels

### Ticker Tape
- Scrolling Bitcoin facts at the bottom of the page (CNBC-style)

## Data Sources

**Live APIs (no key required):**
- CoinGecko - Price, market cap
- Mempool.space - Block height, hashrate, fees, mempool, difficulty

**Estimated/Static:**
- Ownership distribution
- Lost coins, Satoshi's coins
- ETF flows
- Nation-state data

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Data:** TanStack React Query (price every 10s, network every 30–60s)
- **Charts:** Recharts (price history)
- **3D Globe:** Three.js, React Three Fiber, drei, TopoJSON (world-atlas 110m)
- **Fonts:** Nixie One (numbers), Special Elite (labels)

## Running Locally

```bash
# Web app (from repo root)
npm install && npm run dev

# Backend (optional)
cd backend && bun install && bun run dev
```

## Notes

- **402 / "Insufficient credit balance"** – This is a Vibecode platform billing/credits message, not an app bug. The app runs locally and can be deployed elsewhere.
- **"Hang tight, we're loading your app"** – If the Vibecode preview stalls, open the app in a new tab or run it locally.
