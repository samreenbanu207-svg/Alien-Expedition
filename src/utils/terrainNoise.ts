import * as THREE from 'three';
import { RegionId, RegionInfo } from '../types';

// Fast 2D Simplex / Perlin noise implementation for deterministic procedural terrain
class SimplexNoise {
  private p: number[] = [];
  private perm: number[] = [];
  private gradP: { x: number; y: number }[] = [];

  constructor(seed = 42) {
    const p: number[] = [];
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor((Math.sin(seed + i) * 10000) % 256);
      if (p[i] < 0) p[i] += 256;
    }
    this.p = p;
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      const angle = (this.perm[i] / 256) * Math.PI * 2;
      this.gradP[i] = { x: Math.cos(angle), y: Math.sin(angle) };
    }
  }

  private dot2(g: { x: number; y: number }, x: number, y: number): number {
    return g.x * x + g.y * y;
  }

  public noise2D(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

    let n0 = 0, n1 = 0, n2 = 0;

    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1 = 0, j1 = 0;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.perm[ii + this.perm[jj]];
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1]];
    const gi2 = this.perm[ii + 1 + this.perm[jj + 1]];

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * this.dot2(this.gradP[gi0], x0, y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * this.dot2(this.gradP[gi1], x1, y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * this.dot2(this.gradP[gi2], x2, y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }
}

const noise = new SimplexNoise(1337);

export const PLANETARY_REGIONS: Record<RegionId, RegionInfo> = {
  RESEARCH_BASE: {
    id: 'RESEARCH_BASE',
    name: 'Sector 0: Station Nexus',
    subtitle: 'Abandoned Alpha Research Station',
    description: 'Central operations hub with geodesic habitat, sensor masts, docking pylons, and communication array.',
    center: [0, 0],
    radius: 35,
    baseTemp: 18.2,
    baseRadiation: 'LOW',
    basePressure: 0.91,
    dangerLevel: 'MINIMAL',
    geologicalNotes: 'Stabilized bedrock plateau with engineered foundation anchoring.'
  },
  RED_DESERT: {
    id: 'RED_DESERT',
    name: 'Sector 1: Ochre Dunes',
    subtitle: 'Ferric Oxide Regolith Desert',
    description: 'Vast expanse of oxidized iron-rich sand, dune ridges, impact craters, and weathered sandstone hoodoos.',
    center: [-90, -80],
    radius: 75,
    baseTemp: 24.6,
    baseRadiation: 'LOW',
    basePressure: 0.88,
    dangerLevel: 'LOW',
    geologicalNotes: 'High concentrations of hematite, magnetite, and atmospheric ferric particulate.'
  },
  CRYSTAL_VALLEY: {
    id: 'CRYSTAL_VALLEY',
    name: 'Sector 2: Prismatic Basin',
    subtitle: 'Piezoelectric Silicate Formations',
    description: 'Deep canyon filled with gigantic monolithic crystal spires exhibiting refractive dispersion and faint resonance.',
    center: [95, -75],
    radius: 70,
    baseTemp: 12.1,
    baseRadiation: 'LOW',
    basePressure: 0.94,
    dangerLevel: 'LOW',
    geologicalNotes: 'Hexagonal quartz-beryllium monoliths with lattice-trapped volatile gases.'
  },
  BIOLUMINESCENT_FOREST: {
    id: 'BIOLUMINESCENT_FOREST',
    name: 'Sector 3: Phosphor Glade',
    subtitle: 'Xenobotanical Mycelial Canopy',
    description: 'Dense extraterrestrial ecosystem of towering bio-fungal spires, luminous spore clusters, and reactive flora.',
    center: [-90, 85],
    radius: 75,
    baseTemp: 16.8,
    baseRadiation: 'LOW',
    basePressure: 0.96,
    dangerLevel: 'ELEVATED',
    geologicalNotes: 'Humic organo-sedimentary soil enriched by chemotrophic alien microbial mats.'
  },
  VOLCANIC_ZONE: {
    id: 'VOLCANIC_ZONE',
    name: 'Sector 4: Obsidian Rift',
    subtitle: 'Geothermal Magmatic Fissures',
    description: 'Active tectonic rift characterized by dark basaltic lava columns, smoking hydrothermal vents, and thermal crust.',
    center: [100, 95],
    radius: 75,
    baseTemp: 44.5,
    baseRadiation: 'MODERATE',
    basePressure: 1.05,
    dangerLevel: 'HIGH',
    geologicalNotes: 'Ultra-mafic basalt, sulfur precipitates, and sub-surface magma chambers.'
  },
  ALIEN_OCEAN: {
    id: 'ALIEN_OCEAN',
    name: 'Sector 5: Abyssal Shore',
    subtitle: 'Cryo-Hydrocarbon Liquid Basin',
    description: 'Vast shimmering liquid reservoir with rhythmic wave dynamics, saline cliffs, and atmospheric coastal fog.',
    center: [0, 180],
    radius: 80,
    baseTemp: 7.4,
    baseRadiation: 'LOW',
    basePressure: 1.12,
    dangerLevel: 'ELEVATED',
    geologicalNotes: 'Liquid hydrocarbon-water emulsion saturated with dissolved organo-silicates.'
  }
};

/**
 * Calculates deterministic elevation for any (x, z) on Planet A-07
 */
export function getTerrainHeight(x: number, z: number): number {
  const distFromCenter = Math.sqrt(x * x + z * z);
  
  // Station plateau flattening around (0,0)
  let plateauWeight = 1.0;
  if (distFromCenter < 35) {
    plateauWeight = Math.max(0, (distFromCenter - 15) / 20);
  }

  // Base undulating terrain
  const n1 = noise.noise2D(x * 0.008, z * 0.008) * 14.0;
  const n2 = noise.noise2D(x * 0.02, z * 0.02) * 5.5;
  const n3 = noise.noise2D(x * 0.05, z * 0.05) * 1.5;

  let baseElevation = (n1 + n2 + n3);

  // Region 1: Ochre Desert (Dunes & rolling ridges)
  if (x < -20 && z < 0) {
    const duneWave = Math.sin(x * 0.06 + z * 0.03) * 3.5;
    baseElevation += duneWave * 0.8;
  }

  // Region 2: Crystal Basin (Carved depression flanked by steep crags)
  if (x > 20 && z < 0) {
    const valleyDist = Math.sqrt((x - 95) * (x - 95) + (z - (-75)) * (z - (-75)));
    if (valleyDist < 80) {
      baseElevation -= (1.0 - valleyDist / 80) * 8.0;
    }
  }

  // Region 4: Volcanic Caldera & Spires
  if (x > 20 && z > 20) {
    const volcanicDist = Math.sqrt((x - 100) * (x - 100) + (z - 95) * (z - 95));
    if (volcanicDist < 85) {
      const crag = Math.abs(noise.noise2D(x * 0.04, z * 0.04)) * 12.0;
      baseElevation += crag * 0.7 - 2.0;
    }
  }

  // Region 5: Ocean shoreline slope into the sea
  if (z > 100) {
    const oceanDepth = Math.max(0, (z - 110) * 0.18);
    baseElevation -= oceanDepth;
  }

  // Apply base plateau flattening
  return baseElevation * plateauWeight;
}

/**
 * Calculates the surface normal vector at (x, z) for rover wheel suspension & terrain orientation
 */
export function getTerrainNormal(x: number, z: number): THREE.Vector3 {
  const eps = 0.4;
  const hL = getTerrainHeight(x - eps, z);
  const hR = getTerrainHeight(x + eps, z);
  const hD = getTerrainHeight(x, z - eps);
  const hU = getTerrainHeight(x, z + eps);

  const normal = new THREE.Vector3(hL - hR, 2 * eps, hD - hU);
  return normal.normalize();
}

/**
 * Returns which region the coordinates belong to
 */
export function getRegionAt(x: number, z: number): RegionId {
  const distFromOrigin = Math.sqrt(x * x + z * z);
  if (distFromOrigin <= 32) return 'RESEARCH_BASE';

  if (z > 140) return 'ALIEN_OCEAN';
  if (x < 0 && z < 20) return 'RED_DESERT';
  if (x >= 0 && z < 20) return 'CRYSTAL_VALLEY';
  if (x < 0 && z >= 20) return 'BIOLUMINESCENT_FOREST';
  if (x >= 0 && z >= 20) return 'VOLCANIC_ZONE';

  return 'RESEARCH_BASE';
}
