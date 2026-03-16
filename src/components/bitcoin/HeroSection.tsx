import { cn } from "@/lib/utils";
import { DigitalDisplay, CountdownDisplay } from "./DigitalDisplay";
import { Pickaxe, Clock, DollarSign } from "lucide-react";

interface HeroSectionProps {
  remainingBtc: number;
  currentPrice: number;
  satsPerDollar: number;
  halvingDate: Date;
  isLive?: boolean;
  className?: string;
}

export function HeroSection({
  remainingBtc,
  currentPrice,
  satsPerDollar,
  halvingDate,
  isLive = false,
  className,
}: HeroSectionProps) {
  return (
    <div className={cn("grid gap-4 md:gap-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <GaugePanel label="BTC Remaining to Mine" isLive={isLive} icon={<Pickaxe className="w-4 h-4" />}>
          <DigitalDisplay value={remainingBtc} decimals={0} suffix="BTC" size="lg" smoothTransition={isLive} transitionDuration={1500} animate={!isLive} animationSpeed={5000} direction="down" flickerIntensity="low" />
          <div className="font-['Special_Elite'] text-xs stpk-sublabel mt-3 tracking-wide">
            of 21,000,000 total supply
          </div>
        </GaugePanel>

        <GaugePanel label="Next Halving Countdown" icon={<Clock className="w-4 h-4" />}>
          <CountdownDisplay targetDate={halvingDate} size="md" />
          <div className="font-['Special_Elite'] text-xs stpk-sublabel mt-3 tracking-wide">
            Block reward: 3.125 → 1.5625 BTC
          </div>
        </GaugePanel>

        <GaugePanel label="Bitcoin Price" isLive={isLive} icon={<DollarSign className="w-4 h-4" />}>
          <DigitalDisplay value={currentPrice} decimals={0} prefix="$" size="lg" smoothTransition={isLive} transitionDuration={800} animate={!isLive} animationSpeed={500} direction="up" flickerIntensity="low" />
          <div className="flex items-center gap-2 mt-3">
            <span className="stpk-sublabel font-['Special_Elite']">=</span>
            <DigitalDisplay value={satsPerDollar} decimals={0} suffix="sats/$" size="sm" smoothTransition={isLive} transitionDuration={800} animate={!isLive} animationSpeed={500} direction="down" />
          </div>
        </GaugePanel>
      </div>
    </div>
  );
}

interface GaugePanelProps {
  label: string;
  children: React.ReactNode;
  isLive?: boolean;
  icon?: React.ReactNode;
}

function GaugePanel({ label, children, isLive, icon }: GaugePanelProps) {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-lg stpk-glow blur-sm" />

      <div className={cn("relative rounded-lg p-5 md:p-6 stpk-gauge")}>
        {/* Top brass trim */}
        <div className="absolute top-0 left-4 right-4 h-0.5 stpk-trim" />

        {/* Corner rivets */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full stpk-rivet shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full stpk-rivet shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full stpk-rivet shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full stpk-rivet shadow-inner" />

        {/* Label plate */}
        <div className="flex items-center gap-2 mb-4">
          {icon && <div className="stpk-label">{icon}</div>}
          <div className="font-['Special_Elite'] text-[11px] md:text-xs uppercase tracking-[0.15em] stpk-label">
            {label}
          </div>
          {isLive && (
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full stpk-live-dot animate-pulse" />
              <span className="text-[9px] font-['Special_Elite'] stpk-live-text uppercase tracking-wider">Live</span>
            </div>
          )}
        </div>

        {/* Display area */}
        <div className="relative p-3 rounded stpk-display">
          {children}
        </div>

        {/* Bottom brass trim */}
        <div className="absolute bottom-0 left-4 right-4 h-0.5 stpk-trim opacity-60" />
      </div>
    </div>
  );
}
