//You can add/remove more triads here.
const SCALE_TRIADS = [
  [0, 4, 7],
  [2, 5, 9],
  [4, 7, 11],
  [5, 9, 12],
  [7, 11, 14],
  [9, 12, 16],
] as const;

let context: AudioContext | null = null;
let lastIndex = -1;
let lastPlayedAt = 0;
let pendingIndex: number | null = null;
let planetSoundscapeActive = false;
let soundscape:
  | {
      bus: GainNode;
      blipBus: GainNode;
      blipTimer: number;
    }
  | undefined;
let noiseBuffer: AudioBuffer | undefined;

const BLIP_PITCHES = [1046.5, 1318.5, 1568, 1760, 2093, 2637] as const;
const BLIP_DECAY_MS = 220;
const blipTimes = [-1e9, -1e9, -1e9];
const cueTimes = [-1e9, -1e9, -1e9];
let visualBlipTimer = 0;

function getAudioContext() {
  context ??= new AudioContext();
  return context;
}

function getNoiseBuffer(audio: AudioContext) {
  if (noiseBuffer) return noiseBuffer;
  noiseBuffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function scheduleChord(audio: AudioContext, index: number, delay = 0, gain = 0.07, octaveShift = 0) {
  const start = audio.currentTime + delay;
  const filter = audio.createBiquadFilter();
  const volume = audio.createGain();
  const triad = SCALE_TRIADS[index % SCALE_TRIADS.length];
  const octave = Math.floor(index / SCALE_TRIADS.length) + octaveShift;

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(760, start);
  filter.frequency.exponentialRampToValueAtTime(1850, start + 0.18);
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(gain, start + 0.025);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
  filter.connect(volume);
  volume.connect(audio.destination);

  for (const [voice, semitones] of triad.entries()) {
    const oscillator = audio.createOscillator();
    oscillator.type = voice === 0 ? "sine" : "triangle";
    oscillator.frequency.value = 261.63 * 2 ** ((semitones + octave * 12) / 12);
    oscillator.connect(filter);
    oscillator.start(start);
    oscillator.stop(start + 0.36);
  }
}

function getSoundscape(audio: AudioContext) {
  if (soundscape) return soundscape;

  // An interplanetary transmission: a faint wavering carrier over a low hum, a trace of
  // static, and sparse data blips that trail off into a space-like echo.
  const bus = audio.createGain();
  const panner = audio.createStereoPanner();
  const staticFilter = audio.createBiquadFilter();
  const staticGain = audio.createGain();
  const carrierGain = audio.createGain();
  const humGain = audio.createGain();
  const blipBus = audio.createGain();
  const echo = audio.createDelay(1);
  const echoTone = audio.createBiquadFilter();
  const echoFeedback = audio.createGain();

  staticFilter.type = "bandpass";
  staticFilter.frequency.value = 3400;
  staticFilter.Q.value = 1.1;
  staticGain.gain.value = 0.011;
  carrierGain.gain.value = 0.0111;
  humGain.gain.value = 0.3;
  blipBus.gain.value = 3.8;
  echo.delayTime.value = 111.11;
  // echo.delayTime.value = 0.23;
  echoTone.type = "lowpass";
  echoTone.frequency.value = 2200;
  echoFeedback.gain.value = 0.4;
  bus.gain.value = 0;

  staticFilter.connect(staticGain);
  staticGain.connect(bus);
  carrierGain.connect(bus);
  humGain.connect(bus);
  blipBus.connect(bus);
  blipBus.connect(echo);
  echo.connect(echoTone);
  echoTone.connect(echoFeedback);
  echoFeedback.connect(echo);
  echoTone.connect(bus);
  bus.connect(panner);
  panner.connect(audio.destination);

  const noise = audio.createBufferSource();
  noise.buffer = getNoiseBuffer(audio);
  noise.loop = true;
  noise.connect(staticFilter);
  noise.start();

  const carrier = audio.createOscillator();
  const carrierDrift = audio.createOscillator();
  const carrierDriftDepth = audio.createGain();
  carrier.type = "sine";
  carrier.frequency.value = 740;
  carrierDrift.frequency.value = 0.35;
  carrierDriftDepth.gain.value = 22;
  carrierDrift.connect(carrierDriftDepth);
  carrierDriftDepth.connect(carrier.frequency);
  carrier.connect(carrierGain);
  carrier.start();
  carrierDrift.start();

  const hum = audio.createOscillator();
  hum.type = "sine";
  hum.frequency.value = 82.4;
  hum.connect(humGain);
  hum.start();

  soundscape = { bus, blipBus, blipTimer: 0 };
  return soundscape;
}

function scheduleBlip(audio: AudioContext, target: GainNode) {
  const start = audio.currentTime;
  const duration = 0.04 + Math.random() * 0.05;
  const oscillator = audio.createOscillator();
  const volume = audio.createGain();
  oscillator.type = "sine";
  const pitchIndex = Math.floor(Math.random() * BLIP_PITCHES.length);
  oscillator.frequency.value = BLIP_PITCHES[pitchIndex];
  // Each pitch drives one orbiting model so the visuals follow what is heard.
  blipTimes[pitchIndex % blipTimes.length] = performance.now();
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(0.7, start + 0.006);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(volume);
  volume.connect(target);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function startBlips(audio: AudioContext, current: NonNullable<typeof soundscape>) {
  if (current.blipTimer) return;
  const next = () => {
    scheduleBlip(audio, current.blipBus);
    if (Math.random() < 0.4) window.setTimeout(() => scheduleBlip(audio, current.blipBus), 90);
    current.blipTimer = window.setTimeout(next, 450 + Math.random() * 900);
  };
  current.blipTimer = window.setTimeout(next, 250);
}

function stopBlips(current: NonNullable<typeof soundscape>) {
  window.clearTimeout(current.blipTimer);
  current.blipTimer = 0;
}

function updatePlanetSoundscape(audio: AudioContext) {
  if (!planetSoundscapeActive || audio.state !== "running") return;
  const current = getSoundscape(audio);
  const now = audio.currentTime;
  current.bus.gain.cancelScheduledValues(now);
  current.bus.gain.setTargetAtTime(0.17, now, 0.21);
  startBlips(audio, current);
}

function resumeAudio(audio: AudioContext) {
  if (audio.state === "running") {
    if (pendingIndex !== null) {
      const index = pendingIndex;
      pendingIndex = null;
      scheduleChord(audio, index);
    }
    updatePlanetSoundscape(audio);
    return;
  }

  void audio.resume().then(
    () => {
      if (pendingIndex !== null) {
        const index = pendingIndex;
        pendingIndex = null;
        scheduleChord(audio, index);
      }
      updatePlanetSoundscape(audio);
    },
    (error: unknown) => {
      if (!(error instanceof DOMException && error.name === "NotAllowedError")) {
        console.error("Could not start the menu chord sound.", error);
      }
    },
  );
}

/** Unlock Web Audio after the user's first deliberate click or key press. */
export function unlockMenuAudio() {
  resumeAudio(getAudioContext());
}

export function setPlanetSoundscape(active: boolean) {
  planetSoundscapeActive = active;
  if (!active) {
    if (soundscape) {
      stopBlips(soundscape);
      if (context?.state === "running") {
        const now = context.currentTime;
        soundscape.bus.gain.cancelScheduledValues(now);
        soundscape.bus.gain.setTargetAtTime(0, now, 0.12);
      }
    }
    return;
  }

  const audio = getAudioContext();
  if (audio.state === "running") updatePlanetSoundscape(audio);
  else {
    resumeAudio(audio);
    startVisualBlips();
  }
}

/** Without unlocked audio there is no sound, but the models still pulse with the blip rhythm. */
function startVisualBlips() {
  if (visualBlipTimer) return;
  const next = () => {
    if (!planetSoundscapeActive || context?.state === "running") {
      visualBlipTimer = 0;
      return;
    }
    blipTimes[Math.floor(Math.random() * blipTimes.length)] = performance.now();
    visualBlipTimer = window.setTimeout(next, 450 + Math.random() * 900);
  };
  visualBlipTimer = window.setTimeout(next, 250);
}

/** A short electric "dzzz" for a letter igniting. Silent until audio has been unlocked. */
export function playIgnitionZap(pan = 0) {
  const audio = context;
  if (!audio || audio.state !== "running") return;

  const start = audio.currentTime;
  const end = start + 0.26;
  const buzz = audio.createOscillator();
  const buzzGain = audio.createGain();
  const flutter = audio.createOscillator();
  const flutterDepth = audio.createGain();
  const filter = audio.createBiquadFilter();
  const volume = audio.createGain();
  const panner = audio.createStereoPanner();
  const crackle = audio.createBufferSource();
  const crackleFilter = audio.createBiquadFilter();
  const crackleGain = audio.createGain();

  buzz.type = "sawtooth";
  buzz.frequency.setValueAtTime(560, start);
  buzz.frequency.exponentialRampToValueAtTime(95, end);
  // Square flutter on the gain gives the buzzing "zzz".
  flutter.type = "square";
  flutter.frequency.value = 62;
  buzzGain.gain.value = 0.5;
  flutterDepth.gain.value = 0.5;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2200, start);
  filter.frequency.exponentialRampToValueAtTime(700, end);
  filter.Q.value = 1.1;
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(0.07, start + 0.008);
  volume.gain.exponentialRampToValueAtTime(0.0001, end);
  panner.pan.value = pan;

  flutter.connect(flutterDepth);
  flutterDepth.connect(buzzGain.gain);
  buzz.connect(buzzGain);
  buzzGain.connect(filter);
  filter.connect(volume);

  crackle.buffer = getNoiseBuffer(audio);
  crackleFilter.type = "highpass";
  crackleFilter.frequency.value = 4500;
  crackleGain.gain.setValueAtTime(0.0001, start);
  crackleGain.gain.exponentialRampToValueAtTime(0.03, start + 0.004);
  crackleGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.09);
  crackle.connect(crackleFilter);
  crackleFilter.connect(crackleGain);
  crackleGain.connect(volume);

  volume.connect(panner);
  panner.connect(audio.destination);
  buzz.start(start);
  flutter.start(start);
  crackle.start(start);
  buzz.stop(end + 0.02);
  flutter.stop(end + 0.02);
  crackle.stop(start + 0.1);
}

/** A soft, low "dun" with a short echo tail, landing at `land`. */
function scheduleDunIng(audio: AudioContext, land: number) {
  const dun = audio.createOscillator();
  const dunOvertone = audio.createOscillator();
  const dunOvertoneGain = audio.createGain();
  const dunGain = audio.createGain();
  const echo = audio.createDelay(1);
  const echoTone = audio.createBiquadFilter();
  const echoFeedback = audio.createGain();
  const echoGain = audio.createGain();

  // The "dun": one low, rounded note with a quick attack and a gentle decay.
  dun.type = "sine";
  dun.frequency.setValueAtTime(123.47, land);
  dun.frequency.exponentialRampToValueAtTime(110, land + 0.3);
  dunOvertone.type = "triangle";
  dunOvertone.frequency.value = 246.94;
  dunOvertoneGain.gain.value = 0.18;
  dunGain.gain.setValueAtTime(0.0001, land);
  dunGain.gain.exponentialRampToValueAtTime(0.3, land + 0.02);
  dunGain.gain.exponentialRampToValueAtTime(0.0001, land + 0.85);

  echo.delayTime.value = 0.28;
  echoTone.type = "lowpass";
  echoTone.frequency.value = 900;
  echoFeedback.gain.value = 0.35;
  echoGain.gain.value = 0.3;

  dun.connect(dunGain);
  dunOvertone.connect(dunOvertoneGain);
  dunOvertoneGain.connect(dunGain);
  dunGain.connect(audio.destination);
  dunGain.connect(echo);
  echo.connect(echoTone);
  echoTone.connect(echoFeedback);
  echoFeedback.connect(echo);
  echoTone.connect(echoGain);
  echoGain.connect(audio.destination);

}

/**
 * Page change cue while the void grows: a swell that rises into the cover. The resolving
 * "dun iiing" waits for the reveal (see playPageReveal).
 */
export function playPageWarp() {
  const audio = getAudioContext();
  const fire = () => {
    const start = audio.currentTime;
    const land = start + 0.55;

    const swell = audio.createOscillator();
    const swellFilter = audio.createBiquadFilter();
    const swellGain = audio.createGain();
    const air = audio.createBufferSource();
    const airFilter = audio.createBiquadFilter();
    const airGain = audio.createGain();

    // Reversed swell: pitch and brightness climb while the level builds toward the landing.
    swell.type = "sine";
    swell.frequency.setValueAtTime(70, start);
    swell.frequency.exponentialRampToValueAtTime(330, land);
    swellFilter.type = "lowpass";
    swellFilter.frequency.setValueAtTime(200, start);
    swellFilter.frequency.exponentialRampToValueAtTime(1600, land);
    swellGain.gain.setValueAtTime(0.0001, start);
    swellGain.gain.exponentialRampToValueAtTime(0.13, land - 0.04);
    swellGain.gain.exponentialRampToValueAtTime(0.0001, land + 0.06);

    // A breath of filtered noise rising with it, like air pulled toward the page.
    air.buffer = getNoiseBuffer(audio);
    airFilter.type = "bandpass";
    airFilter.frequency.setValueAtTime(400, start);
    airFilter.frequency.exponentialRampToValueAtTime(3200, land);
    airFilter.Q.value = 0.9;
    airGain.gain.setValueAtTime(0.0001, start);
    airGain.gain.exponentialRampToValueAtTime(0.035, land - 0.05);
    airGain.gain.exponentialRampToValueAtTime(0.0001, land + 0.05);

    swell.connect(swellFilter);
    swellFilter.connect(swellGain);
    swellGain.connect(audio.destination);
    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(audio.destination);
    swell.start(start);
    air.start(start);
    swell.stop(land + 0.1);
    air.stop(land + 0.1);
  };
  if (audio.state === "running") fire();
  else void audio.resume().then(fire, () => undefined);
}

/** Page change cue while the void shrinks: the swell turned around, falling away, ending on the "dun" as the void fades. */
export function playPageReveal() {
  const audio = getAudioContext();
  const fire = () => {
    const start = audio.currentTime;
    const end = start + 0.7;
    const swell = audio.createOscillator();
    const swellFilter = audio.createBiquadFilter();
    const swellGain = audio.createGain();
    const air = audio.createBufferSource();
    const airFilter = audio.createBiquadFilter();
    const airGain = audio.createGain();

    swell.type = "sine";
    swell.frequency.setValueAtTime(330, start);
    swell.frequency.exponentialRampToValueAtTime(70, end);
    swellFilter.type = "lowpass";
    swellFilter.frequency.setValueAtTime(1600, start);
    swellFilter.frequency.exponentialRampToValueAtTime(200, end);
    swellGain.gain.setValueAtTime(0.0001, start);
    swellGain.gain.exponentialRampToValueAtTime(0.1, start + 0.06);
    swellGain.gain.exponentialRampToValueAtTime(0.0001, end);

    air.buffer = getNoiseBuffer(audio);
    airFilter.type = "bandpass";
    airFilter.frequency.setValueAtTime(3200, start);
    airFilter.frequency.exponentialRampToValueAtTime(400, end);
    airFilter.Q.value = 0.9;
    airGain.gain.setValueAtTime(0.0001, start);
    airGain.gain.exponentialRampToValueAtTime(0.028, start + 0.08);
    airGain.gain.exponentialRampToValueAtTime(0.0001, end);

    swell.connect(swellFilter);
    swellFilter.connect(swellGain);
    swellGain.connect(audio.destination);
    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(audio.destination);
    swell.start(start);
    air.start(start);
    swell.stop(end + 0.05);
    air.stop(end + 0.05);
    scheduleDunIng(audio, end);
  };
  if (audio.state === "running") fire();
  else void audio.resume().then(fire, () => undefined);
}

/** Low "boom" for the planet vanishing into the horizon. */
export function playPlanetBoom() {
  const audio = getAudioContext();
  const fire = () => {
    const start = audio.currentTime;
    const thump = audio.createOscillator();
    const thumpGain = audio.createGain();
    const rumble = audio.createBufferSource();
    const rumbleFilter = audio.createBiquadFilter();
    const rumbleGain = audio.createGain();

    thump.type = "sine";
    thump.frequency.setValueAtTime(110, start);
    thump.frequency.exponentialRampToValueAtTime(30, start + 0.7);
    thumpGain.gain.setValueAtTime(0.0001, start);
    thumpGain.gain.exponentialRampToValueAtTime(0.7, start + 0.015);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, start + 1);
    rumble.buffer = getNoiseBuffer(audio);
    rumbleFilter.type = "lowpass";
    rumbleFilter.frequency.setValueAtTime(500, start);
    rumbleFilter.frequency.exponentialRampToValueAtTime(70, start + 0.8);
    rumbleGain.gain.setValueAtTime(0.0001, start);
    rumbleGain.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.85);

    thump.connect(thumpGain);
    thumpGain.connect(audio.destination);
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(audio.destination);
    thump.start(start);
    rumble.start(start);
    thump.stop(start + 1.05);
    rumble.stop(start + 0.9);
  };

  if (audio.state === "running") fire();
  else void audio.resume().then(fire, () => undefined);
}

export function playMenuChord(index: number) {
  const now = performance.now();
  if (index === lastIndex && now - lastPlayedAt < 180) return;
  lastIndex = index;
  lastPlayedAt = now;

  const audio = getAudioContext();
  if (audio.state === "running") {
    scheduleChord(audio, index);
  } else {
    pendingIndex = index;
    resumeAudio(audio);
  }
}

/**
 * A soft "space menu" selector ping: one pentatonic note in a higher register with a short
 * echo tail. Used for the right-hand menu items and the project cards.
 */
const SELECTOR_SCALE = [0, 2, 4, 7, 9, 12, 14, 16] as const;
export function playSelectorNote(index: number) {
  const audio = getAudioContext();
  const play = () => {
    const start = audio.currentTime;
    const semitones = SELECTOR_SCALE[((index % SELECTOR_SCALE.length) + SELECTOR_SCALE.length) % SELECTOR_SCALE.length];
    const frequency = 523.25 * 2 ** (semitones / 12);
    const volume = audio.createGain();
    const echo = audio.createDelay(0.5);
    const echoGain = audio.createGain();
    volume.gain.setValueAtTime(0.0001, start);
    volume.gain.exponentialRampToValueAtTime(0.14, start + 0.012);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    echo.delayTime.value = 0.16;
    echoGain.gain.value = 0.35;
    volume.connect(audio.destination);
    volume.connect(echo);
    echo.connect(echoGain);
    echoGain.connect(audio.destination);
    for (const [type, ratio, level] of [["sine", 1, 1], ["triangle", 2, 0.25]] as const) {
      const oscillator = audio.createOscillator();
      const voice = audio.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency * ratio;
      voice.gain.value = level;
      oscillator.connect(voice);
      voice.connect(volume);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
    }
  };
  if (audio.state === "running") play();
  else void audio.resume().then(play, () => undefined);
}

/**
 * Chords for the three scene sections, from the same triads as the menu but each with its own
 * contour so they stay distinct: "Why" climbs by steps, "Services" skips an octave higher,
 * "Journey" descends an octave lower.
 */
const SCENE_VOICINGS = [
  { shift: 0, pick: (i: number) => (i < 3 ? i * 2 : 5) },
  { shift: 1, pick: (i: number) => i },
  { shift: -1, pick: (i: number) => 5 - i },
] as const;
export function playSceneChord(section: number, index: number, delay = 0) {
  const voicing = SCENE_VOICINGS[section % SCENE_VOICINGS.length];
  const triad = ((voicing.pick(index) % SCALE_TRIADS.length) + SCALE_TRIADS.length) % SCALE_TRIADS.length;
  const audio = getAudioContext();
  // Scroll-driven cues never try to wake a locked context; they stay silent until the first click.
  if (audio.state !== "running") return;
  scheduleChord(audio, triad, delay, 0.0708, voicing.shift);
  // A random letter model flashes with the chord, using the same glow as the hover blips.
  const model = Math.floor(Math.random() * cueTimes.length);
  window.setTimeout(() => {
    cueTimes[model] = performance.now();
  }, delay * 1000);
}

/** Per-model energy (0..1) of the scroll chord cues, independent of planet hover. */
export function readCueLevels(): number[] {
  const now = performance.now();
  return cueTimes.map((time) => Math.exp(-(now - time) / BLIP_DECAY_MS));
}

/** Every menu chord in sequence, ringing over each other: the logo's hover signature. */
export function playMenuComposition() {
  const audio = getAudioContext();
  const play = () => {
    for (let index = 0; index < SCALE_TRIADS.length; index += 1) {
      scheduleChord(audio, index, index * 0.085, 0.045);
    }
  };
  if (audio.state === "running") play();
  else void audio.resume().then(play, () => undefined);
}

/** Per-model energy (0..1) of the transmission blips, decaying after each one. */
export function readBlipLevels(): number[] {
  const now = performance.now();
  return blipTimes.map((time) => Math.exp(-(now - time) / BLIP_DECAY_MS));
}
