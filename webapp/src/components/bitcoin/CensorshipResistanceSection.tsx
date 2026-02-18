import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";

interface CensorshipResistanceSectionProps {
  data: {
    transactions24h: number;
    blockSpaceUtilization: number;
    valueSettled24h: number;
  };
  isLive?: boolean;
  className?: string;
}

export function CensorshipResistanceSection({
  data,
  isLive = true,
  className,
}: CensorshipResistanceSectionProps) {
  return (
    <div className={cn("", className)}>
      <SectionHeader title="CENSORSHIP RESISTANCE" isLive={isLive} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
        <StatCard
          label="Transactions (24h)"
          value={data.transactions24h}
          color="orange"
          size="md"
          animate={true}
          animationSpeed={200}
          direction="up"
          smoothTransition={isLive}
          subLabel="Living payment rail"
        />
        <StatCard
          label="Block Space Utilization"
          value={data.blockSpaceUtilization}
          decimals={1}
          suffix="%"
          color="green"
          size="md"
          smoothTransition={isLive}
          subLabel="World's most secure real estate"
        />
        <StatCard
          label="Value Settled (24h)"
          value={data.valueSettled24h}
          decimals={1}
          prefix="$"
          suffix="B"
          color="amber"
          size="md"
          animate={true}
          animationSpeed={5000}
          direction="up"
          smoothTransition={isLive}
          subLabel="Rivals FedWire & Visa"
        />
      </div>
    </div>
  );
}
