import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface DigitalDisplayProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "orange" | "amber" | "red" | "green" | "white";
  animate?: boolean;
  animationSpeed?: number;
  direction?: "up" | "down";
  flickerIntensity?: "none" | "low" | "medium" | "high";
  smoothTransition?: boolean;
  transitionDuration?: number;
  className?: string;
}

const sizeClasses = {
  sm: "text-base md:text-lg",
  md: "text-lg md:text-xl",
  lg: "text-xl md:text-2xl",
  xl: "text-2xl md:text-3xl lg:text-4xl",
};

// Easing function for smooth animation
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function DigitalDisplay({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  size = "md",
  animate = false,
  animationSpeed = 100,
  direction = "up",
  flickerIntensity = "none",
  smoothTransition = false,
  transitionDuration = 1000,
  className,
}: DigitalDisplayProps) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const transitionRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(value);
  const targetValueRef = useRef<number>(value);
  const startTimeRef = useRef<number>(0);
  const initializedRef = useRef<boolean>(false);

  const animateToValue = useCallback(
    (targetValue: number, fromValue: number) => {
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }

      startValueRef.current = fromValue;
      targetValueRef.current = targetValue;
      startTimeRef.current = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / transitionDuration, 1);
        const easedProgress = easeOutCubic(progress);

        const newValue =
          startValueRef.current +
          (targetValueRef.current - startValueRef.current) * easedProgress;

        setDisplayValue(newValue);

        if (progress < 1) {
          transitionRef.current = requestAnimationFrame(step);
        }
      };

      transitionRef.current = requestAnimationFrame(step);
    },
    [transitionDuration]
  );

  // Initialize with the value immediately on first render
  useEffect(() => {
    if (!initializedRef.current) {
      setDisplayValue(value);
      initializedRef.current = true;
    }
  }, [value]);

  // Handle value changes with smooth transition
  useEffect(() => {
    if (!initializedRef.current) return;

    if (smoothTransition && value !== displayValue) {
      animateToValue(value, displayValue);
    } else if (!smoothTransition && !animate) {
      setDisplayValue(value);
    }

    return () => {
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }
    };
  }, [value, smoothTransition, animate, animateToValue]);

  const formattedValue = displayValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div
      className={cn(
        "inline-flex items-baseline gap-1 flex-wrap",
        className
      )}
    >
      {prefix && (
        <span className={cn(
          "text-orange-300/70 font-['Nixie_One']",
          sizeClasses[size]
        )}>
          {prefix}
        </span>
      )}
      <span
        className={cn(
          "font-['Nixie_One'] tabular-nums text-orange-400",
          "drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]",
          "drop-shadow-[0_0_16px_rgba(251,146,60,0.5)]",
          sizeClasses[size]
        )}
      >
        {formattedValue}
      </span>
      {suffix && (
        <span className="text-amber-200/50 font-['Special_Elite'] text-[0.6em] uppercase tracking-wider ml-1">
          {suffix}
        </span>
      )}
    </div>
  );
}

// Countdown timer variant
interface CountdownDisplayProps {
  targetDate: Date;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function CountdownDisplay({
  targetDate,
  size = "lg",
  className,
}: CountdownDisplayProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const padNumber = (num: number) => num.toString().padStart(2, "0");

  const textSizes = {
    sm: "text-lg md:text-xl",
    md: "text-xl md:text-2xl",
    lg: "text-2xl md:text-3xl",
    xl: "text-3xl md:text-4xl",
  };

  const labelSizes = {
    sm: "text-[8px]",
    md: "text-[9px]",
    lg: "text-[10px]",
    xl: "text-xs",
  };

  return (
    <div className={cn("flex items-end gap-1 md:gap-2 flex-wrap", className)}>
      {/* Days */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "font-['Nixie_One'] tabular-nums text-orange-400 nixie-flicker",
            "drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]",
            textSizes[size]
          )}
        >
          {timeLeft.days}
        </span>
        <span className={cn("text-amber-200/40 font-['Special_Elite'] uppercase tracking-wider", labelSizes[size])}>
          days
        </span>
      </div>

      <span className={cn("text-orange-400/50 font-['Nixie_One'] pb-4", textSizes[size])}>:</span>

      {/* Hours */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "font-['Nixie_One'] tabular-nums text-orange-400 nixie-flicker",
            "drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]",
            textSizes[size]
          )}
        >
          {padNumber(timeLeft.hours)}
        </span>
        <span className={cn("text-amber-200/40 font-['Special_Elite'] uppercase tracking-wider", labelSizes[size])}>
          hrs
        </span>
      </div>

      <span className={cn("text-orange-400/50 font-['Nixie_One'] pb-4", textSizes[size])}>:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "font-['Nixie_One'] tabular-nums text-orange-400 nixie-flicker",
            "drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]",
            textSizes[size]
          )}
        >
          {padNumber(timeLeft.minutes)}
        </span>
        <span className={cn("text-amber-200/40 font-['Special_Elite'] uppercase tracking-wider", labelSizes[size])}>
          min
        </span>
      </div>

      <span className={cn("text-orange-400/50 font-['Nixie_One'] pb-4", textSizes[size])}>:</span>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "font-['Nixie_One'] tabular-nums text-orange-400 nixie-flicker",
            "drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]",
            textSizes[size]
          )}
        >
          {padNumber(timeLeft.seconds)}
        </span>
        <span className={cn("text-amber-200/40 font-['Special_Elite'] uppercase tracking-wider", labelSizes[size])}>
          sec
        </span>
      </div>
    </div>
  );
}
