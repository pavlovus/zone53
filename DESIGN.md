---
name: ZONE 53
description: Tactical Telemetry & Industrial Brutalism for Europe's Flagship Hardware Lab
colors:
  bg-base: "#000000"
  bg-carbon: "#080808"
  surface-plate: "#141414"
  surface-plate-hover: "#1C1C1C"
  surface-border: "#262626"
  surface-border-subtle: "#1F1F1F"
  text-primary: "#FFFFFF"
  text-secondary: "#8E8E8E"
  text-muted: "#5A5A5A"
  accent: "#FFCC00"
  accent-deep: "#E5B800"
  accent-glow: "rgba(255, 204, 0, 0.2)"
typography:
  display:
    fontFamily: '"Druk Hero", "Druk Heavy", sans-serif'
    fontSize: "clamp(3.5rem, 9.5vw, 11rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Druk Hero", "Druk Heavy", sans-serif'
    fontSize: "clamp(2rem, 5.5vw, 5.5rem)"
    fontWeight: 900
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  body:
    fontFamily: '"HelveticaNeueCyr", "Helvetica Neue", Helvetica, sans-serif'
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.01em"
  telemetry:
    fontFamily: '"JetBrains Mono", monospace'
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  chamfer-sm: "4px"
  chamfer-md: "8px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#000000"
    padding: "16px 36px"
    typography: "{typography.telemetry}"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
  button-secondary:
    backgroundColor: "{colors.surface-plate}"
    textColor: "{colors.text-primary}"
    padding: "16px 32px"
    rounded: "{rounded.none}"
---

# Design System: Tactical Telemetry & Industrial Brutalism

## 1. Overview
The design language of **ZONE 53** is rooted in **Industrial Brutalism, Classified Skunkworks Telemetry, and Heavy Hardware Architecture**. 

It rejects generic commercial SaaS tropes (no purple mesh gradients, no friendly rounded pill cards, no floating dropshadows, no fake glassmorphism). Instead, it reflects the physical reality of a robotics laboratory in a Polish field: high-tensile steel, carbon fiber composites, electronic HUD interfaces, optical sensors, and warning hazard markers.

The North Star:
> **"A classified aerospace testing facility declassifying its vision for high-clearance institutional partners."**

---

## 2. Colors
The color architecture is an uncompromising, disciplined **strict tricolor system**:

### Primitive Palette
* **Deep OLED Black (`#000000`)**: The dominant substrate. Uncompromising, deep, and void-like.
* **Carbon Graphite (`#080808` / `#141414`)**: Technical plate backgrounds and secondary structure surfaces.
* **Hairline Border Carbon (`#262626`)**: 1px solid dividing rules and grid borders.
* **Stark White (`#FFFFFF`)**: Primary macro-typography, brand wordmarks, and high-contrast structural data.
* **Muted Technical Gray (`#8E8E8E` / `#5A5A5A`)**: Secondary descriptive copy, coordinates, and telemetry metadata.
* **Epikor Catalyst Yellow (`#FFCC00` / `#FFCC01`)**: The sole vibrant accent. Represents electrical energy, activation, robotics telemetry, and high-priority actions.

### Usage Rules
1. **Never introduce unvetted secondary hues** (no blue links, no purple glows, no emerald highlights). All accents route through Epikor Yellow.
2. Background is strictly dark. No light mode toggles.
3. Contrast ratios for body copy on `#000000` must meet or exceed WCAG AAA (minimum 7:1 for body copy).

---

## 3. Typography
Typography is the structural skeleton of the entire site. We establish a three-tier typographic hierarchy:

### 3.1 Macro-Display: `Druk Heavy`
* **Role**: Monumental statement headlines, hero brand marks, section identifiers.
* **Style**: Uppercase only, tightly tracked (`letter-spacing: -0.02em` to `-0.04em`), tight leading (`0.85` to `0.95`).
* **Feeling**: Imposing, monumental, industrial.

### 3.2 Human Interface / Prose: `HelveticaNeueCyr`
* **Role**: Mission statements, descriptive text, benefit descriptions, dialog explanations.
* **Variants**:
  * `Bold (700)`: Section subheads and card titles.
  * `Roman (400)`: Body reading paragraphs, form labels.
  * `Light (300)`: Lead introductory phrases.
* **Feeling**: Classic Swiss typographic precision and clinical neutrality.

### 3.3 Tactical Telemetry: `JetBrains Mono`
* **Role**: Metadata, timestamps, coordinates (`52°13'N 21°00'E`), status pills, unit numbers, input placeholders, buttons.
* **Style**: Monospace, generous tracking (`0.05em` to `0.1em`), technical brackets `[01/08]`, `// LAT-LON`, uppercase accents.
* **Feeling**: Raw terminal data and live aerospace telemetry.

---

## 4. Layout
* **Grid Structure**: Rigid 12-column architectural grid with visible 1px hairline dividers (`border-white/10`).
* **Asymmetric Rhythms**: Monumental typography paired with staggered card blocks and wide negative space.
* **Viewport Boundaries**:
  * Desktop design space: 1920px container max-width with structured margins (`px-6 md:px-12 lg:px-20`).
  * Mobile adaptation: Aggressive collapse to 1-column technical stack; zero horizontal overflow.
* **Physical Anchor**: Hero section anchors directly on the photograph of the yellow hangar (`house.webp`), treated as a physical monument.

---

## 5. Elevation & Depth
* **Zero Drop Shadows**: Traditional soft fuzzy CSS box-shadows (`box-shadow: 0 10px 30px rgba(0,0,0,0.1)`) are **strictly prohibited**.
* **Layering Via Value**: Depth is created solely through tonal value shifts:
  * Level 0 (Base): `#000000`
  * Level 1 (Structural panels): `#080808` with `border: 1px solid #222222`
  * Level 2 (Interactive plates): `#141414` with `border: 1px solid #333333`
* **Backdrop Filtration**: Subtle blur (`backdrop-blur-md` with `bg-black/80`) allowed exclusively for modal overlays and sticky telemetry navigation.

---

## 6. Shapes & Form Language
* **Chamfered / HUD Angled Cuts**:
  * Interactive cards, status badges, and primary action buttons utilize polygon chamfered cuts (45° corner slices) via CSS `clip-path` or SVG framing.
  * Example chamfer syntax:
    ```css
    clip-path: polygon(
      0 0,
      calc(100% - 10px) 0,
      100% 10px,
      100% 100%,
      10px 100%,
      0 calc(100% - 10px)
    );
    ```
* **Structural Crosshairs & Technical Brackets**:
  * Corner marks (`+`, `[`, `]`, `///`) anchor technical cards to evoke engineered blueprints.

---

## 7. Components & Micro-Interactions

### 7.1 Action Buttons (Primary)
* High-impact Epikor Yellow substrate (`#FFCC00`) with pitch black bold text (`#000000`).
* Chamfered corners.
* Hover: Heavy cinematic scale push (`scale(1.02)`) with deep yellow shift (`#E5B800`) over 400ms.
* Active: Physical depress (`scale(0.98)`).

### 7.2 Technical Data Cards
* Background `#0C0C0C` with 1px hairline border `#222222`.
* Header carries monospace unit tag (`[UNIT-01]`, `[PERK-08]`).
* Subtle amber/yellow hover hairline transition (`border-white/20 -> border-[#FFCC00]/60`).

### 7.3 Classified Dossier Clearance Flow (Top-Secret Document Interface)
* **Archetype**: A classified military aerospace clearance file (`DOSSIER // FILE #Z53-2026-X`) framed in an authentic carbon/manila-dossier container with crosshair corners (`+`) and technical classification labels (`[CLASSIFICATION: TOP SECRET // DECLASSIFIED COHORT 2026]`).
* **Visual Layering & Watermarks**:
  * Backdrop: `#000000` with 92% opacity, subtle CRT scanlines, and an authentic film-grain noise texture.
  * Document watermark: Faint diagonal repeating vector stamp `[ZONE 53 // CLASSIFIED ACCESS // EYES ONLY]` at 4% white opacity.
  * Redacted Text Decode: Labels and instructional headers begin behind blacked-out redacted rectangles (`████████`), which unscramble and decode with a cybernetic teleprinter effect as the document opens or sections activate.
* **Interactive Gamified Mechanics**:
  * **Real-time Clearance Level Meter**: Monospace progress gauge (`CLEARANCE PROGRESS: [▓▓▓░░░░░░░] 35% // STAGE: IDENTITY CONFIRMATION`).
  * **Mechanical Stamps**: Animated ink stamps with angle jitter:
    * Initial state: Slanted red/yellow box `[PENDING AUTHORIZATION]` (`transform: rotate(-4deg)`).
    * Submitting state: `[DECRYPTING TRANSMISSION...]`.
    * Success state: High-impact stamped imprint `[ACCESS AUTHORIZED // DISPATCHED]` (`transform: rotate(-2deg)`).
  * **Biometric / Physical Authorization Touchpoint**: An interactive press-and-hold thumbprint or digital cipher key switch to finalize and seal the dossier before satellite dispatch.
  * **Input Fields**: Monospace typed style (`JetBrains Mono`), typewriter cursor blink (`▋`), 1px hairlines, and laser-yellow focus reticle (`border-color: #FFCC00; box-shadow: 0 0 12px rgba(255, 204, 0, 0.25)`).
* **Audio-Tactile Feedback**:
  * Lightweight Web Audio API synthesized mechanical relay clicks on keystroke/step changes, and a low-frequency hydraulic seal chime on transmission (with global HUD mute toggle).

---

## 8. Motion & Physics (Heavy Cinematic Mass)
Following Emil Kowalski's craft principles tuned for heavy machinery:

1. **Heavy Cinematic Mass (400–700ms)**:
   * Transitions avoid frantic, jittery spring bounces. They feel weighted, industrial, and hydraulic.
   * Standard entrance duration: `500ms` with custom hydraulic easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
2. **GPU Compositor Purity**:
   * Animate strictly `transform` and `opacity`. Never animate `height`, `margin`, `padding`, or `border-width`.
3. **Continuous Natural Scroll (Lenis)**:
   * Smooth inertia scroll without locking `body` or hijacking gestures.
   * Parallax layers move in physical depth planes (sky layer vs hangar layer vs typography layer).
4. **Reduced Motion Compliance**:
   * `@media (prefers-reduced-motion: reduce)` must immediately disable all parallax and transitions, defaulting to instantaneous state shifts.

---

## 9. Do's and Don'ts

### DO:
* **DO** use the authentic physical hangar image (`house.webp`) with raw fidelity.
* **DO** apply `JetBrains Mono` for all data badges, coordinates, and technical labels.
* **DO** treat `Druk Heavy` as monumental architecture, using tight line heights and negative letter-spacing.
* **DO** keep cards grounded with chamfered geometry and precise 1px hairline borders.
* **DO** ensure the Epikor Yellow `#FFCC00` shines like a laser beam against the deep black canvas.

### DON'T:
* **DON'T** use purple, blue, cyan, or pastel gradients.
* **DON'T** use soft rounded pill buttons (e.g. `rounded-full`) or bubbly consumer UI shapes.
* **DON'T** use generic SaaS card shadows (`shadow-lg`).
* **DON'T** invent fake statistics, fake partner logos, or fake testimonials.
* **DON'T** hide body content behind complicated scroll triggers that break keyboard navigation or screen readers.
