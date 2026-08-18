import * as THREE from 'three';
import { TimeOfDay, WeatherType } from '../types';

export class AtmosphereAndSky {
  public group: THREE.Group;
  public sunLight: THREE.DirectionalLight;
  public hemiLight: THREE.HemisphereLight;
  public ambientLight: THREE.AmbientLight;
  public skyDome: THREE.Mesh;
  public sunSphere: THREE.Mesh;
  public moonPrimary: THREE.Mesh;
  public moonSecondary: THREE.Mesh;
  public starPoints: THREE.Points;
  public weatherParticles: THREE.Points;

  private weatherPositions: Float32Array;
  private weatherVelocities: Float32Array;
  private weatherCount = 1400;
  private weatherMat: THREE.PointsMaterial;
  private starMaterial: THREE.PointsMaterial;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.group.name = 'AtmosphereAndSky';

    // 1. Directional Sun Light
    this.sunLight = new THREE.DirectionalLight(0xFFE2B7, 1.8);
    this.sunLight.position.set(120, 150, 100);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 400;
    const d = 160;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    scene.add(this.sunLight);

    // 2. Hemisphere & Ambient Lights
    this.hemiLight = new THREE.HemisphereLight(0xE6A23C, 0x1A1410, 0.6);
    scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0x281F19, 0.45);
    scene.add(this.ambientLight);

    // 3. Sky Dome (Large inverted sphere)
    const skyGeo = new THREE.SphereGeometry(380, 24, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x1E140D,
      side: THREE.BackSide,
    });
    this.skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(this.skyDome);

    // 4. Sun Sphere Mesh (Visual sun in sky)
    const sunGeo = new THREE.SphereGeometry(14, 16, 16);
    const sunMeshMat = new THREE.MeshBasicMaterial({ color: 0xFFF0D0 });
    this.sunSphere = new THREE.Mesh(sunGeo, sunMeshMat);
    this.group.add(this.sunSphere);

    // 5. Binary Alien Moons (Planet A-07 has twin moons)
    const moonGeo1 = new THREE.SphereGeometry(8, 16, 16);
    const moonMat1 = new THREE.MeshBasicMaterial({ color: 0xD9C5AC });
    this.moonPrimary = new THREE.Mesh(moonGeo1, moonMat1);
    this.moonPrimary.position.set(-180, 140, -200);
    this.group.add(this.moonPrimary);

    const moonGeo2 = new THREE.SphereGeometry(3.5, 12, 12);
    const moonMat2 = new THREE.MeshBasicMaterial({ color: 0x967B62 });
    this.moonSecondary = new THREE.Mesh(moonGeo2, moonMat2);
    this.moonSecondary.position.set(-150, 160, -180);
    this.group.add(this.moonSecondary);

    // 6. Deep Starfield (Thousands of distant stars)
    const starCount = 2800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.95); // Upper hemisphere only
      const r = 360;

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    this.starMaterial = new THREE.PointsMaterial({
      color: 0xF4D58D,
      size: 1.8,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });
    this.starPoints = new THREE.Points(starGeo, this.starMaterial);
    this.group.add(this.starPoints);

    // 7. Weather & Atmospheric Particulate System
    const weatherGeo = new THREE.BufferGeometry();
    this.weatherPositions = new Float32Array(this.weatherCount * 3);
    this.weatherVelocities = new Float32Array(this.weatherCount * 3);

    for (let i = 0; i < this.weatherCount; i++) {
      this.weatherPositions[i * 3] = (Math.random() - 0.5) * 360;
      this.weatherPositions[i * 3 + 1] = Math.random() * 50;
      this.weatherPositions[i * 3 + 2] = (Math.random() - 0.5) * 360;

      this.weatherVelocities[i * 3] = -0.5 - Math.random() * 0.8;
      this.weatherVelocities[i * 3 + 1] = -0.1 - Math.random() * 0.2;
      this.weatherVelocities[i * 3 + 2] = -0.2 - Math.random() * 0.4;
    }

    weatherGeo.setAttribute('position', new THREE.BufferAttribute(this.weatherPositions, 3));
    this.weatherMat = new THREE.PointsMaterial({
      color: 0xC96F3B,
      size: 1.6,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    this.weatherParticles = new THREE.Points(weatherGeo, this.weatherMat);
    this.group.add(this.weatherParticles);

    // Initial Scene Fog (Warm dusty atmosphere)
    scene.fog = new THREE.FogExp2(0x1E140D, 0.0055);
  }

  public updateTimeOfDay(time: TimeOfDay, scene: THREE.Scene) {
    const skyMat = this.skyDome.material as THREE.MeshBasicMaterial;

    switch (time) {
      case 'DAWN': {
        this.sunLight.position.set(160, 45, 120);
        this.sunSphere.position.set(160, 45, 120);
        this.sunLight.color.setHex(0xE68A48);
        this.sunLight.intensity = 1.2;
        this.hemiLight.color.setHex(0xC96F3B);
        this.hemiLight.groundColor.setHex(0x18100B);
        this.ambientLight.color.setHex(0x352015);
        this.ambientLight.intensity = 0.45;
        skyMat.color.setHex(0x2E160D);
        if (scene.fog) (scene.fog as THREE.FogExp2).color.setHex(0x2E160D);
        this.starMaterial.opacity = 0.35;
        this.sunSphere.visible = true;
        break;
      }
      case 'DAY': {
        this.sunLight.position.set(90, 160, 80);
        this.sunSphere.position.set(90, 160, 80);
        this.sunLight.color.setHex(0xFFE5C0);
        this.sunLight.intensity = 1.9;
        this.hemiLight.color.setHex(0xE6A23C);
        this.hemiLight.groundColor.setHex(0x221810);
        this.ambientLight.color.setHex(0x403022);
        this.ambientLight.intensity = 0.55;
        skyMat.color.setHex(0x382214);
        if (scene.fog) (scene.fog as THREE.FogExp2).color.setHex(0x382214);
        this.starMaterial.opacity = 0.05;
        this.sunSphere.visible = true;
        break;
      }
      case 'SUNSET': {
        this.sunLight.position.set(-160, 30, -110);
        this.sunSphere.position.set(-160, 30, -110);
        this.sunLight.color.setHex(0xD95328);
        this.sunLight.intensity = 1.3;
        this.hemiLight.color.setHex(0xB84E25);
        this.hemiLight.groundColor.setHex(0x140D09);
        this.ambientLight.color.setHex(0x381C10);
        this.ambientLight.intensity = 0.4;
        skyMat.color.setHex(0x2B110A);
        if (scene.fog) (scene.fog as THREE.FogExp2).color.setHex(0x2B110A);
        this.starMaterial.opacity = 0.5;
        this.sunSphere.visible = true;
        break;
      }
      case 'NIGHT': {
        this.sunLight.position.set(-60, -80, -60);
        this.sunSphere.position.set(-60, -80, -60);
        this.sunLight.color.setHex(0x3D3545);
        this.sunLight.intensity = 0.25; // Subtle moonlight
        this.hemiLight.color.setHex(0x2B2433);
        this.hemiLight.groundColor.setHex(0x0E0B08);
        this.ambientLight.color.setHex(0x16131A);
        this.ambientLight.intensity = 0.22;
        skyMat.color.setHex(0x0A0809);
        if (scene.fog) (scene.fog as THREE.FogExp2).color.setHex(0x0A0809);
        this.starMaterial.opacity = 0.95;
        this.sunSphere.visible = false;
        break;
      }
    }
  }

  public updateWeather(weather: WeatherType, scene: THREE.Scene) {
    if (!scene.fog) return;
    const fog = scene.fog as THREE.FogExp2;

    switch (weather) {
      case 'CLEAR':
        fog.density = 0.0045;
        this.weatherMat.opacity = 0.2;
        this.weatherMat.size = 1.2;
        this.weatherMat.color.setHex(0xC96F3B);
        break;
      case 'DUST':
        fog.density = 0.012;
        this.weatherMat.opacity = 0.65;
        this.weatherMat.size = 2.4;
        this.weatherMat.color.setHex(0xB85C2A);
        break;
      case 'ALIEN_STORM':
        fog.density = 0.022;
        this.weatherMat.opacity = 0.85;
        this.weatherMat.size = 3.2;
        this.weatherMat.color.setHex(0x8C3822);
        break;
      case 'MIST':
        fog.density = 0.016;
        this.weatherMat.opacity = 0.45;
        this.weatherMat.size = 3.8;
        this.weatherMat.color.setHex(0x665545);
        break;
    }
  }

  public updateAnimation(delta: number, elapsedTime: number, weather: WeatherType) {
    // Animate weather particulate movement
    const posAttr = this.weatherParticles.geometry.attributes.position;
    const speedMult = weather === 'ALIEN_STORM' ? 4.5 : weather === 'DUST' ? 2.5 : 1.0;

    for (let i = 0; i < this.weatherCount; i++) {
      this.weatherPositions[i * 3] += this.weatherVelocities[i * 3] * delta * 18.0 * speedMult;
      this.weatherPositions[i * 3 + 1] += this.weatherVelocities[i * 3 + 1] * delta * 8.0 * speedMult;
      this.weatherPositions[i * 3 + 2] += this.weatherVelocities[i * 3 + 2] * delta * 12.0 * speedMult;

      // Wrap around bounds
      if (this.weatherPositions[i * 3] < -180) this.weatherPositions[i * 3] = 180;
      if (this.weatherPositions[i * 3 + 1] < 0) this.weatherPositions[i * 3 + 1] = 45;
      if (this.weatherPositions[i * 3 + 2] < -180) this.weatherPositions[i * 3 + 2] = 180;
    }
    posAttr.needsUpdate = true;

    // Twinkle stars
    this.starPoints.rotation.y = elapsedTime * 0.002;
  }
}
