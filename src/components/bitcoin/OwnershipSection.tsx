import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";
import { DigitalDisplay } from "./DigitalDisplay";

interface OwnershipSectionProps {
  data: {
    governments: number;
    governmentsPercent: number;
    institutions: number;
    institutionsPercent: number;
    exchanges: number;
    exchangesPercent: number;
    retail: number;
    retailPercent: number;
    etfDailyInflow: number;
  };
  className?: string;
}

export function OwnershipSection({ data, className }: OwnershipSectionProps) {
  const isInflowPositive = data.etfDailyInflow >= 0;

  return (
    <div className={cn("", className)}>
      <SectionHeader title="Ownership Distribution" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <StatCard
          label="Governments"
          value={data.governments}
          suffix=" BTC"
          size="sm"
          subLabel={`${data.governmentsPercent}% of supply`}
        />
        <StatCard
          label="Institutions / ETFs"
          value={data.institutions}
          suffix=" BTC"
          size="sm"
          animate={true}
          animationSpeed={10000}
          direction="up"
          subLabel={`${data.institutionsPercent}% of supply`}
        />
        <StatCard
          label="Exchanges"
          value={data.exchanges}
          suffix=" BTC"
          size="sm"
          animate={true}
          animationSpeed={5000}
          direction="down"
          subLabel={`${data.exchangesPercent}% of supply`}
        />
        <StatCard
          label="Retail / Other"
          value={data.retail}
          suffix=" BTC"
          size="sm"
          animate={true}
          animationSpeed={8000}
          direction="up"
          subLabel={`${data.retailPercent}% of supply`}
        />

        {/* ETF Daily Inflow - special vintage gauge styling */}
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-md bg-gradient-to-b from-amber-800/20 to-amber-950/20 blur-sm" />
          <div
            className={cn(
              "relative rounded-md p-3 md:p-4",
              "bg-gradient-to-b from-stone-900/95 via-stone-950 to-stone-900/95",
              "border border-amber-900/40",
              "shadow-[inset_0_1px_10px_rgba(0,0,0,0.4)]"
            )}
          >
            {/* Small corner rivets */}
            <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-gradient-to-br from-amber-700 to-amber-950" />
            <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-gradient-to-br from-amber-700 to-amber-950" />

            <div className="font-['Special_Elite'] text-[10px] md:text-xs text-amber-200/50 uppercase tracking-[0.1em] mb-2">
              ETF Daily Flow
            </div>

            <div className="relative px-2 py-1.5 rounded-sm bg-black/50 border border-amber-900/20 shadow-[inset_0_1px_5px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "font-['Nixie_One'] text-lg md:text-xl",
                    isInflowPositive
                      ? "text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]"
                      : "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]"
                  )}
                >
                  {isInflowPositive ? "+" : "-"}
                </span>
                <DigitalDisplay
                  value={Math.abs(data.etfDailyInflow)}
                  decimals={0}
                  prefix="$"
                  suffix="M"
                  size="sm"
                  animate={true}
                  animationSpeed={3000}
                  direction={isInflowPositive ? "up" : "down"}
                  flickerIntensity="low"
                />
              </div>
            </div>

            <div className="font-['Special_Elite'] text-[9px] md:text-[10px] text-amber-200/30 mt-2 tracking-wide">
              {isInflowPositive ? "Net buying pressure" : "Net selling pressure"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
