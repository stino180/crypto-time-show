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
  const duplicatedFacts = [...bitcoinFacts, ...bitcoinFacts];

  return (
    <div className={cn("relative", className)}>
      <div className="absolute -inset-0.5 stpk-glow blur-sm rounded" />

      <div className={cn("relative overflow-hidden rounded stpk-ticker")}>
        {/* Top brass trim */}
        <div className="absolute top-0 left-0 right-0 h-0.5 stpk-trim" />

        {/* Corner rivets */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full stpk-rivet shadow-inner z-10" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full stpk-rivet shadow-inner z-10" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full stpk-rivet shadow-inner z-10" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full stpk-rivet shadow-inner z-10" />

        <div className="relative py-2.5 md:py-3 px-4">
          <div className="absolute left-0 top-0 bottom-0 w-12 stpk-ticker-fade-left z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 stpk-ticker-fade-right z-10 pointer-events-none" />

          <div className="flex ticker-scroll">
            {duplicatedFacts.map((fact, index) => (
              <div key={index} className="flex items-center shrink-0">
                <span className="stpk-ticker-btc font-bold mx-4 md:mx-6 text-sm md:text-base">₿</span>
                <span className={cn("font-['Special_Elite'] text-xs md:text-sm whitespace-nowrap stpk-ticker-text")}>
                  {fact}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 stpk-trim opacity-70" />
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll { animation: ticker-scroll 120s linear infinite; }
        .ticker-scroll:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}

export default TickerTape;
