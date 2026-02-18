import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./StatCard";

interface PriceDataPoint {
  date: string;
  price: number;
  timestamp: number;
}

interface CoinGeckoMarketChart {
  prices: [number, number][];
}

async function fetchBitcoinPriceHistory(): Promise<PriceDataPoint[]> {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch price data");
  }

  const data: CoinGeckoMarketChart = await response.json();

  return data.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
}

interface PriceChartProps {
  className?: string;
}

export function PriceChart({ className }: PriceChartProps) {
  const {
    data: priceData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bitcoin-price-history"],
    queryFn: fetchBitcoinPriceHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Custom tooltip component matching the vintage aesthetic
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-md bg-gradient-to-b from-amber-800/30 to-amber-950/30 blur-sm" />
          <div className="relative bg-stone-950/95 border border-amber-900/50 rounded-md px-3 py-2 shadow-lg">
            <p className="font-['Special_Elite'] text-[10px] text-amber-200/50 uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="font-['Nixie_One'] text-lg text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">
              {formatTooltipValue(payload[0].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("", className)}>
      <SectionHeader title="Price History (30D)" />

      <div className="relative">
        {/* Subtle brass frame glow */}
        <div className="absolute -inset-0.5 rounded-md bg-gradient-to-b from-amber-800/20 to-amber-950/20 blur-sm" />

        <div
          className={cn(
            "relative rounded-md p-4 md:p-6",
            "bg-gradient-to-b from-stone-900/95 via-stone-950 to-stone-900/95",
            "border border-amber-900/40",
            "shadow-[inset_0_1px_10px_rgba(0,0,0,0.4)]"
          )}
        >
          {/* Corner rivets */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-700 to-amber-950" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-700 to-amber-950" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-700 to-amber-950" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-700 to-amber-950" />

          {/* Loading State */}
          {isLoading ? (
            <div className="h-[250px] md:h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-700/30 border-t-orange-400 rounded-full animate-spin" />
                <span className="font-['Special_Elite'] text-xs text-amber-200/40 uppercase tracking-wider">
                  Loading Price Data...
                </span>
              </div>
            </div>
          ) : isError ? (
            /* Error State */
            <div className="h-[250px] md:h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center px-4">
                <div className="w-10 h-10 rounded-full border-2 border-red-500/40 flex items-center justify-center">
                  <span className="text-red-400 text-lg">!</span>
                </div>
                <span className="font-['Special_Elite'] text-xs text-red-400/60 uppercase tracking-wider">
                  Failed to Load Data
                </span>
                <span className="font-['Special_Elite'] text-[10px] text-amber-200/30 max-w-[200px]">
                  {error instanceof Error ? error.message : "Please try again later"}
                </span>
              </div>
            </div>
          ) : (
            /* Chart */
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={priceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="50%" stopColor="#f97316" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "rgba(251, 191, 36, 0.4)",
                      fontSize: 10,
                      fontFamily: "'Special Elite', cursive",
                    }}
                    dy={10}
                    interval="preserveStartEnd"
                    tickCount={6}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "rgba(251, 191, 36, 0.4)",
                      fontSize: 10,
                      fontFamily: "'Special Elite', cursive",
                    }}
                    tickFormatter={formatYAxis}
                    dx={-5}
                    width={50}
                    domain={["dataMin * 0.98", "dataMax * 1.02"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    filter="url(#glow)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#f97316",
                      stroke: "#fbbf24",
                      strokeWidth: 2,
                      filter: "url(#glow)",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Bottom info bar */}
          {priceData && priceData.length > 0 && (
            <div className="mt-4 pt-4 border-t border-amber-900/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-orange-400 rounded-full" />
                    <span className="font-['Special_Elite'] text-[10px] text-amber-200/40 uppercase tracking-wider">
                      BTC/USD
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-['Special_Elite'] text-[9px] text-amber-200/30 uppercase tracking-wider block">
                      High
                    </span>
                    <span className="font-['Nixie_One'] text-sm text-green-400">
                      ${Math.max(...priceData.map((d) => d.price)).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-['Special_Elite'] text-[9px] text-amber-200/30 uppercase tracking-wider block">
                      Low
                    </span>
                    <span className="font-['Nixie_One'] text-sm text-red-400">
                      ${Math.min(...priceData.map((d) => d.price)).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
