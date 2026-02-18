import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// API response types
interface CoinGeckoPrice {
  bitcoin: {
    usd: number;
    usd_24h_change?: number;
    usd_market_cap?: number;
  };
}

interface CoinGeckoMarketData {
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_supply: number;
    circulating_supply: number;
    price_change_percentage_24h: number;
  };
}

interface MempoolFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

interface MempoolHashrate {
  currentHashrate: number;
  currentDifficulty: number;
  hashrates: { timestamp: number; avgHashrate: number }[];
}

interface MempoolInfo {
  count: number;
  vsize: number;
  total_fee: number;
  fee_histogram: number[][];
}

interface MempoolDifficulty {
  progressPercent: number;
  difficultyChange: number;
  estimatedRetargetDate: number;
  remainingBlocks: number;
  remainingTime: number;
  previousRetarget: number;
  nextRetargetHeight: number;
  timeAvg: number;
  timeOffset: number;
}

// Transformed data types for the app
export interface BitcoinPriceData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  satsPerDollar: number;
}

export interface BitcoinNetworkData {
  blockHeight: number;
  hashrate: number; // in EH/s
  difficulty: number; // in T
  feeFast: number;
  feeMedium: number;
  feeSlow: number;
  mempoolSize: number;
  mempoolVSize: number;
  blocksUntilAdjustment: number;
  difficultyChange: number;
  estimatedRetargetDate: Date | null;
}

export interface BitcoinData {
  price: BitcoinPriceData | null;
  network: BitcoinNetworkData | null;
  isLoading: boolean;
  isPriceLoading: boolean;
  isNetworkLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

// API fetchers
async function fetchCoinGeckoPrice(): Promise<CoinGeckoPrice> {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true"
  );
  if (!response.ok) throw new Error("Failed to fetch price data");
  return response.json();
}

async function fetchBlockHeight(): Promise<number> {
  const response = await fetch("https://mempool.space/api/blocks/tip/height");
  if (!response.ok) throw new Error("Failed to fetch block height");
  return response.json();
}

async function fetchHashrate(): Promise<MempoolHashrate> {
  const response = await fetch(
    "https://mempool.space/api/v1/mining/hashrate/3d"
  );
  if (!response.ok) throw new Error("Failed to fetch hashrate");
  return response.json();
}

async function fetchFees(): Promise<MempoolFees> {
  const response = await fetch(
    "https://mempool.space/api/v1/fees/recommended"
  );
  if (!response.ok) throw new Error("Failed to fetch fees");
  return response.json();
}

async function fetchMempool(): Promise<MempoolInfo> {
  const response = await fetch("https://mempool.space/api/mempool");
  if (!response.ok) throw new Error("Failed to fetch mempool");
  return response.json();
}

async function fetchDifficulty(): Promise<MempoolDifficulty> {
  const response = await fetch(
    "https://mempool.space/api/v1/difficulty-adjustment"
  );
  if (!response.ok) throw new Error("Failed to fetch difficulty");
  return response.json();
}

// Main hook
export function useBitcoinData(): BitcoinData {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Price data - poll every 10 seconds
  const priceQuery = useQuery({
    queryKey: ["bitcoin-price"],
    queryFn: fetchCoinGeckoPrice,
    refetchInterval: 10000,
    staleTime: 5000,
    retry: 2,
  });

  // Block height - poll every 30 seconds
  const blockHeightQuery = useQuery({
    queryKey: ["bitcoin-block-height"],
    queryFn: fetchBlockHeight,
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 2,
  });

  // Hashrate - poll every 60 seconds (less frequent changes)
  const hashrateQuery = useQuery({
    queryKey: ["bitcoin-hashrate"],
    queryFn: fetchHashrate,
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 2,
  });

  // Fees - poll every 30 seconds
  const feesQuery = useQuery({
    queryKey: ["bitcoin-fees"],
    queryFn: fetchFees,
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 2,
  });

  // Mempool - poll every 30 seconds
  const mempoolQuery = useQuery({
    queryKey: ["bitcoin-mempool"],
    queryFn: fetchMempool,
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 2,
  });

  // Difficulty - poll every 60 seconds
  const difficultyQuery = useQuery({
    queryKey: ["bitcoin-difficulty"],
    queryFn: fetchDifficulty,
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 2,
  });

  // Update lastUpdated timestamp when any data changes
  useEffect(() => {
    if (
      priceQuery.data ||
      blockHeightQuery.data ||
      hashrateQuery.data ||
      feesQuery.data ||
      mempoolQuery.data ||
      difficultyQuery.data
    ) {
      setLastUpdated(new Date());
    }
  }, [
    priceQuery.data,
    blockHeightQuery.data,
    hashrateQuery.data,
    feesQuery.data,
    mempoolQuery.data,
    difficultyQuery.data,
  ]);

  // Transform price data
  const priceData: BitcoinPriceData | null = priceQuery.data
    ? {
        price: priceQuery.data.bitcoin.usd,
        priceChange24h: priceQuery.data.bitcoin.usd_24h_change ?? 0,
        marketCap: (priceQuery.data.bitcoin.usd_market_cap ?? 0) / 1e12, // Convert to trillions
        satsPerDollar: Math.round(100_000_000 / priceQuery.data.bitcoin.usd),
      }
    : null;

  // Transform network data
  const networkData: BitcoinNetworkData | null =
    blockHeightQuery.data !== undefined ||
    hashrateQuery.data ||
    feesQuery.data ||
    mempoolQuery.data ||
    difficultyQuery.data
      ? {
          blockHeight: blockHeightQuery.data ?? 0,
          hashrate: hashrateQuery.data
            ? hashrateQuery.data.currentHashrate / 1e18 // Convert to EH/s
            : 0,
          difficulty: hashrateQuery.data
            ? hashrateQuery.data.currentDifficulty / 1e12 // Convert to T
            : 0,
          feeFast: feesQuery.data?.fastestFee ?? 0,
          feeMedium: feesQuery.data?.halfHourFee ?? 0,
          feeSlow: feesQuery.data?.hourFee ?? 0,
          mempoolSize: mempoolQuery.data?.count ?? 0,
          mempoolVSize: mempoolQuery.data?.vsize ?? 0,
          blocksUntilAdjustment: difficultyQuery.data?.remainingBlocks ?? 0,
          difficultyChange: difficultyQuery.data?.difficultyChange ?? 0,
          estimatedRetargetDate: difficultyQuery.data?.estimatedRetargetDate
            ? new Date(difficultyQuery.data.estimatedRetargetDate)
            : null,
        }
      : null;

  const isLoading =
    priceQuery.isLoading ||
    blockHeightQuery.isLoading ||
    hashrateQuery.isLoading ||
    feesQuery.isLoading ||
    mempoolQuery.isLoading ||
    difficultyQuery.isLoading;

  const error =
    priceQuery.error ||
    blockHeightQuery.error ||
    hashrateQuery.error ||
    feesQuery.error ||
    mempoolQuery.error ||
    difficultyQuery.error;

  return {
    price: priceData,
    network: networkData,
    isLoading,
    isPriceLoading: priceQuery.isLoading,
    isNetworkLoading:
      blockHeightQuery.isLoading ||
      hashrateQuery.isLoading ||
      feesQuery.isLoading ||
      mempoolQuery.isLoading ||
      difficultyQuery.isLoading,
    error: error as Error | null,
    lastUpdated,
  };
}

// Calculate remaining BTC to mine based on block height
export function calculateRemainingBTC(blockHeight: number): number {
  const totalSupply = 21_000_000;

  // Calculate total mined based on halving schedule
  let mined = 0;
  let reward = 50;
  let blocksProcessed = 0;
  const halvingInterval = 210_000;

  while (blocksProcessed < blockHeight) {
    const blocksInThisEra = Math.min(
      halvingInterval - (blocksProcessed % halvingInterval),
      blockHeight - blocksProcessed
    );

    // Check if we're crossing a halving
    const nextHalvingBlock = Math.ceil((blocksProcessed + 1) / halvingInterval) * halvingInterval;

    if (blocksProcessed + blocksInThisEra >= nextHalvingBlock && blocksProcessed < nextHalvingBlock) {
      // Split across halving
      const blocksBeforeHalving = nextHalvingBlock - blocksProcessed;
      mined += blocksBeforeHalving * reward;
      blocksProcessed = nextHalvingBlock;
      reward = reward / 2;
    } else {
      mined += blocksInThisEra * reward;
      blocksProcessed += blocksInThisEra;
    }

    // Safety check for very high block numbers
    if (reward < 0.00000001) break;
  }

  return totalSupply - mined;
}

// Calculate estimated halving date based on current block height
export function calculateNextHalvingDate(blockHeight: number): Date {
  const halvingInterval = 210_000;
  const currentHalvingEra = Math.floor(blockHeight / halvingInterval);
  const nextHalvingBlock = (currentHalvingEra + 1) * halvingInterval;
  const blocksUntilHalving = nextHalvingBlock - blockHeight;

  // Average block time is ~10 minutes
  const averageBlockTimeMs = 10 * 60 * 1000;
  const msUntilHalving = blocksUntilHalving * averageBlockTimeMs;

  return new Date(Date.now() + msUntilHalving);
}

// Get current block reward
export function getCurrentBlockReward(blockHeight: number): number {
  const halvingInterval = 210_000;
  const halvings = Math.floor(blockHeight / halvingInterval);
  return 50 / Math.pow(2, halvings);
}
