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
| Blue | `rgb(56, 127, 239)` / `#387FEF` | Brand accent, heading emphasis, rainbow arch |
| Yellow | `rgb(255, 225, 84)` / `#FFE154` | Rainbow logo (middle arch) |
| Red/Rose | `rgb(255, 63, 90)` / `#FF3F5A` | Rainbow logo (inner arch), margin line |

### Neutrals
| Name | Value | Usage |
|------|-------|-------|
| Text | `rgb(26, 26, 30)` | Primary text |
| Text muted | `rgba(26, 26, 30, 0.5)` | Secondary text, descriptions |
| Text faint | `rgba(26, 26, 30, 0.35)` | Tertiary text, social icons |
| Page | `rgb(252, 251, 249)` | Full-page cream shell (`.page`) |
| Nav dark | `rgba(26, 26, 30, 0.8)` | Navbar pill |

### Functional Colors
| Name | Value | Usage |
|------|-------|-------|
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

## Design Concept: Cream page shell

Every page uses the same full-bleed cream shell as the home page. There is no notebook, paper sheet, linen backdrop, or ruled-line treatment.

### Key Elements
- **Page shell**: `.page`, full width, `rgb(252, 251, 249)`
- **Content wrap**: `.content-wrap`, max-width 1080px, centered, 64px horizontal padding (36px left / 24px right on small screens)
- **Shared chrome**: sticky glass nav pill, full-screen mobile overlay, and two-column footer — generated from `scripts/apply-site-chrome.js`

### Visual Hierarchy
1. Geist Mono headings
2. DM Sans body text
3. Photographs and location cards sitting on the cream ground
4. Thin rules and whitespace

### What to Avoid
- Paper, linen, notebook margin, or ruled-line decoration
- Heavy borders or shadows on interior elements
- Saturated background colors — keep everything on the cream tone
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
- No border, no shadow — just image + text on the cream page
- Image: full width, 220px height, 4px radius
- Title in Geist Mono, details in Host Grotesk muted

---

## Responsive Behavior

| Breakpoint | Page behavior |
|------------|----------------|
| >1024px | Full-bleed cream `.page`, `.content-wrap` at 1080px |
| 768–1024px | Same shell, wrap still 1080px with 64px padding |
| <768px | Same shell, wrap padding 36px left / 24px right |

### Mobile
- Navbar shows hamburger menu
- Full-screen overlay nav in Geist Mono
- Content padding reduces to 36px left, 24px right
