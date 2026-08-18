import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainNoise';

export class TerrainMesh {
  public mesh: THREE.Mesh;
  private geometry: THREE.PlaneGeometry;
  private material: THREE.MeshStandardMaterial;

  constructor(size = 480, segments = 220) {
    this.geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    this.geometry.rotateX(-Math.PI / 2);

    const posAttr = this.geometry.attributes.position;
    const count = posAttr.count;
    const colors = new Float32Array(count * 3);

    // Color definitions for biomes (strictly following Obsidian & Amber palette)
    const colorBase = new THREE.Color(0x352B24);         // Dark graphite / compacted research bedrock
    const colorDesert = new THREE.Color(0x8C4A28);       // Ferric red-ochre sandstone
    const colorDesertDune = new THREE.Color(0xA65C32);   // Sun-bleached dune crest
    const colorCrystal = new THREE.Color(0x56473A);      // Prismatic mineral bed
    const colorCrystalGlow = new THREE.Color(0x8C7456);  // Pale quartz sediment
    const colorForest = new THREE.Color(0x283227);       // Chemotrophic alien humic moss
    const colorForestDeep = new THREE.Color(0x1B241D);   // Deep spore sediment
    const colorVolcanic = new THREE.Color(0x181412);     // Basaltic dark obsidian
    const colorVolcanicCrust = new THREE.Color(0x331C14);// Heat-altered crust
    const colorShore = new THREE.Color(0x42382C);        // Moist hydrocarbon shoreline

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const y = getTerrainHeight(x, z);
      posAttr.setY(i, y);

      // Biome blending calculation
      const distFromCenter = Math.sqrt(x * x + z * z);
      const finalColor = new THREE.Color();

      if (distFromCenter < 28) {
        // Base Plateau
        finalColor.copy(colorBase);
        if (distFromCenter > 18) {
          const t = (distFromCenter - 18) / 10;
          finalColor.lerp(colorDesert, t * 0.5);
        }
      } else if (z > 130) {
        // Ocean Shoreline
        finalColor.copy(colorShore);
      } else if (x < 0 && z < 20) {
        // Red Desert
        const heightFactor = Math.min(Math.max((y + 5) / 15, 0), 1);
        finalColor.copy(colorDesert).lerp(colorDesertDune, heightFactor);
      } else if (x >= 0 && z < 20) {
        // Crystal Valley
        const heightFactor = Math.min(Math.max((y + 8) / 16, 0), 1);
        finalColor.copy(colorCrystal).lerp(colorCrystalGlow, heightFactor);
      } else if (x < 0 && z >= 20) {
        // Bioluminescent Forest
        const heightFactor = Math.min(Math.max((y + 4) / 14, 0), 1);
        finalColor.copy(colorForestDeep).lerp(colorForest, heightFactor);
      } else {
        // Volcanic Zone
        const heightFactor = Math.min(Math.max((y + 6) / 18, 0), 1);
        finalColor.copy(colorVolcanic).lerp(colorVolcanicCrust, heightFactor);
      }

      // Add subtle procedural variation
      const tint = (Math.sin(x * 0.1) * Math.cos(z * 0.1)) * 0.04;
      finalColor.r = Math.min(Math.max(finalColor.r + tint, 0), 1);
      finalColor.g = Math.min(Math.max(finalColor.g + tint * 0.8, 0), 1);
      finalColor.b = Math.min(Math.max(finalColor.b + tint * 0.6, 0), 1);

      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }

    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry.computeVertexNormals();

    this.material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.12,
      flatShading: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.name = 'PlanetTerrain';
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
