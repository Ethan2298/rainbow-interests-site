# Rainbow Interests — Brand Guide

---

## Typography

### Font Pairing
- **Headings**: Geist Mono (monospace) — weight 400, tight letter-spacing (-0.03em to -0.04em)
- **Body**: DM Sans — weight 400/500, neutral and readable
- **Accent body**: Host Grotesk — weight 400, used for location names and larger body text
- **UI elements** (nav, buttons, labels): DM Sans 500

### Type Scale
| Usage | Font | Size | Weight | Letter Spacing |
|-------|------|------|--------|----------------|
| Hero heading | Geist Mono | 64px | 400 | -0.04em |
| Section heading | Geist Mono | 40px | 400 | -0.03em |
| Card heading | Geist Mono | 24px | 400 | -0.02em |
| Body large | Host Grotesk | 18px | 400 | -0.01em |
| Body | DM Sans | 16px | 400 | 0 |
| Body small | DM Sans | 14px | 400 | 0 |
| Nav link | DM Sans | 13px | 400 | 0.01em |
| Label / uppercase | DM Sans | 11px | 500 | 0.1em |

### Google Fonts Import
```
Inter:ital,wght@0,300;0,400;0,500;0,600;1,400
Geist+Mono:wght@300;400;500;600
DM+Sans:wght@400;500
Host+Grotesk:wght@400
```

---

## Colors

### Primary Palette
| Name | Value | Usage |
|------|-------|-------|
| Blue | `rgb(56, 127, 239)` / `#387FEF` | Brand accent, heading emphasis, ruled lines |
| Yellow | `rgb(255, 225, 84)` / `#FFE154` | Rainbow logo (middle arch) |
| Red/Rose | `rgb(255, 63, 90)` / `#FF3F5A` | Rainbow logo (inner arch), margin line |

### Neutrals
| Name | Value | Usage |
|------|-------|-------|
| Text | `rgb(26, 26, 30)` | Primary text |
| Text muted | `rgba(26, 26, 30, 0.5)` | Secondary text, descriptions |
| Text faint | `rgba(26, 26, 30, 0.35)` | Tertiary text, social icons |
| Paper | `rgb(252, 251, 249)` | Paper background |
| Linen | `rgb(235, 232, 228)` | Page background (behind paper) |
| Nav dark | `rgba(26, 26, 30, 0.8)` | Navbar pill |

### Functional Colors
| Name | Value | Usage |
|------|-------|-------|
| Margin line | `rgba(220, 80, 80, 0.22)` | Notebook red margin rule |
| Ruled lines | `rgba(56, 127, 239, 0.035)` | Faint horizontal notebook lines |
| Divider | `rgba(26, 26, 30, 0.06)` | Section separators |
| Hover bg | `rgba(255, 255, 255, 0.12–0.2)` | Button/link hover states |

---

## Logo

### Rainbow Arches
Three nested arches — blue (outer), yellow (middle), red (inner).

```svg
<svg viewBox="-20 -40 240 170" xmlns="http://www.w3.org/2000/svg">
  <path d="M 20 120 L 20 60 A 80 80 0 0 1 180 60 L 180 120" fill="none" stroke="#387FEF" stroke-width="16" stroke-linecap="square"/>
  <path d="M 44 120 L 44 60 A 56 56 0 0 1 156 60 L 156 120" fill="none" stroke="#FFE154" stroke-width="16" stroke-linecap="square"/>
  <path d="M 68 120 L 68 60 A 32 32 0 0 1 132 60 L 132 120" fill="none" stroke="#FF3F5A" stroke-width="16" stroke-linecap="square"/>
</svg>
```

### Logo Sizes
- Navbar: 18x12px
- Footer: 16x11px
- Favicon / app icon: use at native SVG size

### Logo + Wordmark
Logo icon left, "Rainbow Interests" text right in DM Sans 500 (or 14px in nav context).

---

## Design Concept: The Paper

The site presents as a **sheet of notebook paper** floating on a warm linen surface.

### Key Elements
- **Paper container**: max-width 900px, `rgb(252, 251, 249)`, soft multi-layer box-shadow
- **Notebook margin**: single vertical red line at left: 56px (`rgba(220, 80, 80, 0.22)`)
- **Ruled lines**: horizontal lines every 28px (`rgba(56, 127, 239, 0.035)`)
- **Paper texture**: fractal noise overlay at low opacity for tactile grain
- **Content padding**: left 72px (past the margin line), right 64px

### Visual Hierarchy
1. Geist Mono headings — the "typed" content on the page
2. DM Sans body text — clean annotations
3. Images — photos pasted into the notebook
4. Thin rules and whitespace — let the paper breathe

### What to Avoid
- Heavy borders or shadows on interior elements
- Saturated background colors — keep everything on the paper tone
- Decorative flourishes — the notebook lines ARE the decoration
- Too many font weights — keep it light (400) for headings, medium (500) only for UI

---

## Components

### Navbar
- Floating pill, `border-radius: 100px`
- Dark translucent bg with backdrop blur
- Intensifies on scroll (0.8 → 0.92 opacity, stronger blur + shadow)
- White text, 13px DM Sans

### Buttons
- Primary: `rgb(26, 26, 30)` bg, white text, `border-radius: 100px`, 14px DM Sans 500
- Secondary/Ghost: transparent bg, `rgba(255,255,255,0.12)`, white text

### Section Dividers
- Single 1px line, `rgba(26, 26, 30, 0.06)`
- Generous vertical padding (48px) above and below

### Cards (Location)
- No border, no shadow — just image + text on paper
- Image: full width, 220px height, 4px radius
- Title in Geist Mono, details in Host Grotesk muted

---

## Responsive Behavior

| Breakpoint | Paper behavior |
|------------|----------------|
| >1024px | 900px centered, floating on linen, 24px body padding |
| 768–1024px | 900px, rounded corners, 24px body padding |
| <768px | Edge-to-edge, no shadow, paper becomes the page |

### Mobile
- Navbar shows hamburger menu
- Full-screen overlay nav in Geist Mono
- Content padding reduces to 36px left, 24px right
- Margin line shifts to 28px left
