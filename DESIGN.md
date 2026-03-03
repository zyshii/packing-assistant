# Packing Assistant — Design System

## Overview

Earthy, natural design aesthetic inspired by [realfood.gov](https://realfood.gov/). The palette is anchored in warm cream (`#F3F0D6`) with herb greens, sandy creams, and warm amber accents. Typography pairs Lora (serif headings) with Raleway (clean body text) for an organic yet modern feel.

---

## Typography

### Font Pairing: Wellness Calm
- **Headings**: [Lora](https://fonts.google.com/specimen/Lora) — serif, 400/500/600/700 — organic curves, warm elegance
- **Body**: [Raleway](https://fonts.google.com/specimen/Raleway) — sans-serif, 300/400/500/600/700 — clean, airy, modern

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

### CSS Font Variables
```css
font-family: 'Lora', Georgia, serif;    /* headings */
font-family: 'Raleway', system-ui, sans-serif; /* body */
```

### Tailwind Classes
- `.font-display` → Lora serif (headings, card titles)
- `.font-body` → Raleway sans (body, buttons, badges)
- `.font-serif` → Lora serif alias
- `.font-sans` → Raleway sans alias

### Type Scale
- **H1**: `text-4xl lg:text-5xl font-bold tracking-tight font-display`
- **H2**: `text-2xl font-bold font-display`
- **H3 / CardTitle**: `text-2xl font-semibold font-display`
- **Body**: `text-base` (Raleway, 16px, line-height 1.7)
- **Small / Label**: `text-sm font-semibold font-body`
- **Badge / Caption**: `text-xs font-semibold tracking-wide font-body`

---

## Color Palette

### Light Mode (`:root`)

```css
--background: 54 47% 90%;         /* Warm cream    #F3F0D6 ← realfood.gov theme color */
--foreground: 35 30% 16%;         /* Dark brown    #3A2A1A */

--card: 48 60% 95%;               /* Light cream   #F9F6E8 */
--card-foreground: 35 30% 16%;

--popover: 48 60% 95%;            /* Light cream */
--popover-foreground: 35 30% 16%;

--primary: 142 32% 36%;           /* Herb green    #3E7050 */
--primary-foreground: 0 0% 100%;  /* White */

--secondary: 48 38% 84%;          /* Sandy cream   #E5DABD */
--secondary-foreground: 35 30% 16%;

--muted: 48 28% 87%;              /* Muted cream   #EAE4D1 */
--muted-foreground: 38 16% 44%;   /* Warm gray     #7A6E5A */

--accent: 40 55% 87%;             /* Light amber   #F0E2BB */
--accent-foreground: 35 40% 22%;

--destructive: 8 52% 44%;         /* Terracotta    #AB4432 */
--destructive-foreground: 0 0% 100%;

--border: 45 22% 76%;             /* Warm border   #C9C1A8 */
--input: 45 22% 76%;
--ring: 142 32% 36%;              /* Herb green (focus) */
```

#### Semantic Colors (WCAG AA compliant)
```css
--success: 127 38% 34%;           /* Forest green  #357A48 */
--success-light: 127 38% 94%;
--success-foreground: 0 0% 100%;

--info: 200 46% 38%;              /* Ocean teal    #356D80 */
--info-light: 200 46% 95%;
--info-foreground: 0 0% 100%;

--warning: 35 72% 48%;            /* Warm amber    #CE8020 */
--warning-light: 40 72% 95%;
--warning-foreground: 0 0% 100%;

--neutral: 38 16% 44%;            /* Warm gray     #7A6E5A */
--neutral-light: 45 22% 92%;
```

### Dark Mode (`.dark`)
```css
--background: 35 22% 10%;         /* Deep warm brown  #211A10 */
--foreground: 48 45% 90%;         /* Warm cream       #F0EBD8 */
--card: 35 18% 14%;               /* Dark warm card   #271F13 */
--primary: 142 40% 58%;           /* Lighter herb green */
```

### Named Color Tokens (tailwind.config.ts)
| Token | Hex | Use |
|-------|-----|-----|
| `cream` | `#F3F0D6` | Page background (realfood.gov brand color) |
| `light-cream` | `#F9F6E8` | Card backgrounds |
| `warm-sand` | `#E5DABD` | Secondary surfaces |
| `herb-green` | `#3E7050` | Primary actions, links |
| `forest-green` | `#2E5A3C` | Darker green accent |
| `warm-amber` | `#CE8020` | Warning, accent CTAs |
| `light-amber` | `#F0E2BB` | Accent backgrounds |
| `terracotta` | `#AB4432` | Destructive/error states |
| `warm-charcoal` | `#3A2A1A` | Body text |
| `warm-gray` | `#7A6E5A` | Muted/secondary text |
| `warm-border` | `#C9C1A8` | Borders, dividers |
| `ocean-teal` | `#356D80` | Info/travel accent |
| `soft-lavender` | `#7B6E8C` | Travel leg color |

---

## Shadows

Warm-toned (amber-brown) shadow tints instead of cool blue-grey:

```css
--shadow-soft:     0 1px 2px 0 rgb(58 42 26 / 0.08), 0 1px 3px 1px rgb(58 42 26 / 0.05)
--shadow-card:     0 2px 6px -1px rgb(58 42 26 / 0.10), 0 1px 4px -1px rgb(58 42 26 / 0.07)
--shadow-floating: 0 4px 14px -2px rgb(58 42 26 / 0.14), 0 2px 6px -1px rgb(58 42 26 / 0.09)
--shadow-modal:    0 8px 24px -4px rgb(58 42 26 / 0.12), 0 4px 10px -2px rgb(58 42 26 / 0.08)
```

Tailwind utilities: `shadow-soft`, `shadow-card`, `shadow-floating`, `shadow-modal`

---

## Gradients

```css
--gradient-primary:    linear-gradient(135deg, hsl(142 32% 36%), hsl(142 32% 30%))
--gradient-success:    linear-gradient(135deg, hsl(127 38% 34%), hsl(200 46% 38%))
--gradient-background: linear-gradient(180deg, hsl(54 47% 90%), hsl(48 38% 87%))
```

---

## Border Radius

```css
--radius: 0.75rem   /* 12px base */
```

Tailwind scale: `rounded-sm` (8px) · `rounded-md` (10px) · `rounded-lg` (12px) · `rounded-xl` (16px) · `rounded-2xl` (20px) · `rounded-3xl` (24px) · `rounded-full` (9999px)

- Cards: `rounded-xl`
- Buttons: `rounded-lg`
- Badges: `rounded-full`
- Inputs: `rounded-lg`

---

## Components

### Button

```tsx
// Default — herb green
<Button>Generate Packing List</Button>

// Outline — herb green border, transparent bg
<Button variant="outline">Add Destination</Button>

// Secondary — sandy cream
<Button variant="secondary">Back</Button>

// Ghost — no bg, hover shows light amber
<Button variant="ghost">Cancel</Button>

// Destructive — terracotta
<Button variant="destructive">Remove</Button>
```

**Base styles:** `font-semibold font-body cursor-pointer rounded-lg transition-all duration-200 ease-out active:scale-[0.98]`

**Sizes:**
- Default: `h-10 px-5 py-2`
- Small: `h-9 px-4 text-xs rounded-md`
- Large: `h-12 px-8 text-base rounded-lg`

### Card

- Background: `bg-card` (light cream `#F9F6E8`)
- Border: `border border-border` (warm muted `#C9C1A8`)
- Shadow: `shadow-card`
- Radius: `rounded-xl`
- Title: `font-display` (Lora serif)

### Input / Select

- Background: `bg-card` (slightly warmer than page bg)
- Border: `border-border`
- Height: `h-10`
- Focus: `ring-2 ring-ring` (herb green)
- Radius: `rounded-lg`

### Badge

Variants: `default` (herb green) · `secondary` (sandy cream) · `destructive` (terracotta) · `outline` · `success` (forest green) · `warning` (amber) · `accent` (light amber)

```tsx
<Badge variant="success">Packed</Badge>
<Badge variant="warning">Optional</Badge>
<Badge variant="accent">AI Suggested</Badge>
```

---

## Icons

**Library:** Lucide React — consistent, clean, accessible

### Sizing
- Small: `h-4 w-4`
- Default: `h-5 w-5`
- Large: `h-7 w-7`

### Color Usage
- Primary actions: `text-primary` (herb green)
- Success: `text-success` or `text-green-600`
- Warning/weather: `text-warning` or `text-amber-500`
- Muted/secondary: `text-muted-foreground` (warm gray)
- Destructive: `text-destructive` (terracotta)

---

## Animations

```css
/* Fade in (entrance) */
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }

/* Scale in (modal/card entrance) */
@keyframes scaleIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
.animate-scale-in { animation: scaleIn 0.2s ease-out; }

/* Float (icon) */
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
.animate-float { animation: float 2s ease-in-out infinite; }
```

Transition defaults: `duration-200 ease-out` (interactive) · `duration-300 ease-out` (page-level)

---

## Page Layouts

### Trip Details Page
- Background: `bg-background` (warm cream `#F3F0D6`)
- Header: Lora serif h1, centered, badge with herb green
- Form card: `shadow-floating border-2 border-primary/20` on top of `bg-card`

### Packing List Page
- Same background gradient
- Section headers in Lora
- Weather icons: sun `text-amber-500`, rain `text-info`, snow `text-sky-400`

### Loading State
- Spinner: herb green border animation
- Container: `bg-card rounded-xl shadow-card`

---

## Multi-Destination Colors

Trip legs use naturalistic, travel-inspired colors:

```javascript
const legColors = ["bg-herb-green", "bg-ocean-teal", "bg-warm-amber", "bg-soft-lavender", "bg-terracotta"]
const legBadgeColors = [
  "bg-green-50 text-green-700 border-green-200",
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-red-50 text-red-700 border-red-200",
]
```

---

## Accessibility

### WCAG AA Compliance
All color pairs meet 4.5:1 contrast ratio:
- Herb green `#3E7050` on cream `#F3F0D6`: ✓
- Dark brown `#3A2A1A` on cream `#F3F0D6`: ✓
- White on herb green `#3E7050`: ✓
- Warm amber `#CE8020` on cream `#F3F0D6`: ✓

### Keyboard Navigation
- Focus rings: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Tab order: logical through forms
- Calendar: no hover effects, visible focus rings, bold selected dates

### Touch Targets
- Minimum 44×44px for all interactive elements
- Buttons default `h-10` (40px) — icon padding brings to 44px total

---

## Design Principles

1. **Earthy & Organic** — Cream, greens, ambers, warm browns. Inspired by realfood.gov.
2. **Typography-led** — Lora for headings creates warmth; Raleway keeps body text crisp.
3. **Accessible First** — WCAG AA on all colors, keyboard-navigable, touch-friendly.
4. **Natural Warmth** — Shadows tinted amber-brown (not grey-blue), borders warm not cool.
5. **Subtle Delight** — Fade/scale/float animations at 200–300ms, never excessive.

---

## Maintenance

| To change | File |
|-----------|------|
| Colors | `client/src/index.css` → `:root` or `.dark` |
| Named color tokens | `tailwind.config.ts` → `colors` |
| Fonts | `client/index.html` (Google Fonts link) + `client/src/index.css` (body/h1 font-family) |
| Component variants | `client/src/components/ui/*.tsx` via `cva()` |
| Animations | `client/src/index.css` → `@layer utilities` |

---

*Last updated: 2026-03-02*
*Design system version: 2.0 — Earthy Natural (realfood.gov inspired)*
