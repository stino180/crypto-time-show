import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";

interface CountryNode {
  country: string;
  nodes: number;
}

interface NetworkResilienceSectionProps {
  data: {
    totalNodes: number;
    topCountries: CountryNode[];
    attackCostBillion: number;
  };
  isLive?: boolean;
  className?: string;
}

// Custom card for displaying the top countries list
function TopCountriesCard({ countries }: { countries: CountryNode[] }) {
  return (
    <div className="relative">
      {/* Subtle brass frame glow */}
      <div className="absolute -inset-0.5 rounded-md bg-gradient-to-b from-amber-800/20 to-amber-950/20 blur-sm" />

      <div
        className={cn(
          "relative rounded-md p-4 md:p-5 h-full",
          "bg-gradient-to-b from-stone-900/95 via-stone-950 to-stone-900/95",
          "border border-amber-900/40",
          "shadow-[inset_0_1px_10px_rgba(0,0,0,0.4)]"
        )}
      >
        {/* Small corner rivets */}
        <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-gradient-to-br from-amber-700 to-amber-950" />
        <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-gradient-to-br from-amber-700 to-amber-950" />

        {/* Label */}
        <div className="font-['Special_Elite'] text-[10px] md:text-xs text-amber-200/50 uppercase tracking-[0.1em] mb-3">
          Top 3 Countries by Nodes
        </div>

        {/* Countries list */}
        <div className="space-y-2.5">
          {countries.map((item, index) => (
            <div key={item.country} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-['Special_Elite'] text-xs text-amber-500/60">
                  {index + 1}.
                </span>
                <span className="font-['Special_Elite'] text-sm md:text-base text-amber-200/80 tracking-wide">
                  {item.country}
                </span>
              </div>
              <div className="font-['Orbitron'] text-base md:text-lg text-orange-400 tabular-nums drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]">
                {item.nodes.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Sub-label */}
        <div className="font-['Special_Elite'] text-[9px] md:text-[10px] text-amber-200/30 mt-3 tracking-wide">
          Global distribution of nodes
        </div>
      </div>
    </div>
  );
}

export function NetworkResilienceSection({ data, isLive = false, className }: NetworkResilienceSectionProps) {
  return (
    <div className={cn("", className)}>
      <SectionHeader title="Network Resilience" isLive={isLive} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <StatCard
          label="Total Reachable Nodes"
          value={data.totalNodes}
          color="green"
          size="lg"
          smoothTransition={isLive}
          animate={!isLive}
          animationSpeed={60000}
          direction="up"
          subLabel="Running Bitcoin Core globally"
        />

        <TopCountriesCard countries={data.topCountries} />

        <StatCard
          label="51% Attack Cost"
          value={data.attackCostBillion}
          decimals={1}
          prefix="$"
          suffix="B/yr"
          color="orange"
          size="lg"
          smoothTransition={isLive}
          subLabel="Annual cost to attack network"
        />
      </div>
    </div>
  );
}
