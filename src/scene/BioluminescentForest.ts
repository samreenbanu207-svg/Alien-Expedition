import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainNoise';

export class BioluminescentForest {
  public group: THREE.Group;
  public floraGlowMaterials: THREE.MeshStandardMaterial[] = [];
  public sporeParticles: THREE.Points;
  public forestLights: THREE.PointLight[] = [];

  private sporePositions: Float32Array;
  private sporeVelocities: Float32Array;
  private sporeCount = 220;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'BioluminescentForest';

    // Alien organic stalk material
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0x222E23,
      roughness: 0.75,
      metalness: 0.1,
    });

    // Bioluminescent glowing cap materials (Amber, Emerald, and Deep Violet)
    const glowAmberMat = new THREE.MeshStandardMaterial({
      color: 0x6E4A1E,
      emissive: 0xE6A23C,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.15,
    });

    const glowEmeraldMat = new THREE.MeshStandardMaterial({
      color: 0x1E4A28,
      emissive: 0x7F9F72,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.15,
    });

    const glowVioletMat = new THREE.MeshStandardMaterial({
      color: 0x3E1E54,
      emissive: 0xA75EC7,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.15,
    });

    this.floraGlowMaterials.push(glowAmberMat, glowEmeraldMat, glowVioletMat);

    // Forest groves in Sector 3 (x: -130..-40, z: 45..140)
    const forestGroves = [
      { x: -60, z: 60, count: 10, scale: 2.2 },
      { x: -90, z: 85, count: 16, scale: 2.8, lightColor: 0x7F9F72 },
      { x: -115, z: 65, count: 12, scale: 2.4 },
      { x: -75, z: 115, count: 14, scale: 2.6, lightColor: 0xE6A23C },
      { x: -110, z: 120, count: 12, scale: 3.0, lightColor: 0xA75EC7 },
    ];

    forestGroves.forEach((grove) => {
      const groveGroup = new THREE.Group();

      for (let i = 0; i < grove.count; i++) {
        const ox = grove.x + (Math.random() - 0.5) * grove.scale * 12.0;
        const oz = grove.z + (Math.random() - 0.5) * grove.scale * 12.0;
        const oy = getTerrainHeight(ox, oz);

        const treeGroup = new THREE.Group();
        treeGroup.position.set(ox, oy, oz);

        const height = 4.5 + Math.random() * 6.5;
        const trunkGeo = new THREE.CylinderGeometry(0.18, 0.45, height, 10);
        const trunkMesh = new THREE.Mesh(trunkGeo, stalkMat);
        trunkMesh.position.y = height / 2;
        trunkMesh.castShadow = true;
        trunkMesh.receiveShadow = true;
        treeGroup.add(trunkMesh);

        // Cap / Umbrella Dome
        const capMat = this.floraGlowMaterials[i % this.floraGlowMaterials.length];
        const capRadius = 1.2 + Math.random() * 1.6;
        const capGeo = new THREE.SphereGeometry(capRadius, 14, 10, 0, Math.PI * 2, 0, Math.PI / 1.8);
        const capMesh = new THREE.Mesh(capGeo, capMat);
        capMesh.position.y = height;
        capMesh.castShadow = true;
        capMesh.receiveShadow = true;
        treeGroup.add(capMesh);

        // Hanging bioluminescent tendril spore pods
        for (let t = 0; t < 4; t++) {
          const podAngle = (t / 4) * Math.PI * 2;
          const podGeo = new THREE.SphereGeometry(0.2, 8, 8);
          const podMesh = new THREE.Mesh(podGeo, capMat);
          podMesh.position.set(
            Math.cos(podAngle) * (capRadius * 0.7),
            height - 0.5 - Math.random() * 0.8,
            Math.sin(podAngle) * (capRadius * 0.7)
          );
          treeGroup.add(podMesh);
        }

        groveGroup.add(treeGroup);
      }

      if (grove.lightColor) {
        const pLight = new THREE.PointLight(grove.lightColor, 1.6, 32, 1.4);
        pLight.position.set(grove.x, getTerrainHeight(grove.x, grove.z) + 4.0, grove.z);
        groveGroup.add(pLight);
        this.forestLights.push(pLight);
      }

      this.group.add(groveGroup);
    });

    // Floating Luminous Spore Particles
    const sporeGeo = new THREE.BufferGeometry();
    this.sporePositions = new Float32Array(this.sporeCount * 3);
    this.sporeVelocities = new Float32Array(this.sporeCount * 3);

    for (let i = 0; i < this.sporeCount; i++) {
      const sx = -130 + Math.random() * 90;
      const sz = 45 + Math.random() * 95;
      const sy = getTerrainHeight(sx, sz) + 1.0 + Math.random() * 9.0;

      this.sporePositions[i * 3] = sx;
      this.sporePositions[i * 3 + 1] = sy;
      this.sporePositions[i * 3 + 2] = sz;

      this.sporeVelocities[i * 3] = (Math.random() - 0.5) * 0.3;
      this.sporeVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      this.sporeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }

    sporeGeo.setAttribute('position', new THREE.BufferAttribute(this.sporePositions, 3));

    const sporeMat = new THREE.PointsMaterial({
      color: 0x7F9F72,
      size: 1.8,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    this.sporeParticles = new THREE.Points(sporeGeo, sporeMat);
    this.group.add(this.sporeParticles);
  }

  public updateAnimation(delta: number, elapsedTime: number, nightFactor: number) {
    // Pulse bioluminescent flora glow
    const pulse = 0.3 + (Math.sin(elapsedTime * 1.8) + 1.0) * 0.35;
    const nightBoost = 0.2 + nightFactor * 0.8;

    this.floraGlowMaterials.forEach((mat) => {
      mat.emissiveIntensity = pulse * nightBoost;
    });

    this.forestLights.forEach((light) => {
      light.intensity = (0.5 + nightFactor * 1.8) * (0.8 + Math.sin(elapsedTime * 2.0) * 0.2);
    });

    // Animate spore drifting
    const posAttr = this.sporeParticles.geometry.attributes.position;
    for (let i = 0; i < this.sporeCount; i++) {
      this.sporePositions[i * 3] += Math.sin(elapsedTime + i) * 0.02 + this.sporeVelocities[i * 3] * delta;
      this.sporePositions[i * 3 + 1] += Math.cos(elapsedTime * 0.8 + i) * 0.015;
      this.sporePositions[i * 3 + 2] += Math.cos(elapsedTime + i) * 0.02 + this.sporeVelocities[i * 3 + 2] * delta;
    }
    posAttr.needsUpdate = true;
  }
}
