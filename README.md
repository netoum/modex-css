# @netoum/modex-css

[Corex](https://www.npmjs.com/package/@netoum/corex) Modex CSS package providing global design tokens and component-level utility styles for scalable UI development.

---

## 📦 About

This package provides precompiled CSS styles for the [Corex](https://netoum.com/corex) UI system. It includes:

- 🎨 Global design tokens (colors, spacing, typography, etc.)
- 🧩 Component-level utility styles
- 🔧 Built from design tokens compatible with Tokens Studio files 
- 🌗 Multiple themes (Neo, Revo, Uno) with light/dark modes
- 🚀 Ready-to-use CSS for scalable design systems and modern UIs
---

## 📦 Installation

```bash
npm install @netoum/corex-css
```

## 💡 Usage

### Import a full theme stylesheet:

```css
@import "@netoum/corex-css/neo.css";   /* or revo.css, uno.css */

```

### Import component-level styles:

```css
@import "@netoum/corex-css/components/button.css";
```

### Import token-based styles directly:

```css
@import "@netoum/corex-css/tokens/global/color.css";
@import "@netoum/corex-css/tokens/neo/semantic/color.css";
```

💡 You can explore all available paths in the exports section of package.json.

## 🛠️ Development

### 🔧 Full Build (from design tokens)

Build all themes and modes (light/dark) using token configurations:

```bash
npm run build
```

### ⚡ CSS Build Only (skip design tokens)

Skip token processing and rebuild only the final output CSS:

```bash
npm run build:from:css
```

### 🔍 Lint

```bash
npm run lint
```

## 📜 License

MIT © Netoum

## 🤝 Built by Netoum

Corex is built by Netoum — a web agency specializing in modern applications using HTML, Vanilla JS, TypeScript, Elixir/Phoenix, and accessibility-first development.

Creating exceptional web experiences for clients worldwide.

**Get in touch:** info@netoum.com