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
- **H1 (landing)**: `text-[36px] font-bold font-display text-[#3a2a1a]`
- **H2 (card title)**: `text-[20px] font-bold font-display text-[#3a2a1a]`
- **H3 (section)**: `text-lg font-semibold font-display`
- **Body**: `font-body text-[15px]` (Raleway, line-height 1.6)
- **Label**: `font-body font-semibold text-[13px] text-[#7a6e5a]`
- **Small / Badge text**: `font-body font-semibold text-[12px]`
- **Caption**: `font-body text-[12px] leading-[1.5]`

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

**Form inputs** (destination, activity search):
- Background: `bg-[#f9f6e8]` (card cream — slightly lighter than page)
- Border: none (`border-0`)
- Height: `h-[42px]`
- Focus: `focus-visible:ring-2 focus-visible:ring-[#3e7050] focus-visible:ring-offset-0`
- Radius: `rounded-lg`
- Emoji prefix (🔍 for destination/search) at `left-[14px]`, `pl-[38px]`

**Date picker button** (custom trigger):
- Background: `bg-[#f9f6e8]`, height `h-[42px]`, `px-[14px]`
- Prefix: 📅 emoji in `text-[#a09282]`
- Value text: `text-[#3a2a1a]` / placeholder: `text-[#a09282]`

**Select dropdown** (luggage):
- Background: `bg-[#f3f0d6]` (page cream)
- Border: none, height `h-[42px]`
- Selected: 🧳 emoji prefix in `text-[#3e7050]`

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

### Onboarding Hint

Dismissible hint banner (stored via `localStorage`):
- Background: `bg-[#f0e2bb]` (light amber)
- Icon box: `bg-[#ce8020] size-9 rounded-lg` with 💡 emoji
- Title: `font-body font-bold text-[13px] text-[#3a2a1a]`
- Description: `font-body text-[12px] leading-[1.5] text-[#7a6e5a]`
- Dismiss: `×` text button, `text-[#a09282]`

### Pill Toggle Buttons (Trip Type)

Used for multi-select options instead of checkbox cards:
- **Selected**: `bg-[#3e7050] text-white` — emoji prefix shown
- **Unselected**: `bg-[#f3f0d6] text-[#7a6e5a] hover:bg-[#e8e0c5]`
- Sizing: `px-3.5 py-2 rounded-lg font-body font-semibold text-[13px]`

### Days Pill

Shows duration for each trip leg:
- `bg-[#f0e2bb] px-2.5 py-1 rounded-full`
- ⌛️ emoji + `font-body font-semibold text-[12px] text-[#7a6e5a]`

### Dividers

Section dividers within cards:
- `bg-[#c9c1a8] h-px` (warm-border, 1px)

### Info Alert

API limit / info notice:
- `bg-[#eaf3fb] rounded-xl px-3.5 py-2.5`
- ℹ️ emoji prefix, `text-[12px] text-[#356d80]`

### Daily Activity Accordion

Each trip day is a collapsible accordion row:
- **Expanded header**: green circle badge `bg-[#3e7050] size-7`, white 📅 emoji, count badge `bg-[#3e7050] rounded-full`
- **Collapsed header**: muted amber circle `bg-[#eae4d1] size-7`, muted 📅 emoji `text-[#a09282]`, chevron right
- **Expanded body**: `bg-[#f3f0d6] px-5 pb-4 pt-2.5 rounded-lg`
- **Activity pills**: `bg-[#3e7050] text-white px-3 py-1.5 rounded-full` with `×` remove button
- **Search input**: `bg-[#f9f6e8] h-[38px] px-3 rounded-lg` with 🔍 emoji prefix

---

## Page Layouts

### Trip Details Page (Landing, v2 — Figma redesign 2026-03-02)

Container: `bg-[#f3f0d6] min-h-screen py-10` / `max-w-[960px] mx-auto flex flex-col gap-6 px-4`

**Header section** (`flex flex-col items-center gap-2.5`):
- "✨ Smart Packing" badge: `bg-[#3e7050] text-white px-3.5 py-[5px] rounded-full`
- H1: `font-display font-bold text-[36px] text-[#3a2a1a]`
- Subtitle: `font-body text-[15px] leading-[1.6] text-[#7a6e5a] max-w-[600px] text-center`

**Main form card**: `bg-[#f9f6e8] flex flex-col gap-5 p-7 rounded-2xl`
- Card section header: 🗺️ emoji + `font-display font-bold text-[20px] text-[#3a2a1a]`
- Dividers between sections: `bg-[#c9c1a8] h-px`

**Leg cards**: `bg-[#f3f0d6] flex flex-col gap-3 px-5 py-4 rounded-xl`
- Numbered badge: `bg-[#3e7050] size-7 rounded-full text-white font-bold text-[13px]`

**Bottom row** (2-column flex): Luggage select + Trip type pills

**Daily Activities section**: embedded below divider, no separate card background

### Packing List Page (v2 — Figma redesign 2026-03-02)

Container: `bg-[#f3f0d6] min-h-screen py-8` / `max-w-[1140px] mx-auto flex flex-col gap-7 px-6`

**Back button** (top-left, pill style):
- `bg-[#f9f6e8] flex items-center gap-1.5 px-[14px] py-2 rounded-[8px]`
- ArrowLeft icon + `font-body font-semibold text-[13px] text-[#7a6e5a]`

**Trip Header card** (full width, `bg-[#f9f6e8] rounded-[16px] p-6 flex flex-col gap-4`):
- Top row: 📍 emoji + "Trip Overview" (Lora Bold 22px) + dates + total days + trip type pills
- Trip type badges: `bg-[#3e7050] flex items-center gap-1 px-3 py-[5px] rounded-full text-white text-[12px]` with emoji prefix
- Legs row: numbered colored pills (`bg-[rgba(62,112,80,0.13)]` leg 1, `bg-[rgba(206,128,32,0.13)]` leg 2, `bg-[rgba(123,110,140,0.13)]` leg 3) with matching dot badge and ArrowRight between legs
- Leg dot badge: `size-5 rounded-[10px]` in leg accent color, white bold text
- Activities row: `"Activities:"` label in `text-[#a09282]` + `bg-[#eae4d1] px-[10px] py-1 rounded-full` pills

**Main columns** (`flex gap-6 items-start`):

*Left column* — Packing List (`w-[400px] shrink-0 flex flex-col gap-4`):
- Column header: "Packing List" (Lora Bold 18px) + luggage name right-aligned (`text-[#a09282] text-[12px]`)
- Category cards: `bg-[#f9f6e8] rounded-[12px] overflow-hidden`
  - Header button: `flex items-center gap-[10px] px-4 py-[14px] w-full`
    - Icon square: `size-8 rounded-[8px]` with emoji, bg colors per category (see below)
    - Category name: Raleway Bold 14px
    - Item count: `text-[#a09282] text-[12px]`
    - ChevronDown icon, rotates `-rotate-90` when collapsed
  - Item rows (when expanded): `flex items-center gap-[10px] px-4 py-[10px]`
    - Checkbox: `size-[18px] rounded-[4px]`, `bg-[#3e7050]` + white Check icon when packed, `bg-[#eae4d1]` when unpacked
    - Item text: Raleway Regular 13px, `text-[#3a2a1a]` unpacked / `text-[#a09282] line-through` packed
    - Quantity shown inline: `{item} × {qty}` format
- Packing tips card: `bg-[#fffbeb] rounded-[12px] p-4 border border-[#f0e2bb]`, amber bullet list

**Category icon bg colors:**
| Category | Icon bg | Example |
|----------|---------|---------|
| Tops | `bg-[#dbeafe]` | 👕 |
| Bottoms | `bg-[#dcf5e7]` | 👖 |
| Outerwear | `bg-[#ede9fe]` | 🧥 |
| Footwear | `bg-[#fef3c7]` | 👞 |
| Accessories | `bg-[#fce7f3]` | ✨ |
| Essentials | `bg-[#ccfbf1]` | 🎒 |

*Right column* — Daily Clothing Timeline (`flex-1 bg-[#f9f6e8] rounded-[16px] overflow-hidden`):
- Header: `flex items-center gap-[10px] px-6 py-[18px]` — 📅 emoji + "Daily Clothing Timeline" (Lora Bold 18px) + destination subtitle
- Divider: `bg-[#c9c1a8] h-px`
- Body: `px-6 py-4 flex flex-col`
- Shows 2 days by default; "X more days" expand button: `bg-[#eae4d1] rounded-[10px] px-3 py-[10px]` with ChevronDown

**Timeline day row** (`flex gap-4`):
- Track column (`w-6 shrink-0 flex flex-col items-center`):
  - Dot: `size-[14px] rounded-full mt-[15px]` — leg-colored (`bg-[#3e7050]` leg 1, `bg-[#ce8020]` leg 2, `bg-[#7B6E8C]` leg 3)
  - Stem: `w-[2px] flex-1 opacity-30` in matching leg color
- Content (`flex-1 pb-6`):
  - Day header: "Day N  ·  {date}" (Raleway Bold 14px) + weather pill
  - Weather pill: `bg-[#eae4d1] flex items-center gap-1 px-[10px] py-1 rounded-full` — emoji + `{temp}°F · {condition}` in `text-[#7a6e5a] text-[12px]`
  - Three sub-cards (`grid grid-cols-3 gap-2`, each `rounded-[10px] p-[10px] flex flex-col gap-1.5`):
    - Morning: `bg-[#eaf3fb]`, label `text-[#356d80] font-bold text-[10px]`
    - Daytime: `bg-[#fffbeb]`, label `text-[#ce8020] font-bold text-[10px]`
    - Evening: `bg-[#dbeafe]`, label `text-[#1d4ed8] font-bold text-[10px]`
    - Body text: Raleway Regular 11px `text-[#7a6e5a] leading-[1.6]`

### Loading State
- Spinner: herb green border animation
- Container: `bg-card rounded-xl shadow-card`

---

## Multi-Destination Colors

Trip legs in the activity input use small colored circles (no background tinting on leg cards):

```javascript
const legColors = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"
]
```

> Note: In v2 (Figma redesign), all trip leg cards share the same `bg-[#f3f0d6]` cream background. The numbered green badge (`bg-[#3e7050]`) in each leg header is the primary visual differentiator.

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

*Last updated: 2026-03-02 (v2.2 — Figma result page redesign)*
*Design system version: 2.2 — Earthy Natural (realfood.gov inspired)*
