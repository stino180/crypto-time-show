import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";

export interface SocialAdoptionData {
  nonZeroAddresses: number;
  lightningCapacity: number;
  lightningChannels: number;
}

interface SocialAdoptionSectionProps {
  data: SocialAdoptionData;
  isLive?: boolean;
  className?: string;
}

export function SocialAdoptionSection({
  data,
  isLive = false,
  className,
}: SocialAdoptionSectionProps) {
  return (
    <div className={cn("", className)}>
      <SectionHeader title="SOCIAL & ADOPTION PULSE" isLive={isLive} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        <StatCard
          label="Non-Zero Addresses"
          value={data.nonZeroAddresses}
          color="orange"
          size="sm"
          animate={true}
          animationSpeed={30000}
          direction="up"
          smoothTransition={isLive}
          transitionDuration={2000}
          subLabel="Estimated global users"
        />
        <StatCard
          label="Lightning Capacity"
          value={data.lightningCapacity}
          decimals={0}
          suffix=" BTC"
          color="amber"
          size="sm"
          smoothTransition={true}
          transitionDuration={1500}
          subLabel="Layer 2 locked value"
        />
        <StatCard
          label="Lightning Channels"
          value={data.lightningChannels}
          color="green"
          size="sm"
          smoothTransition={isLive}
          transitionDuration={1000}
          subLabel="Active payment routes"
        />
      </div>
    </div>
  );
}
