import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";
import { DigitalDisplay } from "./DigitalDisplay";

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

function TopCountriesCard({ countries }: { countries: CountryNode[] }) {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-md stpk-glow blur-sm" />
      <div className={cn("relative rounded-md p-4 md:p-5 h-full stpk-panel")}>
        <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full stpk-rivet" />
        <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full stpk-rivet" />

        <div className="font-['Special_Elite'] text-[10px] md:text-xs stpk-label uppercase tracking-[0.1em] mb-3">
          Top 3 Countries by Nodes
        </div>

        <div className="space-y-2.5">
          {countries.map((item, index) => (
            <div key={item.country} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-['Special_Elite'] text-xs stpk-sublabel">{index + 1}.</span>
                <span className="font-['Special_Elite'] text-sm md:text-base stpk-label tracking-wide">{item.country}</span>
              </div>
              <div className="font-['Orbitron'] text-base md:text-lg stpk-nixie tabular-nums">
                {item.nodes.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="font-['Special_Elite'] text-[9px] md:text-[10px] stpk-sublabel mt-3 tracking-wide">
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
        <StatCard label="Total Reachable Nodes" value={data.totalNodes} color="green" size="lg" smoothTransition={isLive} animate={!isLive} animationSpeed={60000} direction="up" subLabel="Running Bitcoin Core globally" />
        <TopCountriesCard countries={data.topCountries} />
        <StatCard label="51% Attack Cost" value={data.attackCostBillion} decimals={1} prefix="$" suffix="B/yr" color="orange" size="lg" smoothTransition={isLive} subLabel="Annual cost to attack network" />
      </div>
    </div>
  );
}
