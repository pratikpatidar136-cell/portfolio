# Implementation Plan - 3D Interactive Portfolio in Local Workspace

We will build a high-fidelity, visually spectacular **3D Interactive Portfolio** for a **Graphics Designer & Video Editor** using **Next.js**, **Tailwind CSS (v3/v4)**, **TypeScript**, and **Framer Motion**. 

Since Node.js is currently not installed on the system, we will install it via `winget` and configure the local powershell session dynamically to execute project setup directly in the local folder: `c:\Users\prati\Documents\potii`.

---

## User Review Required

> [!IMPORTANT]
> **Node.js Installation & Session Setup**:
> Node.js is currently missing from your local environment. We will execute:
> 1. `winget install --id OpenJS.NodeJS.LTS --exact --silent --accept-source-agreements --accept-package-agreements`
> 2. Dynamically add the Node installation folder (`C:\Program Files\nodejs`) to the current process's `$env:Path` so we can immediately start using `node`, `npm`, and `npx` in the same shell session.
>
> **Workspace Location**:
> The project files will be created directly in your active directory:
> `c:\Users\prati\Documents\potii`

> [!TIP]
> **Tailwind CSS Integration**:
> We will configure Tailwind CSS v3/v4 using official template standards to ensure rapid building of modern glassmorphism components, glowing spotlights, and complex grid-hover interactions.

---

## Open Questions

None at this stage. We have verified `winget` is available, and we are ready to proceed with installing Node.js and building the project in the workspace.

---

## Proposed Changes

We will construct a standard Next.js structure in the current directory (`c:\Users\prati\Documents\potii`). All components will be fully typed, responsive, and beautifully styled.

### 1. Setup & Environment
- **Node.js Installation**: Run `winget` to install Node.js LTS.
- **Path Refresh**: Inject `C:\Program Files\nodejs` to the current session's path.
- **Project Setup**: Run `npx -y create-next-app@14 ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` to initialize the project in the current folder.

### 2. Config & Style Declarations

#### [MODIFY] [tailwind.config.ts](file:///c:/Users/prati/Documents/potii/tailwind.config.ts)
Custom animation keyframes for the spotlight, custom glowing cards, custom color themes (deep violet/indigo blacks), and custom transitions.

#### [MODIFY] [src/app/globals.css](file:///c:/Users/prati/Documents/potii/src/app/globals.css)
Inject glassmorphism utility classes, ambient scroll behaviors, and premium mouse-track cursor custom variable styling.

### 3. Component Layer

#### [NEW] [src/components/ui/spotlight.tsx](file:///c:/Users/prati/Documents/potii/src/components/ui/spotlight.tsx)
The Aceternity SVG Spotlight component for the hero glowing backdrops.

#### [NEW] [src/components/ui/spotlight-hover.tsx](file:///c:/Users/prati/Documents/potii/src/components/ui/spotlight-hover.tsx)
Dynamic hover glow grid-cards tracking the mouse coordinates dynamically to render beautiful radial glowing effects.

#### [NEW] [src/components/ui/floating-dock.tsx](file:///c:/Users/prati/Documents/potii/src/components/ui/floating-dock.tsx)
Premium, fluid navigation bar anchored at the bottom of the screen with smooth floating hover expansions.

#### [NEW] [src/components/ui/spline-scene.tsx](file:///c:/Users/prati/Documents/potii/src/components/ui/spline-scene.tsx)
A robust lazy-loaded 3D Spline scene component with smooth skeletal fallback loaders in case the user has network blocks.

### 4. Page Architecture & Sections

#### [MODIFY] [src/app/layout.tsx](file:///c:/Users/prati/Documents/potii/src/app/layout.tsx)
Modern fonts, semantic SEO metadata configurations, and global smooth scrolling body wrappers.

#### [MODIFY] [src/app/page.tsx](file:///c:/Users/prati/Documents/potii/src/app/page.tsx)
Constructing a premier landing page layout containing:
- **Hero Area**: 3D Spline Scene + typography header + CTA actions + stat counters.
- **Service Deck**: Spotlight Hover Cards showcasing (Video Editing, Color Grading, 3D Motion Graphics, Visual Effects).
- **Showcase Gallery**: Beautiful interactive media gallery displaying design work with category filtering.
- **Creative Journey Timeline**: Aesthetic vertical history of high-end client video/design deliverables.
- **Contact Desk**: A sleek, custom contact form with glassmorphic cards.

---

## Verification Plan

### Automated Tests
1. **Node Environment Check**: Verify `node -v` and `npm -v` run correctly.
2. **Build Success**: Verify compiling via `npm run build`.

### Manual Verification
1. **Interactive Review**: Launch `npm run dev` and open in the browser.
2. **Visual Auditing**: Inspect Spotlight gradients, responsive layouts, hover effects, and Spline load status.
