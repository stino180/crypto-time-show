import { cn } from "@/lib/utils";
import { DigitalDisplay } from "./DigitalDisplay";

interface StatCardProps {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "orange" | "amber" | "red" | "green" | "white";
  animate?: boolean;
  animationSpeed?: number;
  direction?: "up" | "down";
  smoothTransition?: boolean;
  transitionDuration?: number;
  subLabel?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  size = "sm",
  animate = false,
  animationSpeed = 100,
  direction = "up",
  smoothTransition = false,
  transitionDuration = 1000,
  subLabel,
  className,
}: StatCardProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Subtle brass frame glow */}
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

        {/* Label */}
        <div className="font-['Special_Elite'] text-[10px] md:text-xs text-amber-200/50 uppercase tracking-[0.1em] mb-2">
          {label}
        </div>

        {/* Value */}
        <DigitalDisplay
          value={value}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          size={size}
          animate={animate}
          animationSpeed={animationSpeed}
          direction={direction}
          smoothTransition={smoothTransition}
          transitionDuration={transitionDuration}
          flickerIntensity="low"
        />

        {/* Sub-label */}
        {subLabel && (
          <div className="font-['Special_Elite'] text-[9px] md:text-[10px] text-amber-200/30 mt-2 tracking-wide">
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  isLive?: boolean;
  className?: string;
}

export function SectionHeader({ title, isLive, className }: SectionHeaderProps) {
  return (
    <div className={cn("relative mb-4 md:mb-5", className)}>
      <div className="flex items-center gap-3">
        {/* Decorative brass element */}
        <div className="w-8 h-0.5 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full" />

        <h2 className="font-['Special_Elite'] text-sm md:text-base uppercase tracking-[0.2em] text-amber-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.4)]">
          {title}
        </h2>

        {isLive && (
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
            <span className="font-['Special_Elite'] text-[9px] text-orange-400/60 uppercase tracking-wider">Live</span>
          </div>
        )}

        {/* Extending line */}
        <div className="flex-1 h-px bg-gradient-to-r from-amber-700/40 to-transparent" />
      </div>
    </div>
  );
}
