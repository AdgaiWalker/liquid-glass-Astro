<!-- src: package.json:2-5 -->
# Liquid Glass Astro

[English](./README.en.md)

<!-- src: package.json:4 -->
Apple 液态玻璃效果的 Astro 组件。

卡片示例                  |  按钮示例
:-------------------------:|:-------------------------:
![](./assets/card.png)  |  ![](./assets/button.png)

## 演示

<!-- src: example/ 目录 -->
运行内置的示例应用：

```bash
git clone https://github.com/AdgaiWalker/liquid-glass-Astro.git
cd liquid-glass-Astro/example
npm install
npm run dev
```

![project liquid gif](./assets/project-liquid.gif)

## 特性

<!-- src: src/LiquidGlass.astro:51-112 -->
- SVG 滤镜链实现折射与色差（RGB 通道分离）
<!-- src: src/types.ts:1, src/utils.ts:10-15 -->
- 4 种折射模式：`standard`、`polar`、`prominent`、`shader`
<!-- src: src/LiquidGlass.astro:67-101 -->
- 可配置色差强度
<!-- src: src/client/liquid-glass.ts:106-158 -->
- 弹性鼠标交互：拉伸 + 平移 + 弹簧回弹
<!-- src: src/client/liquid-glass.ts:52-59 -->
- 可配置模糊/霜化级别
<!-- src: src/LiquidGlass.astro:116 -->
- 通过 Astro `<slot />` 支持任意子内容
<!-- src: src/LiquidGlass.astro:204-209 -->
- 多层阴影 + 接触阴影
<!-- src: src/LiquidGlass.astro:263-273, src/client/liquid-glass.ts:141-149 -->
- 渐变边框高光跟随光标移动
<!-- src: src/shader-utils.ts:65-81 -->
- Shader 模式使用 Canvas SDF + 2×2 超采样
<!-- src: src/LiquidGlass.astro:159-162 -->
- 按压反馈动画（缩放至 0.92）
<!-- src: src/client/liquid-glass.ts:48-50 -->
- Firefox 自动回退（禁用 SVG 滤镜，保留 backdrop-filter）
<!-- src: src/LiquidGlass.astro:308-313 -->
- 尊重 `prefers-reduced-motion` 无障碍设置

<!-- src: src/client/liquid-glass.ts:48-50 -->
> **注意：** Safari 部分支持该效果。Firefox 会自动回退为更简洁的外观。

## 安装

<!-- src: package.json:2 -->
```bash
npm install liquid-glass-astro
```

## 用法

<!-- src: example/src/pages/index.astro:2,43-83 -->
### 基础用法

```astro
---
import LiquidGlass from 'liquid-glass-astro'
---

<LiquidGlass>
  <div class="p-6">
    <h2>你的内容</h2>
    <p>这里会有液态玻璃效果</p>
  </div>
</LiquidGlass>
```

<!-- src: example/src/pages/index.astro:85-108 -->
### 按钮示例

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
  <span>点击我</span>
</LiquidGlass>
```

<!-- src: src/types.ts:1, src/utils.ts:10-15 -->
### 折射模式

```astro
<LiquidGlass mode="standard">标准折射</LiquidGlass>
<LiquidGlass mode="polar">极坐标折射</LiquidGlass>
<LiquidGlass mode="prominent">突出折射</LiquidGlass>
<LiquidGlass mode="shader">Shader 模式（实验性，Canvas 动态生成）</LiquidGlass>
```

<!-- src: src/LiquidGlass.astro:178-180,212-218,245-247 -->
### 浅色背景

当玻璃组件位于明亮背景上时，启用 `overLight` 可获得更强的阴影和更清晰的文字：

```astro
<LiquidGlass overLight={true}>
  <span>在浅色背景上依然清晰</span>
</LiquidGlass>
```

<!-- src: example/src/pages/index.astro:53 -->
### 自定义定位

```astro
<LiquidGlass
  style="position: fixed; top: 25%; left: 50%; transform: translateX(-50%);"
>
  <p>居中浮层</p>
</LiquidGlass>
```

<!-- src: src/client/liquid-glass.ts:206-213 -->
### 手动刷新

```ts
import { refreshLiquidGlass } from 'liquid-glass-astro/client'

// 刷新指定 id 的实例
refreshLiquidGlass('my-glass')

// 刷新所有实例
refreshLiquidGlass()
```

<!-- src: src/client/liquid-glass.ts:227-229 -->
也可以通过自定义事件触发：

```ts
document.dispatchEvent(new CustomEvent('liquid-glass:update', { detail: { id: 'my-glass' } }))
```

## Props

<!-- src: src/types.ts:3-17（全部字段）, src/LiquidGlass.astro:4-18（全部默认值） -->

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
<!-- src: types.ts:4, astro:5 -->
| `displacementScale` | `number` | `70` | 位移/折射效果的强度 |
<!-- src: types.ts:5, astro:6, client/liquid-glass.ts:58 -->
| `blurAmount` | `number` | `0.0625` | 模糊/霜化级别。实际模糊 = `(overLight ? 12 : 4) + blurAmount * 32` px |
<!-- src: types.ts:6, astro:7 -->
| `saturation` | `number` | `140` | backdrop-filter 的色彩饱和度（百分比） |
<!-- src: types.ts:7, astro:8 -->
| `aberrationIntensity` | `number` | `5` | 色差强度。影响 RGB 通道位移的分离程度 |
<!-- src: types.ts:8, astro:9 -->
| `elasticity` | `number` | `0.15` | 鼠标交互的弹性"液态"感。0 = 刚性，越大越有弹性 |
<!-- src: types.ts:9, astro:10 -->
| `cornerRadius` | `number` | `999` | 圆角半径（像素） |
<!-- src: types.ts:10, astro:13 -->
| `overLight` | `boolean` | `false` | 适配浅色背景：增强阴影、移除文字阴影 |
<!-- src: types.ts:1,11, astro:14 -->
| `mode` | `"standard" \| "polar" \| "prominent" \| "shader"` | `"standard"` | 折射模式。`shader` 为 Canvas 动态生成，实验性 |
<!-- src: types.ts:12, astro:12 -->
| `padding` | `string` | `"24px 32px"` | 玻璃内容区的 CSS padding |
<!-- src: types.ts:13, astro:15 -->
| `clickable` | `boolean` | `false` | 启用手型光标、悬停高亮和按压动画 |
<!-- src: types.ts:14, astro:11 -->
| `class` | `string` | `""` | 根元素额外的 CSS 类名 |
<!-- src: types.ts:15, astro:16 -->
| `style` | `string` | `""` | 额外的内联 CSS（追加到内部样式之后） |
<!-- src: types.ts:16, astro:20 -->
| `id` | `string` | 自动 `lg-{随机}` | 自定义 ID。用于 `refreshLiquidGlass(id)` 定位 |

## 进阶

<!-- src: src/client/liquid-glass.ts:202-230 -->
### 客户端 API

组件在页面加载时自动挂载，并自动处理 Astro 页面切换。你也可以使用命令式 API：

```ts
import { mountLiquidGlass, refreshLiquidGlass, unmountLiquidGlass } from 'liquid-glass-astro/client'

mountLiquidGlass()           // 挂载所有 [data-liquid-glass] 元素
refreshLiquidGlass('my-id')  // 刷新指定 id 的实例
refreshLiquidGlass()         // 刷新所有实例
unmountLiquidGlass()         // 卸载所有（在 astro:before-swap 时自动调用）
```

<!-- src: src/client/liquid-glass.ts:226-229 -->
组件监听以下事件：

- `astro:page-load` — Astro 页面切换后自动重新挂载
- `astro:before-swap` — 页面切换前自动卸载
- `liquid-glass:update` — 手动刷新事件，支持可选的 `{ id }` 参数

<!-- src: src/client/liquid-glass.ts:20-37,106-149 -->
### 鼠标交互细节

当光标进入玻璃元素 300px 范围内（可通过 `elasticity` 调节）：

<!-- src: client/liquid-glass.ts:25,135-136 -->
- 元素向光标方向**平移**（系数 0.18x）
<!-- src: client/liquid-glass.ts:23-24,133-134 -->
- 元素沿光标轴方向**拉伸**（X: 0.65, Y: 0.35）
<!-- src: client/liquid-glass.ts:141-149 -->
- **渐变边框**旋转并偏移，模拟光线方向
<!-- src: client/liquid-glass.ts:152-158, astro:155-157 -->
- 鼠标离开时，元素以弹簧动画**回弹**（0.5s cubic-bezier 过冲）

### 浏览器兼容性

| 浏览器 | SVG 滤镜 | backdrop-filter | 备注 |
|--------|----------|-----------------|------|
| Chrome / Edge | 完整 | 完整 | 最佳体验 |
| Safari | 部分 | 完整 | 部分滤镜有差异 |
<!-- src: src/client/liquid-glass.ts:48-50,56 -->
| Firefox | **禁用** | 完整 | 自动回退为 `filter: none` |

### 无障碍

<!-- src: src/LiquidGlass.astro:45,49,115,119,120,121 -->
- 所有装饰性元素均标记 `aria-hidden="true"`
<!-- src: src/LiquidGlass.astro:308-313 -->
- 当系统开启 `prefers-reduced-motion` 时，自动禁用所有变换和过渡动画

## 致谢

移植自 [liquid-glass-react](https://github.com/rdev/liquid-glass-react)，原作者 [@rdev](https://github.com/rdev)。
