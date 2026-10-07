import type { SceneStateName } from "./sceneStates";

/**
 * Tiny shared store between the scroll choreography (which decides the active scene
 * state) and the WebGL scene (which animates toward it). Kept outside React so scroll
 * updates never re-render the page.
 */
type Listener = (state: SceneStateName) => void;

let current: SceneStateName = "hero";
let active = true;
let ready = false;
const readyListeners = new Set<() => void>();
const listeners = new Set<Listener>();
const activeListeners = new Set<(active: boolean) => void>();

export const sceneStore = {
  get state() {
    return current;
  },
  setState(next: SceneStateName) {
    if (next === current) return;
    current = next;
    listeners.forEach((l) => l(next));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  /** Whether the scene is on screen; the canvas stops rendering while it is not. */
  get active() {
    return active;
  },
  setActive(next: boolean) {
    if (next === active) return;
    active = next;
    activeListeners.forEach((l) => l(next));
  },
  /** The first frame has rendered (or there is no WebGL); the loader can lift. */
  get ready() {
    return ready;
  },
  markReady() {
    if (ready) return;
    ready = true;
    readyListeners.forEach((l) => l());
  },
  onReady(listener: () => void) {
    if (ready) listener();
    else readyListeners.add(listener);
    return () => {
      readyListeners.delete(listener);
    };
  },
  subscribeActive(listener: (active: boolean) => void) {
    activeListeners.add(listener);
    return () => {
      activeListeners.delete(listener);
    };
  },
};
