export type RegionId = 
  | 'RESEARCH_BASE'
  | 'RED_DESERT'
  | 'CRYSTAL_VALLEY'
  | 'VOLCANIC_ZONE'
  | 'BIOLUMINESCENT_FOREST'
  | 'ALIEN_OCEAN';

export interface RegionInfo {
  id: RegionId;
  name: string;
  subtitle: string;
  description: string;
  center: [number, number]; // [x, z]
  radius: number;
  baseTemp: number; // in Celsius
  baseRadiation: string; // 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  basePressure: number; // in ATM
  dangerLevel: 'MINIMAL' | 'LOW' | 'ELEVATED' | 'HIGH';
  geologicalNotes: string;
}

export type TimeOfDay = 'DAWN' | 'DAY' | 'SUNSET' | 'NIGHT';

export type WeatherType = 'CLEAR' | 'DUST' | 'ALIEN_STORM' | 'MIST';

export type CameraMode = 'FREE' | 'ROVER_FOLLOW' | 'ROVER_FRONT' | 'ROVER_REAR' | 'TOP_VIEW';

export interface RoverState {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  speed: number;
  maxSpeed: number;
  steeringAngle: number;
  headlights: boolean;
  battery: number; // 0 - 100%
  solarCharging: boolean;
  distanceTraveled: number; // km
  distanceToBase: number; // km
  signalQuality: number; // 0 - 100%
  uplinkStatus: 'OPTIMAL' | 'STABLE' | 'DEGRADED' | 'WEAK' | 'OFFLINE';
  isMoving: boolean;
  isAutopilot: boolean;
  targetDestination?: { x: number; z: number; name: string } | null;
}

export interface PlanetaryConditions {
  temperature: number;
  gravity: number; // G
  atmosphericPressure: number; // ATM
  windSpeed: number; // km/h
  windDirection: string;
  visibility: number; // %
  radiation: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  elevation: number; // meters
}

export interface Specimen {
  id: string;
  code: string;
  name: string;
  region: RegionId;
  category: 'MINERAL' | 'FLORA' | 'GEOLOGY' | 'ENERGY' | 'ARTIFACT' | 'RELIC';
  position: [number, number, number];
  description: string;
  composition: string;
  thermalSignature: string;
  radiationLevel: string;
  density: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'ANOMALOUS';
  scientificValue: string;
  isScanned: boolean;
  isAnalyzed: boolean;
  scanTimestamp?: string;
  scanProgress: number; // 0 to 100
}

export interface MissionStage {
  id: number;
  stageCode: string;
  title: string;
  objective: string;
  targetRegion?: RegionId;
  completed: boolean;
  current: boolean;
  hint: string;
}

export interface BaseSubsystem {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'STANDBY' | 'MAINTENANCE_REQUIRED';
  efficiency: number; // %
  condition: string;
  powerDraw: string;
  telemetryData: Record<string, string | number>;
  description: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'DISCOVERY' | 'WARNING' | 'TELEMETRY' | 'SYSTEM';
  message: string;
  region?: string;
}

export type ActiveModal = 
  | null
  | 'MAP'
  | 'SCANNER'
  | 'SPECIMENS'
  | 'RESEARCH_BASE'
  | 'MISSION'
  | 'EVENT_LOG'
  | 'SCIENCE_GUIDE'
  | 'SPECIMEN_DETAIL';
