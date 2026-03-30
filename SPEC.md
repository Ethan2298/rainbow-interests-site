# Rainbow Interests — Complete Design Specification

> Framer project clone spec. Source: https://capable-wealth-335782.framer.app

---

## 1. Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `rgb(56, 127, 239)` / `#387FEF` | Links, accents, blue arch |
| Secondary | `rgb(255, 225, 84)` / `#FFE154` | Yellow arch |
| Accent | `rgb(255, 63, 90)` / `#FF3F5A` | Red arch, stitch line |
| Text | `rgb(26, 26, 30)` | Body text |
| TextWeak | `rgba(26, 26, 30, 0.5)` | Secondary text |
| Background | `rgb(255, 255, 255)` | Page bg |
| BackgroundRaised | `rgb(245, 245, 245)` | Footer bg |
| Border | `rgba(0, 0, 0, 0.1)` | Borders |
| NavBg | `rgb(51, 51, 51)` | Navbar pill background |

### Typography
| Style | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| Heading 1 | Inter | 56px | 500 (Medium) | 1em | -0.03em |
| Heading 2 | Inter | 36px | 400 | 1.1em | -0.03em |
| Body | DM Sans | 16px | 400 | 1.2em | 0 |
| BodyStrong | DM Sans | 16px | 500 | 1.2em | 0 |
| BodyLarge | Host Grotesk | 20px | 400 | 1.2em | -0.02em |
| BodySmall | DM Sans | 14px | 400 | 1.3em | 0 |
| BodySmallStrong | DM Sans | 14px | 500 | 1.3em | 0 |
| NavLink | DM Sans | 14px | 500 | 1.3em | 0 | color: white |
| NavBrand | DM Sans | 16px | 500 | 1.2em | 0 | color: white |

### Fonts to Load
- Google Fonts: `Inter:wght@400;500`, `DM+Sans:wght@400;500`, `Host+Grotesk:wght@400`

---

## 2. Layout — Desktop (1200px)

Page is a single vertical stack, white background, centered, overflow clip.

---

## 3. NavBar Component

### Structure
- **Outer wrapper**: full width, transparent bg, padding `16px 24px`, centers content
- **Pill container**: `fit-content` width, `rgb(51, 51, 51)` bg, `border-radius: 100px`, padding `8px 8px 8px 16px`, horizontal stack, gap `24px`, overflow hidden
  - **Logo group**: horizontal stack, gap `6px`, links to `/#hero`
    - Rainbow SVG icon (the 3-arch logo, ~20x13px)
    - "Rainbow Interests" text — `/NavBrand` style (white, DM Sans 500, 16px)
  - **Nav links**: horizontal stack, gap `4px`
    - About, Features, Testimonials, Pricing, FAQ — `/NavLink` style (white 80%, DM Sans 500, 14px)
  - **Get Started button**: `SecondarySm` variant — transparent bg (`/Main/Primary-0`), `border-radius: 48px`, padding `8px`

### Glass Effect (Code Override: `withGlassOnScroll`)
- Always: `backdrop-filter: blur(16px) saturate(1.2)`, bg `rgba(51, 51, 51, 0.75)`
- On scroll (>50px): `blur(24px) saturate(1.5)`, bg `rgba(51, 51, 51, 0.85)`, `box-shadow: 0 2px 8px rgba(0,0,0,0.15)`
- Transition: `0.3s ease` on all properties
- Position: sticky top

---

## 4. Hero Section

### Structure
- Full viewport height (`100vh`), overflow clip
- Padding: `160px 16px 64px 80px`
- Vertical stack, gap `80px`, align start

### Content (max-width 500px, z-index 2)
- **Hero image**: full width, 494px height, border-radius 5px
  - Source: `https://framerusercontent.com/images/ZPeWLCAPr9negdElGk5qzVOw7kM.png`
- **Heading**: "A Company Designed To Thrive" — Heading 1 style (Inter Medium, 56px, -0.03em tracking), width 960px (overflows content for dramatic effect), z-index 1
- **Button**: "Read our Vision" — `PrimaryMd` variant, `rgb(51, 51, 51)` bg, `border-radius: 48px`, padding `12px`, height `36px`, text is `/BodyStrongLight` (DM Sans 500, 16px, white)
  - Has arrow icon (`uFNDrhDvW="true"`)
- **Full-width line**: `FullWidthLine` code component — `100vw` width, 3px thick, `rgba(56, 127, 239, 0.3)`, margin-left `-80px` (bleeds to viewport edge)

### Background
- Absolute positioned, full width/height, overflow hidden
- (Background layer — likely a gradient/shader, locked)

---

## 5. Notebook Binder (Code Component: `ShaderOverlay.tsx`)

- Absolute positioned, `43px` wide, full height, top-left corner
- White background
- Vertical stitch line: `1.5px` wide, `rgba(255, 63, 90, 0.3)` color, right edge
- Configurable: hole count (0 in current config), colors
- Creates a notebook/binder aesthetic along the left edge

---

## 6. Locations Section

### Structure
- Padding: `48px 16px 80px 80px`
- Vertical stack, gap `24px`

### Heading
- "Our Locations" — Heading 1 style

### Location Cards (horizontal wrapping stack, gap `40px`)

#### South Florida Card (1fr, min-width 280px)
- **Image**: full width, 280px height, aspect-ratio 1.8, border-radius 5px
  - Source: `https://framerusercontent.com/images/uPhsWU0Pwt2KeFh8Hnx8jhKa7kU.png`
- **Title**: "South Florida" — Heading 2 style
- **Locations list** (vertical stack, gap 8px):
  - The NOW Fort Lauderdale — BodyLarge style
  - The NOW Plantation — BodyLarge style
  - The NOW Wynwood — BodyLarge style
  - The NOW Pinecrest — BodyLarge style

#### Colorado Card (1fr, min-width 280px)
- **Image**: full width, 280px height, aspect-ratio 1.8, border-radius 5px
  - Source: `https://framerusercontent.com/images/4qpPu3lyi6XgwQPf7u2fJ8jVqk.png`
- **Title**: "Soon: Colorado" — Heading 2 style
- **Status**: "Coming Soon" — BodyLarge style

---

## 7. Footer Component

### Structure
- Background: `rgb(245, 245, 245)` (BackgroundRaised)
- Padding: `48px`
- Horizontal layout, space-between, centered vertically
- Max-width `1128px`, inner padding `0 24px`

### Left Content (max-width 280px)
- **Logo**: icon + "Message" text (BodyLarge style), links to `/`
- **Description**: "Track every move, analyze your performance, and get real-time coaching." — BodySmall
- **Social buttons**: horizontal stack, gap `8px`
  - Twitter, Discord, LinkedIn — each is a `SocialsButton` component (transparent bg, 4px radius, 8px padding, 24x24 icon)
- **Credit line**: "Created by [Arthur](https://x.com/uxui_arthur) in [Framer](https://framer.link/arthurdch)" — BodySmall/BodySmallStrong
  - Arthur has avatar (24x24 circle)

### Right Navigation (max-width 240px)
- **Column header**: "Navigation" — BodySmallStrong
- **Links** (vertical stack, gap 16px): About, Features, Testimonials, Pricing, FAQ — BodySmall, link to `/`

---

## 8. Button Component Variants

| Variant | Size | BG | Border Radius | Padding | Text Style |
|---------|------|----|---------------|---------|------------|
| PrimaryMd | 36px h | `rgb(51, 51, 51)` | 48px | 12px | BodyStrongLight (white) |
| PrimarySm | 32px h | `rgb(51, 51, 51)` | 48px | 8px | BodyStrongLight (white) |
| SecondaryMd | 36px h | transparent | 48px | 12px | (inherits) |
| SecondarySm | 32px h | transparent | 48px | 8px | (inherits) |

---

## 9. Rainbow Logo SVG

```svg
<svg viewBox="-20 -40 240 170" xmlns="http://www.w3.org/2000/svg" width="110" height="70">
  <path d="M 20 120 L 20 60 A 80 80 0 0 1 180 60 L 180 120" fill="none" stroke="#387FEF" stroke-width="16" stroke-linecap="square"/>
  <path d="M 44 120 L 44 60 A 56 56 0 0 1 156 60 L 156 120" fill="none" stroke="#FFE154" stroke-width="16" stroke-linecap="square"/>
  <path d="M 68 120 L 68 60 A 32 32 0 0 1 132 60 L 132 120" fill="none" stroke="#FF3F5A" stroke-width="16" stroke-linecap="square"/>
</svg>
```

---

## 10. Image Assets

| Asset | URL | Usage |
|-------|-----|-------|
| Hero image | `https://framerusercontent.com/images/ZPeWLCAPr9negdElGk5qzVOw7kM.png` | Hero section |
| South Florida | `https://framerusercontent.com/images/uPhsWU0Pwt2KeFh8Hnx8jhKa7kU.png` | Location card |
| Colorado | `https://framerusercontent.com/images/4qpPu3lyi6XgwQPf7u2fJ8jVqk.png` | Location card |
| Arthur avatar | `https://framerusercontent.com/images/ONjFjJOjmJKUkxsVtaYneUJVcnM.jpg` | Footer credit |
| Logo SVG | `https://framerusercontent.com/images/9tTCWGuZvB3XxsNGMUK0GcrWg.svg` | Navbar logo |

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Notes |
|-----------|-------|-------|
| Desktop | 1200px | Primary layout |
| Tablet | 810px | Simplified layout |
| Phone | 390px | Mobile menu, stacked layout |

### Mobile Nav
- Full-screen overlay, `BackgroundRaised` bg
- Centered vertical stack of links — each in Heading 1 style
- Hamburger button at bottom center
- Links: About, Features, Testimonials, Pricing, FAQ

---

## 12. Interactions & Animations

- **Navbar glass effect**: backdrop-filter blur transitions on scroll (>50px threshold)
- **Full-width line**: bleeds past content to viewport edge via negative margin
- **Notebook binder**: decorative left-edge stitch line, optional punch holes
