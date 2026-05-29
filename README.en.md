# Liquid Glass Astro
<!-- src: package.json:2-5 -->

Apple's Liquid Glass effect for Astro. <!-- src: package.json:4 -->

Card Example              |  Button Example
:-------------------------:|:-------------------------:
![](./assets/card.png)  |  ![](./assets/button.png)

## Demo
<!-- src: example/ directory -->

Run the included example app:

```bash
git clone https://github.com/AdgaiWalker/liquid-glass-Astro.git
cd liquid-glass-Astro/example
npm install
npm run dev
```

![project liquid gif](./assets/project-liquid.gif)

## Features
<!-- Each feature annotated with its source code location -->

- SVG filter chain with chromatic aberration (RGB channel separation) <!-- src: src/LiquidGlass.astro:51-112 -->
- 4 refraction modes: `standard`, `polar`, `prominent`, `shader` <!-- src: src/types.ts:1, src/utils.ts:10-15 -->
- Configurable chromatic aberration intensity <!-- src: src/LiquidGlass.astro:67-101 -->
- Elastic mouse interaction: stretch + translate + spring-back <!-- src: src/client/liquid-glass.ts:106-158 -->
- Configurable blur/frost level <!-- src: src/client/liquid-glass.ts:52-59 -->
- Supports arbitrary child content via Astro `<slot />` <!-- src: src/LiquidGlass.astro:116 -->
- Multi-layer shadow with contact shadow <!-- src: src/LiquidGlass.astro:204-209 -->
- Gradient border highlights that follow the cursor <!-- src: src/LiquidGlass.astro:263-273, src/client/liquid-glass.ts:141-149 -->
- Shader mode uses canvas SDF with 2x2 supersampling <!-- src: src/shader-utils.ts:65-81 -->
- Press feedback animation (scale to 0.92) <!-- src: src/LiquidGlass.astro:159-162 -->
- Automatic Firefox fallback (disables SVG filter, keeps backdrop-filter) <!-- src: src/client/liquid-glass.ts:48-50 -->
- Respects `prefers-reduced-motion` <!-- src: src/LiquidGlass.astro:308-313 -->

> **Note:** Safari partially supports the effect. Firefox automatically falls back to a simpler appearance. <!-- src: src/client/liquid-glass.ts:48-50 -->

## Installation

```bash
npm install liquid-glass-astro
```
<!-- src: package.json:2 -->

## Usage

### Basic Usage
<!-- src: example/src/pages/index.astro:2,43-83 -->

```astro
---
import LiquidGlass from 'liquid-glass-astro'
---

<LiquidGlass>
  <div class="p-6">
    <h2>Your content here</h2>
    <p>This will have the liquid glass effect</p>
  </div>
</LiquidGlass>
```

### Button Example
<!-- src: example/src/pages/index.astro:85-108 -->

```astro
---
import LiquidGlass from 'liquid-glass-astro'
---

<LiquidGlass
  displacementScale={64}
  blurAmount={0.1}
  saturation={130}
  aberrationIntensity={2}
  elasticity={0.35}
  cornerRadius={100}
  padding="8px 16px"
  clickable={true}
>
  <span>Click Me</span>
</LiquidGlass>
```

### Refraction Modes
<!-- src: src/types.ts:1, src/utils.ts:10-15 -->

```astro
<LiquidGlass mode="standard">Standard refraction</LiquidGlass>
<LiquidGlass mode="polar">Polar refraction</LiquidGlass>
<LiquidGlass mode="prominent">Prominent refraction</LiquidGlass>
<LiquidGlass mode="shader">Shader (experimental, canvas-generated)</LiquidGlass>
```

### Over Light Backgrounds
<!-- src: src/LiquidGlass.astro:178-180,212-218,245-247 -->

When the glass sits over a bright background, enable `overLight` for stronger shadows and removed text-shadow:

```astro
<LiquidGlass overLight={true}>
  <span>Visible on light backgrounds</span>
</LiquidGlass>
```

### Custom Positioning
<!-- src: example/src/pages/index.astro:53 -->

```astro
<LiquidGlass
  style="position: fixed; top: 25%; left: 50%; transform: translateX(-50%);"
>
  <p>Centered overlay</p>
</LiquidGlass>
```

### Manual Refresh
<!-- src: src/client/liquid-glass.ts:206-213 -->

```ts
import { refreshLiquidGlass } from 'liquid-glass-astro/client'

// Refresh a specific instance by id
refreshLiquidGlass('my-glass')

// Refresh all instances
refreshLiquidGlass()
```

You can also dispatch a custom event:
<!-- src: src/client/liquid-glass.ts:227-229 -->

```ts
document.dispatchEvent(new CustomEvent('liquid-glass:update', { detail: { id: 'my-glass' } }))
```

## Props

<!-- src: src/types.ts:3-17 (all fields), src/LiquidGlass.astro:4-18 (all defaults) -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `displacementScale` | `number` | `70` | Intensity of the displacement/refraction effect <!-- src: types.ts:4, astro:5 --> |
| `blurAmount` | `number` | `0.0625` | Blur/frost level. Actual blur = `(overLight ? 12 : 4) + blurAmount * 32` px <!-- src: types.ts:5, astro:6, client/liquid-glass.ts:58 --> |
| `saturation` | `number` | `140` | Color saturation of the backdrop-filter (percent) <!-- src: types.ts:6, astro:7 --> |
| `aberrationIntensity` | `number` | `5` | Chromatic aberration strength. Affects RGB channel displacement separation <!-- src: types.ts:7, astro:8 --> |
| `elasticity` | `number` | `0.15` | Elastic "liquid" feel on mouse interaction. 0 = rigid, higher = more elastic <!-- src: types.ts:8, astro:9 --> |
| `cornerRadius` | `number` | `999` | Border radius in pixels <!-- src: types.ts:9, astro:10 --> |
| `overLight` | `boolean` | `false` | Adapts shadows, text, and blur for use over light backgrounds <!-- src: types.ts:10, astro:13 --> |
| `mode` | `"standard" \| "polar" \| "prominent" \| "shader"` | `"standard"` | Refraction mode. `shader` is canvas-generated, experimental <!-- src: types.ts:1,11, astro:14 --> |
| `padding` | `string` | `"24px 32px"` | CSS padding value for the glass content area <!-- src: types.ts:12, astro:12 --> |
| `clickable` | `boolean` | `false` | Enables pointer cursor, hover highlight, and press animation <!-- src: types.ts:13, astro:15 --> |
| `class` | `string` | `""` | Additional CSS classes on the root element <!-- src: types.ts:14, astro:11 --> |
| `style` | `string` | `""` | Additional inline CSS (appended to internal styles) <!-- src: types.ts:15, astro:16 --> |
| `id` | `string` | auto `lg-{random}` | Custom ID. Used for targeting with `refreshLiquidGlass(id)` <!-- src: types.ts:16, astro:20 --> |

## Advanced

### Client-Side API
<!-- src: src/client/liquid-glass.ts:202-230 -->

The component auto-mounts on page load and handles Astro view transitions automatically. You can also use the imperative API:

```ts
import { mountLiquidGlass, refreshLiquidGlass, unmountLiquidGlass } from 'liquid-glass-astro/client'

mountLiquidGlass()           // Mount all [data-liquid-glass] elements
refreshLiquidGlass('my-id')  // Refresh a specific instance by id
refreshLiquidGlass()         // Refresh all instances
unmountLiquidGlass()         // Unmount all (called automatically on astro:before-swap)
```

The component listens for:
<!-- src: src/client/liquid-glass.ts:226-229 -->

- `astro:page-load` — auto-remounts on Astro view transitions
- `astro:before-swap` — auto-unmounts before page swap
- `liquid-glass:update` — manual refresh event with optional `{ id }` detail

### Mouse Interaction Details
<!-- src: src/client/liquid-glass.ts:20-37,106-149 -->

When the cursor moves within 300px of a glass element (configurable via `elasticity`):

- The element **translates** toward the cursor (factor 0.18x) <!-- src: client/liquid-glass.ts:25,135-136 -->
- The element **stretches** along the cursor axis (X: 0.65, Y: 0.35) <!-- src: client/liquid-glass.ts:23-24,133-134 -->
- The **gradient border** rotates and shifts to match the light direction <!-- src: client/liquid-glass.ts:141-149 -->
- On mouse leave, the element **spring-bounces** back (0.5s cubic-bezier overshoot) <!-- src: client/liquid-glass.ts:152-158, astro:155-157 -->

### Browser Compatibility

| Browser | SVG Filter | backdrop-filter | Notes |
|---------|-----------|-----------------|-------|
| Chrome / Edge | Full | Full | Best experience |
| Safari | Partial | Full | Some filter differences |
| Firefox | **Disabled** | Full | Auto-fallback: `filter: none` <!-- src: src/client/liquid-glass.ts:48-50,56 --> |

### Accessibility

- All decorative elements use `aria-hidden="true"` <!-- src: src/LiquidGlass.astro:45,49,115,119,120,121 -->
- `prefers-reduced-motion: reduce` disables all transforms and transitions <!-- src: src/LiquidGlass.astro:308-313 -->

## Credits

Ported from [liquid-glass-react](https://github.com/rdev/liquid-glass-react) by [@rdev](https://github.com/rdev).
