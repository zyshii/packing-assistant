# Packing Assistant - Design Documentation

## Overview
A travel packing assistant application with a warm, inviting design aesthetic that helps users create personalized packing lists based on weather, activities, and trip details.

---

## Design System

### Color Palette

#### Light Mode
```css
--background: 45 67% 93%      /* Cream */
--foreground: 0 0% 10%        /* Charcoal */

/* Primary Colors */
--primary: 23 67% 64%         /* Softer Warm Orange */
--primary-foreground: 0 0% 100% /* White */

/* Secondary Colors */
--secondary: 38 59% 91%       /* Light Sand */
--secondary-foreground: 0 0% 10% /* Charcoal */

/* Surface Colors */
--card: 48 43% 88%            /* Warm Beige */
--popover: 48 43% 88%         /* Warm Beige */
--muted: 48 43% 88%           /* Warm Beige */
--muted-foreground: 0 0% 35%  /* Warm Gray */

/* Accent Colors */
--accent: 22 100% 75%         /* Soft Peach */
--accent-foreground: 0 0% 10% /* Charcoal */

/* Semantic Colors (WCAG AA Compliant) */
--success: 97 27% 58%         /* Softer Sage Green */
--success-light: 97 27% 95%   /* Very light sage green */
--success-foreground: 0 0% 100% /* White */

--info: 269 29% 62%           /* Softer Violet */
--info-light: 269 29% 96%     /* Very light violet */
--info-foreground: 0 0% 100%  /* White */

--warning: 17 55% 65%         /* Softer Burnt Orange */
--warning-light: 17 55% 95%   /* Very light orange */
--warning-foreground: 0 0% 100% /* White */

--neutral: 0 0% 35%           /* Warm Gray */
--neutral-light: 0 0% 95%     /* Very light gray */

--destructive: 357 39% 58%    /* Terracotta */
--destructive-foreground: 0 0% 100% /* White */
```

#### Dark Mode
```css
--background: 28 20% 8%       /* Warm dark charcoal */
--foreground: 45 30% 95%      /* Warm light cream */
--primary: 28 100% 60%        /* Lighter warm orange */
--accent: 14 100% 70%         /* Bright burnt orange */
```

### Typography

#### Font Settings
- Line height: 1.7 (body), 1.3 (headings)
- Letter spacing: -0.02em (headings)
- Font rendering: Optimized with antialiasing
- Font feature: Kerning enabled

#### Hierarchy
- **H1**: 4xl - 5xl, bold (700), tracking-tight
- **H2**: 2xl, bold (700)
- **Body**: base, normal line-height
- **Small**: sm, muted-foreground
- **Labels**: base, semibold (600)

### Spacing & Layout

#### Border Radius
- Base radius: `1.25rem` (20px) - Increased for organic feel
- Cards: `rounded-2xl`
- Buttons: `rounded-2xl` (standard), `rounded-xl` (small), `rounded-full` (badges)
- Inputs: Default rounded
- Calendar cells: `rounded-md`

#### Shadows
```css
--shadow-soft: 0 2px 8px 0 rgb(232 151 93 / 0.06), 0 1px 3px -1px rgb(232 151 93 / 0.04)
--shadow-card: 0 4px 12px -2px rgb(232 151 93 / 0.08), 0 2px 6px -2px rgb(232 151 93 / 0.06)
--shadow-modal: 0 20px 30px -8px rgb(232 151 93 / 0.10), 0 8px 12px -6px rgb(232 151 93 / 0.06)
--shadow-floating: 0 25px 50px -12px rgb(232 151 93 / 0.12)
```

#### Gradients
```css
--gradient-primary: linear-gradient(135deg, hsl(23 67% 64%), hsl(17 55% 65%))
--gradient-success: linear-gradient(135deg, hsl(97 27% 58%), hsl(269 29% 62%))
--gradient-background: linear-gradient(180deg, hsl(45 67% 96%), hsl(38 59% 94%))
```

---

## Components

### Button Variants

#### Default
- Background: Gradient from warm-orange to burnt-orange
- Text: White
- Shadow: Card shadow, floating on hover
- Hover: Scale [1.02], glow effect
- Transition: All 300ms ease-out

#### Destructive
- Background: Terracotta
- Hover: Terracotta/90
- Shadow: Card → Floating

#### Outline
- Border: 2px warm-orange
- Background: Transparent
- Text: Warm-orange
- Hover: Soft-peach background, burnt-orange text

#### Secondary
- Background: Light-sand
- Text: Charcoal
- Hover: Warm-beige
- Shadow: Soft → Card

#### Ghost
- Background: Transparent
- Hover: Removed per accessibility requirements
- Focus: Ring visible for keyboard navigation

#### Link
- Text: Warm-orange with underline-offset
- Hover: Underline, burnt-orange color

### Sizes
- **Default**: h-11 px-6 py-2.5
- **Small**: h-9 rounded-xl px-4 text-xs
- **Large**: h-14 rounded-2xl px-10 text-base
- **Icon**: h-11 w-11

### Card Component

#### Structure
```tsx
<Card className="shadow-floating border-2 border-warm-orange/20
                 bg-gradient-to-br from-white to-warm-beige/30">
  <CardHeader className="text-center pb-8">
    <CardTitle>Title with icon</CardTitle>
    <CardDescription>Descriptive text</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

#### Properties
- Background: Gradient from white to warm-beige/30
- Border: 2px solid warm-orange/20
- Shadow: Floating
- Hover: Scale 100% (maintains size), floating shadow
- Border radius: Rounded-2xl

### Input Components

#### Text Input
- Height: h-12 (48px)
- Padding: pl-10 (with icon)
- Text size: Base
- Focus: Ring-2 ring-primary ring-offset-2
- Border: Primary color on focus
- Transition: All 200ms

#### Select
- Trigger height: Default
- Content: Scrollable with max-height
- Items: Padding py-2, hover:bg-muted
- Icons: Integrated with mr-2 h-4 w-4

#### Calendar (Date Picker)
- **Accessibility Enhanced**:
  - No hover effects on dates
  - Increased opacity on navigation (70% fixed)
  - Bold headers for better contrast
  - Bold selected dates
  - Today: Bold + 2px primary border
  - Focus: Visible ring-2 for keyboard navigation

#### Checkbox
- Integrated with form items
- Paired with descriptive labels
- Visual feedback on check state

### Form Components

#### FormItem
- Spacing: space-y-3
- Full width in grid layouts

#### FormLabel
- Display: Flex with gap-2
- Font: Base, semibold (600)
- Color: Charcoal
- Icons: h-5 w-5 with color accent

#### FormMessage
- Size: Small
- Color: Destructive or muted-foreground

### Layout Components

#### Container
- Max-width: varies by page
  - Trip Details: max-w-4xl
  - Packing List: max-w-5xl
- Padding: p-4 (mobile), py-8 lg:py-12 (desktop)
- Spacing: space-y-8 lg:space-y-12

#### Grid Layouts
- Trip Types: grid-cols-1 md:grid-cols-3 gap-4
- Date Inputs: grid-cols-1 lg:grid-cols-2 gap-6

---

## Page Layouts

### Trip Details Page

#### Background
```css
background: linear-gradient(to-br, from-cream to-light-sand)
min-height: 100vh
padding: p-4
```

#### Header Section
- Center aligned
- Space-y-6
- Badge: Gradient warm-orange to burnt-orange, rounded-full
- H1: 4xl lg:5xl bold charcoal
- Description: lg warm-gray, max-w-2xl centered

#### Form Card
- Centered with max-w-4xl
- Shadow-floating with warm-orange border
- Gradient background
- Hover effects: subtle scale and shadow

### Packing List Page

#### Background
Same gradient as Trip Details

#### Layout Structure
1. Back Button (ghost variant)
2. Trip Header Component
3. Weather Error Alert (conditional)
4. Daily Clothing Suggestions Component

#### Loading States
- Spinner: Warm-orange gradient border
- Container: Gradient card with rounded-2xl
- Text: Warm-gray, large, medium weight

---

## Animations

### CSS Animations

#### Fade In
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

#### Bounce In
```css
@keyframes bounce-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.4s ease-out;
}
```

#### Scale In
```css
@keyframes scale-in {
  from { transform: scale(0.98); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-in {
  animation: scale-in 0.5s ease-out;
}
```

#### Float (for icons)
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-float {
  animation: float 2s ease-in-out infinite;
}
```

#### Pulse (for badges)
```css
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

#### Spin (for loaders)
```css
.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Transition Properties
- **Default**: `transition-all duration-300 ease-out`
- **Fast**: `transition-all duration-200`
- **Interactive elements**: 300ms ease-out

---

## Accessibility Features

### WCAG AA Compliance
- All color combinations meet 4.5:1 contrast ratio minimum
- Success: 97 27% 58% on background
- Warning: 17 55% 65% on background
- Info: 269 29% 62% on background

### Keyboard Navigation
- Focus rings: Visible on all interactive elements
- Ring style: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Tab order: Logical flow through forms

### Screen Reader Support
- Semantic HTML
- ARIA labels where needed
- Form field labels properly associated
- Error messages linked to inputs

### Calendar Accessibility (Enhanced)
- **No hover effects**: Eliminates dependency on hover states
- **High contrast headers**: text-foreground instead of muted
- **Bold text**: Selected dates and headers use font-semibold
- **Today indicator**: 2px border + bold for clear distinction
- **Keyboard navigation**: Full support with visible focus rings
- **Touch-friendly**: Works well on mobile without hover

---

## Icons

### Icon Library
**Lucide React** - Consistent, accessible icon system

### Common Icons
- **MapPin**: Destination fields (h-5 w-5 text-warm-orange)
- **CalendarIcon**: Date pickers (h-5 w-5 text-sage-green)
- **Luggage**: Luggage size (h-5 w-5 text-warm-orange)
- **Activity**: Trip types (h-5 w-5 text-burnt-orange)
- **Sparkles**: AI/Smart features (h-5 w-5, animate-pulse)
- **Plane**: Trip header (h-7 w-7 text-warm-orange animate-float)
- **ArrowLeft**: Navigation (h-5 w-5)
- **ArrowRight**: Forward actions (h-5 w-5)
- **AlertCircle**: Errors/warnings (h-5 w-5)
- **CheckCircle**: Success states (h-5 w-5)

### Icon Sizing
- Small: h-4 w-4
- Default: h-5 w-5
- Large: h-7 w-7

---

## Interactive States

### Hover States
- **Buttons**: Scale [1.02], enhanced shadow, glow effect
- **Cards**: Floating shadow, no scale (maintains position)
- **Form Items**: Border color change, ring appearance
- **Disabled**: Removed hover effects for accessibility

### Focus States
- **All interactive elements**: 2px ring with primary color
- **Ring offset**: 2px for clear separation
- **Visible on keyboard navigation**: focus-visible pseudo-class

### Active States
- **Buttons**: `active:animate-squish` (subtle press effect)
- **Checkboxes**: Filled state with primary color
- **Selected options**: Border-warm-orange, bg-soft-peach/50

### Loading States
- **Spinner**: Warm-orange gradient border animation
- **Disabled buttons**: Opacity 50%, pointer-events-none
- **Loading text**: Warm-gray, medium font weight

### Error States
- **Form errors**: Text-destructive, small size
- **Alert banners**: Border-2 border-terracotta/30, bg-terracotta/10
- **Validation messages**: Animate-fade-in, destructive color

---

## Responsive Design

### Breakpoints (Tailwind defaults)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly targets (minimum 44x44px)

### Layout Adjustments
- **Grid columns**: 1 → 2 → 3 across breakpoints
- **Typography**: 4xl → 5xl for headlines
- **Spacing**: space-y-8 → space-y-12 on large screens
- **Padding**: p-4 → py-8 lg:py-12 for containers

---

## Design Patterns

### Form Patterns
1. **Icon + Label**: Icons precede labels for visual hierarchy
2. **Inline validation**: Real-time feedback with animations
3. **Progressive disclosure**: Daily activities appear after trip types selected
4. **Contextual help**: Tooltips and helper text below fields

### Feedback Patterns
1. **Success messages**: Animate-bounce-in with success color
2. **Error alerts**: Destructive color with retry button
3. **Loading states**: Centered spinner with descriptive text
4. **Empty states**: Informative messages in gradient cards

### Navigation Patterns
1. **Back buttons**: Ghost variant with arrow icon
2. **Forward flow**: Prominent gradient buttons with arrow
3. **Breadcrumbs**: Implicit through back navigation

---

## Component States Reference

### Calendar Component
```tsx
// Navigation buttons
nav_button: opacity-70 (no hover)

// Day cells
day: No ghost variant hover effects
day: Focus ring-2 for keyboard navigation

// Selected state
day_selected: bg-primary, text-primary-foreground, font-semibold

// Today state
day_today: bg-accent, font-semibold, border-2 border-primary

// Header cells
head_cell: text-foreground (high contrast), font-semibold

// Outside days
day_outside: text-muted-foreground, opacity-50

// Disabled days
day_disabled: text-muted-foreground, opacity-50
```

### Button Component
```tsx
// Base styles (all variants)
- rounded-2xl
- transition-all duration-300 ease-out
- focus-visible:ring-2
- disabled:opacity-50

// Default variant
- bg-gradient-to-br from-warm-orange to-burnt-orange
- text-white
- hover:shadow-floating hover:glow-warm

// Outline variant
- border-2 border-warm-orange
- hover:bg-soft-peach (removed for accessibility on ghost)
```

---

## Design Principles

### 1. Warm & Inviting
- Cream and warm orange color palette
- Soft shadows with warm tones
- Organic rounded corners (1.25rem base)

### 2. Clear Hierarchy
- Bold headlines with tight tracking
- Icon-label pairs for scannability
- Generous whitespace

### 3. Accessible First
- WCAG AA compliance
- No hover-dependent interactions (calendar)
- Visible focus indicators
- High contrast text

### 4. Delightful Interactions
- Smooth transitions (300ms)
- Subtle animations (fade, bounce, scale)
- Glow effects on primary actions
- Floating icons

### 5. Mobile-Friendly
- Touch-friendly targets
- Responsive grid layouts
- Progressive enhancement
- Optimized typography scale

---

## File Structure

```
client/src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── button.tsx         # Button with variants
│   │   ├── card.tsx           # Card container
│   │   ├── calendar.tsx       # Date picker (accessibility enhanced)
│   │   ├── input.tsx          # Text input
│   │   ├── select.tsx         # Dropdown select
│   │   ├── checkbox.tsx       # Checkbox input
│   │   ├── form.tsx           # Form components
│   │   └── ...
│   ├── TripHeader.tsx         # Trip summary header
│   ├── DailyActivityInput.tsx # Activity selector
│   ├── SmartDailyClothingSuggestions.tsx # Packing suggestions
│   └── OnboardingHint.tsx     # First-time user hints
├── pages/
│   ├── TripDetails.tsx        # Main form page
│   ├── Index.tsx              # Packing list results
│   └── NotFound.tsx           # 404 page
├── index.css                  # Design system variables
└── lib/
    ├── utils.ts               # Utility functions (cn)
    ├── weatherApi.ts          # Weather data fetching
    └── aiRecommendationApi.ts # AI recommendations
```

---

## Usage Guidelines

### When to Use Animations
- **Entrance**: fade-in, scale-in, bounce-in for new content
- **Loading**: spin for async operations
- **Success**: bounce-in for confirmation messages
- **Continuous**: float, pulse for attention-grabbing elements

### When to Use Shadows
- **soft**: Subtle elevation (form items)
- **card**: Default cards and containers
- **floating**: Elevated states, important actions
- **modal**: Overlays and dialogs

### When to Use Gradients
- **Primary actions**: Buttons, CTAs
- **Backgrounds**: Page backgrounds, cards
- **Success states**: Confirmation banners

### Color Usage
- **Primary (warm-orange)**: Main actions, links, active states
- **Success (sage-green)**: Confirmations, positive feedback
- **Warning (burnt-orange)**: Cautions, important notices
- **Destructive (terracotta)**: Errors, destructive actions
- **Neutral (warm-gray)**: Secondary text, subtle elements

---

## Recent Design Changes

### Calendar Accessibility Improvements (2026-01-29)
1. **Removed all hover effects** from date picker
2. **Increased navigation button opacity** from 50% to 70%
3. **Enhanced today's date** with border-2 and font-semibold
4. **Improved header contrast** with text-foreground and font-semibold
5. **Strengthened selected dates** with font-semibold
6. **Maintained focus states** for keyboard navigation

**Rationale**: Improve accessibility for users with motor disabilities, touch device users, and keyboard navigation users.

---

## Design Tokens Summary

```css
/* Core Spacing */
--spacing-unit: 0.25rem (4px base)

/* Border Radius */
--radius: 1.25rem
--radius-sm: 0.75rem
--radius-md: 1rem
--radius-lg: 1.25rem
--radius-xl: 1.5rem
--radius-2xl: 2rem
--radius-full: 9999px

/* Typography Scale */
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-4xl: 2.25rem
--text-5xl: 3rem

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700

/* Transitions */
--transition-fast: 200ms
--transition-base: 300ms
--transition-slow: 500ms
--easing: ease-out
```

---

## Dependencies

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon system
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Conflicting class resolution

### Animation
- **Framer Motion**: Complex animations (optional)
- **tw-animate-css**: Tailwind animation utilities

---

## Maintenance Notes

1. **Color changes**: Update in `client/src/index.css` under `:root` or `.dark`
2. **Component variants**: Modify in respective component files using `cva()`
3. **Animations**: Add new keyframes in `index.css` under `@layer utilities`
4. **Accessibility**: Always test with keyboard navigation and screen readers
5. **Responsive**: Test at sm, md, lg breakpoints minimum

---

*Last updated: 2026-01-29*
*Design system version: 1.0*
