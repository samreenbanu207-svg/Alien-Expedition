import * as THREE from 'three';

export class RoverModel {
  public group: THREE.Group;
  public wheels: THREE.Mesh[] = [];
  public wheelSteerGroups: THREE.Group[] = [];
  public mastHead: THREE.Group;
  public antennaDish: THREE.Mesh;
  public roboticArm: THREE.Group;
  public headlightLeft: THREE.SpotLight;
  public headlightRight: THREE.SpotLight;
  public headlightConeLeft: THREE.Mesh;
  public headlightConeRight: THREE.Mesh;
  public headlightBulbLeft: THREE.Mesh;
  public headlightBulbRight: THREE.Mesh;

  private chassisMaterial: THREE.MeshStandardMaterial;
  private goldFoilMaterial: THREE.MeshStandardMaterial;
  private darkMetalMaterial: THREE.MeshStandardMaterial;
  private tireMaterial: THREE.MeshStandardMaterial;
  private amberAccentMaterial: THREE.MeshStandardMaterial;
  private lensMaterial: THREE.MeshBasicMaterial;
  private coneMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'ExplorationRover';

    // Materials - Obsidian, Warm Titanium, Gold Thermal Insulation, Amber Accents
    this.chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x2A241F,
      metalness: 0.65,
      roughness: 0.35,
    });

    this.goldFoilMaterial = new THREE.MeshStandardMaterial({
      color: 0xD49B3E,
      metalness: 0.85,
      roughness: 0.25,
    });

    this.darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x181411,
      metalness: 0.85,
      roughness: 0.3,
    });

    this.tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x12100E,
      metalness: 0.2,
      roughness: 0.85,
    });

    this.amberAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4ff00,
      emissive: 0xa3c900,
      emissiveIntensity: 0.5,
      metalness: 0.5,
      roughness: 0.3,
    });

    this.lensMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4ff00,
    });

    this.coneMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4ff00,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // 1. Central Main Chassis Body
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.6, 2.4);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.chassisMaterial);
    bodyMesh.position.y = 0.75;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.group.add(bodyMesh);

    // Thermal Insulation Core (Golden wrap around electronics deck)
    const thermalCoreGeo = new THREE.BoxGeometry(1.4, 0.35, 1.8);
    const thermalCoreMesh = new THREE.Mesh(thermalCoreGeo, this.goldFoilMaterial);
    thermalCoreMesh.position.set(0, 0.9, 0.1);
    thermalCoreMesh.castShadow = true;
    this.group.add(thermalCoreMesh);

    // Upper Solar Panel Deck
    const solarDeckGeo = new THREE.BoxGeometry(1.5, 0.05, 2.0);
    const solarDeckMesh = new THREE.Mesh(solarDeckGeo, this.darkMetalMaterial);
    solarDeckMesh.position.set(0, 1.1, 0.1);
    solarDeckMesh.castShadow = true;
    this.group.add(solarDeckMesh);

    // Amber scientific stripes on solar deck
    const stripeGeo = new THREE.BoxGeometry(0.12, 0.06, 1.9);
    const stripeL = new THREE.Mesh(stripeGeo, this.amberAccentMaterial);
    stripeL.position.set(-0.65, 1.1, 0.1);
    const stripeR = new THREE.Mesh(stripeGeo, this.amberAccentMaterial);
    stripeR.position.set(0.65, 1.1, 0.1);
    this.group.add(stripeL, stripeR);

    // 2. Camera Mast & Pan/Tilt Sensor Head
    const mastPoleGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.9, 12);
    const mastPoleMesh = new THREE.Mesh(mastPoleGeo, this.darkMetalMaterial);
    mastPoleMesh.position.set(0.45, 1.5, -0.6);
    mastPoleMesh.castShadow = true;
    this.group.add(mastPoleMesh);

    this.mastHead = new THREE.Group();
    this.mastHead.position.set(0.45, 1.95, -0.6);

    const mastHeadBoxGeo = new THREE.BoxGeometry(0.3, 0.18, 0.22);
    const mastHeadBox = new THREE.Mesh(mastHeadBoxGeo, this.chassisMaterial);
    mastHeadBox.castShadow = true;
    this.mastHead.add(mastHeadBox);

    // Binocular stereoscopic cameras
    const eyeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.1, 16);
    eyeGeo.rotateX(Math.PI / 2);
    const eyeL = new THREE.Mesh(eyeGeo, this.lensMaterial);
    eyeL.position.set(-0.08, 0, -0.12);
    const eyeR = new THREE.Mesh(eyeGeo, this.lensMaterial);
    eyeR.position.set(0.08, 0, -0.12);
    this.mastHead.add(eyeL, eyeR);

    // Laser rangefinder emitter in center
    const laserEmitterGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 12);
    laserEmitterGeo.rotateX(Math.PI / 2);
    const laserEmitter = new THREE.Mesh(laserEmitterGeo, this.amberAccentMaterial);
    laserEmitter.position.set(0, 0.04, -0.12);
    this.mastHead.add(laserEmitter);

    this.group.add(this.mastHead);

    // 3. Rear High-Gain Parabolic Communications Antenna
    const dishGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.8);
    this.antennaDish = new THREE.Mesh(dishGeo, this.goldFoilMaterial);
    this.antennaDish.position.set(-0.45, 1.45, 0.85);
    this.antennaDish.rotation.set(-0.6, 0.3, 0);
    this.antennaDish.castShadow = true;
    this.group.add(this.antennaDish);

    const dishFeedGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25);
    const dishFeed = new THREE.Mesh(dishFeedGeo, this.darkMetalMaterial);
    dishFeed.position.set(-0.45, 1.55, 0.72);
    dishFeed.rotation.set(-0.6, 0.3, 0);
    this.group.add(dishFeed);

    // 4. Articulated Robotic Sampling Arm
    this.roboticArm = new THREE.Group();
    this.roboticArm.position.set(-0.55, 0.7, -0.9);

    const armBaseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12);
    const armBase = new THREE.Mesh(armBaseGeo, this.darkMetalMaterial);
    this.roboticArm.add(armBase);

    const armSegment1Geo = new THREE.CylinderGeometry(0.035, 0.035, 0.6);
    armSegment1Geo.rotateZ(Math.PI / 4);
    const armSeg1 = new THREE.Mesh(armSegment1Geo, this.chassisMaterial);
    armSeg1.position.set(-0.2, 0.2, -0.15);
    this.roboticArm.add(armSeg1);

    const spectrometerHeadGeo = new THREE.BoxGeometry(0.12, 0.12, 0.18);
    const spectrometer = new THREE.Mesh(spectrometerHeadGeo, this.amberAccentMaterial);
    spectrometer.position.set(-0.4, 0.38, -0.3);
    this.roboticArm.add(spectrometer);

    this.group.add(this.roboticArm);

    // 5. Rocker-Bogie Suspension & 6 Grooved All-Terrain Wheels
    // Front (-0.95), Middle (0.0), Rear (0.95) | Left (-1.1), Right (1.1)
    const wheelPositions = [
      { x: -1.05, y: 0.38, z: -0.95, isFront: true },
      { x: 1.05, y: 0.38, z: -0.95, isFront: true },
      { x: -1.1, y: 0.38, z: 0.0, isFront: false },
      { x: 1.1, y: 0.38, z: 0.0, isFront: false },
      { x: -1.05, y: 0.38, z: 0.95, isFront: false, isRear: true },
      { x: 1.05, y: 0.38, z: 0.95, isFront: false, isRear: true },
    ];

    const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.3, 20);
    wheelGeo.rotateZ(Math.PI / 2);

    const hubcapGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.32, 12);
    hubcapGeo.rotateZ(Math.PI / 2);

    wheelPositions.forEach((pos, idx) => {
      const steerGroup = new THREE.Group();
      steerGroup.position.set(pos.x, pos.y, pos.z);

      const wheelMesh = new THREE.Mesh(wheelGeo, this.tireMaterial);
      wheelMesh.castShadow = true;
      wheelMesh.receiveShadow = true;

      const hubMesh = new THREE.Mesh(hubcapGeo, this.goldFoilMaterial);
      wheelMesh.add(hubMesh);

      // Tread ribs on tires
      for (let r = 0; r < 6; r++) {
        const ribGeo = new THREE.BoxGeometry(0.31, 0.04, 0.06);
        const rib = new THREE.Mesh(ribGeo, this.darkMetalMaterial);
        const angle = (r / 6) * Math.PI;
        rib.position.set(0, Math.sin(angle) * 0.35, Math.cos(angle) * 0.35);
        rib.rotation.x = angle;
        wheelMesh.add(rib);
      }

      steerGroup.add(wheelMesh);
      this.wheels.push(wheelMesh);
      this.wheelSteerGroups.push(steerGroup);
      this.group.add(steerGroup);

      // Suspension Strut connecting to chassis
      const strutGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5);
      strutGeo.rotateZ(pos.x > 0 ? -0.5 : 0.5);
      const strut = new THREE.Mesh(strutGeo, this.darkMetalMaterial);
      strut.position.set(pos.x > 0 ? pos.x - 0.2 : pos.x + 0.2, pos.y + 0.2, pos.z);
      this.group.add(strut);
    });

    // 6. Dual LED Headlights & Volumetric Lighting Cones
    const bulbGeo = new THREE.SphereGeometry(0.07, 12, 12);

    this.headlightBulbLeft = new THREE.Mesh(bulbGeo, this.lensMaterial);
    this.headlightBulbLeft.position.set(-0.55, 0.68, -1.22);
    this.group.add(this.headlightBulbLeft);

    this.headlightBulbRight = new THREE.Mesh(bulbGeo, this.lensMaterial);
    this.headlightBulbRight.position.set(0.55, 0.68, -1.22);
    this.group.add(this.headlightBulbRight);

    // Three.js SpotLights
    this.headlightLeft = new THREE.SpotLight(0xFFF2DC, 3.5, 38, Math.PI / 5, 0.45, 1.2);
    this.headlightLeft.position.set(-0.55, 0.75, -1.2);
    this.headlightLeft.castShadow = true;
    this.headlightLeft.shadow.mapSize.width = 512;
    this.headlightLeft.shadow.mapSize.height = 512;
    this.headlightLeft.shadow.camera.near = 0.5;
    this.headlightLeft.shadow.camera.far = 40;

    const targetL = new THREE.Object3D();
    targetL.position.set(-0.55, 0.0, -18);
    this.group.add(targetL);
    this.headlightLeft.target = targetL;
    this.group.add(this.headlightLeft);

    this.headlightRight = new THREE.SpotLight(0xFFF2DC, 3.5, 38, Math.PI / 5, 0.45, 1.2);
    this.headlightRight.position.set(0.55, 0.75, -1.2);
    this.headlightRight.castShadow = true;
    this.headlightRight.shadow.mapSize.width = 512;
    this.headlightRight.shadow.mapSize.height = 512;
    this.headlightRight.shadow.camera.near = 0.5;
    this.headlightRight.shadow.camera.far = 40;

    const targetR = new THREE.Object3D();
    targetR.position.set(0.55, 0.0, -18);
    this.group.add(targetR);
    this.headlightRight.target = targetR;
    this.group.add(this.headlightRight);

    // Volumetric Cone VFX
    const coneGeo = new THREE.ConeGeometry(3.2, 14, 16, 1, true);
    coneGeo.rotateX(-Math.PI / 2);
    coneGeo.translate(0, 0, -7);

    this.headlightConeLeft = new THREE.Mesh(coneGeo, this.coneMaterial);
    this.headlightConeLeft.position.set(-0.55, 0.75, -1.2);
    this.group.add(this.headlightConeLeft);

    this.headlightConeRight = new THREE.Mesh(coneGeo, this.coneMaterial);
    this.headlightConeRight.position.set(0.55, 0.75, -1.2);
    this.group.add(this.headlightConeRight);

    this.setHeadlights(true);
  }

  public setHeadlights(enabled: boolean) {
    this.headlightLeft.intensity = enabled ? 4.0 : 0.0;
    this.headlightRight.intensity = enabled ? 4.0 : 0.0;
    this.headlightConeLeft.visible = enabled;
    this.headlightConeRight.visible = enabled;
    (this.headlightBulbLeft.material as THREE.MeshBasicMaterial).color.setHex(enabled ? 0xFFF2DC : 0x443B33);
    (this.headlightBulbRight.material as THREE.MeshBasicMaterial).color.setHex(enabled ? 0xFFF2DC : 0x443B33);
  }

  public updateAnimation(deltaDistance: number, steeringAngle: number, elapsedTime: number) {
    // Rotate all wheels according to distance traveled
    const wheelCircumference = Math.PI * 0.72;
    const wheelRotation = (deltaDistance / wheelCircumference) * Math.PI * 2;
    this.wheels.forEach(w => {
      w.rotation.x += wheelRotation;
    });

    // Steer front and rear wheels (Ackermann-like 4-wheel steer)
    // Front wheels (idx 0, 1) steer with steeringAngle; Rear wheels (idx 4, 5) counter-steer slightly
    if (this.wheelSteerGroups[0]) this.wheelSteerGroups[0].rotation.y = steeringAngle;
    if (this.wheelSteerGroups[1]) this.wheelSteerGroups[1].rotation.y = steeringAngle;
    if (this.wheelSteerGroups[4]) this.wheelSteerGroups[4].rotation.y = -steeringAngle * 0.5;
    if (this.wheelSteerGroups[5]) this.wheelSteerGroups[5].rotation.y = -steeringAngle * 0.5;

    // Micro-pan camera mast
    this.mastHead.rotation.y = Math.sin(elapsedTime * 0.4) * 0.25 + steeringAngle * 0.5;
    this.mastHead.rotation.x = Math.sin(elapsedTime * 0.3) * 0.05;

    // Micro-oscillate antenna dish
    this.antennaDish.rotation.z = Math.sin(elapsedTime * 0.2) * 0.08;
  }
}
