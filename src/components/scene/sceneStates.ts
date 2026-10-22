/**
 * The four states of the Home 3D scene, copied from the live Framer component
 * ("3D Scene" variants Hero / Why Us / Features / Journey). Angles are in degrees,
 * distances in scene units. The camera always sits at (-1, -1, cameraZ) and looks at
 * the origin; everything else lives in one group placed at `group`.
 */
export type SceneStateName = "hero" | "why" | "features" | "journey";

export type SceneValues = {
  cameraZ: number;
  groupX: number;
  groupY: number;
  groupZ: number;
  groupRotX: number;
  planetScale: number;
  cloudsScale: number;
  planetRotY: number;
  /** Auto-rotation of the planet and cloud shell, radians per 60 fps frame. */
  planetSpin: number;
  cloudsSpin: number;
  diskScale: number;
  diskX: number;
  diskY: number;
  diskRotZ: number;
};

export const sceneStates: Record<SceneStateName, SceneValues> = {
  hero: {
    cameraZ: 15,
    groupX: 16,
    groupY: -7,
    groupZ: 1,
    groupRotX: 11,
    planetScale: 2.35,
    cloudsScale: 2.37,
    planetRotY: 0,
    planetSpin: 0.0006,
    cloudsSpin: 0.0004,
    diskScale: 10,
    diskX: -5,
    diskY: 2,
    diskRotZ: 0,
  },
  why: {
    cameraZ: 50,
    groupX: 0,
    groupY: 0,
    groupZ: 1,
    groupRotX: 0,
    planetScale: 2.35,
    cloudsScale: 2.37,
    planetRotY: 0,
    planetSpin: 0.001,
    cloudsSpin: 0.0008,
    diskScale: 13,
    diskX: 0,
    diskY: 0,
    diskRotZ: 0,
  },
  features: {
    cameraZ: 15,
    // The camera sits at (-1, -1, 15) looking at the origin, so its line of sight crosses
    // the disk's depth (z = 25 - 35 = -10) at (2/3, 2/3). Moving the group there puts the
    // disk dead centre on screen (Framer's 0, 0 left it low and to the left).
    groupX: 2 / 3,
    groupY: 2 / 3,
    groupZ: 25,
    groupRotX: 0,
    planetScale: 0.1,
    cloudsScale: 0.1,
    planetRotY: -45,
    planetSpin: 0.001,
    cloudsSpin: 0.0008,
    diskScale: 10,
    diskX: 0,
    diskY: 0,
    diskRotZ: 45,
  },
  journey: {
    cameraZ: 43,
    groupX: 10,
    groupY: 28,
    groupZ: 25,
    groupRotX: -58,
    planetScale: 0.6,
    cloudsScale: 0.62,
    planetRotY: -45,
    planetSpin: 0.001,
    cloudsSpin: 0.0008,
    diskScale: 10,
    diskX: 0,
    diskY: 0,
    diskRotZ: 45,
  },
};

/** Fixed values shared by every state. */
export const sceneConstants = {
  fov: 25,
  cameraX: -1,
  cameraY: -1,
  /** Shapes sit this far behind the group origin. */
  planetZ: -36,
  diskZ: -35,
  diskRotX: 6,
  diskRotY: 1,
  diskRenderOrder: 1,
  wRenderOrder: 2,
  diskScale: 10,
  /** Disk spins counter-clockwise about Z by this much per 60 fps frame. */
  diskSpin: 0.01,
  /** The W follows a tilted orbit around the planet. */
  orbitSpin: 0.008,
  orbitTiltX: 24,
  orbitTiltY: -12,
  orbitRadius: 2.8,
  orbitOscillationAmplitude: 4,
  orbitOscillationSpeed: 0.8,
  wDepth: 0,
  wSpin: 0.012,
  wRadius: 2,
  wScale: 0.38,
  wEmissive: 0x32105f,
  wEmissiveIntensity: 0.7,
  planetHoverWScale: 1.12,
  planetHoverWGlow: 0.9,
  planetHoverDiskScale: 1.08,
  planetHoverResponse: 5,
  sphereRadius: 2,
  planeSize: 4,
  light: {
    color: "rgb(154, 69, 245)",
    ambient: 0.85,
    directional: 4.3,
    position: [-93, 66, -76] as const,
  },
  planetColor: "rgb(145, 145, 145)",
  cloudsColor: "rgb(232, 232, 232)",
  normalScale: 0.6,
  roughness: 0.6,
  /** Seconds for a state change, eased in and out (Framer's "easeInOut"). */
  transition: 1,
};
