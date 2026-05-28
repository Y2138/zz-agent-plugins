# Design System: Furniture Collections List
**品牌**：Furniture Co.
**设备**：Desktop + Mobile (Responsive)
**设计哲学**：Swiss / International — 精确、克制、摄影优先

## 1. Visual Theme & Atmosphere

The Furniture Collections List embodies a **sophisticated, minimalist sanctuary** that marries the pristine simplicity of Scandinavian design with the refined visual language of luxury editorial presentation. The interface feels **spacious and tranquil**, prioritizing breathing room and visual clarity above all else. The design philosophy is gallery-like and photography-first, allowing each furniture piece to command attention as an individual art object.

The overall mood is **airy yet grounded**, creating an aspirational aesthetic that remains approachable and welcoming. The interface feels **utilitarian in its restraint** but elegant in its execution, with every element serving a clear purpose while maintaining visual sophistication.

**Key Characteristics:**
- Expansive whitespace creating generous breathing room between elements
- Clean, architectural grid system with structured content blocks
- Photography-first presentation with minimal UI interference
- Whisper-soft visual hierarchy that guides without shouting
- Refined, understated interactive elements

## 2. Color Palette & Roles

### Primary Foundation
- **Warm Barely-There Cream** (#FCFAFA) – Primary background. Creates warmth more inviting than pure white.
- **Crisp Very Light Gray** (#F5F5F5) – Card backgrounds and secondary surfaces.

### Accent & Interactive
- **Deep Muted Teal-Navy** (#294056) – Sole vibrant accent. Primary CTA buttons, active navigation, interaction highlights.

### Typography & Text Hierarchy
- **Charcoal Near-Black** (#2C2C2C) – Headlines and product names.
- **Soft Warm Gray** (#6B6B6B) – Body copy, descriptions, metadata.
- **Ultra-Soft Silver Gray** (#E0E0E0) – Borders, dividers.

### Functional States
- **Success Moss** (#10B981) – Availability, confirmations
- **Alert Terracotta** (#EF4444) – Low stock, errors
- **Informational Slate** (#64748B) – System messages

## 3. Typography Rules

**Primary Font Family:** Manrope
**Character:** Modern, geometric sans-serif with gentle humanist warmth.

### Hierarchy & Weights
- **Display Headlines (H1):** Semi-bold (600), letter-spacing 0.02em, 2.75-3.5rem
- **Section Headers (H2):** Semi-bold (600), letter-spacing 0.01em, 2-2.5rem
- **Subsection Headers (H3):** Medium (500), normal spacing, 1.5-1.75rem
- **Body Text:** Regular (400), line-height 1.7, 1rem
- **Small Text/Meta:** Regular (400), line-height 1.5, 0.875rem
- **CTA Buttons:** Medium (500), letter-spacing 0.01em, 1rem

### Spacing Principles
- Headers use expanded letter-spacing for elegance
- Body maintains generous line-height (1.7)
- 2-3rem between related text blocks
- 4-6rem between major sections

## 4. Component Stylings

### Buttons
- **Shape:** Subtly rounded corners (8px) — approachable without playful
- **Primary CTA:** Deep Muted Teal-Navy background, white text, padding 0.875rem × 2rem
- **Hover:** Subtle darkening, 250ms ease-in-out
- **Focus:** Soft outer glow in primary color
- **Secondary:** Outlined, transparent background, hover fills with teal tint

### Cards & Product Containers
- **Corners:** Gently rounded (12px)
- **Background:** Alternates Cream and Light Gray
- **Shadow:** Flat by default, whisper-soft on hover (`0 2px 8px rgba(0,0,0,0.06)`)
- **Padding:** Generous 2-2.5rem
- **Image:** Full-bleed top, square or 4:3

### Navigation
- **Layout:** Horizontal, generous spacing (2-3rem between items)
- **Typography:** Medium weight, subtle uppercase, expanded letter-spacing (0.06em)
- **Active Indicator:** Thin underline (2px) in Teal-Navy
- **Mobile:** Hamburger → sliding drawer

### Inputs & Forms
- **Border:** 1px Soft Warm Gray
- **Focus:** Border shifts to Teal-Navy with subtle glow
- **Corners:** 8px (matching buttons)
- **Touch targets:** Minimum 44×44px

### Product Cards (Specific Pattern)
- **Image:** Square (1:1) or landscape (4:3), full card width
- **Content Stack:** Name (H3) → descriptor → material → price
- **Price:** Semi-bold (600) in Charcoal Near-Black
- **Hover:** translateY -4px + enhanced shadow

## 5. Layout Principles

### Grid & Structure
- **Max Width:** 1440px
- **Grid:** Responsive 12-column, gutters 24px (mobile) / 32px (desktop)
- **Product Grid:** 4 → 3 → 2 → 1 columns across breakpoints
- **Breakpoints:** Mobile <768px / Tablet 768-1024 / Desktop 1024-1440 / Large >1440

### Whitespace Strategy
- **Base Unit:** 8px micro, 16px component
- **Vertical Rhythm:** 2rem (32px) between related elements
- **Section Margins:** 5-8rem between major sections
- **Hero Padding:** 8-12rem top/bottom

### Responsive Behavior
- Mobile-first foundation
- Progressive enhancement at larger breakpoints
- Touch targets ≥ 44×44px (WCAG AAA)
- Navigation collapses to hamburger

## 6. Interaction Patterns

### Transitions
- All interactive elements: 200-250ms ease-in-out
- Page-level transitions: fade (150ms)
- Cards: lift + shadow on hover

### Feedback Patterns
- Buttons: color darkening on hover, glow on focus
- Loading states: skeleton shimmer (subtle gray pulse)
- Success: green checkmark fade-in
- Errors: red border + inline message

### Scroll Behavior
- Smooth scroll for anchor links
- No scroll-jacking
- Sticky header after 100px scroll

## 7. Prompt Hints

生成新页面时引用以下片段：

```
氛围：sophisticated minimalist sanctuary with gallery-like spaciousness, airy yet grounded
色板：Background Warm Cream (#FCFAFA), Accent Teal-Navy (#294056), Text Charcoal (#2C2C2C)
字型：Manrope, geometric sans-serif, semi-bold headers / regular body
组件：subtly rounded corners (8-12px), whisper-soft shadows, full-bleed imagery
布局：12-column grid, generous whitespace, photography-first (70-30 image-text ratio)
交互：200-250ms ease transitions, lift+shadow hover, skeleton loading
```
