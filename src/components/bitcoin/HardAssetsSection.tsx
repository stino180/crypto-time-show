import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";

interface HardAssetsSectionProps {
  data: {
    btcMarketCap: number; // in trillions
    globalRealEstate: number; // in trillions ($370T)
    btcVsRealEstate: number; // percentage
    globalM2: number; // in trillions ($105T)
    btcVsM2: number; // percentage
    medianHomePrice: number; // in USD ($420,000)
    homeInBtc: number; // BTC amount (~4.2)
  };
  className?: string;
}

export function HardAssetsSection({ data, className }: HardAssetsSectionProps) {
  return (
    <div className={cn("", className)}>
      <SectionHeader title="Hard Assets Comparison" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <StatCard
          label="Global Real Estate"
          value={data.globalRealEstate}
          decimals={0}
          prefix="$"
          suffix="T"
          color="amber"
          size="md"
          subLabel="Total property value"
        />
        <StatCard
          label="BTC vs Real Estate"
          value={data.btcVsRealEstate}
          decimals={2}
          suffix="%"
          color="orange"
          size="md"
          animate={true}
          animationSpeed={5000}
          direction="up"
          subLabel="Market cap ratio"
        />
        <StatCard
          label="Global M2 Supply"
          value={data.globalM2}
          decimals={0}
          prefix="$"
          suffix="T"
          color="amber"
          size="md"
          subLabel="World fiat money"
        />
        <StatCard
          label="BTC vs Global M2"
          value={data.btcVsM2}
          decimals={2}
          suffix="%"
          color="orange"
          size="md"
          animate={true}
          animationSpeed={3000}
          direction="up"
          subLabel="Absorbing fiat"
        />
        <StatCard
          label="Median US Home"
          value={data.medianHomePrice}
          decimals={0}
          prefix="$"
          color="amber"
          size="md"
          subLabel="Current price USD"
        />
        <StatCard
          label="Home in BTC"
          value={data.homeInBtc}
          decimals={2}
          suffix=" BTC"
          color="green"
          size="md"
          animate={true}
          animationSpeed={8000}
          direction="down"
          subLabel="2015: 1,000 BTC"
        />
      </div>
    </div>
  );
}
