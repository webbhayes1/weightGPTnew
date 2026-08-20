# WeightGPT Design System

**Version:** 1.0
**Date:** November 6, 2025
**Status:** FINAL
**Aesthetic:** Liquid glass minimalism meets performance-driven energy

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Visual Language](#visual-language)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [Iconography](#iconography)
8. [Motion & Animation](#motion--animation)
9. [Glassmorphism & Effects](#glassmorphism--effects)
10. [Platform Implementation](#platform-implementation)

---

## Design Philosophy

### Core Aesthetic

**Vision:** Sleek, futuristic iOS-style health and fitness app that blends liquid glass minimalism with performance-driven energy. Like **Apple Health meets BMW M performance**, wrapped in next-gen iOS glassmorphism.

**Emotional Tone:**
- **Premium** — Every surface feels crafted, intentional, and high-quality
- **Clean** — White dominant with strategic color that means something
- **Motivating** — Emotionally charged through color, motion, and feedback
- **Fresh** — Modern iOS 18 design language with translucent glass surfaces

**Design Principles:**

1. **Liquid Glass Minimalism**
   - Translucent surfaces with natural light diffusion
   - Soft depth through inner shadows and layering
   - Frosted glass backgrounds (blur: 20px)
   - Air gap feeling between floating elements

2. **Performance-Driven Energy**
   - BMW M-inspired gradients (#4C9EEB → #EA4E4E)
   - Kinetic motion reflections
   - Angular light gradients for intensity
   - Glow pulse around active metrics

3. **Controlled Vibrancy**
   - White dominance (#FFFFFF base)
   - Strong emotional contrast: Nutrition (warm vitality) vs Workout (cool precision)
   - Color only where it communicates meaning
   - Gradient energy on action surfaces

4. **Breathable Data-Rich**
   - Modular grid layouts
   - Generous whitespace (air gaps)
   - Information hierarchy through depth, not clutter
   - Every screen feels like a wellness cockpit

---

## Visual Language

### Material System

**Glass Surfaces:**
```
Frosted Glass Card:
- Background: rgba(255, 255, 255, 0.7)
- Backdrop filter: blur(20px)
- Border: 1px solid rgba(255, 255, 255, 0.3)
- Shadow: 0 4px 24px rgba(0, 0, 0, 0.05)
- Border radius: 20px
```

**Elevation Layers:**
```
Layer 0 (Base):        Page background, #FAF9F7 or #FFFFFF
Layer 1 (Floating):    Cards, frosted glass, 4-6px elevation
Layer 2 (Active):      Pressed states, 2-3px elevation
Layer 3 (Modal):       Overlays, 12-24px elevation
Layer 4 (FAB):         Primary actions, 8px elevation + glow
```

**Depth Technique:**
- Inner shadows for recessed feeling (inset 0 2px 8px rgba(0,0,0,0.06))
- Outer shadows for floating feeling (0 4px 24px rgba(0,0,0,0.05))
- Light gloss overlays for liquid metric feel (linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%))

### Motion Philosophy

**Behavioral Feel:** Everything moves like **mercury under glass** — smooth, reactive, and tactile.

**Motion Archetypes:**
- **Liquid Fill** — Gradients sweep like water (ring fills, progress bars)
- **Glass Slide** — Elements glide with momentum and slight overshoot
- **Light Bloom** — Active states glow and pulse with soft light
- **Kinetic Reflection** — Motion leaves trailing light reflections

---

## Color System

### Nutrition Theme (Warm Energy)

**Primary Palette:**
```
Orange          #FFB347    Primary highlight, calorie accent
Orange Light    #FFD27D    Gradient start, hover states
Pink            #FCA7C5    Secondary glow, UI warmth, gentle femininity
Green           #81E296    Protein ring, success states, completion
Yellow          #FFE082    Energy accent, balance, carb highlights
```

**Gradients:**
```
Primary Button:    linear-gradient(135deg, #FFD27D 0%, #FFB347 100%)
Ring Glow:         linear-gradient(180deg, #FFB347 0%, #FCA7C5 100%)
Warm Bloom:        radial-gradient(circle, rgba(255,179,71,0.3) 0%, transparent 70%)
```

**Usage:**
- **Calorie Ring:** Orange (#FFB347) with inner shadow + light gloss
- **Protein Ring:** Green (#81E296) with gradient fill
- **Carbs Ring:** Yellow (#FFE082) with soft glow
- **Fat Ring:** Pink (#FCA7C5) with liquid fill
- **CTAs:** Warm gradient (#FFD27D → #FFB347) + 12px orange-pink bloom on hover
- **Cards:** Frosted white glass with warm accent borders

**Emotional Tone:** Vitality, warmth, approachability, organic energy (like sunlight through a kitchen window)

---

### Workout Theme (Cool Precision)

**Primary Palette:**
```
Navy            #1F3A5F    Foundation color, headers, primary text
Light Blue      #4C9EEB    Activity highlight, cardio accent, CTAs
Red             #EA4E4E    Intensity, performance feedback, calorie burn
White           #FFFFFF    Contrast surface, card backgrounds
Steel Gray      #EDEDED    Separators, neutral zones, dividers
```

**Gradients:**
```
BMW M Gradient:       linear-gradient(135deg, #4C9EEB 0%, #EA4E4E 100%)
Cool Precision:       linear-gradient(180deg, #4C9EEB 0%, #1F3A5F 100%)
Intensity Pulse:      radial-gradient(circle, rgba(234,78,78,0.3) 0%, transparent 70%)
Motion Reflection:    linear-gradient(90deg, transparent 0%, rgba(76,158,235,0.2) 50%, transparent 100%)
```

**Usage:**
- **Time Ring:** BMW M gradient (#4C9EEB → #EA4E4E) segmented by activity type
- **Cardio Segment:** Light Blue (#4C9EEB) with motion reflection
- **Strength Segment:** Navy (#1F3A5F) with angular light
- **Calorie Burn Arc:** Red (#EA4E4E) with intensity pulse glow
- **CTAs:** BMW M gradient + blue glow pulse (rgba(76,158,235,0.3))
- **Cards:** White glass with navy typography, faint inner shadows

**Emotional Tone:** Precision, discipline, performance, kinetic energy (like a BMW M cockpit at night)

---

### Progress Theme (Health Core)

**Primary Palette:**
```
Emerald         #4BAE90    Primary progress, success, goal achievement
Emerald Light   #A7F0BA    Secondary gradient, subtle success highlights
Steel Blue      #6C88A6    Neutral data accents, secondary metrics
Soft Gray       #FAF9F7    Background glass, neutral base
White           #FFFFFF    Card surfaces, clean contrast
```

**Gradients:**
```
Progress Fill:        linear-gradient(90deg, #4BAE90 0%, #A7F0BA 100%)
Success Bloom:        radial-gradient(circle, rgba(75,174,144,0.2) 0%, transparent 70%)
Data Reflection:      linear-gradient(180deg, rgba(108,136,166,0.1) 0%, transparent 100%)
```

**Usage:**
- **Weight Graph:** Smooth emerald curve with gradient fill underneath (#4BAE90 → #A7F0BA at 40% opacity)
- **Logged States:** Emerald (#4BAE90) with subtle glow
- **Achievement Badges:** Emerald with success bloom on unlock
- **Cards:** Modular grid, white glass, emerald accents for completions
- **Hover States:** Shimmer with low-opacity gradient overlay

**Emotional Tone:** Achievement, health, growth, calm confidence

---

### Base Colors (Universal)

**Text:**
```
Primary Text       #1E1E1E    Charcoal black, high contrast, body text
Secondary Text     #6E6E73    Muted gray, timestamps, supporting info
Tertiary Text      #C7C7CC    Light gray, placeholders, disabled states
White Text         #FFFFFF    On colored backgrounds, CTAs, badges
```

**Backgrounds:**
```
Pure White         #FFFFFF    Card surfaces, modals, clean base
Off-White          #FAF9F7    Page background, subtle warmth
Frosted Glass      rgba(255,255,255,0.7) + blur(20px)
Modal Backdrop     rgba(0,0,0,0.4)
```

**Borders & Dividers:**
```
Light Border       rgba(0,0,0,0.06)     Subtle card edges
Glass Border       rgba(255,255,255,0.3) Frosted glass edges
Divider            #EDEDED              Section separators
```

**Semantic Colors:**
```
Success            #4BAE90    Confirmations, logged states, achievements
Warning            #FFB347    Alerts, under-target notifications
Error              #EA4E4E    Validation errors, over-target warnings
Info               #4C9EEB    Informational messages, tips
```

### Color Application Rules

**Tint System:**
```
Background Tints (Feedback cards):    Base color at 10% opacity
Selected States (Cards):              Base color at 5% opacity
Badge Backgrounds (Meal type labels): Base color at 15% opacity
Glow Effects (Active states):        Base color at 30% opacity, blur 12-20px
```

**Glow Application:**
```
Orange-Pink Bloom (Nutrition hover):  rgba(255,179,71,0.3), blur: 12px, spread: 0px
Blue Pulse (Workout active):          rgba(76,158,235,0.3), blur: 16px, spread: 0px
Emerald Success (Achievement unlock): rgba(75,174,144,0.2), blur: 20px, spread: 4px
```

---

## Typography

### Font Family

**Primary:** SF Pro (iOS) / Inter (Web) / Roboto (Android)
- Geometric, confident, slightly condensed for precision metrics
- Variable weights for hierarchy
- Optimized for legibility at all sizes

**Fallback Stack:**
```
iOS:     SF Pro Text, SF Pro Display, -apple-system, system-ui
Web:     Inter, -apple-system, BlinkMacSystemFont, sans-serif
Android: Roboto, system-ui, sans-serif
```

### Type Scale

**Display (Large Numbers, Hero Text):**
```
Display XL     40px / 48px line / -0.8px spacing / Bold (700)
               Usage: Large calorie numbers, weight milestones

Display L      32px / 40px line / -0.5px spacing / Bold (700)
               Usage: Daily totals, primary metrics

Display M      28px / 34px line / -0.3px spacing / Semibold (600)
               Usage: Section titles, card headers
```

**Headings:**
```
H1             20px / 26px line / -0.2px spacing / Bold (700)
               Usage: Page titles, screen headers

H2             18px / 24px line / -0.1px spacing / Semibold (600)
               Usage: Section headers, card titles

H3             16px / 22px line / -0.1px spacing / Semibold (600)
               Usage: Subsection headers, list titles
```

**Body Text:**
```
Body L         18px / 26px line / 0px spacing / Regular (400)
               Usage: Large readable text, descriptions

Body M         16px / 24px line / 0px spacing / Regular (400)
               Usage: Standard body text, meal names

Body S         14px / 20px line / 0px spacing / Regular (400)
               Usage: Supporting text, macros breakdown

Caption        12px / 16px line / 0px spacing / Regular (400)
               Usage: Timestamps, helper text, legal
```

**Interactive:**
```
Button L       18px / 24px line / 0px spacing / Semibold (600)
               Usage: Primary CTAs, important actions

Button M       16px / 22px line / 0px spacing / Medium (500)
               Usage: Secondary buttons, standard actions

Button S       14px / 20px line / 0px spacing / Medium (500)
               Usage: Small actions, tertiary buttons

Tab Label      10px / 14px line / 0.5px spacing / Medium (500)
               Usage: Bottom navigation labels
```

### Font Weight Usage

```
Regular (400)      Body text, descriptions, readable content
Medium (500)       Button labels, tab labels, emphasized inline text
Semibold (600)     Headings, card titles, important metrics
Bold (700)         Display numbers, page titles, primary focus
```

### Special Typography

**Metric Numbers (Precision Display):**
```
Font:              SF Pro Display (iOS) / Inter (Web)
Size:              32-40px
Weight:            Bold (700)
Letter-spacing:    -0.8px (tighter for density)
Color:             #1E1E1E (charcoal black)
Format Example:    "2,150"
```

**Macro Breakdown (Data Labels):**
```
Font:              SF Pro Text
Size:              14px
Weight:            Regular (400)
Color:             #6E6E73 (muted gray)
Format:            "● Protein: 150/180g"
Dot color:         Matches ring color (e.g., #81E296 for protein)
```

**Timestamps:**
```
Font:              SF Pro Text
Size:              12px
Weight:            Regular (400)
Color:             #C7C7CC (light gray)
Format:            "Logged at 12:45 PM" or "2 hours ago"
```

**Gradient Text (Special Emphasis):**
```
Usage:             Streak counter, achievement unlocks
Gradient:          Matches context (Nutrition: orange→pink, Workout: blue→red)
Implementation:    background-image: linear-gradient(...); -webkit-background-clip: text;
```

---

## Spacing & Layout

### Spacing Scale (4px Base Unit)

```
xs     4px      Icon-to-text gap, tight inline spacing
sm     8px      Label-to-input, small element gaps
md     12px     Default element separation, card internal padding (tight)
lg     16px     Card padding (standard), section margins
xl     20px     Card-to-card spacing (vertical stacks)
2xl    24px     Major section gaps
3xl    32px     Page horizontal padding, large breaks
4xl    40px     Extra-large section dividers (rare)
```

### Layout Grid

**Screen Margins:**
```
Horizontal:    16px (left/right edge padding)
Top:           Safe area + 8px
Bottom:        Safe area + bottom nav height + 8px
```

**Card System:**
```
Border Radius:      20px (large, smooth corners)
Padding:            16px (internal content padding)
Vertical Spacing:   20px (between stacked cards)
Shadow:             0 4px 24px rgba(0, 0, 0, 0.05)
Backdrop Filter:    blur(20px) for frosted glass variants
Border:             1px solid rgba(255, 255, 255, 0.3) for glass edges
```

**Bottom Navigation:**
```
Height:             60px
Tab Width:          Equal thirds (33.3% each)
Icon Size:          24×24px
Label Size:         10px caption, 0.5px letter-spacing
Padding:            8px top, 8px bottom
Background:         Frosted glass rgba(255,255,255,0.9) + blur(20px)
Top Border:         1px solid rgba(0,0,0,0.06)
```

### Vertical Rhythm

```
Page Title:         H1 + 16px margin-bottom
Section Header:     H2 + 12px margin-bottom
Subsection:         H3 + 8px margin-bottom
Paragraph Spacing:  16px between blocks
List Item Spacing:  8px between items
Card Stack:         20px between cards
```

### Content Width

```
Maximum:           100% of screen width (no constraint)
Comfortable:       90% for text-heavy content
Readable:          45-60 characters per line for paragraphs
```

---

## Components

### Buttons

#### Primary Button (Context-Aware)

**Nutrition Context:**
```
Background:        linear-gradient(135deg, #FFD27D 0%, #FFB347 100%)
Text:              #FFFFFF, 16px Semibold
Height:            48px
Padding:           0px 24px (horizontal)
Border Radius:     24px (pill shape)
Shadow:            0 4px 12px rgba(255, 179, 71, 0.3)
Glow (Hover):      0 0 20px rgba(255, 179, 71, 0.4)

States:
- Default:         Full opacity, standard shadow
- Hover:           Glow appears (20px blur), shadow deepens
- Pressed:         Scale 0.97, shadow reduces, brightness -5%
- Disabled:        Grayscale, 40% opacity, no shadow
```

**Workout Context:**
```
Background:        linear-gradient(135deg, #4C9EEB 0%, #EA4E4E 100%)
Text:              #FFFFFF, 16px Semibold
Height:            48px
Border Radius:     24px
Shadow:            0 4px 12px rgba(76, 158, 235, 0.3)
Glow (Hover):      0 0 20px rgba(76, 158, 235, 0.4)

States:            Same as Nutrition
```

**React Native Implementation:**
```jsx
<LinearGradient
  colors={['#FFD27D', '#FFB347']}
  start={{x: 0, y: 0}}
  end={{x: 1, y: 1}}
  style={styles.gradientButton}
>
  <Text style={styles.buttonText}>Continue</Text>
</LinearGradient>

// Add react-native-linear-gradient or expo-linear-gradient
```

#### Secondary Button

```
Background:        rgba(255, 255, 255, 0.7)
Backdrop Filter:   blur(20px)
Border:            1px solid rgba(0, 0, 0, 0.06)
Text:              #1F3A5F (navy), 16px Semibold
Height:            48px
Border Radius:     24px
Shadow:            0 2px 8px rgba(0, 0, 0, 0.04)

States:
- Default:         As above
- Hover:           Border → rgba(0,0,0,0.1), shadow deepens
- Pressed:         Background → rgba(255,255,255,0.5), scale 0.97
- Disabled:        Grayscale, 40% opacity
```

#### Floating Action Button (FAB)

```
Size:              56×56px circle
Background:        Emerald #4BAE90 (Progress theme)
Icon:              24×24px, white
Shadow:            0 8px 16px rgba(75, 174, 144, 0.4)
Glow:              0 0 24px rgba(75, 174, 144, 0.3)
Border Radius:     28px (perfect circle)

States:
- Default:         Full glow + shadow
- Hover:           Glow intensifies (0 0 32px), scale 1.05
- Pressed:         Scale 0.95, glow reduces
- Disabled:        Grayscale, no glow, 50% opacity
```

#### Icon Button

```
Size:              40×40px
Background:        Transparent or context color
Icon:              20×20px, inherits color
Border Radius:     20px (circular)
Hover:             Background rgba(0,0,0,0.05)
Pressed:           Background rgba(0,0,0,0.1), scale 0.95
```

---

### Cards

#### Floating Glass Card (Standard)

```
Background:        rgba(255, 255, 255, 0.7)
Backdrop Filter:   blur(20px)
Border:            1px solid rgba(255, 255, 255, 0.3)
Border Radius:     20px
Padding:           16px
Shadow:            0 4px 24px rgba(0, 0, 0, 0.05)
Min Height:        80px

Inner Shadow:      inset 0 2px 8px rgba(0, 0, 0, 0.04) (optional, for depth)
Light Gloss:       linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%) (overlay)
```

**States:**
```
Default:           Standard frosted glass
Hover:             Shadow → 0 6px 32px rgba(0,0,0,0.08), border → rgba(255,255,255,0.5)
Pressed:           Shadow → 0 2px 12px rgba(0,0,0,0.06), scale 0.99
Logged/Selected:   Background tint (e.g., rgba(75,174,144,0.05)), border → #4BAE90 at 30%
```

**React Native:**
```jsx
// Note: Backdrop blur not natively supported, use react-native-blur or fake with opacity
<BlurView intensity={20} style={styles.card}>
  <View style={styles.cardContent}>
    {children}
  </View>
</BlurView>
```

#### Meal/Workout Card

```
Extends:           Floating Glass Card
Layout:            Horizontal flex (checkbox | content | arrow)
Checkbox:          24×24px circle, left side
Content:           Meal name (16px Semibold), type + calories (12px Regular gray)
Arrow:             20×20px chevron right, #C7C7CC

Logged State:
- Background:      rgba(75, 174, 144, 0.05)
- Border:          rgba(75, 174, 144, 0.3)
- Checkbox:        Filled #4BAE90 with white checkmark
- Badge:           "Logged" pill, #4BAE90 background, white 12px text
```

#### Progress Metric Card

```
Background:        White #FFFFFF (solid, not frosted)
Border:            None
Border Radius:     20px
Padding:           20px
Shadow:            0 4px 24px rgba(0, 0, 0, 0.06) (slightly stronger)
Inner Elements:    Data-rich layout with graphs, numbers, gradients
```

---

### Inputs & Forms

#### Text Input (Glass Style)

```
Height:            48px
Padding:           12px 16px
Background:        rgba(255, 255, 255, 0.7)
Backdrop Filter:   blur(20px)
Border:            1px solid rgba(0, 0, 0, 0.06)
Border Radius:     12px
Font:              16px Regular, #1E1E1E
Placeholder:       14px Regular, #C7C7CC

States:
- Default:         As above
- Focus:           Border → context color (e.g., #FFB347), glow 0 0 8px at 20% opacity
- Error:           Border → #EA4E4E, helper text red below
- Disabled:        Background → rgba(255,255,255,0.4), text #C7C7CC
```

#### Checkbox (Circle, Nutrition/Workout Quick-Log)

```
Size:              24×24px circle
Border:            2px solid #EDEDED
Background:        Transparent

Unchecked:
- Border:          #EDEDED
- Background:      Transparent

Checked:
- Border:          #4BAE90 (or context color)
- Background:      #4BAE90 (or context color)
- Checkmark:       White, 14×14px, animated draw-in (200ms)

Animation:         Scale 1.0 → 1.2 → 1.0 (bounce), checkmark draws top-to-bottom
```

#### Toggle Switch (Nutrition ⟷ Workout)

```
Width:             220px
Height:            40px
Background:
- Inactive Side:   rgba(0, 0, 0, 0.05)
- Active Side:     Context gradient (Nutrition: #FFD27D→#FFB347, Workout: #4C9EEB→#EA4E4E)
Border Radius:     20px (pill)
Thumb:             36×36px circle, white, 0 2px 8px rgba(0,0,0,0.12) shadow
Text:              14px Semibold
- Active:          White text
- Inactive:        #6E6E73 text

Animation:         Thumb slides 200ms ease-out, background transitions 300ms
```

---

### Modals & Overlays

#### Full-Screen Modal

```
Background:        #FFFFFF (solid white)
Animation:         Slide up from bottom, 400ms ease-out with slight overshoot
Header:            60px height, H1 title, back button (← 24×24px)
Content Padding:   16px
Close Gesture:     Swipe down from top edge
```

#### Bottom Sheet (Partial Modal)

```
Background:        rgba(255, 255, 255, 0.95)
Backdrop Filter:   blur(30px)
Border Radius:     20px 20px 0 0 (top corners only)
Handle:            36px wide × 4px tall, #C7C7CC, centered, 12px from top
Shadow:            0 -4px 24px rgba(0, 0, 0, 0.12)
Max Height:        85% of screen
Animation:         Slide up 300ms spring (iOS) / ease-out (Android)
Backdrop:          rgba(0, 0, 0, 0.4)
```

#### Toast Notification

```
Background:        #1F3A5F (navy, solid)
Text:              #FFFFFF, 14px Medium
Padding:           12px 16px
Border Radius:     12px
Shadow:            0 4px 16px rgba(0, 0, 0, 0.24)
Position:          Bottom, 90px above bottom nav
Duration:          3 seconds (with [Undo] button if applicable)
Animation:         Slide up 20px + fade in (200ms), fade out (200ms)
Max Width:         90% of screen

With Undo:
- Button:          [Undo] text button, white, right-aligned
- Timer:           3-second countdown (visual progress bar optional)
```

#### Loading Overlay

```
Background:        rgba(0, 0, 0, 0.4) full screen
Spinner:
- Size:            40×40px
- Color:           Context color (Nutrition: #FFB347, Workout: #4C9EEB)
- Style:           Circular, continuous rotation
Text:              #FFFFFF, 16px Medium, centered below spinner, 16px gap
Animation:         Fade in 150ms, spinner rotates 1000ms linear infinite
```

---

### Badges & Labels

#### Status Badge (Logged, Completed)

```
Background:        #4BAE90 (success) or context color
Text:              #FFFFFF, 12px Medium
Padding:           4px 10px
Border Radius:     8px
Height:            24px
Shadow:            0 2px 4px rgba(75, 174, 144, 0.2)
```

#### Meal Type Label

```
Background:        Base color at 15% opacity
                   (e.g., #FFB347 at 15% for Breakfast)
Text:              Base color full opacity, 12px Medium
Padding:           4px 10px
Border Radius:     8px
Height:            24px
No shadow
```

**Meal Type Colors:**
```
Breakfast:         #FFB347 (orange)
Lunch:             #FFE082 (yellow)
Dinner:            #FCA7C5 (pink)
Snacks:            #81E296 (green)
```

---

## Iconography

### Icon System

**Style:** SF Symbols (iOS) / Material Icons Rounded (Android)
- Consistent 2px stroke weight
- Rounded line caps and joins
- 24×24px base size (scales to 20px, 28px, 32px)
- Clean, geometric, modern

### Icon Sizes

```
Small:             20×20px (inline with text, tight spaces)
Default:           24×24px (standard UI elements)
Large:             28×28px (emphasis, headers)
XL:                32×32px (hero icons, empty states)
```

### Common Icons

**Navigation:**
```
Home:              House icon (outline default, filled when active)
Log:               Plus in circle (outline default, filled when active)
Progress:          Chart line trending up (outline default, filled when active)
Settings:          Gear/cog icon
Back:              Chevron left <
Forward:           Chevron right >
```

**Actions:**
```
Add:               Plus +
Swap:              Arrows horizontal ↔
Delete:            Trash can
Favorite:          Heart ♡ (outline) / ♥ (filled)
Edit:              Pencil
Share:             Share arrow (iOS) / Share dots (Android)
Calendar:          Calendar grid
Search:            Magnifying glass
Filter:            Funnel/filter icon
```

**Status:**
```
Success:           Checkmark ✓ in circle
Warning:           Exclamation ⚠ in triangle
Error:             X mark in circle
Info:              i in circle
Fire:              🔥 (use emoji for color, or custom flame icon)
Lock:              Padlock (locked/unlocked states)
```

**Food & Fitness:**
```
Meal:              Fork & knife crossed
Breakfast:         Sunrise / egg icon
Lunch:             Sandwich / midday sun
Dinner:            Plate with food / moon
Snack:             Apple / cookie
Workout:           Dumbbell
Cardio:            Running figure / heart with pulse
Strength:          Dumbbell / flexed arm
Weight:            Scale icon
Timer:             Stopwatch / clock
```

### Icon Colors

```
Inactive:          #C7C7CC (light gray)
Active:            Context color (Nutrition: #FFB347, Workout: #4C9EEB, Progress: #4BAE90)
Destructive:       #EA4E4E (red)
Success:           #4BAE90 (emerald)
On Dark:           #FFFFFF (white)
On Light:          #1E1E1E (charcoal)
```

**Icon with Glow (Active State):**
```
Icon Color:        Context color
Glow:              0 0 12px at 30% opacity of icon color
Example:           Nutrition FAB icon: white with 0 0 12px rgba(255,179,71,0.3) orange glow
```

---

## Motion & Animation

### Timing Functions

```
Ease Out:          cubic-bezier(0.25, 0.46, 0.45, 0.94)   // Default for entering, smooth deceleration
Ease In:           cubic-bezier(0.55, 0.055, 0.675, 0.19) // Default for exiting, smooth acceleration
Ease In Out:       cubic-bezier(0.645, 0.045, 0.355, 1)   // Default for state changes
Spring (iOS):      UIView spring (damping: 0.8, velocity: 0.6) // Slight overshoot, natural bounce
Linear:            linear                                  // Continuous motion (spinners)
```

### Duration Scale

```
Instant:           100ms      State changes (checkbox, button press)
Fast:              200ms      Toasts, micro-interactions, color transitions
Normal:            300ms      Most animations (cards, modals)
Medium:            400ms      Screen transitions, tab switches
Slow:              600ms      Progress fills, complex animations
Very Slow:         800ms      Graph updates, data visualizations
```

### Animation Archetypes

#### Liquid Fill (Ring Progress, Graphs)

```
Description:       Gradient sweeps like water, smooth and organic
Duration:          600ms
Easing:            Spring (iOS) / Ease Out (Android)
Effect:            Arc draws clockwise, gradient flows with motion
Implementation:    SVG stroke-dasharray animation or Animated.timing in React Native
```

**Example (Calorie Ring Fill):**
```
Start:             0% filled, gray outline
End:               75% filled, orange gradient with inner glow
Animation:         Gradient sweeps clockwise from 12 o'clock, trailing light reflection
Stagger:           Inner rings start 100ms after outer (cascade effect)
```

#### Glass Slide (Screen Transitions, Modals)

```
Description:       Elements glide with momentum and slight overshoot
Duration:          400ms
Easing:            Spring (damping 0.8, velocity 0.6)
Effect:            Push/pull with blur fade and parallax depth
Implementation:    React Navigation with custom transition
```

**Example (Modal Present):**
```
Start:             Modal off-screen bottom, backdrop opacity 0
End:               Modal on screen, backdrop opacity 0.4
Animation:         Slide up with 10px overshoot, then settle, backdrop fades in
Parallax:          Background content scales 0.95 and blurs slightly
```

#### Light Bloom (Active States, Hover)

```
Description:       Active elements glow and pulse with soft light
Duration:          300ms
Easing:            Ease Out
Effect:            Glow appears with radial gradient blur
Implementation:    CSS box-shadow or React Native Shadow (iOS) / Elevation (Android)
```

**Example (Button Hover):**
```
Default:           0 4px 12px rgba(255,179,71,0.3)
Hover:             0 0 20px rgba(255,179,71,0.4) + 0 4px 12px rgba(255,179,71,0.3)
Animation:         Glow fades in 200ms ease-out, button scales 1.02
```

#### Kinetic Reflection (Motion Trail, Workout Context)

```
Description:       Motion leaves trailing light reflections
Duration:          300ms
Easing:            Ease Out
Effect:            Horizontal gradient sweeps across element
Implementation:    Animated gradient position or shimmer effect
```

**Example (Workout Ring Fill):**
```
Effect:            As ring fills, horizontal light sweep moves with progress edge
Gradient:          linear-gradient(90deg, transparent 0%, rgba(76,158,235,0.3) 50%, transparent 100%)
Animation:         Gradient position animates left-to-right, follows fill edge
```

### Screen Transitions

#### Push/Pop (Navigation Stack)

```
Type:              Horizontal slide
Duration:          400ms
Easing:            Spring (iOS) / Ease Out (Android)
Entering:          New screen slides in from right (100% → 0%)
Exiting:           Old screen slides to left (0% → -30%) and fades (100% → 80% opacity)
Parallax:          Exiting screen moves slower (depth effect)
Blur:              Exiting screen blurs slightly (0 → 8px backdrop filter)
```

#### Modal Present

```
Type:              Vertical slide from bottom
Duration:          400ms
Easing:            Spring (iOS) / Ease Out (Android)
Entering:          Modal slides up from bottom, slight overshoot
Backdrop:          Black fades in to 40% opacity
Background:        Scale 0.95 + blur 8px (creates depth)
Dismiss:           Reverse animation + swipe down gesture
```

#### Bottom Sheet

```
Type:              Partial screen slide from bottom
Duration:          300ms
Easing:            Spring (damping 0.85)
Entering:          Sheet slides up from bottom, handle visible immediately
Backdrop:          Black fades in to 40% opacity
Interaction:       Draggable, follows finger, snaps to positions
Dismiss:           Swipe down past threshold or tap backdrop
```

#### Tab Switch (Bottom Nav)

```
Type:              Cross-fade with content slide
Duration:          400ms
Easing:            Ease In Out
Effect:
- Old tab content fades out 50% + slides left 20px
- New tab content fades in 100% + slides from right 20px
- Tab bar icon morphs (outline → filled)
- Subtle blur transition during switch
```

### Component Animations

#### Button Press

```
Duration:          120ms
Scale:             1.0 → 0.97 (pressed)
Shadow:            Deepens (spread -2px) during press
Brightness:        -5% during press
Glow:              Intensifies if hover state active
Release:           Spring back to 1.0 (150ms)
```

#### Checkbox Check

```
Duration:          200ms
Easing:            Ease Out
Animation:
1. Circle border scales 1.0 → 1.2 → 1.0 (bounce)
2. Background color fills (0ms delay)
3. Checkmark draws from top-to-bottom (50ms delay, 150ms duration)
Haptic:            Light impact on iOS
```

#### Progress Ring Fill

```
Duration:          600ms
Easing:            Spring (iOS) / Ease Out (Android)
Animation:
1. Outer ring (calories) fills first
2. Inner rings stagger 100ms each (protein → carbs → fat)
3. Gradient flows with fill direction
4. Inner glow appears at 80% fill
Effect:            Liquid mercury flowing into rings
```

#### Toast Appear/Dismiss

```
Appear:
- Duration:        200ms
- Effect:          Slide up 20px + fade in (opacity 0 → 1)
- Easing:          Ease Out

Dismiss:
- Duration:        200ms
- Effect:          Fade out (opacity 1 → 0)
- Easing:          Ease In
- Note:            No slide down (feels less intrusive)
```

#### Card Expand (Swipe Actions)

```
Duration:          200ms
Easing:            Ease Out
Animation:
- Card slides horizontally (swipe distance)
- Actions reveal underneath (red delete, blue favorite)
- Action icons scale in (0.8 → 1.0)
Spring Back:       If swipe doesn't meet threshold, card springs back (250ms)
```

#### Loading Spinner

```
Duration:          1000ms (1 full rotation per second)
Easing:            Linear (continuous, no easing)
Animation:         360° rotation, infinite loop
Style:             iOS: UIActivityIndicator, Android: Material CircularProgressIndicator
Color:             Context color (Nutrition: #FFB347, Workout: #4C9EEB)
```

#### Heart Favorite Toggle

```
Duration:          300ms
Easing:            Spring (damping 0.7, velocity 0.8)
Animation:
1. Scale 1.0 → 1.3 → 1.0 (pop effect)
2. Rotate -5° → 0° → 5° → 0° (wobble)
3. Color transition (outline gray → filled red)
4. Subtle glow appears on filled state
Haptic:            Medium impact on iOS
```

### Micro-Interactions

#### Day Selector Tap

```
Duration:          200ms
Animation:
- Tapped day scales 1.0 → 1.1 → 1.0 (brief pop)
- Font weight increases (400 → 600)
- Previously selected day scales down
- Content below cross-fades to new day (300ms)
Haptic:            Light impact
```

#### Meal Quick-Log (Checkbox → Progress Update)

```
Timeline:
0ms:               Checkbox tap detected
0-200ms:           Checkbox animates (check draws in)
50ms:              Card background tints green (fade in)
100ms:             "Logged" badge slides in from left
200ms:             Progress ring starts filling
200-800ms:         Progress ring animates (liquid fill)
250ms:             Calorie number counts up
Haptic:            Light impact at 0ms, success notification at 800ms
Total:             800ms end-to-end
```

#### FAB Press & Expand

```
Press:
- Duration:        120ms
- Effect:          Scale 0.95, glow intensifies, shadow deepens

Release:
- Duration:        150ms
- Effect:          Spring back to 1.0, navigate to Log tab

Expand (Future):
- Duration:        300ms
- Effect:          FAB expands to reveal quick actions (speed dial)
- Actions:         Meal, Workout, Weight (3 buttons fan out)
```

---

## Glassmorphism & Effects

### Frosted Glass Card

**CSS Implementation:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* Safari */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  padding: 16px;
}
```

**React Native Implementation:**
```jsx
import { BlurView } from 'expo-blur';
// or '@react-native-community/blur'

<BlurView
  intensity={20}
  tint="light"
  style={styles.glassCard}
>
  <View style={styles.cardContent}>
    {children}
  </View>
</BlurView>

// Fallback for Android (blur not always supported):
// Use white background at 0.7 opacity with subtle shadow
```

### Inner Shadow (Depth)

**Purpose:** Creates recessed feeling, adds depth to flat surfaces

**CSS:**
```css
.inner-shadow {
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.04);
}
```

**React Native:**
```jsx
// Inner shadows not natively supported
// Use gradient overlay to fake effect:
<LinearGradient
  colors={['rgba(0,0,0,0.02)', 'transparent']}
  style={styles.innerShadow}
/>
```

### Light Gloss Overlay

**Purpose:** Liquid metric feel, creates shine on glass surfaces

**CSS:**
```css
.light-gloss::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%);
  border-radius: 20px 20px 0 0;
  pointer-events: none;
}
```

**React Native:**
```jsx
<LinearGradient
  colors={['rgba(255,255,255,0.4)', 'transparent']}
  style={styles.glossOverlay}
  pointerEvents="none"
/>
```

### Glow Effects

#### Orange-Pink Bloom (Nutrition Hover)

**CSS:**
```css
.nutrition-glow {
  box-shadow:
    0 4px 12px rgba(255, 179, 71, 0.3),
    0 0 20px rgba(255, 179, 71, 0.4);
  transition: box-shadow 200ms ease-out;
}
```

**React Native:**
```jsx
// iOS Shadow
shadowColor: '#FFB347',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 12,

// Android elevation (approximate)
elevation: 8,
```

#### Blue Pulse (Workout Active)

**CSS:**
```css
.workout-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 16px rgba(76, 158, 235, 0.3);
  }
  50% {
    box-shadow: 0 0 24px rgba(76, 158, 235, 0.5);
  }
}
```

**React Native:**
```jsx
// Use Animated API
const pulseAnim = useRef(new Animated.Value(0.3)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.3,
        duration: 1000,
        useNativeDriver: false,
      }),
    ])
  ).start();
}, []);
```

#### Emerald Success Glow (Achievement Unlock)

**CSS:**
```css
.success-bloom {
  box-shadow:
    0 4px 24px rgba(75, 174, 144, 0.2),
    0 0 32px rgba(75, 174, 144, 0.3);
  animation: bloom 600ms ease-out;
}

@keyframes bloom {
  0% {
    box-shadow: 0 0 0 rgba(75, 174, 144, 0);
  }
  50% {
    box-shadow: 0 0 48px rgba(75, 174, 144, 0.5);
  }
  100% {
    box-shadow: 0 0 32px rgba(75, 174, 144, 0.3);
  }
}
```

### Gradient Backgrounds

#### Nutrition Button Gradient

```css
background: linear-gradient(135deg, #FFD27D 0%, #FFB347 100%);
```

**React Native:**
```jsx
<LinearGradient
  colors={['#FFD27D', '#FFB347']}
  start={{x: 0, y: 0}}
  end={{x: 1, y: 1}}
  angle={135}
/>
```

#### BMW M Workout Gradient

```css
background: linear-gradient(135deg, #4C9EEB 0%, #EA4E4E 100%);
```

#### Progress Graph Fill

```css
fill: url(#progressGradient);

<linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" style="stop-color:#4BAE90;stop-opacity:1" />
  <stop offset="100%" style="stop-color:#A7F0BA;stop-opacity:1" />
</linearGradient>
```

---

## Platform Implementation

### iOS-Specific

**Safe Areas:**
```swift
// Respect safe area insets
SafeAreaView {
  // Content
}

// React Native:
import { SafeAreaView } from 'react-native-safe-area-context';
```

**Haptics:**
```swift
// Light impact (checkbox, button press)
UIImpactFeedbackGenerator(style: .light).impactOccurred()

// Medium impact (meal logged)
UIImpactFeedbackGenerator(style: .medium).impactOccurred()

// Success notification (goal reached)
UINotificationFeedbackGenerator().notificationOccurred(.success)

// React Native:
import { triggerHapticFeedback } from 'react-native-haptic-feedback';
```

**Native Components:**
```
Date Picker:       UIDatePicker (wheel style)
Alert:             UIAlertController (iOS native style)
Share Sheet:       UIActivityViewController
```

**Gestures:**
```
Back Swipe:        Edge swipe from left (system gesture, don't interfere)
Modal Dismiss:     Swipe down from top edge
```

---

### Android-Specific

**Safe Areas:**
```kotlin
// Handle status bar and navigation bar
WindowCompat.setDecorFitsSystemWindows(window, false)

// React Native:
<View style={{ paddingTop: StatusBar.currentHeight }}>
```

**Ripple Effect:**
```jsx
// All tappable elements
<TouchableNativeFeedback
  background={TouchableNativeFeedback.Ripple('#FFB347', false)}
>
  <View>...</View>
</TouchableNativeFeedback>
```

**Material Components:**
```
Date Picker:       Material DatePicker (calendar style)
Dialog:            MaterialAlertDialog
Bottom Sheet:      BottomSheetDialog
```

**Elevation (Shadow Alternative):**
```jsx
// Android uses elevation instead of shadow
elevation: 4, // Equivalent to ~4-8px shadow blur
```

---

### React Native Library Recommendations

**UI Components:**
```
React Native Paper:         Material Design components (buttons, cards, inputs)
React Native Elements:      Alternative UI kit
Custom Components:          Build from scratch for full control (recommended for glass effects)
```

**Gradients:**
```
expo-linear-gradient:       For Expo projects
react-native-linear-gradient: For bare React Native
```

**Blur Effects:**
```
expo-blur:                  For Expo projects (BlurView)
@react-native-community/blur: For bare React Native
Note: Android blur limited, use opacity fallback
```

**Animations:**
```
react-native-reanimated:    High-performance animations (recommended)
Animated API:               Built-in, good for simple animations
Lottie:                     For complex illustrations (optional)
```

**Navigation:**
```
@react-navigation/native:   Standard navigation library
@react-navigation/stack:    For stack-based navigation
@react-navigation/bottom-tabs: For bottom tab bar
```

**Gestures:**
```
react-native-gesture-handler: For advanced gestures (swipe, long-press)
```

---

## Design Tokens (JSON Reference)

### Colors

```json
{
  "colors": {
    "text": {
      "primary": "#1E1E1E",
      "secondary": "#6E6E73",
      "tertiary": "#C7C7CC",
      "white": "#FFFFFF"
    },
    "background": {
      "white": "#FFFFFF",
      "offWhite": "#FAF9F7",
      "frostedGlass": "rgba(255, 255, 255, 0.7)",
      "modalBackdrop": "rgba(0, 0, 0, 0.4)"
    },
    "nutrition": {
      "orange": "#FFB347",
      "orangeLight": "#FFD27D",
      "pink": "#FCA7C5",
      "green": "#81E296",
      "yellow": "#FFE082"
    },
    "workout": {
      "navy": "#1F3A5F",
      "blue": "#4C9EEB",
      "red": "#EA4E4E",
      "steelGray": "#EDEDED"
    },
    "progress": {
      "emerald": "#4BAE90",
      "emeraldLight": "#A7F0BA",
      "steelBlue": "#6C88A6"
    },
    "semantic": {
      "success": "#4BAE90",
      "warning": "#FFB347",
      "error": "#EA4E4E",
      "info": "#4C9EEB"
    },
    "borders": {
      "light": "rgba(0, 0, 0, 0.06)",
      "glass": "rgba(255, 255, 255, 0.3)",
      "divider": "#EDEDED"
    }
  }
}
```

### Spacing

```json
{
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20,
    "2xl": 24,
    "3xl": 32,
    "4xl": 40
  }
}
```

### Typography

```json
{
  "typography": {
    "display": {
      "xl": { "size": 40, "lineHeight": 48, "weight": "700", "letterSpacing": -0.8 },
      "l": { "size": 32, "lineHeight": 40, "weight": "700", "letterSpacing": -0.5 },
      "m": { "size": 28, "lineHeight": 34, "weight": "600", "letterSpacing": -0.3 }
    },
    "heading": {
      "h1": { "size": 20, "lineHeight": 26, "weight": "700", "letterSpacing": -0.2 },
      "h2": { "size": 18, "lineHeight": 24, "weight": "600", "letterSpacing": -0.1 },
      "h3": { "size": 16, "lineHeight": 22, "weight": "600", "letterSpacing": -0.1 }
    },
    "body": {
      "l": { "size": 18, "lineHeight": 26, "weight": "400", "letterSpacing": 0 },
      "m": { "size": 16, "lineHeight": 24, "weight": "400", "letterSpacing": 0 },
      "s": { "size": 14, "lineHeight": 20, "weight": "400", "letterSpacing": 0 },
      "caption": { "size": 12, "lineHeight": 16, "weight": "400", "letterSpacing": 0 }
    },
    "button": {
      "l": { "size": 18, "lineHeight": 24, "weight": "600", "letterSpacing": 0 },
      "m": { "size": 16, "lineHeight": 22, "weight": "500", "letterSpacing": 0 },
      "s": { "size": 14, "lineHeight": 20, "weight": "500", "letterSpacing": 0 }
    }
  }
}
```

### Shadows

```json
{
  "shadows": {
    "card": "0 4px 24px rgba(0, 0, 0, 0.05)",
    "cardHover": "0 6px 32px rgba(0, 0, 0, 0.08)",
    "button": "0 4px 12px rgba(255, 179, 71, 0.3)",
    "fab": "0 8px 16px rgba(75, 174, 144, 0.4)",
    "modal": "0 -4px 24px rgba(0, 0, 0, 0.12)",
    "toast": "0 4px 16px rgba(0, 0, 0, 0.24)"
  }
}
```

### Animation Durations

```json
{
  "animation": {
    "instant": 100,
    "fast": 200,
    "normal": 300,
    "medium": 400,
    "slow": 600,
    "verySlow": 800
  }
}
```

---

## Cross-References

**For additional design specifications, see:**

- **Color Palettes (Detailed):** [Q3.0 Color Palettes](planning/Q3.0_Navigation_AppShell_FINAL.md#color-palettes)
- **Interaction Patterns:** [Q3.0 Interaction Patterns](planning/Q3.0_Navigation_AppShell_FINAL.md#interaction-patterns)
- **Accessibility Guidelines:** [Q3.0 Accessibility](planning/Q3.0_Navigation_AppShell_FINAL.md#accessibility)
- **Data Structures:** [Q0 Data Structures](Q0_DATA_STRUCTURES.md)

---

## Version History

### v1.0 - 2025-11-06
- Initial design system specification
- Liquid glass minimalism aesthetic defined
- BMW M × Apple Health vision captured
- Typography scale, spacing system, component library complete
- Glassmorphism effects and motion patterns documented
- Platform-specific implementations included
- Design tokens provided for easy implementation

---

**Document Owner:** Planning context
**Last Updated:** 2025-11-06
**Status:** Ready for Development
**Next Review:** When Q3.1-Q3.7 introduce new UI patterns
