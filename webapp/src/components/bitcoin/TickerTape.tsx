import { cn } from "@/lib/utils";

interface TickerTapeProps {
  className?: string;
}

const bitcoinFacts = [
  "Did you know? The 21 millionth Bitcoin will be mined in the year 2140.",
  "Current cost to 51% attack the network: $10.5 Billion per year (Virtually Impossible)",
  "Bitcoin has been running for over 15 years with 99.98% uptime.",
  "Satoshi Nakamoto's identity remains unknown since 2008.",
  "Every 10 minutes, a new block is added to Bitcoin's immutable ledger.",
  "There are only 21 million Bitcoin that will ever exist.",
  "Bitcoin settles more value daily than most traditional payment networks.",
  "Over 19.5 million Bitcoin have already been mined.",
];

export function TickerTape({ className }: TickerTapeProps) {
  // Duplicate the facts to create seamless loop
  const duplicatedFacts = [...bitcoinFacts, ...bitcoinFacts];

  return (
    <div className={cn("relative", className)}>
      {/* Outer brass frame glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-700/30 via-amber-800/40 to-amber-700/30 blur-sm rounded" />

      {/* Main ticker container */}
      <div
        className={cn(
          "relative overflow-hidden rounded",
          "bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900",
          "border-2 border-amber-800/50",
          "shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Top brass trim */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-700/30 via-amber-600/50 to-amber-700/30" />

        {/* Corner rivets */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 shadow-inner z-10" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 shadow-inner z-10" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 shadow-inner z-10" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 shadow-inner z-10" />

        {/* Ticker content area */}
        <div className="relative py-2.5 md:py-3 px-4">
          {/* Fade edges for smooth visual */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-stone-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-stone-950 to-transparent z-10 pointer-events-none" />

          {/* Scrolling content */}
          <div className="flex ticker-scroll">
            {duplicatedFacts.map((fact, index) => (
              <div key={index} className="flex items-center shrink-0">
                {/* Bitcoin symbol separator */}
                <span className="text-amber-500 font-bold mx-4 md:mx-6 text-sm md:text-base drop-shadow-[0_0_6px_rgba(251,146,60,0.6)]">
                  ₿
                </span>
                {/* Fact text */}
                <span
                  className={cn(
                    "font-['Special_Elite'] text-xs md:text-sm whitespace-nowrap",
                    "text-orange-400/90",
                    "drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                  )}
                >
                  {fact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom brass trim */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-700/30 via-amber-600/40 to-amber-700/30" />
      </div>

      {/* Inline styles for the ticker animation */}
      <style>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-scroll {
          animation: ticker-scroll 120s linear infinite;
        }

        .ticker-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default TickerTape;
