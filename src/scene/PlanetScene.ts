import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraMode, TimeOfDay, WeatherType, RoverState, PlanetaryConditions, Specimen } from '../types';
import { TerrainMesh } from './TerrainMesh';
import { RoverModel } from './RoverModel';
import { ResearchBaseModel } from './ResearchBaseModel';
import { CrystalFormations } from './CrystalFormations';
import { VolcanicGeology } from './VolcanicGeology';
import { BioluminescentForest } from './BioluminescentForest';
import { AlienOceanMesh } from './AlienOceanMesh';
import { AtmosphereAndSky } from './AtmosphereAndSky';
import { DiscoverablesManager } from './DiscoverablesManager';
import { getTerrainHeight, getTerrainNormal, getRegionAt, PLANETARY_REGIONS } from '../utils/terrainNoise';
import { soundFX } from '../audio/soundFX';

export interface SceneCallbacks {
  onRoverUpdate: (rover: RoverState) => void;
  onPlanetaryConditionsUpdate: (conditions: PlanetaryConditions) => void;
  onSpecimenClick: (specimen: Specimen) => void;
  onObjectClick: (name: string, info: string) => void;
  onMissionEventTrigger?: (eventCode: string) => void;
}

export class PlanetScene {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public raycaster: THREE.Raycaster;
  public mouse: THREE.Vector2;

  // Submodules
  public terrain: TerrainMesh;
  public rover: RoverModel;
  public researchBase: ResearchBaseModel;
  public crystals: CrystalFormations;
  public volcanic: VolcanicGeology;
  public forest: BioluminescentForest;
  public ocean: AlienOceanMesh;
  public sky: AtmosphereAndSky;
  public discoverables: DiscoverablesManager;

  // State
  private cameraMode: CameraMode = 'ROVER_FOLLOW';
  private timeOfDay: TimeOfDay = 'DAY';
  private weather: WeatherType = 'CLEAR';
  private isExploring = true;

  // Rover Kinematics State
  public roverState: RoverState = {
    x: 0,
    y: 0,
    z: -12, // Spawn at the Research Base Docking Bay
    rotationY: Math.PI,
    speed: 0,
    maxSpeed: 7.5, // km/h
    steeringAngle: 0,
    headlights: true,
    battery: 94,
    solarCharging: true,
    distanceTraveled: 0.12,
    distanceToBase: 0.01,
    signalQuality: 98,
    uplinkStatus: 'OPTIMAL',
    isMoving: false,
    isAutopilot: false,
    targetDestination: null,
  };

  // Driving Controls Input Map
  public input = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  private clock: THREE.Clock;
  private reqId: number | null = null;
  private callbacks: SceneCallbacks;
  private isDestroyed = false;

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Three.js Scene & Renderer Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0E0B08);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.2, 800);
    this.camera.position.set(0, 15, -28);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 2. Orbit Controls for Free Exploration
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going underground
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 320;
    this.controls.target.set(0, 1.5, -12);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 3. Instantiate 3D Environment Systems
    this.sky = new AtmosphereAndSky(this.scene);
    this.scene.add(this.sky.group);

    this.terrain = new TerrainMesh(500, 220);
    this.scene.add(this.terrain.mesh);

    this.researchBase = new ResearchBaseModel();
    this.scene.add(this.researchBase.group);

    this.crystals = new CrystalFormations();
    this.scene.add(this.crystals.group);

    this.volcanic = new VolcanicGeology();
    this.scene.add(this.volcanic.group);

    this.forest = new BioluminescentForest();
    this.scene.add(this.forest.group);

    this.ocean = new AlienOceanMesh();
    this.scene.add(this.ocean.mesh);
    this.scene.add(this.ocean.mistParticles);

    this.discoverables = new DiscoverablesManager();
    this.scene.add(this.discoverables.group);

    this.rover = new RoverModel();
    this.scene.add(this.rover.group);

    // Initial Rover Placement
    const initialHeight = getTerrainHeight(this.roverState.x, this.roverState.z);
    this.roverState.y = initialHeight;
    this.rover.group.position.set(this.roverState.x, this.roverState.y, this.roverState.z);
    this.rover.group.rotation.y = this.roverState.rotationY;

    // Apply Initial Sky & Weather
    this.sky.updateTimeOfDay(this.timeOfDay, this.scene);
    this.sky.updateWeather(this.weather, this.scene);

    // Event Listeners
    this.bindEvents();

    // Start Rendering Loop
    this.animate = this.animate.bind(this);
    this.reqId = requestAnimationFrame(this.animate);
  }

  private bindEvents() {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
  }

  private onWindowResize = () => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (['ArrowUp', 'KeyW'].includes(e.code)) this.input.forward = true;
    if (['ArrowDown', 'KeyS'].includes(e.code)) this.input.backward = true;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) this.input.left = true;
    if (['ArrowRight', 'KeyD'].includes(e.code)) this.input.right = true;
    if (e.code === 'KeyL') this.toggleHeadlights();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (['ArrowUp', 'KeyW'].includes(e.code)) this.input.forward = false;
    if (['ArrowDown', 'KeyS'].includes(e.code)) this.input.backward = false;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) this.input.left = false;
    if (['ArrowRight', 'KeyD'].includes(e.code)) this.input.right = false;
  };

  private onPointerDown = (event: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Check interactive specimen discoverables
    const specimenHits = this.raycaster.intersectObjects(this.discoverables.interactiveMeshes, false);
    if (specimenHits.length > 0) {
      const hit = specimenHits[0].object;
      const data = hit.userData?.specimenData as Specimen;
      if (data) {
        soundFX.playClick();
        this.callbacks.onSpecimenClick(data);
        return;
      }
    }

    // 2. Check Research Base clicking
    const baseHits = this.raycaster.intersectObject(this.researchBase.group, true);
    if (baseHits.length > 0) {
      soundFX.playClick();
      this.callbacks.onObjectClick(
        'Sector 0: Station Nexus',
        'Abandoned Alpha Research Base. Subsystems active on emergency auxiliary power.'
      );
      return;
    }

    // 3. Check Rover clicking
    const roverHits = this.raycaster.intersectObject(this.rover.group, true);
    if (roverHits.length > 0) {
      soundFX.playClick();
      this.callbacks.onObjectClick(
        'Expedition Rover [A-07-EX-1]',
        'Six-wheel articulated planetary explorer with stereoscopic optics and laser spectrometry.'
      );
    }
  };

  public setCameraMode(mode: CameraMode) {
    this.cameraMode = mode;
    soundFX.playClick();

    if (mode === 'FREE') {
      this.controls.enabled = true;
      this.controls.target.copy(this.rover.group.position);
    } else {
      this.controls.enabled = false;
    }
  }

  public setTimeOfDay(time: TimeOfDay) {
    this.timeOfDay = time;
    this.sky.updateTimeOfDay(time, this.scene);
    const nightFactor = time === 'NIGHT' ? 1.0 : time === 'SUNSET' ? 0.4 : time === 'DAWN' ? 0.2 : 0.0;
    this.crystals.updateNightGlow(nightFactor);
    this.forest.updateAnimation(0, this.clock.getElapsedTime(), nightFactor);
    soundFX.playClick();
  }

  public setWeather(weather: WeatherType) {
    this.weather = weather;
    this.sky.updateWeather(weather, this.scene);
    soundFX.playClick();
  }

  public toggleHeadlights() {
    this.roverState.headlights = !this.roverState.headlights;
    this.rover.setHeadlights(this.roverState.headlights);
    soundFX.playClick();
  }

  public navigateToCoordinates(x: number, z: number, name: string) {
    this.roverState.isAutopilot = true;
    this.roverState.targetDestination = { x, z, name };
    soundFX.playScanBeep();
  }

  public cancelAutopilot() {
    this.roverState.isAutopilot = false;
    this.roverState.targetDestination = null;
  }

  private updateRoverPhysics(delta: number) {
    const r = this.roverState;

    // Handle Manual / Autopilot Steering and Acceleration
    let targetSpeed = 0;
    let targetSteering = 0;

    if (r.isAutopilot && r.targetDestination) {
      const dx = r.targetDestination.x - r.x;
      const dz = r.targetDestination.z - r.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 4.0) {
        // Arrived at destination!
        r.isAutopilot = false;
        r.targetDestination = null;
        soundFX.playDiscoveryChime();
      } else {
        const desiredAngle = Math.atan2(dx, dz) + Math.PI;
        let angleDiff = desiredAngle - r.rotationY;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        targetSteering = Math.max(-0.45, Math.min(0.45, angleDiff * 1.5));
        targetSpeed = dist > 15 ? r.maxSpeed : r.maxSpeed * 0.55;
      }
    } else {
      // Manual controls
      if (this.input.forward) targetSpeed += r.maxSpeed;
      if (this.input.backward) targetSpeed -= r.maxSpeed * 0.55;

      if (this.input.left) targetSteering += 0.45;
      if (this.input.right) targetSteering -= 0.45;
    }

    // Smooth speed & steering interpolation
    r.speed = THREE.MathUtils.lerp(r.speed, targetSpeed, delta * 4.0);
    r.steeringAngle = THREE.MathUtils.lerp(r.steeringAngle, targetSteering, delta * 8.0);

    const isMoving = Math.abs(r.speed) > 0.05;
    r.isMoving = isMoving;

    // Turn rover when moving
    if (isMoving) {
      const turnRate = r.steeringAngle * (r.speed / r.maxSpeed) * delta * 2.2;
      r.rotationY += turnRate;

      // Translate position
      const moveDist = (r.speed * 0.28) * delta * 4.0; // Conversion to world units/sec
      r.x -= Math.sin(r.rotationY) * moveDist;
      r.z -= Math.cos(r.rotationY) * moveDist;

      // Keep inside exploration boundary
      r.x = Math.max(-220, Math.min(220, r.x));
      r.z = Math.max(-220, Math.min(220, r.z));

      // Update telemetry distance
      r.distanceTraveled += Math.abs(moveDist) * 0.001; // in km
    }

    // Align rover with procedural terrain height and surface normal
    const groundY = getTerrainHeight(r.x, r.z);
    r.y = THREE.MathUtils.lerp(r.y, groundY, delta * 15.0);

    const surfaceNormal = getTerrainNormal(r.x, r.z);

    // Apply translation to Three.js rover group
    this.rover.group.position.set(r.x, r.y, r.z);

    // Orient rover with surface normal and heading
    const forward = new THREE.Vector3(-Math.sin(r.rotationY), 0, -Math.cos(r.rotationY)).normalize();
    const right = new THREE.Vector3().crossVectors(surfaceNormal, forward).normalize();
    const correctedForward = new THREE.Vector3().crossVectors(right, surfaceNormal).normalize();

    const rotationMatrix = new THREE.Matrix4().makeBasis(right, surfaceNormal, correctedForward.negate());
    this.rover.group.quaternion.setFromRotationMatrix(rotationMatrix);

    // Animate wheels & mast
    const deltaDistance = r.speed * delta * 2.0;
    this.rover.updateAnimation(deltaDistance, r.steeringAngle, this.clock.getElapsedTime());

    // Update Distance to Base and Signal Quality (Inverse square law approximation)
    const distToBaseUnits = Math.sqrt(r.x * r.x + r.z * r.z);
    r.distanceToBase = parseFloat((distToBaseUnits * 0.02).toFixed(2));

    // Signal drops with distance and weather attenuation
    let signal = 100 - (distToBaseUnits / 220) * 45;
    if (this.weather === 'ALIEN_STORM') signal -= 25;
    if (this.weather === 'DUST') signal -= 10;
    r.signalQuality = Math.max(8, Math.min(100, Math.round(signal)));

    if (r.signalQuality > 75) r.uplinkStatus = 'OPTIMAL';
    else if (r.signalQuality > 45) r.uplinkStatus = 'STABLE';
    else if (r.signalQuality > 20) r.uplinkStatus = 'DEGRADED';
    else r.uplinkStatus = 'WEAK';

    // Battery simulation (Consumes with driving, recharges under sunlight)
    if (isMoving) {
      r.battery = Math.max(5, r.battery - delta * 0.02);
    } else if (this.timeOfDay === 'DAY' || this.timeOfDay === 'DAWN') {
      r.battery = Math.min(100, r.battery + delta * 0.015);
    }

    // Update sound synthesizer
    soundFX.updateRoverSound(Math.abs(r.speed), isMoving);
  }

  private updateCamera(delta: number) {
    const roverPos = this.rover.group.position;
    const roverRotY = this.roverState.rotationY;

    switch (this.cameraMode) {
      case 'ROVER_FOLLOW': {
        const offset = new THREE.Vector3(
          Math.sin(roverRotY) * 9.0,
          3.8,
          Math.cos(roverRotY) * 9.0
        );
        const targetCamPos = roverPos.clone().add(offset);
        const lookTarget = roverPos.clone().add(new THREE.Vector3(0, 1.2, 0));

        this.camera.position.lerp(targetCamPos, delta * 5.0);
        this.camera.lookAt(lookTarget);
        break;
      }
      case 'ROVER_FRONT': {
        // Cockpit / Hood camera
        const offset = new THREE.Vector3(
          -Math.sin(roverRotY) * 0.8,
          1.8,
          -Math.cos(roverRotY) * 0.8
        );
        const targetCamPos = roverPos.clone().add(offset);
        const lookAhead = roverPos.clone().add(
          new THREE.Vector3(-Math.sin(roverRotY) * 20.0, 1.2, -Math.cos(roverRotY) * 20.0)
        );

        this.camera.position.lerp(targetCamPos, delta * 12.0);
        this.camera.lookAt(lookAhead);
        break;
      }
      case 'ROVER_REAR': {
        // Rear sensor camera looking backward
        const offset = new THREE.Vector3(
          -Math.sin(roverRotY) * 1.5,
          1.6,
          -Math.cos(roverRotY) * 1.5
        );
        const targetCamPos = roverPos.clone().add(offset);
        const lookBehind = roverPos.clone().add(
          new THREE.Vector3(Math.sin(roverRotY) * 18.0, 1.0, Math.cos(roverRotY) * 18.0)
        );

        this.camera.position.lerp(targetCamPos, delta * 10.0);
        this.camera.lookAt(lookBehind);
        break;
      }
      case 'TOP_VIEW': {
        // Overhead tactical satellite map
        const targetCamPos = new THREE.Vector3(roverPos.x, roverPos.y + 45.0, roverPos.z);
        this.camera.position.lerp(targetCamPos, delta * 4.0);
        this.camera.lookAt(roverPos);
        break;
      }
      case 'FREE': {
        this.controls.update();
        break;
      }
    }
  }

  private updatePlanetaryTelemetry() {
    const regionId = getRegionAt(this.roverState.x, this.roverState.z);
    const region = PLANETARY_REGIONS[regionId];

    // Temperature fluctuation based on time of day and region
    let temp = region.baseTemp;
    if (this.timeOfDay === 'NIGHT') temp -= 14.5;
    else if (this.timeOfDay === 'SUNSET') temp -= 6.2;
    else if (this.timeOfDay === 'DAWN') temp -= 8.0;

    // Wind speed fluctuation based on weather
    let wind = 12.0;
    if (this.weather === 'ALIEN_STORM') wind = 68.5;
    else if (this.weather === 'DUST') wind = 38.0;
    else if (this.weather === 'MIST') wind = 6.2;

    // Visibility
    let visibility = 95;
    if (this.weather === 'ALIEN_STORM') visibility = 28;
    else if (this.weather === 'DUST') visibility = 54;
    else if (this.weather === 'MIST') visibility = 42;

    const conditions: PlanetaryConditions = {
      temperature: parseFloat(temp.toFixed(1)),
      gravity: 0.82,
      atmosphericPressure: region.basePressure,
      windSpeed: parseFloat(wind.toFixed(1)),
      windDirection: 'ESE 112°',
      visibility,
      radiation: region.baseRadiation as 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH',
      elevation: parseFloat((this.roverState.y * 12.4 + 420).toFixed(1)),
    };

    this.callbacks.onPlanetaryConditionsUpdate(conditions);
  }

  private animate() {
    if (this.isDestroyed) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update Rover Kinematics & Ground Physics
    this.updateRoverPhysics(delta);

    // 2. Update Camera Tracking
    this.updateCamera(delta);

    // 3. Update Subsystem Animations
    this.researchBase.updateAnimation(elapsedTime);
    this.volcanic.updateAnimation(delta, elapsedTime);
    this.ocean.updateAnimation(elapsedTime);
    this.discoverables.updateAnimation(elapsedTime);
    this.sky.updateAnimation(delta, elapsedTime, this.weather);

    const nightFactor = this.timeOfDay === 'NIGHT' ? 1.0 : this.timeOfDay === 'SUNSET' ? 0.4 : 0.0;
    this.forest.updateAnimation(delta, elapsedTime, nightFactor);

    // 4. Dispatch Telemetry to React UI
    this.callbacks.onRoverUpdate({ ...this.roverState });
    this.updatePlanetaryTelemetry();

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);

    this.reqId = requestAnimationFrame(this.animate);
  }

  public dispose() {
    this.isDestroyed = true;
    if (this.reqId) cancelAnimationFrame(this.reqId);

    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);

    this.terrain.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
