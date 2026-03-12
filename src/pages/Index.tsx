import { HeroSection } from "@/components/bitcoin/HeroSection";
import { PriceChart } from "@/components/bitcoin/PriceChart";
import { BitcoinGlobe } from "@/components/bitcoin/BitcoinGlobe";
import { ScarcitySection } from "@/components/bitcoin/ScarcitySection";
import { NetworkHealthSection } from "@/components/bitcoin/NetworkHealthSection";
import { OwnershipSection } from "@/components/bitcoin/OwnershipSection";
import { GlobalContextSection } from "@/components/bitcoin/GlobalContextSection";
import { NetworkResilienceSection } from "@/components/bitcoin/NetworkResilienceSection";
import { HardAssetsSection } from "@/components/bitcoin/HardAssetsSection";
import { CensorshipResistanceSection } from "@/components/bitcoin/CensorshipResistanceSection";
import { EnergyEnvironmentSection } from "@/components/bitcoin/EnergyEnvironmentSection";
import { SocialAdoptionSection } from "@/components/bitcoin/SocialAdoptionSection";
import { TickerTape } from "@/components/bitcoin/TickerTape";
import { BlogSection } from "@/components/bitcoin/BlogSection";
import {
  useBitcoinData,
  calculateRemainingBTC,
  calculateNextHalvingDate,
  getCurrentBlockReward,
} from "@/hooks/useBitcoinData";

// Simulated data for stats without free APIs
const SIMULATED_DATA = {
  scarcity: {
    lostSupply: 3700000,
    satoshiCoins: 1100000,
    zombieCoins: 1800000,
    usdInflation: 3.2,
    liquidSupply: 4200000,
    illiquidSupply: 15400000,
  },
  ownership: {
    governments: 500000,
    governmentsPercent: 2.5,
    institutions: 1100000,
    institutionsPercent: 5.6,
    exchanges: 2300000,
    exchangesPercent: 11.7,
    retail: 15800000,
    retailPercent: 80.2,
    etfDailyInflow: 250,
  },
  global: {
    goldMarketCap: 17.5,
    btcPerHuman: 0.00259,
    wholecoiners: 1020000,
    nationStateAdoption: 3,
    miningRenewable: 56,
  },
  resilience: {
    totalNodes: 17850,
    topCountries: [
      { country: "USA", nodes: 5240 },
      { country: "Germany", nodes: 2180 },
      { country: "France", nodes: 1450 },
    ],
    attackCostBillion: 10.5,
  },
  hardAssets: {
    globalRealEstate: 370,
    globalM2: 105,
    medianHomePrice: 420000,
  },
  censorship: {
    transactions24h: 485000,
    blockSpaceUtilization: 97.2,
    valueSettled24h: 18.5,
  },
  energy: {
    bitcoinEnergy: 160,
    bankingEnergy: 260,
    energySavings: 38,
    methaneMitigated: 2.5,
  },
  adoption: {
    nonZeroAddresses: 52400000,
    lightningCapacity: 5280,
    lightningChannels: 62500,
  },
};

// Fallback values when API data is not yet loaded
const FALLBACK_DATA = {
  price: 104000,
  blockHeight: 880000,
  hashrate: 650,
  difficulty: 110.5,
  feeFast: 25,
  feeMedium: 15,
  feeSlow: 5,
  mempoolSize: 150000,
  blocksUntilAdjustment: 1200,
  marketCap: 2.05,
};

const Index = () => {
  const { price, network, isLoading, lastUpdated } = useBitcoinData();

  // Calculate derived values from real data or use fallbacks
  const currentPrice = price?.price ?? FALLBACK_DATA.price;
  const satsPerDollar = price?.satsPerDollar ?? Math.round(100_000_000 / FALLBACK_DATA.price);
  const blockHeight = network?.blockHeight ?? FALLBACK_DATA.blockHeight;
  const remainingBtc = blockHeight ? calculateRemainingBTC(blockHeight) : calculateRemainingBTC(FALLBACK_DATA.blockHeight);
  const halvingDate = blockHeight ? calculateNextHalvingDate(blockHeight) : calculateNextHalvingDate(FALLBACK_DATA.blockHeight);
  const currentReward = blockHeight ? getCurrentBlockReward(blockHeight) : getCurrentBlockReward(FALLBACK_DATA.blockHeight);
  const nextReward = currentReward / 2;

  // Calculate annual inflation based on current block reward
  // Blocks per year: ~52560 (365.25 * 24 * 6)
  const blocksPerYear = 52560;
  const minedSupply = 21_000_000 - remainingBtc;
  const annualNewBtc = blocksPerYear * currentReward;
  const annualInflation = (annualNewBtc / minedSupply) * 100;

  // Build data objects combining real and simulated data
  const heroData = {
    remainingBtc,
    currentPrice,
    satsPerDollar,
    halvingDate,
    currentReward,
    nextReward,
  };

  const scarcityData = {
    totalSupply: 21_000_000,
    minedSupply,
    lostSupply: SIMULATED_DATA.scarcity.lostSupply,
    satoshiCoins: SIMULATED_DATA.scarcity.satoshiCoins,
    zombieCoins: SIMULATED_DATA.scarcity.zombieCoins,
    annualInflation,
    usdInflation: SIMULATED_DATA.scarcity.usdInflation,
    liquidSupply: SIMULATED_DATA.scarcity.liquidSupply,
    illiquidSupply: SIMULATED_DATA.scarcity.illiquidSupply,
  };

  const networkData = {
    hashrate: network?.hashrate ?? FALLBACK_DATA.hashrate,
    blockHeight,
    mempoolSize: network?.mempoolSize ?? FALLBACK_DATA.mempoolSize,
    feeFast: network?.feeFast ?? FALLBACK_DATA.feeFast,
    feeMedium: network?.feeMedium ?? FALLBACK_DATA.feeMedium,
    feeSlow: network?.feeSlow ?? FALLBACK_DATA.feeSlow,
    blocksUntilAdjustment: network?.blocksUntilAdjustment ?? FALLBACK_DATA.blocksUntilAdjustment,
    difficulty: network?.difficulty ?? FALLBACK_DATA.difficulty,
  };

  const globalData = {
    btcMarketCap: price?.marketCap ?? FALLBACK_DATA.marketCap,
    goldMarketCap: SIMULATED_DATA.global.goldMarketCap,
    btcAsPercentOfGold: ((price?.marketCap ?? FALLBACK_DATA.marketCap) / SIMULATED_DATA.global.goldMarketCap) * 100,
    btcPerHuman: SIMULATED_DATA.global.btcPerHuman,
    wholecoiners: SIMULATED_DATA.global.wholecoiners,
    nationStateAdoption: SIMULATED_DATA.global.nationStateAdoption,
    miningRenewable: SIMULATED_DATA.global.miningRenewable,
  };

  // New section data
  const resilienceData = {
    totalNodes: SIMULATED_DATA.resilience.totalNodes,
    topCountries: SIMULATED_DATA.resilience.topCountries,
    attackCostBillion: SIMULATED_DATA.resilience.attackCostBillion,
  };

  const btcMarketCapTrillion = price?.marketCap ?? FALLBACK_DATA.marketCap;
  const hardAssetsData = {
    btcMarketCap: btcMarketCapTrillion,
    globalRealEstate: SIMULATED_DATA.hardAssets.globalRealEstate,
    btcVsRealEstate: (btcMarketCapTrillion / SIMULATED_DATA.hardAssets.globalRealEstate) * 100,
    globalM2: SIMULATED_DATA.hardAssets.globalM2,
    btcVsM2: (btcMarketCapTrillion / SIMULATED_DATA.hardAssets.globalM2) * 100,
    medianHomePrice: SIMULATED_DATA.hardAssets.medianHomePrice,
    homeInBtc: SIMULATED_DATA.hardAssets.medianHomePrice / currentPrice,
  };

  const censorshipData = {
    transactions24h: SIMULATED_DATA.censorship.transactions24h,
    blockSpaceUtilization: SIMULATED_DATA.censorship.blockSpaceUtilization,
    valueSettled24h: SIMULATED_DATA.censorship.valueSettled24h,
  };

  const energyData = {
    bitcoinEnergy: SIMULATED_DATA.energy.bitcoinEnergy,
    bankingEnergy: SIMULATED_DATA.energy.bankingEnergy,
    energySavings: SIMULATED_DATA.energy.energySavings,
    methaneMitigated: SIMULATED_DATA.energy.methaneMitigated,
  };

  const adoptionData = {
    nonZeroAddresses: SIMULATED_DATA.adoption.nonZeroAddresses,
    lightningCapacity: SIMULATED_DATA.adoption.lightningCapacity,
    lightningChannels: SIMULATED_DATA.adoption.lightningChannels,
  };

  // Determine if we have live data
  const hasLiveData = !isLoading && (price !== null || network !== null);

  return (
    <div className="relative min-h-screen bg-stone-950 overflow-hidden">
      {/* Warm ambient glow effects - like light from nixie tubes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/8 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/6 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-400/4 blur-[180px] rounded-full" />
      </div>

      {/* Subtle vignette effect */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 px-4 md:px-8 py-6 md:py-8 max-w-[1800px] mx-auto">
        {/* Header - vintage control panel style */}
        <header className="mb-8 md:mb-10">
          <div className="relative inline-block w-full">
            {/* Brass plate backing */}
            <div className="absolute -inset-2 bg-gradient-to-b from-amber-800/20 via-amber-900/10 to-amber-950/20 blur-md rounded-lg" />

            <div className="relative text-center py-4">
              {/* Main title */}
              <h1 className="font-['Nixie_One'] text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] text-orange-400 drop-shadow-[0_0_30px_rgba(251,146,60,0.5)]">
                BITCOIN CLOCK
              </h1>

              {/* Decorative line with brass styling */}
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
                <div className="w-2 h-2 rotate-45 bg-amber-600/40" />
                <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
              </div>

              <p className="font-['Special_Elite'] text-xs md:text-sm text-amber-200/40 mt-3 tracking-[0.3em] uppercase">
                Real-Time Network Statistics
              </p>

              {/* Live indicator - styled like a small pilot light */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="relative">
                  <div className={`w-2.5 h-2.5 rounded-full ${hasLiveData ? "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)]" : "bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]"}`} />
                  {hasLiveData && (
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping opacity-50" />
                  )}
                </div>
                <span className={`font-['Special_Elite'] text-[10px] md:text-xs uppercase tracking-[0.2em] ${hasLiveData ? "text-orange-400/70" : "text-amber-600/70"}`}>
                  {isLoading ? "Connecting..." : hasLiveData ? "Live Feed" : "Cached Data"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard sections */}
        <div className="space-y-8 md:space-y-10">
          {/* Hero Section - Main stats */}
          <HeroSection
            remainingBtc={heroData.remainingBtc}
            currentPrice={heroData.currentPrice}
            satsPerDollar={heroData.satsPerDollar}
            halvingDate={heroData.halvingDate}
            isLive={hasLiveData}
          />

          {/* Price History Chart */}
          <PriceChart />

          {/* Global BTC Distribution Globe */}
          <BitcoinGlobe />

          {/* Two-column layout for middle sections on larger screens */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
            {/* Scarcity Metrics */}
            <ScarcitySection data={scarcityData} />

            {/* Network Health */}
            <NetworkHealthSection data={networkData} isLive={hasLiveData} />
          </div>

          {/* Ownership Distribution */}
          <OwnershipSection data={SIMULATED_DATA.ownership} />

          {/* Global Context */}
          <GlobalContextSection data={globalData} />

          {/* Network Resilience - Decentralization stats */}
          <NetworkResilienceSection data={resilienceData} isLive={hasLiveData} />

          {/* Hard Assets Comparison */}
          <HardAssetsSection data={hardAssetsData} />

          {/* Censorship Resistance Stats */}
          <CensorshipResistanceSection data={censorshipData} isLive={hasLiveData} />

          {/* Energy & Environment */}
          <EnergyEnvironmentSection data={energyData} />

          {/* Social & Adoption Pulse */}
          <SocialAdoptionSection data={adoptionData} isLive={hasLiveData} />

          {/* AI News Blog */}
          <BlogSection />
        </div>

        {/* Ticker Tape - Scrolling facts */}
        <TickerTape className="mt-10 md:mt-14" />

        {/* Footer - vintage plate style */}
        <footer className="mt-10 md:mt-14 text-center pb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-800/10 to-amber-950/10 blur-sm rounded-md" />
            <div className="relative inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-3 border border-amber-900/30 rounded-md bg-stone-950/80">
              <div className="flex items-center gap-3">
                <span className="font-['Special_Elite'] text-[10px] md:text-xs text-orange-400/50 tracking-wide">
                  Price & Network: Live API
                </span>
                <span className="text-amber-700/30">|</span>
                <span className="font-['Special_Elite'] text-[10px] md:text-xs text-amber-200/30 tracking-wide">
                  Ownership: Estimated
                </span>
              </div>
              {lastUpdated && (
                <>
                  <span className="hidden sm:inline text-amber-700/30">|</span>
                  <span className="font-['Special_Elite'] text-[10px] md:text-xs text-amber-200/30 tracking-wide">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </>
              )}
              <span className="hidden sm:inline text-amber-700/30">|</span>
              <span className="font-['Special_Elite'] text-[10px] md:text-xs text-orange-400/60 tracking-wider">
                21M FOREVER
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
