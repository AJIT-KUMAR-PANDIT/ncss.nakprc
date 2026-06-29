# Vitrum — Liquid Glass Design System for the Web

> A cross-browser design system translating Apple's Liquid Glass (WWDC 2025) to the open web,  
> using the real-rendered-content displacement technique pioneered by Aave.

---

## 1. Philosophy

Apple's Liquid Glass — announced June 2025 — introduced a new digital meta-material that dynamically bends and shapes light. Unlike simple blur-and-tint glassmorphism, it simulates actual optics: refraction, specular highlights, chromatic aberration, and lensing that reads differently against every backdrop. The interface floats above content without obscuring it.

Bringing this to the web has four hard constraints:

1. **Cross-browser** — must work in Chrome, Safari, and Firefox without flags.
2. **Live content** — glass bends the real DOM pixels, not a static snapshot, so text stays selectable and links stay clickable.
3. **Performance-first** — map generation must stay within a 16 ms frame budget.
4. **Accessible** — the system respects `prefers-reduced-motion`, `prefers-contrast`, and `forced-colors` at every layer.

The entire system descends from a single SVG primitive — `feDisplacementMap` — with a WebGL fallback for surfaces the browser compositor won't pass through a filter.

---

## 2. Design Principles

| Principle | What it means in practice |
|---|---|
| **Lensing over blurring** | Glass *bends* what's behind it, not just blurs. The displaced content remains legible and interactive. |
| **Concentricity** | Corner radii mirror the host element's radii. A button nested in a card uses a smaller radius so the curves run parallel. |
| **Content primacy** | Glass is always a secondary layer. Never cover meaningful content with a glass surface; float controls above it. |
| **Adaptive material** | Glass reads ambient color from nearby content and subtly shifts its tint. Dark content → dark glass. Light content → light glass. |
| **Earned motion** | Physics-based springs only. No linear tweens. Motion communicates relationship: elements spring *from their source*, not from a fixed corner. |
| **Restraint** | One glass effect per focal point. A page with 12 glass panels is a hall of mirrors. |

---

## 3. Design Tokens

All tokens are CSS custom properties set on `:root`. The system supports light, dark, and high-contrast appearances out of the box.

### 3.1 Color

```css
:root {
  /* ── Backgrounds ─────────────────────────────────────────── */
  --color-bg-primary:       #0a0a0f;   /* near-black, the content canvas */
  --color-bg-secondary:     #111118;
  --color-bg-elevated:      #1a1a24;   /* raised surfaces below glass */

  /* ── Glass fills (translucent, not opaque) ───────────────── */
  --color-glass-clear:      rgba(255, 255, 255, 0.06);
  --color-glass-light:      rgba(255, 255, 255, 0.12);
  --color-glass-medium:     rgba(255, 255, 255, 0.18);
  --color-glass-tint-blue:  rgba(10,  132, 255, 0.14);
  --color-glass-tint-violet:rgba(175,  82, 222, 0.12);
  --color-glass-dark:       rgba(0,    0,   0,  0.28);

  /* ── Specular & rim (pure white at varying opacity) ──────── */
  --color-spec-strong:      rgba(255, 255, 255, 0.80);
  --color-spec-mid:         rgba(255, 255, 255, 0.40);
  --color-spec-soft:        rgba(255, 255, 255, 0.16);
  --color-rim:              rgba(255, 255, 255, 0.10);

  /* ── Apple system accents ────────────────────────────────── */
  --color-accent-blue:      #0A84FF;
  --color-accent-purple:    #BF5AF2;
  --color-accent-teal:      #5AC8FA;
  --color-accent-green:     #30D158;
  --color-accent-orange:    #FF9F0A;
  --color-accent-red:       #FF375F;

  /* ── Typography ──────────────────────────────────────────── */
  --color-text-primary:     rgba(255, 255, 255, 0.95);
  --color-text-secondary:   rgba(255, 255, 255, 0.60);
  --color-text-tertiary:    rgba(255, 255, 255, 0.36);
  --color-text-on-glass:    rgba(255, 255, 255, 0.92);

  /* ── Semantic ─────────────────────────────────────────────── */
  --color-success:          #30D158;
  --color-warning:          #FF9F0A;
  --color-danger:           #FF375F;
  --color-info:             #0A84FF;

  /* ── Borders ─────────────────────────────────────────────── */
  --color-border-glass:     rgba(255, 255, 255, 0.14);
  --color-border-strong:    rgba(255, 255, 255, 0.24);
  --color-border-subtle:    rgba(255, 255, 255, 0.07);
}

/* Light mode overrides */
@media (prefers-color-scheme: light) {
  :root {
    --color-bg-primary:        #f2f2f7;
    --color-bg-secondary:      #ffffff;
    --color-bg-elevated:       #ffffff;

    --color-glass-clear:       rgba(255, 255, 255, 0.40);
    --color-glass-light:       rgba(255, 255, 255, 0.60);
    --color-glass-medium:      rgba(255, 255, 255, 0.72);
    --color-glass-tint-blue:   rgba(10,  132, 255, 0.10);
    --color-glass-dark:        rgba(0,     0,   0, 0.06);

    --color-text-primary:      rgba(0, 0, 0, 0.88);
    --color-text-secondary:    rgba(0, 0, 0, 0.56);
    --color-text-tertiary:     rgba(0, 0, 0, 0.30);
    --color-text-on-glass:     rgba(0, 0, 0, 0.86);

    --color-border-glass:      rgba(0, 0, 0, 0.10);
    --color-border-strong:     rgba(0, 0, 0, 0.18);
    --color-border-subtle:     rgba(0, 0, 0, 0.06);

    --color-spec-strong:       rgba(255, 255, 255, 0.90);
    --color-spec-mid:          rgba(255, 255, 255, 0.60);
  }
}

/* High contrast override — removes all translucency */
@media (prefers-contrast: more) {
  :root {
    --color-glass-clear:       rgba(20, 20, 35, 0.96);
    --color-glass-light:       rgba(20, 20, 35, 0.96);
    --color-glass-medium:      rgba(20, 20, 35, 0.96);
    --color-border-glass:      rgba(255, 255, 255, 0.60);
  }
}
```

### 3.2 Spacing Scale

Based on a 4 px base unit. Every layout measurement is a multiple.

```css
:root {
  --space-0:   0px;
  --space-1:   4px;
  --space-2:   8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
}
```

### 3.3 Typography

The system uses the Apple system font stack with deliberately sized role assignments.  
Body copy never exceeds 17 px. Display goes as large as the layout permits.

```css
:root {
  /* Font families */
  --font-display: "SF Pro Display", -apple-system, BlinkMacSystemFont,
                  "Helvetica Neue", sans-serif;
  --font-body:    "SF Pro Text",    -apple-system, BlinkMacSystemFont,
                  "Helvetica Neue", sans-serif;
  --font-mono:    "SF Mono", "JetBrains Mono", "Fira Code", monospace;

  /* Scale (rem) */
  --text-xs:    0.6875rem;  /* 11px — captions, labels */
  --text-sm:    0.8125rem;  /* 13px — footnotes */
  --text-base:  1.0000rem;  /* 16px — body */
  --text-md:    1.0625rem;  /* 17px — large body (Apple's preferred reading size) */
  --text-lg:    1.1875rem;  /* 19px — subheadings */
  --text-xl:    1.3750rem;  /* 22px — section titles */
  --text-2xl:   1.7500rem;  /* 28px — page titles */
  --text-3xl:   2.1250rem;  /* 34px — display */
  --text-4xl:   2.6250rem;  /* 42px — hero */
  --text-5xl:   3.4375rem;  /* 55px — splash */

  /* Weight */
  --weight-regular:   400;
  --weight-medium:    500;
  --weight-semibold:  600;
  --weight-bold:      700;
  --weight-heavy:     800;

  /* Tracking */
  --tracking-tight:  -0.030em;
  --tracking-normal:  0.000em;
  --tracking-wide:    0.012em;
  --tracking-caps:    0.080em;

  /* Leading */
  --leading-tight:  1.15;
  --leading-snug:   1.3;
  --leading-normal: 1.5;
  --leading-loose:  1.75;
}
```

**Typographic roles**

| Role | Font | Size | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display` | SF Pro Display | 42–55 px | Heavy 800 | −0.030 | Hero headlines |
| `title-1` | SF Pro Display | 34 px | Bold 700 | −0.020 | Page titles |
| `title-2` | SF Pro Display | 28 px | Bold 700 | −0.015 | Section titles |
| `title-3` | SF Pro Text | 22 px | Semibold 600 | −0.010 | Card titles |
| `headline` | SF Pro Text | 17 px | Semibold 600 | 0 | List item labels |
| `body` | SF Pro Text | 17 px | Regular 400 | 0 | Running text |
| `callout` | SF Pro Text | 16 px | Regular 400 | 0 | Secondary paragraphs |
| `subhead` | SF Pro Text | 15 px | Regular 400 | 0 | Supplementary info |
| `footnote` | SF Pro Text | 13 px | Regular 400 | 0 | Fine print |
| `caption` | SF Pro Text | 11 px | Regular 400 | +0.012 | Labels, timestamps |

### 3.4 Radius

Apple's concentricity principle: outer and inner radii are proportional to the padding between them. A container with `border-radius: 24px` and `12px` padding should host a child with `border-radius: 12px`.

```css
:root {
  --radius-none:     0px;
  --radius-xs:       4px;   /* dense controls (checkboxes, tags) */
  --radius-sm:       8px;   /* compact desktop controls */
  --radius-md:      12px;   /* standard cards, inputs */
  --radius-lg:      16px;   /* large cards, popovers */
  --radius-xl:      20px;   /* sheets, modals */
  --radius-2xl:     28px;   /* side panels, drawers */
  --radius-3xl:     36px;   /* large overlay surfaces */
  --radius-pill:  9999px;   /* switches, tabs, capsule buttons */

  /* Concentricity helpers */
  --radius-inset-sm: calc(var(--radius) - var(--padding));  /* use inline */
}
```

### 3.5 Blur & Depth

```css
:root {
  /* backdrop-filter blur amounts */
  --blur-subtle:   8px;
  --blur-moderate: 20px;
  --blur-heavy:    40px;
  --blur-extreme:  60px;

  /* Glass displacement (feDisplacementMap scale) */
  --glass-refraction-subtle:  0.05;
  --glass-refraction-standard: 0.10;
  --glass-refraction-strong:  0.18;

  /* Z-elevation (shadows for depth) */
  --shadow-sm:  0 1px  3px rgba(0,0,0,0.20),  0 1px  2px rgba(0,0,0,0.12);
  --shadow-md:  0 4px  8px rgba(0,0,0,0.24),  0 2px  4px rgba(0,0,0,0.14);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.32),  0 4px  8px rgba(0,0,0,0.18);
  --shadow-xl:  0 16px 48px rgba(0,0,0,0.40), 0 8px 16px rgba(0,0,0,0.20);
  --shadow-glass: 0 0 0 1px var(--color-border-glass),
                  0 8px 32px rgba(0, 0, 0, 0.24),
                  inset 0 1px 0 var(--color-spec-soft);
}
```

### 3.6 Animation Tokens

Apple's motion system is spring-based. No cubic-bezier easing for glass element transforms.

```css
:root {
  /* Spring physics (use with Web Animations API or Framer Motion) */
  --spring-snappy:      { stiffness: 500, damping: 36, mass: 1 };
  --spring-standard:    { stiffness: 300, damping: 28, mass: 1 };
  --spring-gentle:      { stiffness: 180, damping: 22, mass: 1 };
  --spring-bounce:      { stiffness: 400, damping: 18, mass: 1 };
  --spring-slow:        { stiffness: 120, damping: 20, mass: 1 };

  /* CSS fallbacks for browsers without spring support */
  --ease-glass-in:      cubic-bezier(0.32, 0.72, 0.00, 1.00);
  --ease-glass-out:     cubic-bezier(0.20, 0.00, 0.00, 1.00);
  --ease-glass-inout:   cubic-bezier(0.40, 0.00, 0.20, 1.00);

  /* Durations */
  --duration-instant:    80ms;
  --duration-fast:      150ms;
  --duration-standard:  250ms;
  --duration-slow:      400ms;
  --duration-enter:     360ms;
  --duration-exit:      240ms;  /* exits are always faster than enters */
}
```

---

## 4. The Glass Material

### 4.1 How It Works

Every glass component is driven by an SVG `feDisplacementMap` filter. The displacement map is a small PNG generated at runtime from the glass's shape. Its red channel encodes horizontal pixel shift; its green channel encodes vertical shift. Pixels outside the lens region sit at neutral gray (128, 128) and are untouched.

```
                 ┌─────────────────────────────────────┐
                 │           Host element               │
                 │  (real DOM — text, images, cards)   │
                 │                                      │
                 │       ┌───────────────┐             │
                 │       │  Displacement │             │
                 │       │     map PNG   │             │
                 │       │  (R=horiz,    │             │
                 │       │   G=vert,     │             │
                 │       │   neutral=128)│             │
                 │       └──────┬────────┘             │
                 │              │ feDisplacementMap     │
                 │       ┌──────▼────────┐             │
                 │       │  Glass lens   │             │
                 │       │  (bent pixel  │             │
                 │       │   region)     │             │
                 │       └───────────────┘             │
                 └─────────────────────────────────────┘

  Additional passes: chromatic aberration (color fringe) + specular highlight
```

The content's own pixels move — nothing is sampled from outside — which is why everything under a glass panel stays interactive.

### 4.2 Map Generation

```typescript
interface LensMap {
  width:        number;   // px
  height:       number;   // px
  borderRadius: number;   // px
  scale:        number;   // 0.0–0.25  refraction strength
  depth:        number;   // 1–30      height of the virtual lens above surface
  curvature:    number;   // 0–100     how strongly the lens curves (0 = flat)
  splay:        number;   // 0.5–2.0   horizontal/vertical ratio
  chroma:       number;   // 0.0–0.5   chromatic aberration amount
}

/**
 * Build a displacement map for a given lens shape.
 * Only the top-left quadrant is computed; the rest is mirrored.
 * This reduces per-pixel work by 75 %.
 */
function generateLensMap(lens: LensMap): ImageData {
  const { width, height, borderRadius, scale, depth, curvature, chroma } = lens;
  const canvas = new OffscreenCanvas(width, height);
  const ctx    = canvas.getContext('2d')!;
  const data   = ctx.createImageData(width, height);

  const hw = width  / 2;
  const hh = height / 2;
  const neutral = 128;

  // Compute one quadrant, mirror to all four
  for (let qy = 0; qy < hh; qy++) {
    for (let qx = 0; qx < hw; qx++) {
      const inside = isInsideLens(qx, qy, hw, hh, borderRadius / 2);
      let dx = 0, dy = 0;

      if (inside) {
        // Spherical lens displacement
        const nx = (qx - hw / 2) / (hw / 2);
        const ny = (qy - hh / 2) / (hh / 2);
        const r  = Math.sqrt(nx * nx + ny * ny);
        const z  = depth * (1 - Math.pow(r, curvature / 40));
        dx = nx * z * scale;
        dy = ny * z * scale;
      }

      // Write into all four quadrants
      writeQuadrant(data, width, height, qx, qy, hw, hh, dx, dy, neutral, inside, chroma);
    }
  }

  return data;
}
```

### 4.3 Glass Parameters

| Parameter | Range | Default | What it controls |
|---|---|---|---|
| `width` | 1–∞ px | — | Lens width in pixels |
| `height` | 1–∞ px | — | Lens height in pixels |
| `borderRadius` | 0–`min(w,h)/2` | 0 | Corner rounding of the lens |
| `scale` | 0.00–0.25 | 0.10 | Refraction strength. >0.18 distorts aggressively. |
| `depth` | 1–30 | 10 | Virtual lens height above the surface |
| `curvature` | 0–100 | 40 | Sphere curvature (100 = perfect sphere) |
| `splay` | 0.5–2.0 | 1.0 | Horizontal vs. vertical refraction ratio |
| `chroma` | 0.00–0.50 | 0.20 | Chromatic aberration (color fringe at edge) |
| `blur` | 0–12 px | 0 | Frost layer over the displaced pixels |
| `glow` | 0.00–0.40 | 0.10 | Ambient glow around the lens perimeter |
| `edgeHighlight` | 0.00–0.60 | 0.25 | Rim light on the lens border |
| `specularAngle` | 0–360° | 45 | Light source angle for specular highlight |

### 4.4 SVG Filter Template

```html
<!-- Generated once per glass shape, re-stamped with a fresh ID on every shape change  -->
<!-- (Safari caches by filter ID; a stale ID freezes the glass mid-animation)          -->
<svg width="0" height="0" aria-hidden="true" focusable="false"
     style="position:absolute; pointer-events:none;">
  <defs>
    <filter id="glass-filter-{{uid}}" x="-10%" y="-10%" width="120%" height="120%"
            color-interpolation-filters="sRGB">

      <!-- 1. Displace content pixels via the lens map -->
      <feImage href="{{dataUri}}" result="map" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale="{{pixelScale}}"
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced"
      />

      <!-- 2. Chromatic aberration — shift R and B channels slightly -->
      <feColorMatrix type="matrix" in="displaced"
        values="1 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0"
        result="red-channel" />
      <feOffset in="red-channel"  dx="{{chromaDx}}" dy="0" result="red-shifted" />
      <feColorMatrix type="matrix" in="displaced"
        values="0 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 1 0"
        result="green-channel" />
      <feColorMatrix type="matrix" in="displaced"
        values="0 0 0 0 0   0 0 0 0 0   0 0 1 0 0   0 0 0 1 0"
        result="blue-channel" />
      <feOffset in="blue-channel" dx="{{chromaDxNeg}}" dy="0" result="blue-shifted" />
      <feMerge result="chroma-merged">
        <feMergeNode in="red-shifted" />
        <feMergeNode in="green-channel" />
        <feMergeNode in="blue-shifted" />
      </feMerge>

      <!-- 3. Specular highlight pass (restricted to lens bounds — see Safari notes) -->
      <feFlood flood-color="white" flood-opacity="{{specularOpacity}}" result="specular-color" />
      <feComposite in="specular-color" in2="map" operator="in" result="specular" />
      <feMerge>
        <feMergeNode in="chroma-merged" />
        <feMergeNode in="specular" />
      </feMerge>

    </filter>
  </defs>
</svg>
```

### 4.5 Glass Variants

```css
/* ── Variant: Clear ──────────────────────────────────────── */
.glass-clear {
  background:    var(--color-glass-clear);
  backdrop-filter: blur(var(--blur-subtle));
  -webkit-backdrop-filter: blur(var(--blur-subtle));
  border:        1px solid var(--color-border-glass);
  box-shadow:    var(--shadow-glass);
  /* feDisplacementMap: scale=0.06, depth=8, chroma=0.10 */
}

/* ── Variant: Frosted ────────────────────────────────────── */
.glass-frosted {
  background:    var(--color-glass-medium);
  backdrop-filter: blur(var(--blur-moderate));
  -webkit-backdrop-filter: blur(var(--blur-moderate));
  border:        1px solid var(--color-border-glass);
  box-shadow:    var(--shadow-glass);
  /* feDisplacementMap: scale=0.10, depth=10, blur=4, chroma=0.20 */
}

/* ── Variant: Tinted ─────────────────────────────────────── */
.glass-tinted-blue {
  background:    var(--color-glass-tint-blue);
  backdrop-filter: blur(var(--blur-moderate));
  -webkit-backdrop-filter: blur(var(--blur-moderate));
  border:        1px solid rgba(10, 132, 255, 0.20);
  box-shadow:    0 0 0 1px rgba(10, 132, 255, 0.12),
                 0 8px 32px rgba(10, 132, 255, 0.12),
                 inset 0 1px 0 rgba(255,255,255,0.16);
}

/* ── Variant: Dark ───────────────────────────────────────── */
.glass-dark {
  background:    var(--color-glass-dark);
  backdrop-filter: blur(var(--blur-heavy));
  -webkit-backdrop-filter: blur(var(--blur-heavy));
  border:        1px solid rgba(255, 255, 255, 0.06);
  box-shadow:    var(--shadow-xl);
  /* feDisplacementMap: scale=0.08, depth=6, chroma=0.12 */
}

/* ── Variant: Ultra-thin (navigation bars) ───────────────── */
.glass-ultra-thin {
  background:    rgba(255, 255, 255, 0.04);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--color-border-subtle);
  /* No feDisplacementMap — performance budget for fixed toolbars */
}
```

### 4.6 Scroll Edge Effects

When content scrolls beneath a glass element, a dissolve effect lifts the glass visually:

```css
.glass-nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;

  /* The scroll-edge effect dissolves content into the background as it scrolls under */
  -webkit-mask-image: linear-gradient(
    to bottom,
    black calc(100% - 20px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    black calc(100% - 20px),
    transparent 100%
  );
}

/* JavaScript: add .glass-nav-bar--scrolled when scrollY > 0 */
.glass-nav-bar--scrolled {
  background: var(--color-glass-medium);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom-color: var(--color-border-glass);
  transition: background var(--duration-standard) var(--ease-glass-inout),
              backdrop-filter var(--duration-standard) var(--ease-glass-inout);
}
```

---

## 5. Component Library

### 5.1 Glass Container

The foundational glass element. All other components compose it.

**API**

```typescript
interface GlassProps {
  variant?:      'clear' | 'frosted' | 'dark' | 'tinted';
  tintColor?:    string;           // CSS color for tinted variant
  radius?:       number | 'pill';  // px
  refraction?:   number;           // 0.0–0.25, overrides variant default
  chroma?:       number;           // 0.0–0.50
  specAngle?:    number;           // degrees
  glow?:         boolean;
  children:      React.ReactNode;
  className?:    string;
}
```

**HTML structure**

```html
<div class="glass-container glass-frosted" style="border-radius: 20px;">
  <!-- The glass SVG filter targets this host -->
  <div class="glass-content">
    <!-- Your content here. Stays interactive. -->
  </div>

  <!-- Specular rim light (decorative, aria-hidden) -->
  <div class="glass-rim" aria-hidden="true"></div>
</div>
```

```css
.glass-container {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.glass-content {
  position: relative;
  z-index: 1;
}

.glass-rim {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: inset 0  1px 0 var(--color-spec-soft),
              inset 0 -1px 0 rgba(0,0,0,0.12),
              inset  1px 0  0 rgba(255,255,255,0.06),
              inset -1px 0  0 rgba(255,255,255,0.03);
  z-index: 2;
}
```

---

### 5.2 Glass Button

Three sizes. Capsule shape for primary, rounded-rect for secondary actions in dense layouts.

```html
<!-- Primary — Capsule -->
<button class="glass-btn glass-btn--primary glass-btn--lg" type="button">
  <span class="glass-btn__label">Continue</span>
</button>

<!-- Secondary — Rounded rect -->
<button class="glass-btn glass-btn--secondary glass-btn--md" type="button">
  <span class="glass-btn__label">Cancel</span>
</button>

<!-- Destructive -->
<button class="glass-btn glass-btn--danger glass-btn--md" type="button">
  <span class="glass-btn__label">Delete</span>
</button>
```

```css
.glass-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-tight);
  transition: transform var(--duration-fast)   var(--ease-glass-out),
              opacity  var(--duration-fast)   var(--ease-glass-out),
              box-shadow var(--duration-fast) var(--ease-glass-out);
  will-change: transform;
  user-select: none;
  -webkit-user-select: none;
}

/* Sizes */
.glass-btn--sm  { height: 32px;  padding: 0 14px; font-size: var(--text-sm);  border-radius: var(--radius-md); }
.glass-btn--md  { height: 44px;  padding: 0 20px; font-size: var(--text-base); border-radius: var(--radius-lg); }
.glass-btn--lg  { height: 54px;  padding: 0 28px; font-size: var(--text-md); border-radius: var(--radius-pill); }

/* Variants */
.glass-btn--primary {
  background: var(--color-accent-blue);
  color: #fff;
  box-shadow: 0 0 0 0.5px rgba(255,255,255,0.20),
              0 4px 16px rgba(10, 132, 255, 0.40),
              inset 0 1px 0 rgba(255,255,255,0.30);
}

.glass-btn--secondary {
  background: var(--color-glass-medium);
  color: var(--color-text-primary);
  backdrop-filter: blur(var(--blur-subtle));
  -webkit-backdrop-filter: blur(var(--blur-subtle));
  box-shadow: var(--shadow-glass);
  border: 1px solid var(--color-border-glass);
}

.glass-btn--danger {
  background: rgba(255, 55, 95, 0.18);
  color: var(--color-accent-red);
  border: 1px solid rgba(255, 55, 95, 0.28);
  box-shadow: 0 4px 16px rgba(255, 55, 95, 0.16),
              inset 0 1px 0 rgba(255,255,255,0.12);
}

/* States */
.glass-btn:hover  { transform: scale(1.02); }
.glass-btn:active { transform: scale(0.97); opacity: 0.88; }

.glass-btn:focus-visible {
  outline: 2px solid var(--color-accent-blue);
  outline-offset: 3px;
}

.glass-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  transform: none;
}
```

---

### 5.3 Glass Switch

The classic binary toggle. The thumb is a glass lens that creates a moving highlight as it slides.

```html
<label class="glass-switch" aria-label="Enable notifications">
  <input class="glass-switch__input" type="checkbox" role="switch">
  <span class="glass-switch__track" aria-hidden="true">
    <!-- Glass SVG filter applied to this host; the thumb lens travels L→R -->
    <span class="glass-switch__thumb"></span>
  </span>
</label>
```

```css
.glass-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.glass-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.glass-switch__track {
  width: 51px;
  height: 31px;
  border-radius: var(--radius-pill);
  background: rgba(120, 120, 128, 0.30);
  border: 1px solid rgba(255,255,255,0.10);
  position: relative;
  transition: background var(--duration-standard) var(--ease-glass-inout);
}

.glass-switch__input:checked + .glass-switch__track {
  background: var(--color-accent-green);
  box-shadow: 0 0 0 0.5px rgba(48,209,88,0.40),
              0 2px 8px rgba(48,209,88,0.24);
}

.glass-switch__thumb {
  position: absolute;
  top: 2px; left: 2px;
  width: 27px;
  height: 27px;
  border-radius: var(--radius-pill);

  /* Glass material on the thumb */
  background: rgba(255,255,255,0.92);
  box-shadow: 0 2px 6px rgba(0,0,0,0.28),
              0 1px 2px rgba(0,0,0,0.16),
              inset 0 1px 0 rgba(255,255,255,0.80);

  transition: transform var(--duration-standard) var(--ease-glass-out);
  will-change: transform;
}

.glass-switch__input:checked + .glass-switch__track .glass-switch__thumb {
  transform: translateX(20px);
}

.glass-switch__input:focus-visible + .glass-switch__track {
  outline: 2px solid var(--color-accent-blue);
  outline-offset: 2px;
}

/* The feDisplacementMap glass effect on the thumb refraction target is the track fill */
/* Applied via JavaScript — see Glass.applyToSwitch() in the implementation guide */
```

**JS integration** (displacement map moves with the thumb)

```typescript
Glass.applyToSwitch(trackElement, {
  lens:             { lensW: 27, lensH: 27, borderRadius: 14 },
  refractionTarget: trackFillElement,   // a copy of the track fill
  scale:            0.12,
  chroma:           0.15,
  specularAngle:    135,
});
```

---

### 5.4 Glass Slider

The glass lens rides the track and refracts the progress fill beneath it. Uses a gentler bend than the switch because the fill must stay readable as a value.

```html
<div class="glass-slider" role="group" aria-label="Volume">
  <div class="glass-slider__track">
    <div class="glass-slider__fill" style="width: 60%;"></div>
    <!-- Glass thumb — feDisplacementMap applied here -->
    <div class="glass-slider__thumb" style="left: 60%;"></div>
  </div>
  <!-- Native input back-synced for accessibility -->
  <input type="range" class="glass-slider__input" min="0" max="100" value="60"
         aria-label="Volume">
</div>
```

```css
.glass-slider {
  position: relative;
  width: 100%;
}

.glass-slider__track {
  height: 6px;
  border-radius: var(--radius-pill);
  background: rgba(255,255,255,0.12);
  position: relative;
}

.glass-slider__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--color-accent-blue);
  box-shadow: 0 0 0 0.5px rgba(10,132,255,0.40);
}

.glass-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: var(--radius-pill);
  background: rgba(255,255,255,0.95);
  box-shadow: 0 2px 8px rgba(0,0,0,0.32),
              inset 0 1px 0 rgba(255,255,255,0.80);
  cursor: grab;
  transition: transform var(--duration-instant) var(--ease-glass-out);
  will-change: left;
}

.glass-slider__thumb:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.12);
}

.glass-slider__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
```

---

### 5.5 Glass Toggle Group

The glass panel is the selection indicator, gliding between options with a spring.

```html
<div class="glass-toggle-group" role="tablist" aria-label="View mode">
  <div class="glass-toggle-group__indicator" aria-hidden="true"></div>
  <button class="glass-toggle-group__option glass-toggle-group__option--selected"
          role="tab" aria-selected="true">Grid</button>
  <button class="glass-toggle-group__option" role="tab" aria-selected="false">List</button>
  <button class="glass-toggle-group__option" role="tab" aria-selected="false">Map</button>
</div>
```

```css
.glass-toggle-group {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1);
  border-radius: var(--radius-pill);
  background: rgba(255,255,255,0.08);
  border: 1px solid var(--color-border-subtle);
  position: relative;
}

.glass-toggle-group__indicator {
  position: absolute;
  border-radius: var(--radius-pill);
  height: calc(100% - 8px);
  top: 4px;

  /* Glass material — feDisplacementMap target is a highlighted-options layer */
  background: rgba(255,255,255,0.92);
  box-shadow: 0 1px 4px rgba(0,0,0,0.20),
              inset 0 1px 0 rgba(255,255,255,0.70);

  /* Spring: position driven by JS, not CSS transition */
  will-change: left, width;
  transition: left   280ms var(--ease-glass-out),
              width  280ms var(--ease-glass-out);
}

.glass-toggle-group__option {
  position: relative;
  z-index: 1;
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-pill);
  background: transparent;
  border: none;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-glass-inout);
  white-space: nowrap;
}

.glass-toggle-group__option--selected,
.glass-toggle-group__option[aria-selected="true"] {
  color: var(--color-bg-primary);
}
```

---

### 5.6 Glass Navigation Bar

Floats above content. Shrinks on scroll (Apple tab-bar behavior).

```html
<header class="glass-nav" role="banner">
  <nav class="glass-nav__inner" aria-label="Main navigation">
    <a class="glass-nav__logo" href="/" aria-label="Home">
      <!-- logo -->
    </a>

    <ul class="glass-nav__links" role="list">
      <li><a class="glass-nav__link" href="/products">Products</a></li>
      <li><a class="glass-nav__link" href="/docs">Docs</a></li>
      <li><a class="glass-nav__link" href="/blog">Blog</a></li>
    </ul>

    <div class="glass-nav__actions">
      <button class="glass-btn glass-btn--secondary glass-btn--sm">Sign in</button>
      <button class="glass-btn glass-btn--primary  glass-btn--sm">Get started</button>
    </div>
  </nav>
</header>
```

```css
.glass-nav {
  position: fixed;
  top: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - var(--space-8));
  max-width: 1100px;
  z-index: 1000;

  background: var(--color-glass-medium);
  backdrop-filter: saturate(200%) blur(40px);
  -webkit-backdrop-filter: saturate(200%) blur(40px);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border-glass);
  box-shadow: var(--shadow-glass);

  /* Glass lensing on the bar itself — feDisplacementMap */
  transition: border-radius var(--duration-slow)    var(--ease-glass-inout),
              top           var(--duration-standard) var(--ease-glass-inout),
              width         var(--duration-standard) var(--ease-glass-inout);
}

/* Scroll-collapsed state — matches Apple's shrinking tab bar */
.glass-nav--collapsed {
  top: var(--space-2);
  width: auto;
  border-radius: var(--radius-pill);
}

.glass-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-5);
  gap: var(--space-6);
}

.glass-nav__links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.glass-nav__link {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  transition: color var(--duration-fast) var(--ease-glass-inout),
              background var(--duration-fast) var(--ease-glass-inout);
}

.glass-nav__link:hover {
  color: var(--color-text-primary);
  background: var(--color-glass-clear);
}

.glass-nav__link[aria-current="page"] {
  color: var(--color-text-primary);
  background: var(--color-glass-light);
}
```

---

### 5.7 Glass Card

```html
<article class="glass-card">
  <div class="glass-card__header">
    <span class="glass-card__label">Feature</span>
    <h3 class="glass-card__title">Refraction at 60 fps</h3>
  </div>
  <p class="glass-card__body">
    The displacement map is quarter-computed and mirrored, keeping
    map generation well inside the frame budget.
  </p>
  <div class="glass-card__footer">
    <a class="glass-card__cta" href="#">Learn more →</a>
  </div>
</article>
```

```css
.glass-card {
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  background: var(--color-glass-light);
  backdrop-filter: blur(var(--blur-moderate));
  -webkit-backdrop-filter: blur(var(--blur-moderate));
  border: 1px solid var(--color-border-glass);
  box-shadow: var(--shadow-glass);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: transform var(--duration-fast) var(--ease-glass-out),
              box-shadow var(--duration-fast) var(--ease-glass-out);
  will-change: transform;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--color-border-glass);
}

.glass-card__label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-accent-blue);
}

.glass-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.glass-card__body {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
  margin: 0;
}

.glass-card__footer {
  margin-top: auto;
}

.glass-card__cta {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-accent-blue);
  text-decoration: none;
}

.glass-card__cta:hover {
  text-decoration: underline;
}
```

---

### 5.8 Glass Sheet / Modal

Sheets spring from their source element (Apple's "action springs from the action itself" principle). Dialogs are full-overlay.

```html
<!-- Sheet (slides up from bottom, springs from its trigger) -->
<div class="glass-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"
     data-source-id="trigger-btn-id">
  <!-- Drag handle -->
  <div class="glass-sheet__handle" aria-hidden="true"></div>

  <header class="glass-sheet__header">
    <h2 class="glass-sheet__title" id="sheet-title">Share</h2>
    <button class="glass-btn glass-btn--secondary glass-btn--sm"
            aria-label="Close">✕</button>
  </header>

  <div class="glass-sheet__body">
    <!-- Sheet content -->
  </div>
</div>

<!-- Overlay scrim -->
<div class="glass-scrim" aria-hidden="true"></div>
```

```css
.glass-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.40);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 998;
  opacity: 0;
  animation: scrim-in var(--duration-enter) var(--ease-glass-out) forwards;
}

.glass-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  max-height: 90dvh;
  overflow-y: auto;

  background: var(--color-glass-medium);
  backdrop-filter: blur(var(--blur-heavy));
  -webkit-backdrop-filter: blur(var(--blur-heavy));
  border-radius: var(--radius-3xl) var(--radius-3xl) 0 0;
  border-top: 1px solid var(--color-border-glass);
  box-shadow: 0 -8px 48px rgba(0,0,0,0.40),
              inset 0 1px 0 var(--color-spec-soft);
  padding: var(--space-2) var(--space-6) var(--space-10);

  transform: translateY(100%);
  animation: sheet-in var(--duration-enter) var(--ease-glass-out) forwards;
}

.glass-sheet__handle {
  width: 36px;
  height: 5px;
  border-radius: var(--radius-pill);
  background: rgba(255,255,255,0.28);
  margin: 0 auto var(--space-4);
}

.glass-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.glass-sheet__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
  margin: 0;
}

@keyframes sheet-in {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

@keyframes scrim-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .glass-sheet { animation: none; transform: translateY(0); }
  .glass-scrim { animation: none; opacity: 1; }
}
```

---

### 5.9 Glass Input

```html
<label class="glass-input-group">
  <span class="glass-input-group__label">Email address</span>
  <div class="glass-input-group__field">
    <span class="glass-input-group__icon" aria-hidden="true">✉</span>
    <input class="glass-input" type="email" placeholder="you@example.com"
           autocomplete="email">
  </div>
  <span class="glass-input-group__hint">We'll send your magic link here.</span>
</label>
```

```css
.glass-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.glass-input-group__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
}

.glass-input-group__field {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--color-glass-clear);
  backdrop-filter: blur(var(--blur-subtle));
  -webkit-backdrop-filter: blur(var(--blur-subtle));
  border: 1px solid var(--color-border-glass);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.12);
  transition: border-color var(--duration-fast) var(--ease-glass-inout),
              box-shadow   var(--duration-fast) var(--ease-glass-inout);
}

.glass-input-group__field:focus-within {
  border-color: var(--color-accent-blue);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.12),
              0 0 0 3px rgba(10, 132, 255, 0.20);
}

.glass-input {
  flex: 1;
  height: 48px;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
}

.glass-input::placeholder {
  color: var(--color-text-tertiary);
}

.glass-input-group__icon {
  color: var(--color-text-tertiary);
  font-size: 16px;
  flex-shrink: 0;
}

.glass-input-group__hint {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  line-height: var(--leading-snug);
}
```

---

## 6. Motion System

### 6.1 Spring Physics

Use spring physics via the Web Animations API or a library like Motion One:

```typescript
import { animate, spring } from 'motion';

// Standard glass element entering the scene
animate(element, { opacity: [0, 1], y: [16, 0] }, {
  easing:   spring({ stiffness: 300, damping: 28, mass: 1 }),
  duration: 0.4,
});

// Toggle group indicator sliding between options
animate(indicator, { x: targetX, width: targetWidth }, {
  easing:   spring({ stiffness: 500, damping: 36 }),
  duration: 0.35,
});

// Sheet springing in from its source element
animate(sheet, { y: ['100%', '0%'] }, {
  easing:   spring({ stiffness: 300, damping: 28 }),
  duration: 0.36,
});

// Glass thumb on switch
animate(thumb, { x: checked ? 20 : 0 }, {
  easing:   spring({ stiffness: 480, damping: 32 }),
  duration: 0.28,
});
```

### 6.2 Interaction Micro-animations

```typescript
// Button press feedback
button.addEventListener('pointerdown', () => {
  animate(button, { scale: 0.97 }, { easing: spring({ stiffness: 600, damping: 40 }) });
});

button.addEventListener('pointerup', () => {
  animate(button, { scale: 1.0 }, { easing: spring({ stiffness: 300, damping: 22 }) });
});

// Glass card hover lift
card.addEventListener('mouseenter', () => {
  animate(card, { y: -3, boxShadow: shadowLg }, { duration: 0.25, easing: easeGlassOut });
});
```

### 6.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Kill all displacement map animation */
  .glass-container { filter: none !important; }

  /* Remove spring transitions */
  .glass-switch__thumb,
  .glass-toggle-group__indicator,
  .glass-slider__thumb {
    transition: none !important;
  }

  /* Remove entrance animations */
  .glass-sheet,
  .glass-scrim {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
```

---

## 7. Implementation Guide

### 7.1 The Glass Class

```typescript
class Glass {
  private svgRoot: SVGElement;
  private filterId: string;

  constructor(private host: HTMLElement) {
    this.svgRoot = createSVGRoot();
    document.body.appendChild(this.svgRoot);
    this.filterId = '';
  }

  /**
   * Apply the glass effect.
   * Call whenever the lens shape changes (not when it merely moves).
   */
  apply(opts: LensMap): void {
    // 1. Generate displacement map
    const mapData = generateLensMap(opts);
    const dataUri = imageDataToDataURI(mapData);

    // 2. Issue a FRESH filter ID to defeat Safari's output cache
    this.filterId = `glass-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // 3. Stamp the SVG filter
    this.svgRoot.innerHTML = buildFilterSVG(this.filterId, dataUri, opts);

    // 4. Attach to host
    this.host.style.filter = `url(#${this.filterId})`;
  }

  /**
   * Move the lens position (does NOT regenerate the map).
   * Only updates the filter's feOffset or the host's transform.
   * Cheap: runs every frame during drags or switch animations.
   */
  moveLens(x: number, y: number): void {
    // Just move the host element — the filter travels with it
    this.host.style.transform = `translate(${x}px, ${y}px)`;
  }

  destroy(): void {
    this.svgRoot.remove();
    this.host.style.filter = '';
  }
}
```

### 7.2 WebGL Renderer (Canvas / Video)

For surfaces the SVG filter pipeline can't touch (canvas-drawn content, live `<video>` in Safari):

```typescript
class GlassWebGL {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private lensTexture: WebGLTexture;

  constructor(canvas: HTMLCanvasElement) {
    this.gl      = canvas.getContext('webgl')!;
    this.program = buildShaderProgram(this.gl, VERT_SRC, FRAG_SRC);
  }

  /**
   * Set the displacement map (from generateLensMap) and render.
   */
  setDisplacement(map: ImageData, source: TexImageSource): void {
    uploadTexture(this.gl, this.lensTexture, map);
    uploadTexture(this.gl, this.sourceTexture, source);
    this.render();
  }

  private render(): void {
    // ... standard WebGL draw call
  }
}

/* Fragment shader — same refraction logic as feDisplacementMap, runs on GPU */
const FRAG_SRC = `
  precision highp float;
  uniform sampler2D uSource;  // the canvas/video pixels
  uniform sampler2D uMap;     // the displacement map
  uniform float uScale;
  varying vec2 vUv;

  void main() {
    vec2 map   = texture2D(uMap, vUv).rg;
    vec2 shift = (map - 0.5) * uScale;
    gl_FragColor = texture2D(uSource, vUv + shift);
  }
`;
```

### 7.3 Applying Glass to Switch (full example)

```typescript
import { Glass } from './glass';
import { animate, spring } from 'motion';

const track = document.querySelector('.glass-switch__track')!;
const thumb = document.querySelector('.glass-switch__thumb')!;
const input = document.querySelector('.glass-switch__input')! as HTMLInputElement;

// A hidden copy of the track fill that sits on its own layer and gets bent by the glass.
// The fill registers as a moving highlight as the thumb slides.
const fill = createHighlightFill(track);
track.appendChild(fill);

const glass = new Glass(thumb as HTMLElement);

// Initial map generation
glass.apply({
  width: 27, height: 27, borderRadius: 14,
  scale: 0.12, depth: 8, curvature: 40, splay: 1.0,
  chroma: 0.15, blur: 0, glow: 0.10,
  edgeHighlight: 0.30, specularAngle: 135,
});

// Toggle handler
input.addEventListener('change', () => {
  const checked = input.checked;

  // Spring the thumb
  animate(thumb, { x: checked ? 20 : 0 }, {
    easing: spring({ stiffness: 480, damping: 32 }),
  });

  // Animate the track background
  animate(track, {
    backgroundColor: checked ? 'var(--color-accent-green)' : 'rgba(120,120,128,0.30)',
  }, { duration: 0.24, easing: 'ease-out' });
});
```

---

## 8. Cross-Browser Notes

These are the quirks that trip up every Chromium-only glass implementation.

### 8.1 Safari SVG Filter Caching

**Problem:** Safari caches `feDisplacementMap` output by filter `id`. When you update the displacement map's data URI without changing the `id`, Safari keeps rendering the stale output. The glass freezes.

**Fix:** Generate a fresh filter `id` on every map update:

```typescript
const uid = `glass-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
filterEl.setAttribute('id', uid);
host.style.filter = `url(#${uid})`;
```

### 8.2 Safari Filter Source Size Ceiling

**Problem:** Safari has a maximum size for the source graphic a filter can process. Past this ceiling, Safari renders the effect in broken, mismatched blocks — or drops it entirely. The limit varies across Safari versions and between desktop and iOS.

**Fix:** Keep the filtered DOM region conservative. Refract small components (controls, handles) rather than large page sections. For large glass surfaces, use only `backdrop-filter: blur()` without `feDisplacementMap`.

### 8.3 Safari Live Video

**Problem:** Safari composites `<video>` on the GPU and never passes those pixels to the SVG filter pipeline. `feDisplacementMap` has no effect on a playing video in Safari/WebKit.

**Fix:** Run the WebGL renderer path for any component whose refraction target is a `<video>` element:

```typescript
const renderer = new GlassWebGL(overlayCanvas);

video.addEventListener('timeupdate', () => {
  renderer.setDisplacement(currentMap, video);
});
```

### 8.4 Quarter-Map Computation

The displacement map is regenerated on every lens shape change. Since it's a rounded rectangle, it has four-fold symmetry. Computing only the top-left quadrant and mirroring into all four reduces per-pixel work by 75%:

```typescript
for (let qy = 0; qy <= halfH; qy++) {
  for (let qx = 0; qx <= halfW; qx++) {
    const { dx, dy } = computePixel(qx, qy, lens);

    setPixel(buf, qx,           qy,           dx,  dy);  // top-left
    setPixel(buf, width - 1 - qx, qy,          -dx,  dy); // top-right
    setPixel(buf, qx,           height - 1 - qy, dx, -dy); // bottom-left
    setPixel(buf, width - 1 - qx, height - 1 - qy, -dx, -dy); // bottom-right
  }
}
```

### 8.5 Specular Pass — Lens-Region Only

The specular highlight runs as a separate SVG filter pass. Covering the full filter region scales cost with the entire area. In Chromium, restricting it to the lens region produces sub-pixel edge artifacts. In Safari, it doesn't. The fix:

- **Chromium:** compute specular over the full region, accept the cost.
- **Safari:** compute specular over the lens region only (half the cost, no artifacts).

Detect the browser once on startup and set a flag:

```typescript
const IS_WEBKIT = CSS.supports('-webkit-backdrop-filter', 'blur(1px)') &&
                  !navigator.userAgent.includes('Chrome');
const SPECULAR_REGION: 'full' | 'lens' = IS_WEBKIT ? 'lens' : 'full';
```

### 8.6 Firefox

Firefox supports `feDisplacementMap` correctly. The main gap is `backdrop-filter` — use the `-webkit-` prefix plus the un-prefixed version, and ensure the fallback background color is visible enough without the blur.

```css
.glass-container {
  backdrop-filter: blur(20px);         /* Firefox 126+ */
  -webkit-backdrop-filter: blur(20px); /* Safari */
  background: var(--color-glass-medium); /* Visible without blur */
}
```

---

## 9. Accessibility

### 9.1 Reduced Transparency

```css
@media (prefers-reduced-transparency: reduce) {
  .glass-container,
  .glass-card,
  .glass-nav,
  .glass-sheet {
    background: var(--color-bg-elevated) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-color: var(--color-border-strong) !important;
  }

  /* Remove displacement map entirely */
  [style*="filter: url(#glass"] {
    filter: none !important;
  }
}
```

### 9.2 Increased Contrast

```css
@media (prefers-contrast: more) {
  :root {
    --color-border-glass: rgba(255, 255, 255, 0.60);
    --color-text-secondary: rgba(255, 255, 255, 0.84);
    --color-text-tertiary:  rgba(255, 255, 255, 0.60);
    --color-glass-clear:    rgba(20, 20, 35, 0.96);
    --color-glass-medium:   rgba(20, 20, 35, 0.98);
  }

  .glass-btn--primary {
    background: #0071E3;
    box-shadow: none;
  }
}
```

### 9.3 Focus Management

- Every interactive glass element has a clearly visible `:focus-visible` ring — `2px solid var(--color-accent-blue)` with a 2–3 px offset.
- Glass overlays (sheets, modals) trap focus and restore it on close.
- Use `aria-modal="true"` and `role="dialog"` on overlaid sheets.
- The glass rim light and specular highlight are always `aria-hidden="true"`.

### 9.4 Color Contrast

The minimum contrast ratio for all text against any glass surface is **4.5:1** (WCAG AA). Text-on-glass tokens are pre-calculated to meet this:

| Token | Value | Use |
|---|---|---|
| `--color-text-on-glass` | `rgba(255,255,255,0.92)` | Primary text over dark glass |
| `--color-text-primary`  | `rgba(255,255,255,0.95)` | All primary text |
| Accent blue on dark bg  | `#0A84FF` | Passes 4.6:1 against `#0a0a0f` |

### 9.5 Forced Colors

```css
@media (forced-colors: active) {
  .glass-container,
  .glass-card,
  .glass-nav {
    background: Canvas;
    border: 1px solid ButtonText;
    backdrop-filter: none;
    filter: none;
  }

  .glass-btn--primary {
    background: Highlight;
    color: HighlightText;
  }
}
```

---

## 10. Performance Guidelines

| Rule | Reason |
|---|---|
| **Never `feDisplacementMap` a fixed element larger than 400 × 400 px** | Safari's source graphic ceiling; risk of broken rendering |
| **Only one WebGL renderer per glass surface** | Multiple WebGL contexts contend for GPU memory |
| **Do not regen the displacement map on every frame** | Map gen = O(W×H / 4). Budget 8–10 ms for 120 × 120 px maps. Only regen on shape change. |
| **Move lenses by `transform: translate()` not `left/top`** | Compositor-only, never triggers layout |
| **Use `will-change: transform` on animated glass thumbs only** | Promotes to a compositing layer; use sparingly |
| **Offscreen canvas for map generation** | Keeps map work off the main thread |
| **Detect `prefers-reduced-motion` and skip filter registration** | Saves GPU work for users who don't want animation |
| **Batch glass instances** | One shared `<svg>` root holds all filter defs; fewer DOM nodes |

---

## 11. File Structure

```
vitrum/
├── tokens/
│   ├── colors.css
│   ├── spacing.css
│   ├── typography.css
│   ├── radius.css
│   ├── blur.css
│   └── animation.css
├── glass/
│   ├── Glass.ts              — Core glass class (SVG path)
│   ├── GlassWebGL.ts         — WebGL renderer (canvas / video path)
│   ├── generateLensMap.ts    — Quarter-map computation
│   ├── buildFilterSVG.ts     — SVG filter template stamper
│   └── browserQuirks.ts      — IS_WEBKIT, SPECULAR_REGION, etc.
├── components/
│   ├── GlassContainer.tsx
│   ├── GlassButton.tsx
│   ├── GlassSwitch.tsx
│   ├── GlassSlider.tsx
│   ├── GlassToggleGroup.tsx
│   ├── GlassNavBar.tsx
│   ├── GlassCard.tsx
│   ├── GlassSheet.tsx
│   └── GlassInput.tsx
├── hooks/
│   ├── useGlass.ts           — Attaches / cleans up Glass instance
│   ├── useSpring.ts          — Web Animations API spring wrapper
│   └── useScrollCollapse.ts  — Nav bar scroll collapse
├── utils/
│   ├── imageDataToDataURI.ts
│   └── createHighlightFill.ts
└── index.ts
```

---

## 12. Design Checklist

Before shipping a glass component or page section:

- [ ] Glass used sparingly — one focal glass element per screen section
- [ ] `feDisplacementMap` only on elements ≤ 400 × 400 px
- [ ] Unique filter IDs per update (Safari caching fix)
- [ ] Fallback `background` color visible without backdrop-filter
- [ ] `prefers-reduced-motion` collapses all springs and map animation
- [ ] `prefers-reduced-transparency` replaces glass with opaque surfaces
- [ ] `prefers-contrast: more` raises border opacity and text contrast
- [ ] `forced-colors` override present
- [ ] All text passes 4.5:1 contrast against glass background
- [ ] Focus ring visible on all interactive glass elements
- [ ] Animated glass thumbs use `will-change: transform` (not `top/left`)
- [ ] Displacement map regenerated only on shape change, not on move
- [ ] Corner radii follow concentricity — inner radius = outer − padding
- [ ] Motion springs from source element, not arbitrary screen origin

---

*Vitrum — Liquid Glass for the Web*  
*Inspired by Apple's Liquid Glass (WWDC 2025) and Aave's cross-browser displacement map technique.*
