import * as THREE from 'three';

export class AlienOceanMesh {
  public mesh: THREE.Mesh;
  public mistParticles: THREE.Points;
  private geometry: THREE.PlaneGeometry;
  private material: THREE.MeshStandardMaterial;
  private initialY: Float32Array;
  private count: number;

  constructor() {
    // Ocean plane positioned in southern sector (z: 130 to 350)
    const width = 450;
    const depth = 220;
    const segmentsW = 90;
    const segmentsD = 50;

    this.geometry = new THREE.PlaneGeometry(width, depth, segmentsW, segmentsD);
    this.geometry.rotateX(-Math.PI / 2);

    this.count = this.geometry.attributes.position.count;
    this.initialY = new Float32Array(this.count);

    const pos = this.geometry.attributes.position;
    for (let i = 0; i < this.count; i++) {
      this.initialY[i] = pos.getY(i);
    }

    this.material = new THREE.MeshStandardMaterial({
      color: 0x1A2226,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88,
      flatShading: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, -3.2, 230);
    this.mesh.receiveShadow = true;

    // Coastal Mist Particles
    const mistGeo = new THREE.BufferGeometry();
    const mistCount = 120;
    const mistPos = new Float32Array(mistCount * 3);

    for (let i = 0; i < mistCount; i++) {
      mistPos[i * 3] = (Math.random() - 0.5) * 380;
      mistPos[i * 3 + 1] = -2.0 + Math.random() * 4.0;
      mistPos[i * 3 + 2] = 135 + Math.random() * 80;
    }

    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    const mistMat = new THREE.PointsMaterial({
      color: 0x544E45,
      size: 6.0,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });

    this.mistParticles = new THREE.Points(mistGeo, mistMat);
  }

  public updateAnimation(elapsedTime: number) {
    const pos = this.geometry.attributes.position;
    for (let i = 0; i < this.count; i++) {
      const u = pos.getX(i);
      const v = pos.getZ(i);
      const wave = Math.sin(u * 0.08 + elapsedTime * 1.5) * 0.45 +
                   Math.cos(v * 0.06 + elapsedTime * 1.2) * 0.35;
      pos.setY(i, this.initialY[i] + wave);
    }
    pos.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }
}
