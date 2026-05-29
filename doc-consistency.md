# Documentation Consistency Review Report

**Project**: liquid-glass-astro
**Date**: 2026-05-29
**Reviewer**: Automated doc-consistency-reviewer
**Scope**: README.md, src/types.ts, src/LiquidGlass.astro, src/client/liquid-glass.ts, src/shader-utils.ts, package.json

---

## 审核结论

- **结论**: **不通过** — README 完全描述的是旧 React 版本，与当前 Astro 实现严重不一致
- **汇总**: P0: 2  P1: 8  P2: 6  P3: 5  待补充: 2
- **修复优先级**: P0 → P1 → P2 → P3

---

## P0 — 严重误导/安全问题

### [P0-01] README 标题与项目性质不符
- **严重级别**: P0
- **位置**: `README.md:1`
- **证据**:
  - 文档: `# Liquid Glass React` + `Apple's Liquid Glass effect for React`
  - 代码: `package.json` name = `"liquid-glass-astro"`, description = `"Apple's Liquid Glass effect for Astro"`
- **影响**: 用户以为这是 React 组件，实际是 Astro 组件；npm install 命令完全错误
- **建议**: 改为 `# Liquid Glass Astro` + 对应描述

### [P0-02] 安装命令指向错误包名
- **严重级别**: P0
- **位置**: `README.md:34`
- **证据**:
  - 文档: `npm install liquid-glass-react`
  - 代码: `package.json` name = `"liquid-glass-astro"`
- **影响**: 按文档操作 100% 失败，安装了一个不同的 npm 包
- **建议**: 改为 `npm install liquid-glass-astro`

---

## P1 — 核心功能不一致

### [P1-01] 代码示例使用 React 语法
- **严重级别**: P1
- **位置**: `README.md:39-52` (Basic Usage), `README.md:57-69` (Button Example)
- **证据**:
  - 文档: `import LiquidGlass from 'liquid-glass-react'` + JSX `<LiquidGlass>` 语法
  - 代码: 实际是 Astro 组件 `src/LiquidGlass.astro`，使用 `---` frontmatter + `<slot />`
- **影响**: 用户无法运行示例代码
- **建议**: 重写为 Astro 组件使用示例，展示 `import LiquidGlass from 'liquid-glass-astro'` + `<LiquidGlass>` 在 `.astro` 文件中的用法

### [P1-02] mouseContainer prop 不存在
- **严重级别**: P1
- **位置**: `README.md:73-93` (Mouse Container Example), `README.md:111`
- **证据**:
  - 文档: 声明 `mouseContainer` prop（`React.RefObject<HTMLElement | null> | null`）
  - 代码: `src/types.ts` `LiquidGlassProps` 接口中无此属性
- **影响**: 用户传入 `mouseContainer` 会被静默忽略，功能不会生效
- **建议**: 删除该 prop 文档或说明此功能在 Astro 版本中不可用

### [P1-03] globalMousePos prop 不存在
- **严重级别**: P1
- **位置**: `README.md:113`
- **证据**:
  - 文档: 声明 `globalMousePos` prop（`{ x: number; y: number }`）
  - 代码: `src/types.ts` 无此属性
- **影响**: 同 P1-02
- **建议**: 删除该 prop 文档

### [P1-04] mouseOffset prop 不存在
- **严重级别**: P1
- **位置**: `README.md:114`
- **证据**:
  - 文档: 声明 `mouseOffset` prop（`{ x: number; y: number }`）
  - 代码: `src/types.ts` 无此属性
- **影响**: 同 P1-02
- **建议**: 删除该 prop 文档

### [P1-05] onClick prop 不存在
- **严重级别**: P1
- **位置**: `README.md:110`
- **证据**:
  - 文档: 声明 `onClick` prop（`() => void`）
  - 代码: `src/types.ts` 有 `clickable: boolean` 但无 `onClick`；Astro 组件通过 DOM 事件处理点击
- **影响**: 用户传入 `onClick` 不会生效
- **建议**: 说明使用 Astro 的标准事件绑定方式，删除 `onClick` prop 文档

### [P1-06] children prop 不存在（改为 slot）
- **严重级别**: P1
- **位置**: `README.md:99`
- **证据**:
  - 文档: `children` 类型 `React.ReactNode`
  - 代码: `src/LiquidGlass.astro:116` 使用 `<slot />`（Astro 的子组件传递方式）
- **影响**: 概念误导
- **建议**: 说明使用 Astro slot 语法传递内容

### [P1-07] style prop 类型不匹配
- **严重级别**: P1
- **位置**: `README.md:108`
- **证据**:
  - 文档: `style` 类型 `React.CSSProperties`（对象）
  - 代码: `src/types.ts:15` `style?: string`
- **影响**: 用户传入对象会报错
- **建议**: 改类型为 `string`（CSS 字符串）

### [P1-08] className prop 不存在
- **严重级别**: P1
- **位置**: `README.md:106`
- **证据**:
  - 文档: `className` prop
  - 代码: `src/types.ts:14` 使用 `class`（Astro 使用 HTML 属性名）
- **影响**: 传入 `className` 会被 Astro 忽略
- **建议**: 改为 `class` prop

---

## P2 — 示例不完整/命名不一致

### [P2-01] 缺少 Astro 版本未记录的 prop
- **严重级别**: P2
- **位置**: `src/types.ts:13-16`
- **证据**:
  - 代码: `clickable?: boolean`, `id?: string` 两个新 prop
  - 文档: Props 表格中无此两项
- **影响**: 用户不知道可以使用这些功能
- **建议**: 在 Props 表格中添加 `clickable` 和 `id`

### [P2-02] padding 默认值不一致
- **严重级别**: P2
- **位置**: `README.md:107`
- **证据**:
  - 文档: padding 默认值标记为 `-`（无默认值）
  - 代码: `src/LiquidGlass.astro:12` `padding = "24px 32px"`
- **影响**: 用户不知道不传 padding 时有默认值
- **建议**: 默认值改为 `"24px 32px"`

### [P2-03] aberrationIntensity 默认值不一致
- **严重级别**: P2
- **位置**: `README.md:103`
- **证据**:
  - 文档: `aberrationIntensity` 默认值 `2`
  - 代码: `src/LiquidGlass.astro:8` `aberrationIntensity = 5`
- **影响**: 用户预期色差效果比实际弱
- **建议**: 默认值改为 `5`

### [P2-04] README 图片链接指向上游仓库
- **严重级别**: P2
- **位置**: `README.md:7`
- **证据**:
  - 文档: `![](https://github.com/rdev/liquid-glass-react/raw/master/assets/card.png)` — 指向 `rdev/liquid-glass-react`
  - 代码: 本地有 `assets/card.png`, `assets/button.png`, `assets/project-liquid.gif`
- **影响**: 如果上游删除资源则图片丢失
- **建议**: 改为相对路径 `./assets/card.png` 等

### [P2-05] Demo 链接指向外部站点
- **严重级别**: P2
- **位置**: `README.md:11`
- **证据**:
  - 文档: `https://liquid-glass.maxrovensky.com` — 上游 React demo
  - 代码: 本地有 `example/` Astro demo
- **影响**: 用户看到的是 React 版效果而非 Astro 版
- **建议**: 指向本项目部署的 demo 或说明这是上游 demo

### [P2-06] liquid-glass-example/ 仍保留旧 React 代码
- **严重级别**: P2
- **位置**: `liquid-glass-example/` 整个目录
- **证据**:
  - `liquid-glass-example/package.json` 依赖 `liquid-glass-react: ^1.0.2`
  - `liquid-glass-example/README.md` 是默认 Next.js 模板
  - 项目已移植为 Astro，此目录已无用
- **影响**: 混淆项目结构
- **建议**: 删除 `liquid-glass-example/` 目录或移至 archive

---

## P3 — 措辞/格式/链接小问题

### [P3-01] 关键词列表不完整
- **严重级别**: P3
- **位置**: `README.md:不存在的 keywords section`; `package.json:14`
- **证据**:
  - package.json keywords: `["astro", "liquid-glass", "component", "typescript"]`
  - README 无 keywords 区域，但内容关键词包含 "react"
- **影响**: SEO/发现性
- **建议**: README 中删除 React 相关关键词

### [P3-02] 没有说明浏览器兼容性差异
- **严重级别**: P3
- **位置**: `README.md:27`
- **证据**:
  - 文档: `Safari and Firefox only partially support the effect (displacement will not be visible)`
  - 代码: `src/client/liquid-glass.ts:48-56` 有 `isFirefox()` 检测，对 Firefox 禁用 SVG filter
- **影响**: 文档描述不够精确，实际代码对 Firefox 有专门处理
- **建议**: 补充说明 Firefox 完全不支持 displacement（代码中回退为 `filter: none`）

### [P3-03] package.json repository.url 为空
- **严重级别**: P3
- **位置**: `package.json:19`
- **证据**:
  - 代码: `"url": ""`
- **影响**: npm 包缺少仓库链接
- **建议**: 填入 `https://github.com/AdgaiWalker/liquid-glass-Astro`

### [P3-04] 旧 src/index.tsx 仍存在
- **严重级别**: P3
- **位置**: `src/index.tsx`
- **证据**:
  - 文件存在，包含 React 组件实现（564 行）
  - `package.json` exports 已不引用此文件
  - `tsconfig.json` extends `astro/tsconfigs/strict`
- **影响**: 混淆代码库，增加维护负担
- **建议**: 删除 `src/index.tsx`

### [P3-05] package.json 无 devDependencies 中缺少 astro
- **严重级别**: P3
- **位置**: `package.json`
- **证据**:
  - 根 `package.json` 无 `astro` 依赖，也无 `devDependencies`
  - `tsconfig.json` extends `astro/tsconfigs/strict`
  - example 依赖 `astro: ^5.7.10`
- **影响**: 根项目直接 `npm install` 可能缺少 astro 类型支持
- **建议**: 添加 `astro` 为 peerDependency 或 devDependency

---

## 待证据补充

### [待补充-01] shader mode 稳定性声明
- **严重级别**: 待证据补充
- **位置**: `README.md:112`
- **证据**:
  - 文档: `shader` is the most accurate but not the most stable
  - 代码: shader mode 使用 `ShaderDisplacementGenerator` 动态生成 displacement map，需测试其稳定性
- **影响**: 不确定描述是否仍然准确
- **建议**: 在 Astro 版本中验证 shader mode 稳定性后更新描述

### [待补充-02] overLight 效果描述
- **严重级别**: 待证据补充
- **位置**: `README.md:109`
- **证据**:
  - 文档: `Whether the glass is over a light background` — 一行简述
  - 代码: `LiquidGlass.astro` 中 overLight 影响 shadow opacity、shadow overlay、box-shadow 深度、text-shadow
- **影响**: 文档描述过于简化，用户可能不知道效果范围
- **建议**: 补充 overLight 影响的具体视觉效果说明

---

## 修复优先级路线图

1. **P0 (紧急)**: 重写 README 标题、描述、安装命令
2. **P1 (必须)**: 重写所有代码示例为 Astro 语法；修正 Props 表格
3. **P2 (建议)**: 补充新 prop 文档、修正默认值、修复图片链接
4. **P3 (可选)**: 清理旧文件、补充 package.json 字段
