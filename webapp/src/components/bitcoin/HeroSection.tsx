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
      {/* Main hero stats - vintage gauge panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Remaining BTC to Mine */}
        <GaugePanel
          label="BTC Remaining to Mine"
          isLive={isLive}
          icon={<Pickaxe className="w-4 h-4" />}
        >
          <DigitalDisplay
            value={remainingBtc}
            decimals={0}
            suffix="BTC"
            size="lg"
            smoothTransition={isLive}
            transitionDuration={1500}
            animate={!isLive}
            animationSpeed={5000}
            direction="down"
            flickerIntensity="low"
          />
          <div className="font-['Special_Elite'] text-xs text-amber-200/40 mt-3 tracking-wide">
            of 21,000,000 total supply
          </div>
        </GaugePanel>

        {/* Halving Countdown */}
        <GaugePanel
          label="Next Halving Countdown"
          icon={<Clock className="w-4 h-4" />}
        >
          <CountdownDisplay
            targetDate={halvingDate}
            size="md"
          />
          <div className="font-['Special_Elite'] text-xs text-amber-200/40 mt-3 tracking-wide">
            Block reward: 3.125 → 1.5625 BTC
          </div>
        </GaugePanel>

        {/* Current Price */}
        <GaugePanel
          label="Bitcoin Price"
          isLive={isLive}
          icon={<DollarSign className="w-4 h-4" />}
        >
          <DigitalDisplay
            value={currentPrice}
            decimals={0}
            prefix="$"
            size="lg"
            smoothTransition={isLive}
            transitionDuration={800}
            animate={!isLive}
            animationSpeed={500}
            direction="up"
            flickerIntensity="low"
          />
          <div className="flex items-center gap-2 mt-3">
            <span className="text-amber-200/30 font-['Special_Elite']">=</span>
            <DigitalDisplay
              value={satsPerDollar}
              decimals={0}
              suffix="sats/$"
              size="sm"
              smoothTransition={isLive}
              transitionDuration={800}
              animate={!isLive}
              animationSpeed={500}
              direction="down"
            />
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
      {/* Outer brass frame */}
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-b from-amber-700/40 via-amber-900/30 to-amber-950/40 blur-sm" />

      <div
        className={cn(
          "relative rounded-lg p-5 md:p-6",
          "bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900",
          "border-2 border-amber-800/50",
          "shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),inset_0_-2px_20px_rgba(120,80,40,0.1)]"
        )}
      >
        {/* Top brass trim */}
        <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />

        {/* Corner rivets */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 shadow-inner" />

        {/* Label plate */}
        <div className="flex items-center gap-2 mb-4">
          {icon && (
            <div className="text-amber-500/70">
              {icon}
            </div>
          )}
          <div className="font-['Special_Elite'] text-[11px] md:text-xs uppercase tracking-[0.15em] text-amber-200/60">
            {label}
          </div>
          {isLive && (
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
              <span className="text-[9px] font-['Special_Elite'] text-orange-400/60 uppercase tracking-wider">Live</span>
            </div>
          )}
        </div>

        {/* Display area - recessed panel look */}
        <div className="relative p-3 rounded bg-black/60 border border-amber-900/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          {children}
        </div>

        {/* Bottom brass trim */}
        <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
      </div>
    </div>
  );
}
