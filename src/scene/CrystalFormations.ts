import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainNoise';

export class CrystalFormations {
  public group: THREE.Group;
  public crystalMaterials: THREE.MeshPhysicalMaterial[] = [];
  public crystalLights: THREE.PointLight[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'CrystalFormations';

    // Materials - Pale amber, violet-quartz, and opalescent silica
    const matAmber = new THREE.MeshPhysicalMaterial({
      color: 0xE6A23C,
      emissive: 0x94541B,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.65,
      ior: 1.54,
      transparent: true,
      opacity: 0.9,
    });

    const matViolet = new THREE.MeshPhysicalMaterial({
      color: 0xBA82D4,
      emissive: 0x5C2F75,
      emissiveIntensity: 0.3,
      roughness: 0.18,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.6,
      transparent: true,
      opacity: 0.9,
    });

    const matPaleGold = new THREE.MeshPhysicalMaterial({
      color: 0xF4D58D,
      emissive: 0x8C6B2E,
      emissiveIntensity: 0.4,
      roughness: 0.12,
      metalness: 0.2,
      transmission: 0.7,
      ior: 1.58,
      transparent: true,
      opacity: 0.92,
    });

    this.crystalMaterials.push(matAmber, matViolet, matPaleGold);

    // Generate crystal clusters concentrated in Sector 2 (Crystal Valley around x: 60..130, z: -110..-40)
    const clusterCenters = [
      { x: 70, z: -60, count: 9, scale: 2.8, mat: matAmber },
      { x: 95, z: -85, count: 14, scale: 3.5, mat: matPaleGold, lightColor: 0xE6A23C },
      { x: 120, z: -55, count: 8, scale: 2.5, mat: matViolet, lightColor: 0xBA82D4 },
      { x: 85, z: -110, count: 10, scale: 3.0, mat: matAmber },
      { x: 55, z: -90, count: 7, scale: 2.2, mat: matPaleGold },
      { x: 105, z: -70, count: 12, scale: 4.2, mat: matAmber, lightColor: 0xF4D58D },
    ];

    clusterCenters.forEach((cluster, cIdx) => {
      const clusterGroup = new THREE.Group();
      const cy = getTerrainHeight(cluster.x, cluster.z);
      clusterGroup.position.set(cluster.x, cy, cluster.z);

      for (let i = 0; i < cluster.count; i++) {
        const height = (3.0 + Math.random() * 5.0) * cluster.scale;
        const radius = (0.4 + Math.random() * 0.7) * cluster.scale;
        const segments = 6; // Hexagonal crystal prism

        const crystalGeo = new THREE.CylinderGeometry(0.01, radius, height, segments);
        const crystalMesh = new THREE.Mesh(crystalGeo, cluster.mat);

        const offsetX = (Math.random() - 0.5) * cluster.scale * 4.0;
        const offsetZ = (Math.random() - 0.5) * cluster.scale * 4.0;
        crystalMesh.position.set(offsetX, height / 2 - 0.5, offsetZ);

        // Random natural lean angles
        crystalMesh.rotation.x = (Math.random() - 0.5) * 0.45;
        crystalMesh.rotation.z = (Math.random() - 0.5) * 0.45;
        crystalMesh.rotation.y = Math.random() * Math.PI * 2;

        crystalMesh.castShadow = true;
        crystalMesh.receiveShadow = true;
        clusterGroup.add(crystalMesh);
      }

      // Add soft subterranean crystal light source for nighttime illumination
      if (cluster.lightColor) {
        const pLight = new THREE.PointLight(cluster.lightColor, 1.8, 28, 1.5);
        pLight.position.set(0, 4.0, 0);
        clusterGroup.add(pLight);
        this.crystalLights.push(pLight);
      }

      this.group.add(clusterGroup);
    });
  }

  public updateNightGlow(nightFactor: number) {
    // Increase crystal luminescence at night
    const intensity = 0.25 + nightFactor * 0.75;
    this.crystalMaterials.forEach((m) => {
      m.emissiveIntensity = intensity;
    });

    this.crystalLights.forEach((light) => {
      light.intensity = 0.5 + nightFactor * 2.2;
    });
  }
}
