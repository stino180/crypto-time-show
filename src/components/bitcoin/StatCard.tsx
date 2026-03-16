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
      <div className="absolute -inset-0.5 rounded-md stpk-glow blur-sm" />

      <div className={cn("relative rounded-md p-3 md:p-4 stpk-panel")}>
        {/* Small corner rivets */}
        <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full stpk-rivet" />
        <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full stpk-rivet" />

        <div className="font-['Special_Elite'] text-[10px] md:text-xs stpk-label uppercase tracking-[0.1em] mb-2">
          {label}
        </div>

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

        {subLabel && (
          <div className="font-['Special_Elite'] text-[9px] md:text-[10px] stpk-sublabel mt-2 tracking-wide">
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
        <div className="w-8 h-0.5 stpk-trim rounded-full" />

        <h2 className="font-['Special_Elite'] text-sm md:text-base uppercase tracking-[0.2em] stpk-heading-sm">
          {title}
        </h2>

        {isLive && (
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-1.5 h-1.5 rounded-full stpk-live-dot animate-pulse" />
            <span className="text-[9px] font-['Special_Elite'] stpk-live-text uppercase tracking-wider">Live</span>
          </div>
        )}

        <div className="flex-1 h-px stpk-line" />
      </div>
    </div>
  );
}
