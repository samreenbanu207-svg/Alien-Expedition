import * as THREE from 'three';

export class ResearchBaseModel {
  public group: THREE.Group;
  public commDish: THREE.Group;
  public solarPanels: THREE.Group[] = [];
  public beaconLight: THREE.PointLight;
  public beaconMesh: THREE.Mesh;
  public dockPadGlow: THREE.Mesh;

  private stationMaterial: THREE.MeshStandardMaterial;
  private darkComposite: THREE.MeshStandardMaterial;
  private amberWindowMaterial: THREE.MeshBasicMaterial;
  private solarCellMaterial: THREE.MeshStandardMaterial;
  private goldFoilMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'ResearchBase';

    // Materials - Obsidian & Amber scientific facility palette
    this.stationMaterial = new THREE.MeshStandardMaterial({
      color: 0x362D25,
      metalness: 0.7,
      roughness: 0.35,
    });

    this.darkComposite = new THREE.MeshStandardMaterial({
      color: 0x1A1512,
      metalness: 0.85,
      roughness: 0.25,
    });

    this.amberWindowMaterial = new THREE.MeshBasicMaterial({
      color: 0xE6A23C,
    });

    this.solarCellMaterial = new THREE.MeshStandardMaterial({
      color: 0x1E1B26,
      metalness: 0.9,
      roughness: 0.15,
    });

    this.goldFoilMaterial = new THREE.MeshStandardMaterial({
      color: 0xD49B3E,
      metalness: 0.85,
      roughness: 0.25,
    });

    // 1. Central Geodesic Habitat Dome (Primary Module)
    const domeGeo = new THREE.SphereGeometry(7.5, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, this.stationMaterial);
    domeMesh.position.set(0, 0, 0);
    domeMesh.castShadow = true;
    domeMesh.receiveShadow = true;
    this.group.add(domeMesh);

    // Habitat Base Ring / Foundation
    const ringGeo = new THREE.CylinderGeometry(7.7, 8.0, 1.2, 28);
    const ringMesh = new THREE.Mesh(ringGeo, this.darkComposite);
    ringMesh.position.set(0, 0.6, 0);
    ringMesh.castShadow = true;
    ringMesh.receiveShadow = true;
    this.group.add(ringMesh);

    // Dome Observation Windows (Amber glowing slits)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const windowGeo = new THREE.BoxGeometry(1.6, 0.4, 0.2);
      const windowMesh = new THREE.Mesh(windowGeo, this.amberWindowMaterial);
      windowMesh.position.set(Math.sin(angle) * 6.6, 3.8, Math.cos(angle) * 6.6);
      windowMesh.rotation.y = angle;
      this.group.add(windowMesh);
    }

    // 2. Airlock Tunnel Entrance
    const airlockGeo = new THREE.BoxGeometry(2.4, 2.6, 4.5);
    const airlock = new THREE.Mesh(airlockGeo, this.stationMaterial);
    airlock.position.set(0, 1.3, 7.5);
    airlock.castShadow = true;
    airlock.receiveShadow = true;
    this.group.add(airlock);

    // Airlock Door Frame (Amber Accents)
    const doorFrameGeo = new THREE.BoxGeometry(1.8, 2.0, 0.2);
    const doorFrame = new THREE.Mesh(doorFrameGeo, this.darkComposite);
    doorFrame.position.set(0, 1.3, 9.76);
    this.group.add(doorFrame);

    // 3. Laboratory / Science Module (West Wing)
    const labGeo = new THREE.CylinderGeometry(3.5, 3.5, 9.0, 16);
    labGeo.rotateZ(Math.PI / 2);
    const labMesh = new THREE.Mesh(labGeo, this.stationMaterial);
    labMesh.position.set(-11.5, 3.0, -2.0);
    labMesh.castShadow = true;
    labMesh.receiveShadow = true;
    this.group.add(labMesh);

    // Connecting corridor between Dome and Lab
    const corridor1Geo = new THREE.CylinderGeometry(1.4, 1.4, 6.0, 12);
    corridor1Geo.rotateZ(Math.PI / 2);
    const corridor1 = new THREE.Mesh(corridor1Geo, this.darkComposite);
    corridor1.position.set(-5.5, 1.8, -1.0);
    corridor1.castShadow = true;
    this.group.add(corridor1);

    // 4. Primary Communications & Relay Tower
    const towerGeo = new THREE.CylinderGeometry(0.3, 0.6, 14.0, 8);
    const tower = new THREE.Mesh(towerGeo, this.darkComposite);
    tower.position.set(6.0, 7.0, -6.0);
    tower.castShadow = true;
    this.group.add(tower);

    // Rotating High-Gain Satellite Comm Array
    this.commDish = new THREE.Group();
    this.commDish.position.set(6.0, 14.2, -6.0);

    const commDishMeshGeo = new THREE.SphereGeometry(2.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 3);
    const commDishMesh = new THREE.Mesh(commDishMeshGeo, this.goldFoilMaterial);
    commDishMesh.rotation.x = -Math.PI / 2;
    commDishMesh.castShadow = true;
    this.commDish.add(commDishMesh);

    const commSpireGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5);
    const commSpire = new THREE.Mesh(commSpireGeo, this.stationMaterial);
    commSpire.position.set(0, 0, 1.2);
    commSpire.rotation.x = Math.PI / 2;
    this.commDish.add(commSpire);

    this.group.add(this.commDish);

    // Pulsing Red/Amber Aviation Beacon on mast tip
    const beaconGeo = new THREE.SphereGeometry(0.18, 12, 12);
    this.beaconMesh = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: 0xE6A23C }));
    this.beaconMesh.position.set(6.0, 16.2, -6.0);
    this.group.add(this.beaconMesh);

    this.beaconLight = new THREE.PointLight(0xE6A23C, 2.0, 25);
    this.beaconLight.position.set(6.0, 16.2, -6.0);
    this.group.add(this.beaconLight);

    // 5. Large Photovoltaic Solar Arrays
    const solarPositions = [
      { x: 14.0, y: 3.5, z: 4.0, rotY: 0.4 },
      { x: 14.0, y: 3.5, z: -4.0, rotY: -0.2 },
    ];

    solarPositions.forEach((sp) => {
      const solarGroup = new THREE.Group();
      solarGroup.position.set(sp.x, sp.y, sp.z);
      solarGroup.rotation.y = sp.rotY;

      // Pylon
      const pylonGeo = new THREE.CylinderGeometry(0.2, 0.3, 3.5, 8);
      const pylon = new THREE.Mesh(pylonGeo, this.darkComposite);
      pylon.position.set(0, -1.75, 0);
      solarGroup.add(pylon);

      // Panel frame
      const frameGeo = new THREE.BoxGeometry(6.5, 0.1, 3.2);
      const frame = new THREE.Mesh(frameGeo, this.stationMaterial);
      frame.rotation.x = -0.5;
      frame.castShadow = true;

      // Solar cells
      const cellsGeo = new THREE.BoxGeometry(6.2, 0.12, 2.9);
      const cells = new THREE.Mesh(cellsGeo, this.solarCellMaterial);
      frame.add(cells);

      solarGroup.add(frame);
      this.solarPanels.push(solarGroup);
      this.group.add(solarGroup);
    });

    // 6. Rover Docking Bay & Induction Charging Platform
    const dockBaseGeo = new THREE.BoxGeometry(7.0, 0.3, 7.0);
    const dockBase = new THREE.Mesh(dockBaseGeo, this.darkComposite);
    dockBase.position.set(0, 0.15, -12.0);
    dockBase.receiveShadow = true;
    this.group.add(dockBase);

    // Glowing induction charging rails
    const dockPadGeo = new THREE.PlaneGeometry(5.0, 5.0);
    dockPadGeo.rotateX(-Math.PI / 2);
    this.dockPadGlow = new THREE.Mesh(
      dockPadGeo,
      new THREE.MeshBasicMaterial({
        color: 0xE6A23C,
        transparent: true,
        opacity: 0.35,
      })
    );
    this.dockPadGlow.position.set(0, 0.32, -12.0);
    this.group.add(this.dockPadGlow);

    // Docking Guide Pillars
    for (let c = 0; c < 4; c++) {
      const px = (c % 2 === 0 ? -3.2 : 3.2);
      const pz = -12.0 + (c < 2 ? -3.2 : 3.2);
      const pillarGeo = new THREE.CylinderGeometry(0.12, 0.15, 1.2, 8);
      const pillar = new THREE.Mesh(pillarGeo, this.stationMaterial);
      pillar.position.set(px, 0.6, pz);

      const capGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const cap = new THREE.Mesh(capGeo, this.amberWindowMaterial);
      cap.position.set(0, 0.6, 0);
      pillar.add(cap);

      this.group.add(pillar);
    }

    // 7. Cryogenic Fuel & Atmospheric Scrubbing Tanks
    for (let t = 0; t < 3; t++) {
      const tankGeo = new THREE.CylinderGeometry(1.1, 1.1, 4.2, 16);
      const tank = new THREE.Mesh(tankGeo, this.stationMaterial);
      tank.position.set(-8.0 + t * 2.6, 2.1, 8.0);
      tank.castShadow = true;
      this.group.add(tank);

      const tankRingGeo = new THREE.TorusGeometry(1.15, 0.06, 8, 24);
      tankRingGeo.rotateX(Math.PI / 2);
      const tankRing = new THREE.Mesh(tankRingGeo, this.goldFoilMaterial);
      tankRing.position.set(0, 0, 0);
      tank.add(tankRing);
    }
  }

  public updateAnimation(elapsedTime: number) {
    // Rotate communication dish slowly
    this.commDish.rotation.y = elapsedTime * 0.15;

    // Pulse beacon light (1 Hz pulse)
    const pulse = (Math.sin(elapsedTime * 4.0) + 1.0) * 0.5;
    this.beaconLight.intensity = 0.5 + pulse * 2.5;
    (this.beaconMesh.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.6;

    // Pulse induction charging pad
    (this.dockPadGlow.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(elapsedTime * 1.5) * 0.15;
  }
}
