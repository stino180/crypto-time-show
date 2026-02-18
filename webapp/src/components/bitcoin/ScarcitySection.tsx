import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";

interface ScarcitySectionProps {
  data: {
    totalSupply: number;
    minedSupply: number;
    lostSupply: number;
    satoshiCoins: number;
    zombieCoins: number;
    annualInflation: number;
    usdInflation: number;
    liquidSupply: number;
    illiquidSupply: number;
  };
  className?: string;
}

export function ScarcitySection({ data, className }: ScarcitySectionProps) {
  return (
    <div className={cn("", className)}>
      <SectionHeader title="Scarcity Metrics" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        <StatCard
          label="Total Supply Cap"
          value={data.totalSupply}
          suffix=" BTC"
          color="orange"
          size="md"
        />
        <StatCard
          label="Mined Supply"
          value={data.minedSupply}
          suffix=" BTC"
          color="green"
          size="md"
          animate={true}
          animationSpeed={30000}
          direction="up"
        />
        <StatCard
          label="Lost / Locked"
          value={data.lostSupply}
          suffix=" BTC"
          color="red"
          size="md"
          subLabel="Estimated permanently lost"
        />
        <StatCard
          label="Satoshi's Coins"
          value={data.satoshiCoins}
          suffix=" BTC"
          color="amber"
          size="md"
          subLabel="Never moved since 2009"
        />
        <StatCard
          label="Zombie Coins"
          value={data.zombieCoins}
          suffix=" BTC"
          color="red"
          size="md"
          subLabel="10+ years dormant"
        />
        <StatCard
          label="BTC Inflation"
          value={data.annualInflation}
          decimals={2}
          suffix="%"
          color="green"
          size="md"
          subLabel="Annual supply increase"
        />
        <StatCard
          label="USD Inflation"
          value={data.usdInflation}
          decimals={1}
          suffix="%"
          color="red"
          size="md"
          subLabel="CPI Year over Year"
        />
        <StatCard
          label="Liquid Supply"
          value={data.liquidSupply}
          suffix=" BTC"
          color="orange"
          size="md"
          subLabel="Available for trading"
        />
        <StatCard
          label="Illiquid Supply"
          value={data.illiquidSupply}
          suffix=" BTC"
          color="amber"
          size="md"
          subLabel="Long-term held"
        />
      </div>
    </div>
  );
}
