import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";

interface NetworkHealthSectionProps {
  data: {
    hashrate: number;
    blockHeight: number;
    mempoolSize: number;
    feeFast: number;
    feeMedium: number;
    feeSlow: number;
    blocksUntilAdjustment: number;
    difficulty: number;
  };
  isLive?: boolean;
  className?: string;
}

export function NetworkHealthSection({ data, isLive = false, className }: NetworkHealthSectionProps) {
  return (
    <div className={cn("", className)}>
      <SectionHeader title="Network Health" isLive={isLive} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        <StatCard
          label="Hashrate"
          value={data.hashrate}
          decimals={1}
          suffix=" EH/s"
          color="green"
          size="sm"
          smoothTransition={isLive}
          animate={!isLive}
          animationSpeed={2000}
          direction="up"
          subLabel="Exahashes per second"
        />
        <StatCard
          label="Block Height"
          value={data.blockHeight}
          color="orange"
          size="sm"
          smoothTransition={isLive}
          animate={!isLive}
          animationSpeed={600000}
          direction="up"
          subLabel="Current block number"
        />
        <StatCard
          label="Mempool Size"
          value={data.mempoolSize}
          suffix=" tx"
          color="amber"
          size="sm"
          smoothTransition={isLive}
          animate={!isLive}
          animationSpeed={500}
          direction="up"
          subLabel="Unconfirmed transactions"
        />
        <StatCard
          label="Difficulty"
          value={data.difficulty}
          decimals={1}
          suffix="T"
          color="green"
          size="sm"
          smoothTransition={isLive}
          subLabel="Mining difficulty"
        />
        <StatCard
          label="Fee - Fast"
          value={data.feeFast}
          suffix=" sat/vB"
          color="red"
          size="sm"
          smoothTransition={isLive}
          animate={!isLive}
          animationSpeed={3000}
          direction="up"
          subLabel="~10 min confirm"
        />
        <StatCard
          label="Fee - Medium"
          value={data.feeMedium}
          suffix=" sat/vB"
          color="amber"
          size="sm"
          smoothTransition={isLive}
          animate={!isLive}
          animationSpeed={5000}
          direction="up"
          subLabel="~30 min confirm"
        />
        <StatCard
          label="Fee - Slow"
          value={data.feeSlow}
          suffix=" sat/vB"
          color="green"
          size="sm"
          smoothTransition={isLive}
          animate={!isLive}
          animationSpeed={8000}
          direction="up"
          subLabel="~60 min confirm"
        />
        <StatCard
          label="Blocks to Adjust"
          value={data.blocksUntilAdjustment}
          color="orange"
          size="sm"
          smoothTransition={isLive}
          subLabel="Until difficulty change"
        />
      </div>
    </div>
  );
}
