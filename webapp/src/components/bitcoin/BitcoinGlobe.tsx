import { useRef, useState, useEffect, Suspense, useMemo, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./StatCard";

// BTC holdings data by country
const BTC_HOLDINGS = [
  { name: "USA", lat: 38.9, lng: -77.0, holdings: 40, iso: "USA" },
  { name: "Germany", lat: 52.5, lng: 13.4, holdings: 12, iso: "DEU" },
  { name: "UK", lat: 51.5, lng: -0.1, holdings: 8, iso: "GBR" },
  { name: "China", lat: 39.9, lng: 116.4, holdings: 7, iso: "CHN" },
  { name: "Japan", lat: 35.7, lng: 139.7, holdings: 5, iso: "JPN" },
  { name: "El Salvador", lat: 13.7, lng: -89.2, holdings: 2, iso: "SLV" },
  { name: "Switzerland", lat: 46.9, lng: 7.4, holdings: 3, iso: "CHE" },
  { name: "Singapore", lat: 1.3, lng: 103.8, holdings: 2.5, iso: "SGP" },
  { name: "UAE", lat: 25.2, lng: 55.3, holdings: 2, iso: "ARE" },
  { name: "Canada", lat: 45.4, lng: -75.7, holdings: 3, iso: "CAN" },
  { name: "Australia", lat: -33.9, lng: 151.2, holdings: 2.5, iso: "AUS" },
  { name: "Brazil", lat: -15.8, lng: -47.9, holdings: 1.5, iso: "BRA" },
  { name: "Netherlands", lat: 52.4, lng: 4.9, holdings: 2, iso: "NLD" },
  { name: "South Korea", lat: 37.6, lng: 127.0, holdings: 2, iso: "KOR" },
];

const BTC_COUNTRY_CODES = new Set(BTC_HOLDINGS.map(h => h.iso));

// world-atlas 110m uses numeric ISO 3166-1 ids; map to our ISO_A3 set for fills
const NUMERIC_ID_TO_ISO: Record<number, string> = {
  840: "USA", 276: "DEU", 826: "GBR", 156: "CHN", 392: "JPN", 222: "SLV",
  756: "CHE", 702: "SGP", 784: "ARE", 124: "CAN", 36: "AUS", 76: "BRA",
  528: "NLD", 410: "KOR",
};

// Convert lat/lng to 3D coordinates
function latLngTo3D(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  ];
}

// Shared materials (reused across components)
const orangeMaterial = new THREE.MeshBasicMaterial({ color: "#f97316" });
const orangeTransparent = new THREE.MeshBasicMaterial({
  color: "#f97316",
  transparent: true,
  opacity: 0.5
});
const orangeGlow = new THREE.MeshBasicMaterial({
  color: "#f97316",
  transparent: true,
  opacity: 0.15
});

// Shared geometries
const dotGeometry = new THREE.SphereGeometry(1, 8, 8);

// Hotspot component - optimized with shared geometry/material
const Hotspot = memo(function Hotspot({
  lat, lng, size, name, holdings
}: {
  lat: number;
  lng: number;
  size: number;
  name: string;
  holdings: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const position = useMemo(() => latLngTo3D(lat, lng, 2.08), [lat, lng]);

  useFrame((state) => {
    if (groupRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      groupRef.current.scale.setScalar(scale);
    }
  });

  const dotSize = size * 0.5;

  return (
    <group position={position}>
      <group ref={groupRef}>
        <mesh
          geometry={dotGeometry}
          material={orangeMaterial}
          scale={dotSize}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      </group>
      <mesh geometry={dotGeometry} material={orangeTransparent} scale={dotSize * 1.8} />
      <mesh geometry={dotGeometry} material={orangeGlow} scale={dotSize * 3} />

      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-stone-950/95 border border-orange-500/50 rounded-md px-2 py-1 whitespace-nowrap pointer-events-none">
            <p className="font-['Special_Elite'] text-[10px] text-orange-300/80 uppercase tracking-wider">{name}</p>
            <p className="font-['Nixie_One'] text-sm text-orange-400">{holdings}%</p>
          </div>
        </Html>
      )}
    </group>
  );
});

// Types for GeoJSON (world-atlas: properties may be empty, id is often numeric)
interface GeoFeature {
  id?: number;
  properties?: { ISO_A3?: string; iso_a3?: string; ADM0_A3?: string };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

// Batched country outlines - single draw call for all countries
const CountryLines = memo(function CountryLines({
  geoData,
  radius
}: {
  geoData: GeoFeature[] | null;
  radius: number;
}) {
  const { outlineGeometry, filledGeometry } = useMemo(() => {
    if (!geoData) return { outlineGeometry: null, filledGeometry: null };

    const outlinePositions: number[] = [];
    const filledPositions: number[] = [];
    const filledIndices: number[] = [];

    geoData.forEach((feature) => {
      const iso = feature.properties?.ISO_A3 || feature.properties?.iso_a3 || feature.properties?.ADM0_A3
        || (feature.id != null ? NUMERIC_ID_TO_ISO[feature.id] : '');
      const isBtc = iso ? BTC_COUNTRY_CODES.has(iso) : false;

      const processRing = (ring: number[][]) => {
        if (ring.length < 3) return;

        // Add outline points
        for (let i = 0; i < ring.length; i++) {
          const [lng, lat] = ring[i];
          const [x, y, z] = latLngTo3D(lat, lng, radius);
          outlinePositions.push(x, y, z);

          // Connect to next point (or loop back)
          const next = ring[(i + 1) % ring.length];
          const [nx, ny, nz] = latLngTo3D(next[1], next[0], radius);
          outlinePositions.push(nx, ny, nz);
        }

        // Fill BTC countries
        if (isBtc && ring.length >= 3) {
          const startIdx = filledPositions.length / 3;
          ring.forEach(([lng, lat]) => {
            const [x, y, z] = latLngTo3D(lat, lng, radius + 0.005);
            filledPositions.push(x, y, z);
          });
          // Fan triangulation
          for (let i = 1; i < ring.length - 1; i++) {
            filledIndices.push(startIdx, startIdx + i, startIdx + i + 1);
          }
        }
      };

      if (feature.geometry.type === 'Polygon') {
        (feature.geometry.coordinates as number[][][]).forEach(processRing);
      } else if (feature.geometry.type === 'MultiPolygon') {
        (feature.geometry.coordinates as number[][][][]).forEach(poly =>
          poly.forEach(processRing)
        );
      }
    });

    // Create outline geometry
    const outGeo = new THREE.BufferGeometry();
    outGeo.setAttribute('position', new THREE.Float32BufferAttribute(outlinePositions, 3));

    // Create filled geometry
    const fillGeo = new THREE.BufferGeometry();
    if (filledPositions.length > 0) {
      fillGeo.setAttribute('position', new THREE.Float32BufferAttribute(filledPositions, 3));
      fillGeo.setIndex(filledIndices);
    }

    return { outlineGeometry: outGeo, filledGeometry: fillGeo };
  }, [geoData, radius]);

  if (!outlineGeometry) return null;

  return (
    <>
      <lineSegments geometry={outlineGeometry}>
        <lineBasicMaterial color="#f97316" transparent opacity={0.4} />
      </lineSegments>
      {filledGeometry && filledGeometry.attributes.position && (
        <mesh geometry={filledGeometry}>
          <meshBasicMaterial color="#f97316" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </>
  );
});

// Grid lines as single geometry
const GridLines = memo(function GridLines({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];

    // Latitude lines every 30 degrees
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lng = -180; lng < 180; lng += 10) {
        const [x1, y1, z1] = latLngTo3D(lat, lng, radius);
        const [x2, y2, z2] = latLngTo3D(lat, lng + 10, radius);
        positions.push(x1, y1, z1, x2, y2, z2);
      }
    }

    // Longitude lines every 30 degrees
    for (let lng = -180; lng < 180; lng += 30) {
      for (let lat = -80; lat < 80; lat += 10) {
        const [x1, y1, z1] = latLngTo3D(lat, lng, radius);
        const [x2, y2, z2] = latLngTo3D(lat + 10, lng, radius);
        positions.push(x1, y1, z1, x2, y2, z2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [radius]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#f97316" transparent opacity={0.2} />
    </lineSegments>
  );
});

// Globe component
function Globe() {
  const globeRef = useRef<THREE.Group>(null);
  const [geoData, setGeoData] = useState<GeoFeature[] | null>(null);

  // Load lightweight TopoJSON (much smaller than full GeoJSON)
  useEffect(() => {
    // Use a smaller, simplified world dataset (~500KB vs 23MB)
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(async (topology) => {
        // Dynamically import topojson-client for conversion
        const topojson = await import('topojson-client');
        const countries = topojson.feature(topology, topology.objects.countries);
        setGeoData((countries as { features: GeoFeature[] }).features);
      })
      .catch(err => console.error('Failed to load geo data:', err));
  }, []);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Black base sphere */}
      <Sphere args={[1.99, 32, 32]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>

      {/* Grid lines */}
      <GridLines radius={2.005} />

      {/* Country outlines and fills */}
      <CountryLines geoData={geoData} radius={2.01} />

      {/* Atmosphere glow */}
      <Sphere args={[2.1, 16, 16]}>
        <meshBasicMaterial color="#f97316" transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>

      {/* Orbital ring */}
      <mesh rotation={[Math.PI * 0.4, 0.3, 0.2]}>
        <torusGeometry args={[2.8, 0.006, 6, 64]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.5} />
      </mesh>

      {/* Hotspots */}
      {BTC_HOLDINGS.map((loc) => (
        <Hotspot
          key={loc.name}
          lat={loc.lat}
          lng={loc.lng}
          size={0.03 + (loc.holdings / 100) * 0.08}
          name={loc.name}
          holdings={loc.holdings}
        />
      ))}
    </group>
  );
}

// Scene
function Scene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 6);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.1} />
      <Globe />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
        rotateSpeed={0.5}
      />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-700/30 border-t-orange-400 rounded-full animate-spin" />
        <span className="font-['Special_Elite'] text-xs text-amber-200/40 uppercase tracking-wider">
          Loading Globe...
        </span>
      </div>
    </div>
  );
}

interface BitcoinGlobeProps {
  className?: string;
}

export function BitcoinGlobe({ className }: BitcoinGlobeProps) {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      if (!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl")) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  if (!webGLSupported) {
    return (
      <div className={cn("", className)}>
        <SectionHeader title="Global BTC Distribution" />
        <div className="h-[300px] flex items-center justify-center bg-stone-950 rounded border border-amber-900/40">
          <span className="text-amber-200/40 text-sm">WebGL not supported</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <SectionHeader title="Global BTC Distribution" />

      <div className="relative">
        <div className="absolute -inset-0.5 rounded-md bg-gradient-to-b from-amber-800/20 to-amber-950/20 blur-sm" />

        <div className={cn(
          "relative rounded-md p-4 md:p-6",
          "bg-gradient-to-b from-stone-900/95 via-stone-950 to-stone-900/95",
          "border border-amber-900/40"
        )}>
          {/* Corner rivets */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
            <div key={pos} className={`absolute ${pos} w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-700 to-amber-950`} />
          ))}

          <div className="h-[300px] md:h-[400px] w-full bg-[#050510] rounded">
            <Suspense fallback={<LoadingFallback />}>
              <Canvas
                gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
                camera={{ fov: 45, near: 0.1, far: 100 }}
                style={{ background: "#050510" }}
              >
                <Scene />
              </Canvas>
            </Suspense>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-amber-900/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="font-['Special_Elite'] text-[10px] text-amber-200/40 uppercase tracking-wider">BTC Holders</span>
              </div>
            </div>
            <span className="font-['Special_Elite'] text-[9px] text-amber-200/30 uppercase tracking-wider">
              Drag to rotate • Scroll to zoom
            </span>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
            {BTC_HOLDINGS.slice(0, 6).map((loc) => (
              <div key={loc.name} className="text-center p-2 rounded bg-stone-950/50 border border-amber-900/20">
                <div className="font-['Special_Elite'] text-[9px] text-amber-200/50 uppercase">{loc.name}</div>
                <div className="font-['Nixie_One'] text-lg text-orange-400">{loc.holdings}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
