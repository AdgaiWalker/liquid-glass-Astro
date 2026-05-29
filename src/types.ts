export type LiquidGlassMode = "standard" | "polar" | "prominent" | "shader";

export interface LiquidGlassProps {
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  overLight?: boolean;
  mode?: LiquidGlassMode;
  padding?: string;
  clickable?: boolean;
  class?: string;
  style?: string;
  id?: string;
}
