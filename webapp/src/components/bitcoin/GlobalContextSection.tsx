import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";

interface GlobalContextSectionProps {
  data: {
    btcMarketCap: number;
    goldMarketCap: number;
    btcAsPercentOfGold: number;
    btcPerHuman: number;
    wholecoiners: number;
    nationStateAdoption: number;
    miningRenewable: number;
  };
  className?: string;
}

export function GlobalContextSection({ data, className }: GlobalContextSectionProps) {
  return (
    <div className={cn("", className)}>
      <SectionHeader title="Global Context" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 md:gap-3">
        <StatCard
          label="BTC Market Cap"
          value={data.btcMarketCap}
          decimals={2}
          prefix="$"
          suffix="T"
          color="green"
          size="sm"
          animate={true}
          animationSpeed={1000}
          direction="up"
        />
        <StatCard
          label="Gold Market Cap"
          value={data.goldMarketCap}
          decimals={1}
          prefix="$"
          suffix="T"
          color="amber"
          size="sm"
        />
        <StatCard
          label="BTC / Gold Ratio"
          value={data.btcAsPercentOfGold}
          decimals={1}
          suffix="%"
          color="orange"
          size="sm"
          animate={true}
          animationSpeed={2000}
          direction="up"
          subLabel="Flippening progress"
        />
        <StatCard
          label="BTC per Human"
          value={data.btcPerHuman}
          decimals={5}
          suffix=" BTC"
          color="green"
          size="sm"
          subLabel="If divided equally"
        />
        <StatCard
          label="Wholecoiners"
          value={data.wholecoiners}
          color="orange"
          size="sm"
          animate={true}
          animationSpeed={20000}
          direction="up"
          subLabel="Addresses with 1+ BTC"
        />
        <StatCard
          label="Nation States"
          value={data.nationStateAdoption}
          suffix=" countries"
          color="amber"
          size="sm"
          subLabel="Legal tender / reserves"
        />
        <StatCard
          label="Mining Renewable"
          value={data.miningRenewable}
          suffix="%"
          color="green"
          size="sm"
          subLabel="Sustainable energy"
        />
      </div>
    </div>
  );
}
