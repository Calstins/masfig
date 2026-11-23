---
name: Emerald Ledger Enterprise
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7b6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2d'
  primary: '#006b2c'
  on-primary: '#ffffff'
  primary-container: '#00873a'
  on-primary-container: '#f7fff2'
  inverse-primary: '#62df7d'
  secondary: '#006d30'
  on-secondary: '#ffffff'
  secondary-container: '#92f5a4'
  on-secondary-container: '#007233'
  tertiary: '#466252'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e7b6a'
  on-tertiary-container: '#f6fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#95f8a7'
  secondary-fixed-dim: '#79db8d'
  on-secondary-fixed: '#00210a'
  on-secondary-fixed-variant: '#005323'
  tertiary-fixed: '#caead6'
  tertiary-fixed-dim: '#afceba'
  on-tertiary-fixed: '#042014'
  on-tertiary-fixed-variant: '#314d3e'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
  ledger-mono:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a clean, light enterprise operational environment tailored for ERP workflows, multi-channel commerce, point-of-sale management, and real-time inventory ledgers. 

The visual language follows **Corporate / Modern** principles infused with understated minimalism:
- **Tone:** Authoritative, high-clarity, reliable, and calm under high data densities.
- **Target Audience:** Inventory managers, retail operations teams, logistics directors, and retail cashiers processing thousands of SKUs and ledger lines daily.
- **Emotional Response:** Inspires quiet confidence, operational speed, and frictionless record auditing. The interface minimizes cognitive overload by removing saturated, noisy graphics and replacing them with structural table grids, soft emerald green confirmation tones, crisp monochrome boundaries, and dedicated currency precision.

## Colors

The palette balances crisp functional neutrals with a decisive emerald green brand identity.

- **Primary (`#16a34a`) & Secondary (`#15803d`):** Dedicated to high-priority system actions (`+ Add Product`, primary batch actions), active navigation icons, and key visual indicators. Hover and pressed states use the darker `#15803d`.
- **Tertiary / Sage Tint (`#dcfce7` / `#f0fdf4`):** Used strictly for high-visibility low-stress accents: selected navigation menu pills, published status tags, and soft in-stock badges.
- **Canvas & Surface System:**
  - App Canvas Base: `#f8fafc` (subtle cool slate-gray canvas ensuring white surface cards stand out).
  - Container Cards & Ledgers: Pure `#ffffff`.
  - Borders & Grid Lines: `#eaecf0` and `#e2e8f0` for clean 1px structural framing without harsh contrast.
- **Text & Neutral Tiers:**
  - Primary Titles & Figures: `#0f172a` (high contrast slate-900).
  - Body Text & SKUs: `#334155` (slate-700).
  - Column Headers & Meta Captions: `#64748b` (slate-500) and `#94a3b8` (slate-400).
- **Functional Semantics:**
  - In Stock / Active: `#16a34a` on `#dcfce7`.
  - Low Stock / Warning: `#d97706` on `#fef3c7`.
  - Out of Stock / Destructive: `#dc2626` on `#fee2e2`.

## Typography

The design system utilizes **Inter** throughout all hierarchy levels to ensure maximum geometric clarity, optical balancing at small point sizes, and uniform tabular numeral alignment.

- **Ledger & Financial Values:** Always apply `font-feature-settings: "tnum" 1` (tabular numbers) to ensure uniform vertical alignment across price tables and quantity metrics. 
- **Nigerian Naira (`₦`) Formatting:** The Naira currency sign is set adjacent to the numerical value without a space (`₦6,900`), rendered with medium or semi-bold weight (`fontWeight: 600`) to guarantee high-scan speed in balance sheets.
- **Table Column Headers:** Rendered using `label-sm` or `label-md` in uppercase, tracked out with `letter-spacing: 0.05em`, in muted neutral slate (`#64748b`).
- **Product Titles & Secondary SKUs:** Product titles use `body-md` in uppercase semi-bold (`#0f172a`), paired with secondary categories and barcodes in `body-sm` (`#94a3b8`).

## Layout & Spacing

The architecture employs an asymmetrical enterprise workspace composed of a fixed/collapsible sidebar navigation (240px expanded, 72px icon-only collapsed) and a fluid main operational dashboard canvas.

### Layout System
- **Grid Structure:** Fluid 12-column responsive grid within the main content canvas.
- **Gutter & Margins:** 
  - Mobile (<768px): 1rem margins, 1rem gutters.
  - Tablet (768px - 1024px): 1.5rem margins, 1rem gutters.
  - Desktop (>1024px): 2rem margins, 1.5rem gutters.
- **Density Philosophy:** Compact-to-comfortable administrative rhythm. Row heights in tabular lists maintain an optical vertical padding of `space-sm` (8px to 12px) to maximize record display per viewport while maintaining effortless touch/click target safety.

## Elevation & Depth

This system avoids heavy drop shadows, instead utilizing **low-contrast outlines** paired with subtle micro-elevation to separate surfaces cleanly.

- **Base Layer:** The canvas sits at level 0 on `#f8fafc`.
- **Card & Ledger Containers:** Level 1 uses pure `#ffffff` bordered with a crisp 1px solid stroke in `#eaecf0`. A negligible ambient shadow (`0 1px 2px 0 rgba(15, 23, 42, 0.04)`) creates gentle optical separation from the canvas.
- **Popovers & Dropdown Menus:** Level 2 elevates filters, combobox pickers, and account panels using `#ffffff`, 1px `#e2e8f0` border, and a diffused ambient shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Modal Dialogues & Drawers:** Level 3 features full scrim (`rgba(15, 23, 42, 0.4)`) with high-surface card depth (`0 20px 25px -5px rgba(15, 23, 42, 0.1)`).

## Shapes

The interface balances sharp enterprise efficiency with modern friendliness through standard **0.5rem (8px)** corner radiuses on standard interactive components and soft pills for indicators.

- **Standard Controls (`roundedness: 2` / 8px):** Applied to primary buttons, action toolbars, table card containers, modal dialogue boxes, filter selection inputs, and product thumbnail images.
- **Pills & Status Badges:** Fully circular (`rounded-full` / 9999px) for operational state tags (e.g., `Published`, `12 units`, `Low Stock`), ensuring they read distinctly as non-interactive status tokens compared to rectangular action buttons.
- **Avatars:** Fully circular badges (`rounded-full`) displaying high-contrast monograms.

## Components

### 1. Buttons
- **Primary Action Button:** Emerald green solid (`#16a34a`) with white text, 8px border-radius, `space-sm` vertical and `space-md` horizontal padding, paired with a leading SVG icon (e.g., `+ Add Product`). Hover transitions to `#15803d`.
- **Secondary / Utility Button:** Crisp `#ffffff` surface, 1px `#e2e8f0` border, slate-700 text (`#334155`), with hover tint `#f8fafc` (e.g., `Import/Export` with upload glyph).
- **Table Inline Actions:** Bare 32x32px ghost icon buttons (`Edit`, `Delete`) with subtle `#64748b` stroke icons, shifting to emerald on edit hover and rose `#ef4444` on delete hover.

### 2. Status Chips & Pills
- **Stock Counter Pill:** Soft mint background (`#f0fdf4`), emerald green text (`#16a34a`), 9999px border-radius, font size 12px with medium weight (`12 units`).
- **Publication Tag:** Sage tint background (`#dcfce7`), forest green label (`#15803d`), semi-bold typography (`Published`).

### 3. Filter Controls & Inputs
- **Search SKU Field:** White background, 1px `#e2e8f0` border, 8px radius, leading neutral search icon (`#94a3b8`), placeholder `#94a3b8` in 14px Inter. Focus states display an emerald focus ring (`#16a34a` at 20% opacity with 1px solid `#16a34a` stroke).
- **Dropdown Filter Chips:** Select triggers displaying category, brand, and status labels followed by a subtle chevron down glyph (`#64748b`).

### 4. Data Ledgers & Tables
- **Container:** Full-width white card bounded by 1px `#eaecf0` outer border.
- **Headers:** Light border bottom (`1px solid #f1f5f9`), slate-500 uppercase 11px font, left-aligned for identity/SKU, right-aligned for financial amounts (Price, Stock, Sales).
- **Rows:** Alternating subtle hover state (`#f8fafc`), 44px minimum touch height, product thumbnail (40x40px rounded-lg) paired with double-line product identity (Title in `#0f172a`, Category in `#94a3b8`).

### 5. Sidebar Navigation
- **Active Navigation Item:** Background tint `#f0fdf4`, primary green text `#16a34a`, semi-bold weight, with a matching green icon glyph.
- **Inactive Item:** Transparent background, slate-600 text (`#475569`), shifting to `#f8fafc` on hover.
- **Collapsible Groups:** Nested children indented 24px with soft bullet guides.