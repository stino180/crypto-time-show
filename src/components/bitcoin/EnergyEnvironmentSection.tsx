import { cn } from "@/lib/utils";
import { StatCard, SectionHeader } from "./StatCard";

interface EnergyEnvironmentSectionProps {
  data: {
    bitcoinEnergy: number; // TWh/year
    bankingEnergy: number; // TWh/year
    energySavings: number; // TWh saved (or percentage)
    methaneMitigated: number; // Million tons CO2 equivalent/year
  };
  className?: string;
}

export function EnergyEnvironmentSection({ data, className }: EnergyEnvironmentSectionProps) {
  return (
    <div className={cn("", className)}>
      <SectionHeader title="ENERGY & ENVIRONMENT" />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        <StatCard
          label="Bitcoin Energy Usage"
          value={data.bitcoinEnergy}
          suffix=" TWh/yr"
          color="amber"
          size="sm"
          subLabel="100% transparent"
        />
        <StatCard
          label="Traditional Banking Energy"
          value={data.bankingEnergy}
          suffix=" TWh/yr"
          color="red"
          size="sm"
          subLabel="Estimated"
        />
        <StatCard
          label="BTC vs Banking"
          value={data.energySavings}
          suffix="% less"
          color="green"
          size="sm"
          subLabel="Energy efficiency gain"
        />
        <StatCard
          label="Methane Mitigated"
          value={data.methaneMitigated}
          decimals={1}
          suffix="M tons CO2/yr"
          color="green"
          size="sm"
          subLabel="Flared gas mining benefit"
        />
      </div>
    </div>
  );
}
