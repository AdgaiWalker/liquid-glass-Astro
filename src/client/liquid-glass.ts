import { ShaderDisplacementGenerator, fragmentShaders } from "../shader-utils.js";
import { modeMaps } from "../utils.js";
import type { LiquidGlassMode } from "../types.js";

interface RuntimeConfig {
  filterId: string;
  displacementScale: number;
  blurAmount: number;
  saturation: number;
  aberrationIntensity: number;
  elasticity: number;
  cornerRadius: number;
  overLight: boolean;
  mode: LiquidGlassMode;
}


const mounted = new WeakMap<HTMLElement, { abort: AbortController; resizeObserver: ResizeObserver }>();

const MOUSE = {
  ACTIVATION_ZONE: 300,
  NORMALIZE_DISTANCE: 300,
  STRETCH_X: 0.65,
  STRETCH_Y: 0.35,
  TRANSLATE_FACTOR: 0.18,
  BASE_ANGLE: 135,
  ANGLE_SENSITIVITY: 1.2,
  MIN_SCALE: 0.8,
  HIGHLIGHT_BASE_A: 0.12,
  HIGHLIGHT_SENS_A: 0.008,
  HIGHLIGHT_BASE_B: 0.4,
  HIGHLIGHT_SENS_B: 0.012,
  STOP_BASE_A: 33,
  STOP_SENS_A: 0.3,
  STOP_BASE_B: 66,
  STOP_SENS_B: 0.4,
} as const;

const BLUR = { LIGHT_BASE: 12, DARK_BASE: 4, RANGE: 32 } as const;

function readConfig(root: HTMLElement): RuntimeConfig | null {
  const raw = root.dataset.lgConfig;
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
}

function isFirefox(): boolean {
  return navigator.userAgent.toLowerCase().includes("firefox");
}

function updateSize(root: HTMLElement, config: RuntimeConfig): void {
  const rect = root.getBoundingClientRect();
  root.style.setProperty("--lg-width", `${rect.width}px`);
  root.style.setProperty("--lg-height", `${rect.height}px`);
  root.style.setProperty("--lg-filter", isFirefox() ? "none" : `url(#${config.filterId})`);

  const blur = (config.overLight ? BLUR.LIGHT_BASE : BLUR.DARK_BASE) + config.blurAmount * BLUR.RANGE;
  root.style.setProperty("--lg-backdrop", `blur(${blur}px) saturate(${config.saturation}%)`);
}

function updateFilterPrimitives(root: HTMLElement, config: RuntimeConfig): void {
  const direction = config.mode === "shader" ? 1 : -1;
  const maps = root.querySelectorAll<SVGFEDisplacementMapElement>("feDisplacementMap");
  if (maps[0]) maps[0].setAttribute("scale", String(config.displacementScale * direction));
  if (maps[1]) maps[1].setAttribute("scale", String((config.displacementScale - config.aberrationIntensity * 2.5) * direction));
  if (maps[2]) maps[2].setAttribute("scale", String((config.displacementScale - config.aberrationIntensity * 5.0) * direction));

  const alphas = root.querySelectorAll<SVGFEFuncAElement>("feFuncA");
  const edgeAlpha = alphas[0];
  if (edgeAlpha) {
    edgeAlpha.setAttribute("type", "table");
    edgeAlpha.setAttribute("tableValues", `0 ${Math.min(config.aberrationIntensity * 0.1, 0.5)} 1`);
  }

  const blur = root.querySelector<SVGFEGaussianBlurElement>("feGaussianBlur");
  if (blur) blur.setAttribute("stdDeviation", String(Math.max(0.3, 0.3 + config.aberrationIntensity * 0.15)));
}

function applyStaticMap(root: HTMLElement, config: RuntimeConfig): void {
  if (config.mode === "shader") return;
  const image = root.querySelector<SVGFEImageElement>("feImage");
  const map = modeMaps[config.mode];
  if (image && map) image.setAttribute("href", map);
}

function applyShaderMap(root: HTMLElement, config: RuntimeConfig): void {
  if (config.mode !== "shader") {
    applyStaticMap(root, config);
    return;
  }
  const rect = root.getBoundingClientRect();
  const image = root.querySelector("feImage");
  if (!image || rect.width < 1 || rect.height < 1) return;

  const generator = new ShaderDisplacementGenerator({
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    fragment: fragmentShaders.liquidGlass,
  });
  const dataUrl = generator.updateShader();
  generator.destroy();
  image.setAttribute("href", dataUrl);
}

function updateMouse(root: HTMLElement, config: RuntimeConfig, clientX: number, clientY: number): void {
  const rect = root.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = clientX - centerX;
  const deltaY = clientY - centerY;

  const edgeDistanceX = Math.max(0, Math.abs(deltaX) - rect.width / 2);
  const edgeDistanceY = Math.max(0, Math.abs(deltaY) - rect.height / 2);
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY);

  const activationZone = MOUSE.ACTIVATION_ZONE;
  const fade = edgeDistance > activationZone ? 0 : 1 - edgeDistance / activationZone;

  const centerDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  if (centerDistance === 0) {
    root.style.setProperty("--lg-x", "0px");
    root.style.setProperty("--lg-y", "0px");
    root.style.setProperty("--lg-scale-x", "1");
    root.style.setProperty("--lg-scale-y", "1");
    return;
  }

  const normalizedX = deltaX / centerDistance;
  const normalizedY = deltaY / centerDistance;
  const stretch = Math.min(centerDistance / MOUSE.NORMALIZE_DISTANCE, 1) * config.elasticity * fade;

  const scaleX = 1 + Math.abs(normalizedX) * stretch * MOUSE.STRETCH_X - Math.abs(normalizedY) * stretch * MOUSE.STRETCH_Y;
  const scaleY = 1 + Math.abs(normalizedY) * stretch * MOUSE.STRETCH_X - Math.abs(normalizedX) * stretch * MOUSE.STRETCH_Y;
  const translateX = deltaX * config.elasticity * MOUSE.TRANSLATE_FACTOR * fade;
  const translateY = deltaY * config.elasticity * MOUSE.TRANSLATE_FACTOR * fade;

  const offsetX = (deltaX / rect.width) * 100;
  const offsetY = (deltaY / rect.height) * 100;

  root.style.setProperty("--lg-x", `${translateX}px`);
  root.style.setProperty("--lg-y", `${translateY}px`);
  root.style.setProperty("--lg-scale-x", String(Math.max(MOUSE.MIN_SCALE, scaleX)));
  root.style.setProperty("--lg-scale-y", String(Math.max(MOUSE.MIN_SCALE, scaleY)));
  root.style.setProperty("--lg-angle", `${MOUSE.BASE_ANGLE + offsetX * MOUSE.ANGLE_SENSITIVITY}deg`);
  root.style.setProperty("--lg-highlight-a", String(MOUSE.HIGHLIGHT_BASE_A + Math.abs(offsetX) * MOUSE.HIGHLIGHT_SENS_A));
  root.style.setProperty("--lg-highlight-b", String(MOUSE.HIGHLIGHT_BASE_B + Math.abs(offsetX) * MOUSE.HIGHLIGHT_SENS_B));
  root.style.setProperty("--lg-stop-a", `${Math.max(10, MOUSE.STOP_BASE_A + offsetY * MOUSE.STOP_SENS_A)}%`);
  root.style.setProperty("--lg-stop-b", `${Math.min(90, MOUSE.STOP_BASE_B + offsetY * MOUSE.STOP_SENS_B)}%`);
}

function resetMouse(root: HTMLElement): void {
  root.classList.add("lg-resetting");
  root.style.setProperty("--lg-x", "0px");
  root.style.setProperty("--lg-y", "0px");
  root.style.setProperty("--lg-scale-x", "1");
  root.style.setProperty("--lg-scale-y", "1");
}

function refreshRoot(root: HTMLElement): void {
  const config = readConfig(root);
  if (!config) return;
  updateSize(root, config);
  updateFilterPrimitives(root, config);
  applyShaderMap(root, config);
}

function mountRoot(root: HTMLElement): void {
  if (mounted.has(root)) return;
  const config = readConfig(root);
  if (!config) return;

  const abort = new AbortController();
  const resizeObserver = new ResizeObserver(() => refreshRoot(root));

  refreshRoot(root);
  resizeObserver.observe(root);

  root.addEventListener("mousemove", (event) => {
    root.classList.remove("lg-resetting");
    const latest = readConfig(root);
    if (latest) updateMouse(root, latest, event.clientX, event.clientY);
  }, { signal: abort.signal });

  root.addEventListener("mouseleave", () => resetMouse(root), { signal: abort.signal });

  root.addEventListener("pointerdown", () => {
    root.dataset.lgActive = "true";
  }, { signal: abort.signal });

  root.addEventListener("pointerup", () => {
    delete root.dataset.lgActive;
  }, { signal: abort.signal });

  root.addEventListener("pointercancel", () => {
    delete root.dataset.lgActive;
  }, { signal: abort.signal });

  mounted.set(root, { abort, resizeObserver });
}

export function mountLiquidGlass(): void {
  document.querySelectorAll<HTMLElement>("[data-liquid-glass]").forEach(mountRoot);
}

export function refreshLiquidGlass(id?: string): void {
  if (id) {
    const root = document.getElementById(id);
    if (root instanceof HTMLElement && root.matches("[data-liquid-glass]")) refreshRoot(root);
    return;
  }
  document.querySelectorAll<HTMLElement>("[data-liquid-glass]").forEach(refreshRoot);
}

export function unmountLiquidGlass(): void {
  document.querySelectorAll<HTMLElement>("[data-liquid-glass]").forEach((root) => {
    const state = mounted.get(root);
    if (!state) return;
    state.abort.abort();
    state.resizeObserver.disconnect();
    mounted.delete(root);
  });
}

if (typeof document !== "undefined") {
  document.addEventListener("astro:before-swap", unmountLiquidGlass);
  document.addEventListener("liquid-glass:update", ((event: CustomEvent<{ id?: string }>) => {
    refreshLiquidGlass(event.detail?.id);
  }) as EventListener);
}
