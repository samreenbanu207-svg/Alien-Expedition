import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainNoise';

export class VolcanicGeology {
  public group: THREE.Group;
  public lavaMaterials: THREE.MeshBasicMaterial[] = [];
  public smokeParticles: THREE.Points;
  public lavaLights: THREE.PointLight[] = [];

  private smokePositions: Float32Array;
  private smokeVelocities: Float32Array;
  private particleCount = 180;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'VolcanicGeology';

    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x14100E,
      roughness: 0.95,
      metalness: 0.2,
      flatShading: true,
    });

    const lavaMat = new THREE.MeshBasicMaterial({
      color: 0xDE581F,
    });
    this.lavaMaterials.push(lavaMat);

    // Volcanic vents and basalt spires in Sector 4 (x: 60..140, z: 50..130)
    const volcanicSites = [
      { x: 75, z: 65, scale: 3.5, hasVent: true },
      { x: 100, z: 95, scale: 4.5, hasVent: true },
      { x: 125, z: 75, scale: 3.0, hasVent: false },
      { x: 85, z: 120, scale: 3.8, hasVent: true },
      { x: 120, z: 125, scale: 4.0, hasVent: false },
    ];

    volcanicSites.forEach((site) => {
      const siteGroup = new THREE.Group();
      const sy = getTerrainHeight(site.x, site.z);
      siteGroup.position.set(site.x, sy, site.z);

      // Basalt column cluster
      const numColumns = 7 + Math.floor(Math.random() * 6);
      for (let i = 0; i < numColumns; i++) {
        const height = (4.0 + Math.random() * 7.0) * site.scale * 0.4;
        const radius = (0.6 + Math.random() * 0.8) * site.scale * 0.3;
        const columnGeo = new THREE.CylinderGeometry(radius * 0.8, radius, height, 5); // Pentagonal basalt
        const colMesh = new THREE.Mesh(columnGeo, basaltMat);

        const ox = (Math.random() - 0.5) * site.scale * 2.8;
        const oz = (Math.random() - 0.5) * site.scale * 2.8;
        colMesh.position.set(ox, height / 2, oz);
        colMesh.rotation.y = Math.random() * Math.PI;
        colMesh.rotation.z = (Math.random() - 0.5) * 0.15;
        colMesh.castShadow = true;
        colMesh.receiveShadow = true;
        siteGroup.add(colMesh);
      }

      if (site.hasVent) {
        // Glowing magma fissure trench
        const fissureGeo = new THREE.PlaneGeometry(site.scale * 2.2, site.scale * 0.7);
        fissureGeo.rotateX(-Math.PI / 2);
        const fissureMesh = new THREE.Mesh(fissureGeo, lavaMat);
        fissureMesh.position.set(0, 0.15, 0);
        siteGroup.add(fissureMesh);

        // Warm geothermal glow light
        const pLight = new THREE.PointLight(0xDE581F, 2.2, 35, 1.2);
        pLight.position.set(0, 2.0, 0);
        siteGroup.add(pLight);
        this.lavaLights.push(pLight);
      }

      this.group.add(siteGroup);
    });

    // Rising Smoke/Steam Particle System
    const smokeGeo = new THREE.BufferGeometry();
    this.smokePositions = new Float32Array(this.particleCount * 3);
    this.smokeVelocities = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      // Pick one of the volcanic sites randomly
      const site = volcanicSites[Math.floor(Math.random() * volcanicSites.length)];
      const sy = getTerrainHeight(site.x, site.z);

      this.smokePositions[i * 3] = site.x + (Math.random() - 0.5) * 6;
      this.smokePositions[i * 3 + 1] = sy + Math.random() * 15;
      this.smokePositions[i * 3 + 2] = site.z + (Math.random() - 0.5) * 6;

      this.smokeVelocities[i * 3] = (Math.random() - 0.5) * 0.3;
      this.smokeVelocities[i * 3 + 1] = 0.5 + Math.random() * 0.8;
      this.smokeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }

    smokeGeo.setAttribute('position', new THREE.BufferAttribute(this.smokePositions, 3));

    const smokeMat = new THREE.PointsMaterial({
      color: 0x54473D,
      size: 3.5,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });

    this.smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    this.group.add(this.smokeParticles);
  }

  public updateAnimation(delta: number, elapsedTime: number) {
    // Animate rising smoke particles
    const posAttr = this.smokeParticles.geometry.attributes.position;
    for (let i = 0; i < this.particleCount; i++) {
      this.smokePositions[i * 3] += this.smokeVelocities[i * 3] * delta;
      this.smokePositions[i * 3 + 1] += this.smokeVelocities[i * 3 + 1] * delta;
      this.smokePositions[i * 3 + 2] += this.smokeVelocities[i * 3 + 2] * delta;

      // Reset when too high
      if (this.smokePositions[i * 3 + 1] > 35) {
        this.smokePositions[i * 3 + 1] = 2.0;
      }
    }
    posAttr.needsUpdate = true;

    // Pulse lava brightness
    const pulse = 0.85 + Math.sin(elapsedTime * 3.0) * 0.15;
    this.lavaLights.forEach((light) => {
      light.intensity = 1.8 * pulse;
    });
  }
}
