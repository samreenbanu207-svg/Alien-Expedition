import * as THREE from 'three';
import { Specimen } from '../types';
import { getTerrainHeight } from '../utils/terrainNoise';

export const INITIAL_SPECIMENS: Specimen[] = [
  {
    id: 'sp-001',
    code: 'A-07-001',
    name: 'Hexahedral Silicate Monolith',
    region: 'CRYSTAL_VALLEY',
    category: 'MINERAL',
    position: [78, 0, -68],
    description: 'Gigantic hexagonal prism exhibiting internal refraction and piezoelectric harmonic oscillation when irradiated with laser pulses.',
    composition: '84% Crystalline SiO2, 11% Beryllium-Bismuth Matrix, 5% Trapped Xenon',
    thermalSignature: '11.8 °C (Endothermic heat sink)',
    radiationLevel: '0.04 mSv/h (Negligible)',
    density: '4.82 g/cm³',
    rarity: 'UNCOMMON',
    scientificValue: 'Exceptional optical purity; potential quantum semiconductor substrate.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-002',
    code: 'A-07-002',
    name: 'Xenomycota Bioluminescent Cap',
    region: 'BIOLUMINESCENT_FOREST',
    category: 'FLORA',
    position: [-74, 0, 78],
    description: 'Arborescent alien fruiting body with luciferase-analogous enzymes producing sustained green-amber cold luminescence.',
    composition: 'Cellulose-Chitin hybrid polymer, Luciferin-PX complex, Lipidic enzymes',
    thermalSignature: '17.2 °C (Near-ambient homeostasis)',
    radiationLevel: '0.01 mSv/h (Zero hazard)',
    density: '1.14 g/cm³',
    rarity: 'COMMON',
    scientificValue: 'Novel bio-photonic metabolic pathway without photosynthetic precursors.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-003',
    code: 'A-07-003',
    name: 'Hydrothermal Basalt Core',
    region: 'VOLCANIC_ZONE',
    category: 'GEOLOGY',
    position: [92, 0, 88],
    description: 'Vitreous volcanic outflow nodule rich in native gold, tellurium veins, and ultra-dense olivine crystals.',
    composition: '56% Pyroxene-Olivine, 24% Iron-Nickel Sulfide, 12% Tellurides, 8% Native Au',
    thermalSignature: '48.6 °C (Active thermal emission)',
    radiationLevel: '0.18 mSv/h (Elevated background)',
    density: '5.67 g/cm³',
    rarity: 'RARE',
    scientificValue: 'Reveals mantle differentiation and heavy element abundance in planetary core.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-004',
    code: 'A-07-004',
    name: 'Ferric Regolith Core',
    region: 'RED_DESERT',
    category: 'MINERAL',
    position: [-80, 0, -65],
    description: 'Stratified sedimentary block formed by aeolian sorting and magnetic iron cementation under low atmospheric pressure.',
    composition: '62% Hematite (Fe2O3), 22% Magnetite (Fe3O4), 16% Quartz sand',
    thermalSignature: '26.1 °C (High solar absorption)',
    radiationLevel: '0.02 mSv/h (Normal)',
    density: '3.91 g/cm³',
    rarity: 'COMMON',
    scientificValue: 'Standard geochemical benchmark for atmospheric oxidation history.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-005',
    code: 'A-07-005',
    name: 'Precursor Resonator Pillar',
    region: 'VOLCANIC_ZONE',
    category: 'ARTIFACT',
    position: [118, 0, 110],
    description: 'Geometrically carved metallic alloy monolith displaying engineered micro-circuit conduits and anomalous quantum flux.',
    composition: 'Unclassified synthesized metamaterial (Superconducting titanium-carbon lattice)',
    thermalSignature: '3.4 °C (Cryo-stabilized internal core)',
    radiationLevel: '0.45 mSv/h (Localized containment field)',
    density: '14.2 g/cm³',
    rarity: 'ANOMALOUS',
    scientificValue: 'Artificial non-human technology; conclusive evidence of extraterrestrial intelligence.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-006',
    code: 'A-07-006',
    name: 'Subsurface Prismatic Geode',
    region: 'CRYSTAL_VALLEY',
    category: 'MINERAL',
    position: [112, 0, -82],
    description: 'Hollow spherical crystal cluster containing trapped primordial volatile liquid and luminescent gas pockets.',
    composition: '70% Quartz, 18% Calcite, 8% Liquid hydrocarbons, 4% Argon gas',
    thermalSignature: '10.2 °C (Stable)',
    radiationLevel: '0.03 mSv/h (Negligible)',
    density: '2.85 g/cm³',
    rarity: 'RARE',
    scientificValue: 'Direct capsule of the atmospheric composition 800 million years ago.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-007',
    code: 'A-07-007',
    name: 'Fossilized Xenomorphic Carapace',
    region: 'RED_DESERT',
    category: 'RELIC',
    position: [-105, 0, -35],
    description: 'Permineralized exoskeletal fragment of an extinct multi-segmented terrestrial arthropod-like organism.',
    composition: 'Apatite-Silica replacement of bio-calcified protein structure',
    thermalSignature: '22.0 °C (Passive rock temperature)',
    radiationLevel: '0.02 mSv/h (Zero hazard)',
    density: '2.98 g/cm³',
    rarity: 'RARE',
    scientificValue: 'Crucial paleobiological evidence confirming historical surface macro-fauna.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-008',
    code: 'A-07-008',
    name: 'Cryo-Hydrocarbon Polyp',
    region: 'ALIEN_OCEAN',
    category: 'FLORA',
    position: [-25, 0, 155],
    description: 'Chemotrophic colonial organism flourishing at the liquid interface, absorbing dissolved alkanes for energy.',
    composition: 'Lipid-stabilized membrane matrix with organo-metallic catalysts',
    thermalSignature: '6.8 °C (Thermal equilibrium with sea)',
    radiationLevel: '0.01 mSv/h (Zero hazard)',
    density: '0.98 g/cm³',
    rarity: 'UNCOMMON',
    scientificValue: 'Model organism for liquid methane/ethane solvent biochemistry.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-009',
    code: 'A-07-009',
    name: 'Station Telemetry Beacon (Relic)',
    region: 'RESEARCH_BASE',
    category: 'ARTIFACT',
    position: [-18, 0, 16],
    description: 'Weathered scientific transponder left behind by the initial survey team, containing partial archival logs.',
    composition: 'Titanium-Alloy chassis, Photovoltaic silicon, Solid-state memory banks',
    thermalSignature: '19.4 °C (Low power standby)',
    radiationLevel: '0.05 mSv/h (Tritium battery glow)',
    density: '3.40 g/cm³',
    rarity: 'UNCOMMON',
    scientificValue: 'Contains encrypted flight paths and baseline geographical charts from Expedition Day 1.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
  {
    id: 'sp-010',
    code: 'A-07-010',
    name: 'Quantum Flux Node',
    region: 'VOLCANIC_ZONE',
    category: 'ENERGY',
    position: [75, 0, 125],
    description: 'Self-sustaining magnetic vortex hovering above fractured obsidian bed, emitting electromagnetic pulses.',
    composition: 'Coherent plasma vortex stabilized by sub-surface magnetic monopole cluster',
    thermalSignature: '78.5 °C (High ionization field)',
    radiationLevel: '0.82 mSv/h (High localized caution)',
    density: 'N/A (Energy construct)',
    rarity: 'ANOMALOUS',
    scientificValue: 'Breakthrough candidate for non-contact zero-point power harvesting.',
    isScanned: false,
    isAnalyzed: false,
    scanProgress: 0,
  },
];

export class DiscoverablesManager {
  public group: THREE.Group;
  public specimens: Specimen[];
  public interactiveMeshes: THREE.Mesh[] = [];
  public scanRings: Map<string, THREE.Mesh> = new Map();
  public targetPointers: Map<string, THREE.Group> = new Map();

  private activeScanSpecimenId: string | null = null;
  private scanHologramBeam: THREE.Mesh;
  private scanRingMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Discoverables';

    // Clone initial specimens and update elevations from terrain
    this.specimens = JSON.parse(JSON.stringify(INITIAL_SPECIMENS));
    this.specimens.forEach((sp) => {
      sp.position[1] = getTerrainHeight(sp.position[0], sp.position[2]);
    });

    this.scanRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4ff00,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });

    // Hologram Scan Beam (Vertical volumetric scanner cylinder)
    const beamGeo = new THREE.CylinderGeometry(2.4, 2.4, 12, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xd4ff00,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.scanHologramBeam = new THREE.Mesh(beamGeo, beamMat);
    this.scanHologramBeam.visible = false;
    this.group.add(this.scanHologramBeam);

    this.createSpecimenMeshes();
  }

  private createSpecimenMeshes() {
    this.specimens.forEach((sp) => {
      const specimenGroup = new THREE.Group();
      specimenGroup.position.set(sp.position[0], sp.position[1], sp.position[2]);

      let mesh: THREE.Mesh;

      switch (sp.category) {
        case 'MINERAL': {
          const geo = new THREE.OctahedronGeometry(1.6, 0);
          const mat = new THREE.MeshStandardMaterial({
            color: 0xE6A23C,
            emissive: 0x6E4A1E,
            emissiveIntensity: 0.35,
            metalness: 0.7,
            roughness: 0.2,
            flatShading: true,
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.position.y = 1.6;
          break;
        }
        case 'FLORA': {
          const geo = new THREE.DodecahedronGeometry(1.4, 1);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x7F9F72,
            emissive: 0x3E5E35,
            emissiveIntensity: 0.45,
            metalness: 0.2,
            roughness: 0.4,
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.position.y = 1.8;
          break;
        }
        case 'GEOLOGY': {
          const geo = new THREE.IcosahedronGeometry(1.5, 0);
          const mat = new THREE.MeshStandardMaterial({
            color: 0xC96F3B,
            emissive: 0x753215,
            emissiveIntensity: 0.4,
            metalness: 0.6,
            roughness: 0.5,
            flatShading: true,
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.position.y = 1.5;
          break;
        }
        case 'ARTIFACT':
        case 'RELIC': {
          const geo = new THREE.BoxGeometry(1.4, 3.2, 1.4);
          const mat = new THREE.MeshStandardMaterial({
            color: 0x2E2822,
            emissive: 0xE6A23C,
            emissiveIntensity: 0.25,
            metalness: 0.9,
            roughness: 0.15,
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.position.y = 1.6;
          break;
        }
        case 'ENERGY': {
          const geo = new THREE.TorusGeometry(1.2, 0.4, 16, 32);
          const mat = new THREE.MeshBasicMaterial({
            color: 0xF4D58D,
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.position.y = 2.4;
          break;
        }
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { specimenId: sp.id, specimenData: sp };
      this.interactiveMeshes.push(mesh);
      specimenGroup.add(mesh);

      // Interactive HUD Range Reticle / Ground Target Ring
      const ringGeo = new THREE.RingGeometry(2.2, 2.4, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, this.scanRingMaterial.clone());
      ringMesh.position.y = 0.15;
      specimenGroup.add(ringMesh);
      this.scanRings.set(sp.id, ringMesh);

      // Pulsing Vertical Tactical Marker
      const pointerGroup = new THREE.Group();
      pointerGroup.position.set(0, 4.2, 0);

      const pointerGeo = new THREE.ConeGeometry(0.3, 0.9, 4);
      pointerGeo.rotateX(Math.PI);
      const pointerMat = new THREE.MeshBasicMaterial({ color: 0xd4ff00 });
      const pointerMesh = new THREE.Mesh(pointerGeo, pointerMat);
      pointerGroup.add(pointerMesh);

      specimenGroup.add(pointerGroup);
      this.targetPointers.set(sp.id, pointerGroup);

      this.group.add(specimenGroup);
    });
  }

  public startScan(specimenId: string) {
    this.activeScanSpecimenId = specimenId;
    const target = this.specimens.find((s) => s.id === specimenId);
    if (target) {
      this.scanHologramBeam.position.set(target.position[0], target.position[1] + 6, target.position[2]);
      this.scanHologramBeam.visible = true;
    }
  }

  public updateScanProgress(specimenId: string, progress: number) {
    const sp = this.specimens.find((s) => s.id === specimenId);
    if (sp) {
      sp.scanProgress = progress;
      if (progress >= 100) {
        sp.isScanned = true;
        this.scanHologramBeam.visible = false;
        this.activeScanSpecimenId = null;
      }
    }

    if (this.scanHologramBeam.visible) {
      const mat = this.scanHologramBeam.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + (progress / 100) * 0.45;
    }
  }

  public markSpecimenAnalyzed(specimenId: string): Specimen | null {
    const sp = this.specimens.find((s) => s.id === specimenId);
    if (sp) {
      sp.isScanned = true;
      sp.isAnalyzed = true;
      sp.scanProgress = 100;
      sp.scanTimestamp = new Date().toLocaleTimeString();

      // Change marker color to Success Green
      const ring = this.scanRings.get(specimenId);
      if (ring) {
        (ring.material as THREE.MeshBasicMaterial).color.setHex(0x7F9F72);
      }
      return sp;
    }
    return null;
  }

  public updateAnimation(elapsedTime: number) {
    // Float & rotate energy/mineral meshes gently
    this.interactiveMeshes.forEach((m, idx) => {
      m.rotation.y = elapsedTime * 0.4 + idx;
      m.rotation.x = Math.sin(elapsedTime * 0.5 + idx) * 0.1;
    });

    // Animate target pointer bouncing
    let pointerIdx = 0;
    this.targetPointers.forEach((p) => {
      p.position.y = 4.0 + Math.sin(elapsedTime * 2.5 + pointerIdx * 0.6) * 0.3;
      p.rotation.y = elapsedTime * 1.5;
      pointerIdx++;
    });

    // Pulse scanning rings
    this.scanRings.forEach((r) => {
      (r.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(elapsedTime * 3.0) * 0.25;
    });

    // Scan beam animation if active
    if (this.scanHologramBeam.visible) {
      this.scanHologramBeam.rotation.y = elapsedTime * 4.0;
    }
  }
}
