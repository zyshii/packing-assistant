# Packing Assistant - Design Specification

## Application Overview

**Packing Assistant** is a smart travel companion web application that helps users pack efficiently for trips by providing personalized packing lists and daily clothing suggestions based on destination weather, trip type, and planned activities.

---

## Design System

### Color Palette

| Color Name | Usage | HSL Value | Hex Value |
|------------|-------|-----------|-----------|
| Primary (Warm Orange) | Buttons, links, accents | HSL(23, 67%, 64%) | #E89B6B |
| Accent (Soft Peach) | Highlights, hover states | HSL(22, 100%, 75%) | #FFB380 |
| Success (Sage Green) | Success messages | HSL(97, 27%, 58%) | #A4B88E |
| Background (Cream) | Page background | HSL(45, 67%, 93%) | #F9F6F0 |
| Foreground (Charcoal) | Text | HSL(0, 0%, 10%) | #1A1A1A |
| Card Background | Card backgrounds | White with soft shadow | #FFFFFF |
| Muted Foreground | Secondary text | HSL(0, 0%, 45%) | #737373 |
| Border | Element borders | Warm orange variants | #E5E7EB |

### Typography

| Element | Font Size | Font Weight | Line Height |
|---------|-----------|-------------|-------------|
| Page Heading | 48px (3xl-4xl) | 700 (Bold) | 1.2 |
| Section Heading | 32px (2xl) | 700 (Bold) | 1.3 |
| Card Heading | 24px (xl) | 600 (Semibold) | 1.4 |
| Body Text | 16px (base) | 400 (Normal) | 1.5 |
| Label Text | 16px (base) | 600 (Semibold) | 1.4 |
| Small Text | 14px (sm) | 400 (Normal) | 1.4 |
| Badge Text | 12px (xs) | 500 (Medium) | 1.3 |

### Spacing & Layout

- **Border Radius**: 1.25rem (20px) for organic, friendly feel
- **Card Padding**: 2rem (32px) on desktop, 1.5rem (24px) on mobile
- **Section Spacing**: 3rem (48px) between major sections
- **Element Spacing**: 1rem (16px) between related elements
- **Container Max Width**: 1200px (centered)
- **Responsive Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Shadows

- **Card Shadow**: 0 4px 6px rgba(0, 0, 0, 0.07)
- **Floating Shadow**: 0 10px 15px rgba(0, 0, 0, 0.1)
- **Modal Shadow**: 0 20px 25px rgba(0, 0, 0, 0.15)

### Animations

- **Fade In**: 300ms opacity transition
- **Bounce In**: 400ms scale + opacity
- **Scale In**: 500ms scale animation
- **Hover**: 200ms all properties

---

## Screen Layouts

### 1. Trip Details Page (`/`)

**Purpose**: Collect trip information from the user

#### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                    HEADER SECTION                   │
│   [Suitcase Icon] Packing Assistant      [Beta]    │
│   Plan smarter, pack lighter, travel confidently   │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌───────────────────────────────────────────┐   │
│   │  💡 ONBOARDING HINT (Dismissible)        │   │
│   │  Welcome! Fill in your trip details...   │   │
│   │                                      [×]  │   │
│   └───────────────────────────────────────────┘   │
│                                                     │
│   ┌───────────────────────────────────────────┐   │
│   │           TRIP DETAILS FORM               │   │
│   │                                           │   │
│   │  Where are you going?                    │   │
│   │  [Destination Autocomplete Field]        │   │
│   │                                           │   │
│   │  When are you traveling?                 │   │
│   │  [Start Date]  →  [End Date]            │   │
│   │                                           │   │
│   │  What type of trip is this?              │   │
│   │  ☐ Business  ☐ Leisure  ☐ Adventure     │   │
│   │                                           │   │
│   │  What luggage will you use?              │   │
│   │  [Dropdown: Carry-on / Backpack / ...]   │   │
│   │                                           │   │
│   │  ┌─────────────────────────────────┐     │   │
│   │  │ DAILY ACTIVITIES (Accordion)    │     │   │
│   │  │                                 │     │   │
│   │  │ ▶ Day 1 - Jan 29, 2026         │     │   │
│   │  │   [Activity Search]              │     │   │
│   │  │   + Add activity                │     │   │
│   │  │                                 │     │   │
│   │  │ ▶ Day 2 - Jan 30, 2026         │     │   │
│   │  │                                 │     │   │
│   │  │ ▶ Day 3 - Jan 31, 2026         │     │   │
│   │  └─────────────────────────────────┘     │   │
│   │                                           │   │
│   │          [Generate Packing List]          │   │
│   │                                           │   │
│   └───────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Component Details

**1. Header Section**
- Logo: Suitcase icon (Lucide icon) + "Packing Assistant" text
- Badge: "Beta" badge in warm orange
- Tagline: "Plan smarter, pack lighter, travel confidently"
- Background: Gradient cream to light peach

**2. Onboarding Hint**
- Light blue/info background
- Icon: Info circle or lightbulb
- Dismissible with X button
- Appears only on first visit (localStorage tracking)
- Animation: Fade in on mount

**3. Destination Field**
- Label: "Where are you going?"
- Input type: Text with autocomplete popover
- Popover shows: Filtered list of 200+ destinations
- Icons: Search icon inside input, MapPin for destinations
- Validation: Minimum 2 characters, must match known destination
- Error state: Red border + error message below

**4. Date Range Picker**
- Label: "When are you traveling?"
- Two date inputs: Start date → End date
- Calendar popup on click
- Today indicator: Bold + border
- Constraints:
  - Max 16 days from today (weather API limit)
  - Max trip length: 14 days
  - End date must be after start date
- Accessibility: Keyboard navigation, no hover-only interactions
- Visual: Arrow icon between dates

**5. Trip Type Checkboxes**
- Label: "What type of trip is this?"
- Options: Business, Leisure, Adventure
- Layout: Horizontal row on desktop, vertical on mobile
- Validation: At least one must be selected
- Visual: Checkbox with label, warm orange accent when checked

**6. Luggage Size Dropdown**
- Label: "What luggage will you use?"
- Options:
  - Carry-on only
  - Backpack
  - Medium suitcase
  - Large suitcase
- Default: None selected
- Required field
- Icon: Luggage icon

**7. Daily Activity Input (Accordion)**
- One accordion item per day
- Header: "Day N - [Date]"
- Expanded state shows:
  - Activity search input
  - List of available activities (filtered by trip type)
  - Selected activities with remove button
  - "+ Add activity" button
- Activity lists:
  - **Business**: Meetings, Conferences, Networking, Client dinners, Site visits
  - **Leisure**: Sightseeing, Museums, Shopping, Dining out, Beach/pool, Photography, Theater/shows
  - **Adventure**: Hiking, Rock climbing, Water sports, Skiing/snowboarding, Camping, Mountain biking
- Visual: Badges for selected activities, search icon in input

**8. Submit Button**
- Text: "Generate Packing List"
- Style: Large, warm orange, full width on mobile
- States:
  - Default: Solid warm orange
  - Hover: Slightly darker, scale 1.02
  - Disabled: Gray, when form invalid
  - Loading: Spinner inside button
- Icon: Arrow right or sparkles

---

### 2. Packing List Page (`/packing-list`)

**Purpose**: Display personalized packing recommendations and daily clothing suggestions

#### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Trip Details                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌───────────────────────────────────────────┐   │
│   │           TRIP HEADER CARD                │   │
│   │                                           │   │
│   │  📍 Paris, France                        │   │
│   │  📅 Jan 29 - Feb 3, 2026 (5 days)       │   │
│   │                                           │   │
│   │  Trip Types:                             │   │
│   │  [Business] [Leisure]                    │   │
│   │                                           │   │
│   │  Activities:                             │   │
│   │  Sightseeing · Museums · Client dinners  │   │
│   └───────────────────────────────────────────┘   │
│                                                     │
│   ┌───────────────────────────────────────────┐   │
│   │     DAILY CLOTHING SUGGESTIONS            │   │
│   │                                           │   │
│   │  Day 1 - Thursday, Jan 29                │   │
│   │  🌤️ Partly cloudy · 12°C · UV Index 3   │   │
│   │                                           │   │
│   │  Morning: Business meeting               │   │
│   │  • Dress shirt                           │   │
│   │  • Dress pants                           │   │
│   │  • Blazer                                │   │
│   │  • Dress shoes                           │   │
│   │                                           │   │
│   │  Daytime: Museum visit                   │   │
│   │  • Comfortable top                       │   │
│   │  • Jeans                                 │   │
│   │  • Walking shoes                         │   │
│   │  • Light jacket                          │   │
│   │                                           │   │
│   │  Evening: Dining out                     │   │
│   │  • Smart casual outfit                   │   │
│   │                                           │   │
│   │  ─────────────────────────────────────   │   │
│   │                                           │   │
│   │  Day 2 - Friday, Jan 30                  │   │
│   │  ☀️ Sunny · 15°C · UV Index 4           │   │
│   │  ...                                     │   │
│   └───────────────────────────────────────────┘   │
│                                                     │
│   ┌───────────────────────────────────────────┐   │
│   │       OPTIMIZED PACKING LIST              │   │
│   │                                           │   │
│   │  👕 Tops (8 items)                       │   │
│   │  • Dress shirt × 3                       │   │
│   │  • T-shirt × 3                           │   │
│   │  • Sweater × 2                           │   │
│   │                                           │   │
│   │  👖 Bottoms (5 items)                    │   │
│   │  • Dress pants × 2                       │   │
│   │  • Jeans × 2                             │   │
│   │  • Shorts × 1                            │   │
│   │                                           │   │
│   │  🧥 Outerwear (3 items)                  │   │
│   │  • Blazer × 1                            │   │
│   │  • Light jacket × 1                      │   │
│   │  • Raincoat × 1                          │   │
│   │                                           │   │
│   │  👟 Footwear (3 pairs)                   │   │
│   │  • Dress shoes × 1                       │   │
│   │  • Walking shoes × 1                     │   │
│   │  • Casual shoes × 1                      │   │
│   │                                           │   │
│   │  🎒 Accessories (6 items)                │   │
│   │  • Sunglasses × 1                        │   │
│   │  • Belt × 1                              │   │
│   │  • Watch × 1                             │   │
│   │  • Umbrella × 1                          │   │
│   │  • Hat × 1                               │   │
│   │  • Scarf × 1                             │   │
│   │                                           │   │
│   │  🧴 Essentials (7 items)                 │   │
│   │  • Toiletries kit × 1                    │   │
│   │  • Medications × 1                       │   │
│   │  • Phone charger × 1                     │   │
│   │  • Travel adapter × 1                    │   │
│   │  • Documents folder × 1                  │   │
│   │  • Water bottle × 1                      │   │
│   │  • First aid kit × 1                     │   │
│   └───────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Component Details

**1. Back Button**
- Text: "← Back to Trip Details"
- Position: Top left
- Style: Text link with arrow, warm orange
- Hover: Underline
- Functionality: Returns to trip details page (preserves data)

**2. Trip Header Card**
- Background: Gradient card with warm orange border
- Layout: 2 columns on desktop, stacked on mobile
- Elements:
  - **Destination**: MapPin icon + location name
  - **Dates**: Calendar icon + date range + duration
  - **Trip Types**: Badges with Target icon
  - **Activities**: Comma-separated list or badges
- Typography: Large, bold headings
- Spacing: Generous padding, clear visual hierarchy

**3. Daily Clothing Suggestions**
- One section per day
- Day header:
  - Day number + day of week + date
  - Weather icon + conditions + temperature + UV index
  - Background: Light gradient matching weather
- Time periods:
  - Morning / Daytime / Evening
  - Activity name in bold
  - Bulleted list of clothing items
  - Icons for clothing types
- Divider between days
- Loading state: Spinner with "Analyzing weather and activities..."
- Error state: Alert banner with retry button

**4. Optimized Packing List**
- Section heading: "Optimized Packing List"
- Categories (collapsible or expanded):
  - 👕 Tops
  - 👖 Bottoms
  - 🧥 Outerwear
  - 👟 Footwear
  - 🎒 Accessories
  - 🧴 Essentials
- Each category:
  - Emoji + category name + item count badge
  - List of items with quantities
  - Format: "Item name × quantity"
- Hover effects: Slight scale, background highlight
- Color coding: Category badges in different colors

**5. Loading State**
- Centered spinner with gradient border
- Text: "Loading packing recommendations..."
- Background: Gradient card
- Animation: Smooth spin

**6. Error State (Weather API)**
- Alert banner, destructive color (terracotta)
- Icon: Alert triangle
- Text: Clear error message
- Action: "Retry" button
- Position: Above daily suggestions

**7. Empty State (No trip data)**
- Centered message
- Icon: Clipboard or suitcase
- Text: "No trip data found. Please fill in your trip details."
- Action: Button to go to trip details page
- Sample data option for demo

---

### 3. Not Found Page (`/404`)

**Purpose**: Handle invalid routes gracefully

#### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                    🔍 404                          │
│                                                     │
│              Page Not Found                        │
│                                                     │
│   The page you're looking for doesn't exist.      │
│                                                     │
│            [Go to Home Page]                       │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Component Details

- Centered layout
- Large 404 with search icon
- Heading: "Page Not Found"
- Description: Helpful message
- Button: "Go to Home Page" (links to `/`)
- Background: Cream with subtle pattern

---

## Component Library

### Buttons

**Primary Button**
- Background: Warm orange (#E89B6B)
- Text: White, semibold
- Padding: 0.75rem 1.5rem
- Border radius: 1.25rem
- Hover: Darker orange, scale 1.02
- Active: Pressed state, scale 0.98
- Disabled: Gray, cursor not-allowed

**Secondary Button**
- Background: Transparent
- Border: 2px warm orange
- Text: Warm orange, semibold
- Padding: 0.75rem 1.5rem
- Border radius: 1.25rem
- Hover: Light orange background

**Text Button**
- Background: None
- Text: Warm orange, underline on hover
- Padding: Minimal
- No border

### Form Inputs

**Text Input**
- Border: 1px light gray
- Border radius: 0.75rem
- Padding: 0.75rem 1rem
- Font size: 16px
- Focus: Warm orange border, ring effect
- Error: Red border
- Disabled: Gray background

**Select Dropdown**
- Similar to text input
- Dropdown icon: Chevron down
- Options: Hover highlight
- Selected: Checkmark

**Checkbox**
- Size: 1.25rem × 1.25rem
- Border: 2px warm orange
- Checked: Filled warm orange, white checkmark
- Border radius: 0.25rem
- Label: 16px, clickable

**Date Picker (Calendar)**
- Popover on input click
- Month/year navigation
- Today: Bold + border
- Selected: Warm orange background
- Hover: Light orange background
- Disabled dates: Gray, cursor not-allowed
- Keyboard navigation: Focus ring

### Cards

**Standard Card**
- Background: White
- Border radius: 1.25rem
- Shadow: Soft card shadow
- Padding: 2rem
- Responsive: Reduce padding on mobile

**Gradient Card**
- Background: Gradient (cream to light peach)
- Border: Warm orange accent
- Border radius: 1.25rem
- Shadow: Floating shadow
- Use for important sections

**Info Card**
- Background: Light blue
- Border: Blue accent
- Icon: Info circle
- Dismissible: X button top right

### Badges

- Border radius: 9999px (pill shape)
- Padding: 0.25rem 0.75rem
- Font size: 12px
- Variants:
  - **Default**: Gray background
  - **Primary**: Warm orange
  - **Success**: Sage green
  - **Info**: Light blue
  - **Warning**: Yellow

### Icons

- Library: Lucide React
- Size: 1rem to 1.5rem (context dependent)
- Color: Matches text or custom
- Common icons:
  - MapPin (destination)
  - Calendar (dates)
  - Target (trip type)
  - Suitcase (luggage)
  - Cloud, Sun, CloudRain (weather)
  - ArrowRight (navigation)
  - X (close)
  - Info (information)
  - Plus (add)
  - Trash (remove)

### Accordions

- Header: Button with chevron icon
- Collapsed: Chevron right
- Expanded: Chevron down
- Border: Bottom border between items
- Animation: Smooth expand/collapse (200ms)
- Content padding: 1rem

### Alerts

- Border left: 4px accent color
- Padding: 1rem
- Border radius: 0.5rem
- Icon: Left aligned
- Variants:
  - **Info**: Blue
  - **Success**: Green
  - **Warning**: Yellow
  - **Error**: Red
- Dismissible: Optional X button

---

## User Flows

### Flow 1: Creating a Packing List

```
START
  ↓
User lands on Trip Details page (/)
  ↓
User sees onboarding hint (first time)
  ↓
User fills in destination (autocomplete)
  ↓
User selects start and end dates
  ↓
User selects trip type(s)
  ↓
User selects luggage size
  ↓
User expands daily activity accordions
  ↓
User selects activities for each day
  ↓
User clicks "Generate Packing List"
  ↓
Form validation runs
  ├─ Valid: Continue
  └─ Invalid: Show error messages, stop
  ↓
Data saved to localStorage
  ↓
Navigate to /packing-list
  ↓
Trip header displays
  ↓
Weather API called
  ├─ Success: Display weather
  └─ Error: Show error alert with retry
  ↓
Daily recommendations API called
  ↓
Packing optimization API called
  ↓
Display daily clothing suggestions
  ↓
Display optimized packing list
  ↓
User reviews recommendations
  ↓
User can go back to modify trip details
  ↓
END
```

### Flow 2: Modifying Trip Details

```
START (from Packing List page)
  ↓
User clicks "Back to Trip Details"
  ↓
Navigate to /
  ↓
Form pre-filled with saved data
  ↓
User modifies fields
  ↓
User clicks "Generate Packing List"
  ↓
Updated data saved
  ↓
Navigate to /packing-list
  ↓
New recommendations generated
  ↓
END
```

### Flow 3: First Time User (Onboarding)

```
START
  ↓
User visits site for first time
  ↓
Check localStorage for 'onboarding-dismissed'
  ├─ Not found: Show onboarding hint
  └─ Found: Hide hint
  ↓
User reads hint
  ↓
User clicks X to dismiss
  ↓
Set 'onboarding-dismissed' in localStorage
  ↓
Hint fades out
  ↓
User proceeds with form
  ↓
END
```

### Flow 4: Weather API Error Handling

```
START (on Packing List page)
  ↓
Weather API called
  ↓
API returns error
  ↓
Display error alert
  ↓
User sees: "Unable to fetch weather data"
  ↓
User clicks "Retry" button
  ↓
Weather API called again
  ├─ Success: Display weather, hide alert
  └─ Error: Show alert again
  ↓
Alternative: Use sample data
  ↓
END
```

---

## Responsive Design

### Mobile (< 640px)

- Single column layout
- Full width cards
- Reduced padding (1rem)
- Stacked form fields
- Full width buttons
- Accordion default collapsed
- Smaller font sizes
- Touch-friendly targets (min 44px)

### Tablet (640px - 1024px)

- 2 column layout where appropriate
- Medium padding (1.5rem)
- Side-by-side date pickers
- Larger touch targets
- Optimized spacing

### Desktop (> 1024px)

- Max width container (1200px)
- 2-3 column layouts
- Full padding (2rem)
- Hover effects enabled
- Larger typography
- Side-by-side comparisons

---

## Accessibility Requirements

### WCAG AA Compliance

- **Color Contrast**: All text has minimum 4.5:1 contrast ratio
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Focus Indicators**: Visible focus rings on all focusable elements
- **Screen Readers**: Semantic HTML with ARIA labels where needed
- **Alternative Text**: All icons have aria-labels
- **Form Labels**: All inputs have associated labels
- **Error Messages**: Clear, descriptive error messages

### Specific Enhancements

**Calendar Component**:
- No hover-only interactions
- Bold text for headers and selected dates
- Focus-visible rings for keyboard navigation
- Today indicator uses multiple signals (bold + border)
- Touch-friendly on mobile

**Form Validation**:
- Real-time validation feedback
- Error messages below fields
- Success indicators
- Required field markers

**Navigation**:
- Logical tab order
- Skip to content link (optional)
- Breadcrumb navigation (optional)

---

## Interactions & Animations

### Micro-interactions

1. **Button Hover**
   - Scale: 1.02
   - Transition: 200ms
   - Shadow increase

2. **Card Hover**
   - Shadow increase
   - Slight lift effect
   - Border glow

3. **Input Focus**
   - Border color change to warm orange
   - Ring effect (outline)
   - Smooth transition (200ms)

4. **Checkbox Toggle**
   - Checkmark fade in
   - Background color transition
   - 150ms duration

5. **Accordion Expand**
   - Chevron rotation (90deg)
   - Content slide down
   - 200ms ease-out

### Page Transitions

- No hard page reloads (SPA)
- Fade in content (300ms)
- Loading states with spinners
- Skeleton screens (optional enhancement)

### Loading States

1. **Form Submit**
   - Button shows spinner
   - Disabled state
   - "Generating..." text

2. **API Data**
   - Spinner in content area
   - Gradient border animation
   - "Loading packing recommendations..." text

3. **Weather Data**
   - Skeleton placeholders for weather icons
   - Fade in when loaded

### Error States

1. **Form Validation**
   - Red border on field
   - Error message fade in below field
   - Shake animation (optional)

2. **API Error**
   - Alert banner slide down
   - Icon + message + retry button
   - Auto-dismiss (optional, 5s)

3. **Network Error**
   - Full screen message (if critical)
   - Retry button
   - Offline indicator

---

## API Integration Points

### 1. Weather API (`/api/weather`)

**Request**:
```
GET /api/weather?location=Paris,France&startDate=2026-01-29&endDate=2026-02-03
```

**Response**:
```json
{
  "daily": [
    {
      "date": "2026-01-29",
      "temperature": 12,
      "weatherCode": 3,
      "precipitation": 20,
      "uvIndex": 3
    },
    ...
  ]
}
```

**UI Integration**:
- Called on Packing List page mount
- Displayed in daily suggestions section
- Weather icons based on weatherCode
- Temperature in Celsius
- Error handling with retry option

### 2. Daily Recommendations API (`/api/recommendations/daily`)

**Request**:
```
POST /api/recommendations/daily
{
  "destination": "Paris, France",
  "startDate": "2026-01-29",
  "endDate": "2026-02-03",
  "tripTypes": ["business", "leisure"],
  "luggageSize": "carry-on",
  "dailyActivities": {
    "2026-01-29": ["Meetings", "Dining out"],
    "2026-01-30": ["Sightseeing", "Museums"]
  }
}
```

**Response**:
```json
{
  "days": [
    {
      "date": "2026-01-29",
      "morning": {
        "activity": "Meetings",
        "clothing": ["Dress shirt", "Dress pants", "Blazer"]
      },
      "daytime": {
        "activity": "Sightseeing",
        "clothing": ["T-shirt", "Jeans", "Walking shoes"]
      },
      "evening": {
        "activity": "Dining out",
        "clothing": ["Smart casual outfit"]
      }
    },
    ...
  ]
}
```

**UI Integration**:
- Called after weather data loads
- Displayed in daily suggestions cards
- Grouped by time of day
- Activity names in bold

### 3. Packing Optimization API (`/api/recommendations/packing`)

**Request**:
```
POST /api/recommendations/packing
{
  "destination": "Paris, France",
  "startDate": "2026-01-29",
  "endDate": "2026-02-03",
  "tripTypes": ["business", "leisure"],
  "luggageSize": "carry-on",
  "dailyActivities": { ... }
}
```

**Response**:
```json
{
  "categories": {
    "tops": [
      { "item": "Dress shirt", "quantity": 3 },
      { "item": "T-shirt", "quantity": 3 }
    ],
    "bottoms": [
      { "item": "Dress pants", "quantity": 2 },
      { "item": "Jeans", "quantity": 2 }
    ],
    ...
  }
}
```

**UI Integration**:
- Called simultaneously with daily recommendations
- Displayed in categorized packing list
- Shows quantities clearly
- Category icons and badges

---

## State Management

### localStorage

**Keys**:
- `trip-data`: Saved trip form data
- `onboarding-dismissed`: Boolean for hint visibility

**trip-data Structure**:
```json
{
  "destination": "Paris, France",
  "startDate": "2026-01-29",
  "endDate": "2026-02-03",
  "tripTypes": ["business", "leisure"],
  "luggageSize": "carry-on",
  "dailyActivities": {
    "2026-01-29": ["Meetings", "Dining out"],
    "2026-01-30": ["Sightseeing", "Museums"]
  }
}
```

### React Query Cache

- Weather data: 15 minute cache
- Recommendations: No cache (regenerate on request)
- Retry logic: 3 attempts with exponential backoff

### Form State (React Hook Form)

- Real-time validation
- Touched field tracking
- Error message management
- Dirty state tracking
- Submit state management

---

## Design Variations & Alternatives

### Alternative Layout: Sidebar Navigation

```
┌──────────┬──────────────────────────────────┐
│          │                                  │
│  TRIP    │        DAILY SUGGESTIONS         │
│  SUMMARY │                                  │
│          │  Day 1 - Thursday, Jan 29        │
│  Paris   │  🌤️ 12°C                        │
│  Jan 29  │                                  │
│  5 days  │  Morning: Meetings               │
│          │  • Dress shirt                   │
│  Types:  │  • Dress pants                   │
│  Busines │                                  │
│  Leisure │  Daytime: Sightseeing            │
│          │  • T-shirt                       │
│  [Edit]  │  • Jeans                         │
│          │                                  │
│          │  ────────────────────────         │
│          │                                  │
│          │  Day 2 - Friday, Jan 30          │
│          │                                  │
├──────────┤                                  │
│  PACKING │                                  │
│  LIST    │                                  │
│          │                                  │
│  Tops    │                                  │
│  Bottoms │                                  │
│  Outerwea│                                  │
│  ...     │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Alternative: Wizard/Stepper Interface

```
Step 1: Destination ➜ Step 2: Dates ➜ Step 3: Trip Type ➜ Step 4: Activities ➜ Results

[Progress bar: ████████░░░░░░░░]

Step 2 of 4: When are you traveling?

[Start Date]  →  [End Date]

[Back]  [Next]
```

### Alternative: Card-based Activity Selection

Instead of accordion, use card grid:

```
┌─────────┐ ┌─────────┐ ┌─────────┐
│  🏢     │ │  🎨     │ │  🍽️     │
│Meetings │ │Museums  │ │Dining   │
│         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘
```

---

## Future Enhancements

1. **Dark Mode**
   - Toggle switch in header
   - Dark color palette
   - Persistent preference

2. **Save Multiple Trips**
   - Trip history
   - Edit saved trips
   - Compare trips

3. **Export Packing List**
   - Print-friendly version
   - PDF export
   - Share link

4. **Packing Checklist**
   - Interactive checkboxes
   - Progress tracking
   - "Mark all packed"

5. **Weather Alerts**
   - Extreme weather warnings
   - Packing adjustments
   - Notifications

6. **Collaborative Planning**
   - Share trip with others
   - Co-edit activities
   - Split packing list

7. **Smart Suggestions**
   - Learn from user preferences
   - Personalized recommendations
   - "Pack lighter" suggestions

8. **Integrations**
   - Calendar sync
   - Flight booking integration
   - Hotel information

---

## Technical Implementation Notes

### Tech Stack
- **Frontend**: React 18.3.1, TypeScript, Vite
- **Styling**: Tailwind CSS 3.4.17
- **Components**: Radix UI (accessible primitives)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: Wouter
- **Icons**: Lucide React
- **Animations**: Framer Motion (optional)
- **Date Handling**: date-fns

### File Structure
```
/client
  /src
    /pages
      - TripDetails.tsx
      - Index.tsx (Packing List)
      - NotFound.tsx
    /components
      - TripHeader.tsx
      - SmartDailyClothingSuggestions.tsx
      - DailyActivityInput.tsx
      - OnboardingHint.tsx
      /ui (40+ components)
        - button.tsx
        - input.tsx
        - select.tsx
        - calendar.tsx
        - card.tsx
        - badge.tsx
        - accordion.tsx
        - alert.tsx
        - ...
    - App.tsx
    - index.css (design tokens)
```

### Performance Optimizations
- Code splitting by route
- Lazy loading components
- React Query caching
- Debounced autocomplete
- Memoized expensive calculations
- Optimized re-renders

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ required
- CSS Grid and Flexbox
- No IE11 support

---

## Conclusion

This design specification provides a comprehensive blueprint for the Packing Assistant application, covering all UI screens, components, user flows, and technical considerations. The design prioritizes accessibility, responsiveness, and user-friendly interactions to create a delightful travel planning experience.

**Key Design Principles**:
1. **Friendly & Approachable**: Warm color palette, organic shapes, friendly microcopy
2. **Accessible by Default**: WCAG AA compliance, keyboard navigation, screen reader support
3. **Mobile-First**: Responsive design that works beautifully on all devices
4. **Performance-Oriented**: Fast load times, smooth animations, efficient API usage
5. **User-Centric**: Clear feedback, helpful error messages, intuitive flows

This specification can be used to create mockups in Pencil Project, Figma, or any other design tool, and serves as a development guide for implementation.
