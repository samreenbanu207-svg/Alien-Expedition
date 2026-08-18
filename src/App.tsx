import React, { useState, useEffect, useRef } from 'react';
import {
  ActiveModal,
  CameraMode,
  LogEntry,
  MissionStage,
  PlanetaryConditions,
  RoverState,
  Specimen,
  TimeOfDay,
  WeatherType,
} from './types';
import { PlanetScene } from './scene/PlanetScene';
import { INITIAL_SPECIMENS } from './scene/DiscoverablesManager';
import { PLANETARY_REGIONS, getRegionAt } from './utils/terrainNoise';
import { soundFX } from './audio/soundFX';

// UI Components
import { TopBar } from './components/TopBar';
import { ExplorationNav } from './components/ExplorationNav';
import { TelemetryHUD } from './components/TelemetryHUD';
import { BottomStatusBar } from './components/BottomStatusBar';
import { MiniMap } from './components/MiniMap';
import { RoverControlsOverlay } from './components/RoverControlsOverlay';
import { PlanetaryMapModal } from './components/PlanetaryMapModal';
import { ScannerOverlay } from './components/ScannerOverlay';
import { SpecimenDetailModal } from './components/SpecimenDetailModal';
import { DiscoveryLogModal } from './components/DiscoveryLogModal';
import { ResearchBaseModal } from './components/ResearchBaseModal';
import { MissionTimelineModal } from './components/MissionTimelineModal';
import { EventLogDrawer } from './components/EventLogDrawer';
import { ScienceGuideModal } from './components/ScienceGuideModal';
import { WebGLFallback } from './components/WebGLFallback';

const INITIAL_MISSION_STAGES: MissionStage[] = [
  {
    id: 1,
    stageCode: '01',
    title: 'DEPART SECTOR 0',
    objective: 'Drive Exploration Rover out of Station Nexus docking bay onto the planetary terrain.',
    targetRegion: 'RESEARCH_BASE',
    completed: false,
    current: true,
    hint: 'Drive rover forward (>35m from base origin).',
  },
  {
    id: 2,
    stageCode: '02',
    title: 'OCHRE DUNES SURVEY',
    objective: 'Navigate west into Sector 1 Red Desert and analyze Ferric Regolith Core specimen.',
    targetRegion: 'RED_DESERT',
    completed: false,
    current: false,
    hint: 'Travel to Sector 1 (X: -80, Z: -65) and initiate scanner.',
  },
  {
    id: 3,
    stageCode: '03',
    title: 'CRYSTAL BASIN ANALYSIS',
    objective: 'Proceed eastward into Sector 2 Prismatic Basin to analyze Hexahedral Silicate Monolith.',
    targetRegion: 'CRYSTAL_VALLEY',
    completed: false,
    current: false,
    hint: 'Travel to Sector 2 (X: 78, Z: -68).',
  },
  {
    id: 4,
    stageCode: '04',
    title: 'PHOSPHOR GLADE EXPLORATION',
    objective: 'Sample bioluminescent alien flora in Sector 3 Phosphor Glade.',
    targetRegion: 'BIOLUMINESCENT_FOREST',
    completed: false,
    current: false,
    hint: 'Travel southwest to Sector 3 (X: -74, Z: 78).',
  },
  {
    id: 5,
    stageCode: '05',
    title: 'OBSIDIAN RIFT THERMAL SURVEY',
    objective: 'Record geothermal readings and investigate magma fissures in Sector 4 Volcanic Zone.',
    targetRegion: 'VOLCANIC_ZONE',
    completed: false,
    current: false,
    hint: 'Travel southeast to Sector 4 (X: 92, Z: 88).',
  },
  {
    id: 6,
    stageCode: '06',
    title: 'RETURN TO STATION DOCK',
    objective: 'Return rover safely to Sector 0 Station Nexus for data synchronization.',
    targetRegion: 'RESEARCH_BASE',
    completed: false,
    current: false,
    hint: 'Navigate back to Station Nexus (X: 0, Z: 0).',
  },
];

export function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<PlanetScene | null>(null);

  // Environmental & Camera State
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('DAY');
  const [weather, setWeather] = useState<WeatherType>('CLEAR');
  const [cameraMode, setCameraMode] = useState<CameraMode>('ROVER_FOLLOW');
  const [audioMuted, setAudioMuted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Rover Kinematics & Planetary Telemetry State
  const [rover, setRover] = useState<RoverState>({
    x: 0,
    y: 0,
    z: -12,
    rotationY: Math.PI,
    speed: 0,
    maxSpeed: 7.5,
    steeringAngle: 0,
    headlights: true,
    battery: 94,
    solarCharging: true,
    distanceTraveled: 0.0,
    distanceToBase: 0.01,
    signalQuality: 98,
    uplinkStatus: 'OPTIMAL',
    isMoving: false,
    isAutopilot: false,
    targetDestination: null,
  });

  const [conditions, setConditions] = useState<PlanetaryConditions>({
    temperature: 18.2,
    gravity: 0.82,
    atmosphericPressure: 0.91,
    windSpeed: 14.0,
    windDirection: 'ESE 112°',
    visibility: 95,
    radiation: 'LOW',
    elevation: 420.0,
  });

  // Discoveries & Catalog State
  const [specimens, setSpecimens] = useState<Specimen[]>(() => JSON.parse(JSON.stringify(INITIAL_SPECIMENS)));
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);

  // Mission & Logs State
  const [missionStages, setMissionStages] = useState<MissionStage[]>(INITIAL_MISSION_STAGES);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '00:00:01',
      level: 'SYSTEM',
      message: 'Exploration Rover [K-01] initialized on Sector 0 docking platform.',
      region: 'STATION NEXUS',
    },
    {
      id: 'log-2',
      timestamp: '00:00:04',
      level: 'TELEMETRY',
      message: 'Satellite downlink established with Kepler-186X orbital relay. Carrier signal stable at 98%.',
    },
  ]);

  // Modals
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Live Mission Clock
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMissionTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${s}`;
  };

  // Push new event log
  const pushLog = (level: LogEntry['level'], message: string, region?: string) => {
    const timestamp = formatMissionTime(elapsedSeconds);
    setLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp,
        level,
        message,
        region,
      },
      ...prev.slice(0, 50), // keep latest 50 logs
    ]);
  };

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    try {
      const scene = new PlanetScene(mountRef.current, {
        onRoverUpdate: (updatedRover) => {
          setRover(updatedRover);
        },
        onPlanetaryConditionsUpdate: (updatedConditions) => {
          setConditions(updatedConditions);
        },
        onSpecimenClick: (specimen) => {
          setSelectedSpecimen(specimen);
          setActiveModal('SPECIMEN_DETAIL');
        },
        onObjectClick: (name, info) => {
          pushLog('INFO', `${name} inspected. ${info}`);
        },
      });

      sceneRef.current = scene;
    } catch (err) {
      console.error('WebGL initialization error:', err);
      setHasWebGL(false);
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, []);

  // Monitor Mission Stage Progression based on real rover movement and specimen scans
  useEffect(() => {
    const currentReg = getRegionAt(rover.x, rover.z);
    const distFromOrigin = Math.sqrt(rover.x * rover.x + rover.z * rover.z);

    setMissionStages((prevStages) => {
      const newStages = [...prevStages];

      // Stage 1: Depart base
      if (!newStages[0].completed && distFromOrigin > 35) {
        newStages[0].completed = true;
        newStages[0].current = false;
        newStages[1].current = true;
        pushLog('DISCOVERY', 'Stage 01 Complete: Rover departed Station Nexus perimeter.', 'SECTOR 0');
        soundFX.playDiscoveryChime();
      }

      // Stage 2: Desert survey (analyzed desert specimen or entered desert)
      const desertSpecimen = specimens.find((s) => s.code === 'A-07-004');
      if (newStages[0].completed && !newStages[1].completed) {
        if (currentReg === 'RED_DESERT' || (desertSpecimen && desertSpecimen.isAnalyzed)) {
          newStages[1].completed = true;
          newStages[1].current = false;
          newStages[2].current = true;
          pushLog('DISCOVERY', 'Stage 02 Complete: Red Desert survey completed.', 'SECTOR 1');
          soundFX.playDiscoveryChime();
        }
      }

      // Stage 3: Crystal analysis
      const crystalSpecimen = specimens.find((s) => s.code === 'A-07-001');
      if (newStages[1].completed && !newStages[2].completed) {
        if (currentReg === 'CRYSTAL_VALLEY' || (crystalSpecimen && crystalSpecimen.isAnalyzed)) {
          newStages[2].completed = true;
          newStages[2].current = false;
          newStages[3].current = true;
          pushLog('DISCOVERY', 'Stage 03 Complete: Prismatic Basin crystal formations analyzed.', 'SECTOR 2');
          soundFX.playDiscoveryChime();
        }
      }

      // Stage 4: Forest exploration
      const forestSpecimen = specimens.find((s) => s.code === 'A-07-002');
      if (newStages[2].completed && !newStages[3].completed) {
        if (currentReg === 'BIOLUMINESCENT_FOREST' || (forestSpecimen && forestSpecimen.isAnalyzed)) {
          newStages[3].completed = true;
          newStages[3].current = false;
          newStages[4].current = true;
          pushLog('DISCOVERY', 'Stage 04 Complete: Bioluminescent ecosystem logged.', 'SECTOR 3');
          soundFX.playDiscoveryChime();
        }
      }

      // Stage 5: Volcanic survey
      const volcanicSpecimen = specimens.find((s) => s.code === 'A-07-003');
      if (newStages[3].completed && !newStages[4].completed) {
        if (currentReg === 'VOLCANIC_ZONE' || (volcanicSpecimen && volcanicSpecimen.isAnalyzed)) {
          newStages[4].completed = true;
          newStages[4].current = false;
          newStages[5].current = true;
          pushLog('DISCOVERY', 'Stage 05 Complete: Obsidian Rift geothermal readings recorded.', 'SECTOR 4');
          soundFX.playDiscoveryChime();
        }
      }

      // Stage 6: Return to Base
      if (newStages[4].completed && !newStages[5].completed) {
        if (distFromOrigin < 15) {
          newStages[5].completed = true;
          newStages[5].current = false;
          pushLog('DISCOVERY', 'Stage 06 Complete: Rover returned to Station Nexus. Full Survey Complete!', 'SECTOR 0');
          soundFX.playDiscoveryChime();
        }
      }

      return newStages;
    });
  }, [rover.x, rover.z, specimens]);

  // Handlers for environment controls
  const handleTimeChange = (newTime: TimeOfDay) => {
    setTimeOfDay(newTime);
    if (sceneRef.current) sceneRef.current.setTimeOfDay(newTime);
    pushLog('TELEMETRY', `Planetary lighting synchronized to ${newTime} cycle.`);
  };

  const handleWeatherChange = (newWeather: WeatherType) => {
    setWeather(newWeather);
    if (sceneRef.current) sceneRef.current.setWeather(newWeather);
    pushLog('WARNING', `Atmospheric perturbation detected: Weather shifted to ${newWeather}.`);
  };

  const handleCameraChange = (mode: CameraMode) => {
    setCameraMode(mode);
    if (sceneRef.current) sceneRef.current.setCameraMode(mode);
  };

  const handleToggleHeadlights = () => {
    if (sceneRef.current) sceneRef.current.toggleHeadlights();
  };

  const handleToggleAudio = () => {
    soundFX.init();
    const nextMuted = !audioMuted;
    setAudioMuted(nextMuted);
    soundFX.setMuted(nextMuted);
  };

  const handleSetDrivingInput = (key: 'forward' | 'backward' | 'left' | 'right', value: boolean) => {
    soundFX.init();
    if (sceneRef.current) {
      sceneRef.current.input[key] = value;
    }
  };

  const handleNavigateToCoords = (x: number, z: number, name: string) => {
    if (sceneRef.current) {
      sceneRef.current.navigateToCoordinates(x, z, name);
      pushLog('TELEMETRY', `Autopilot waypoint locked: Destination ${name} (X: ${x.toFixed(0)}, Z: ${z.toFixed(0)}).`);
    }
  };

  const handleCancelAutopilot = () => {
    if (sceneRef.current) {
      sceneRef.current.cancelAutopilot();
      pushLog('TELEMETRY', 'Autopilot aborted by manual override.');
    }
  };

  const handleAnalyzeSpecimen = (specimenId: string) => {
    if (sceneRef.current) {
      const analyzed = sceneRef.current.discoverables.markSpecimenAnalyzed(specimenId);
      if (analyzed) {
        setSpecimens((prev) =>
          prev.map((s) => (s.id === specimenId ? { ...s, isAnalyzed: true, isScanned: true, scanProgress: 100 } : s))
        );
        pushLog('DISCOVERY', `Specimen ${analyzed.code} (${analyzed.name}) cataloged and archived.`, analyzed.region);
      }
    }
  };

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  const scannedCount = specimens.filter((s) => s.isAnalyzed).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0E0B08] text-[#E8E1D5] font-sans">
      {/* 1. 3D WebGL Canvas Viewport (75-80% viewport dominance) */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-crosshair z-0"
      />

      {/* 2. Top Navigation Bar */}
      <TopBar
        timeOfDay={timeOfDay}
        weather={weather}
        audioMuted={audioMuted}
        onTimeChange={handleTimeChange}
        onWeatherChange={handleWeatherChange}
        onToggleAudio={handleToggleAudio}
      />

      {/* 3. Left Navigation & Operations Panel */}
      <ExplorationNav
        activeModal={activeModal}
        onSelectModal={(m) => setActiveModal(m)}
        scannedCount={scannedCount}
        totalSpecimens={specimens.length}
      />

      {/* 4. Right Planetary Conditions / Scientific Telemetry Panel */}
      <TelemetryHUD conditions={conditions} rover={rover} />

      {/* 5. Bottom Status Bar */}
      <BottomStatusBar
        rover={rover}
        cameraMode={cameraMode}
        missionTime={formatMissionTime(elapsedSeconds)}
        onCameraChange={handleCameraChange}
        onToggleHeadlights={handleToggleHeadlights}
      />

      {/* 6. Tactical Mini-Map in Corner */}
      <MiniMap
        rover={rover}
        specimens={specimens}
        onExpandMap={() => setActiveModal('MAP')}
      />

      {/* 7. On-Screen Driving & Quick Scan Controls */}
      <RoverControlsOverlay
        rover={rover}
        onSetInput={handleSetDrivingInput}
        onTriggerScan={() => setActiveModal('SCANNER')}
        onToggleHeadlights={handleToggleHeadlights}
      />

      {/* ==================================================== */}
      {/* 8. Interactive Overlay Modals                        */}
      {/* ==================================================== */}

      {/* Full Planetary Map Modal */}
      {activeModal === 'MAP' && (
        <PlanetaryMapModal
          rover={rover}
          specimens={specimens}
          onClose={() => setActiveModal(null)}
          onNavigate={handleNavigateToCoords}
          onCancelAutopilot={handleCancelAutopilot}
        />
      )}

      {/* Radar Scanner Overlay */}
      {activeModal === 'SCANNER' && (
        <ScannerOverlay
          rover={rover}
          specimens={specimens}
          onClose={() => setActiveModal(null)}
          onSelectSpecimen={(sp) => {
            setSelectedSpecimen(sp);
            setActiveModal('SPECIMEN_DETAIL');
          }}
          onAnalyzeSpecimen={handleAnalyzeSpecimen}
        />
      )}

      {/* Specimen Detail Modal */}
      {activeModal === 'SPECIMEN_DETAIL' && selectedSpecimen && (
        <SpecimenDetailModal
          specimen={selectedSpecimen}
          onClose={() => {
            setSelectedSpecimen(null);
            setActiveModal(null);
          }}
          onAnalyze={handleAnalyzeSpecimen}
          onNavigateToSpecimen={(x, z, name) => handleNavigateToCoords(x, z, name)}
        />
      )}

      {/* Discovery Log Catalog Modal */}
      {activeModal === 'SPECIMENS' && (
        <DiscoveryLogModal
          specimens={specimens}
          onClose={() => setActiveModal(null)}
          onSelectSpecimen={(sp) => {
            setSelectedSpecimen(sp);
            setActiveModal('SPECIMEN_DETAIL');
          }}
        />
      )}

      {/* Research Base Subsystems Modal */}
      {activeModal === 'RESEARCH_BASE' && (
        <ResearchBaseModal
          onClose={() => setActiveModal(null)}
          onNavigateToBase={() => handleNavigateToCoords(0, -12, 'Station Nexus Dock')}
        />
      )}

      {/* Mission Timeline Modal */}
      {activeModal === 'MISSION' && (
        <MissionTimelineModal
          stages={missionStages}
          rover={rover}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Real-time Event Log Drawer */}
      {activeModal === 'EVENT_LOG' && (
        <EventLogDrawer
          logs={logs}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Educational Planetary Science Reference */}
      {activeModal === 'SCIENCE_GUIDE' && (
        <ScienceGuideModal
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
export default App;
