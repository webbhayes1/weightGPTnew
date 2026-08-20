# WeightGPT Design Guide

**Last Updated**: November 13, 2025
**Phase**: Post-Onboarding (Phase 2.5)

This guide documents all design elements, patterns, and conventions established during app development to ensure consistency across the entire application.

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [UI Patterns](#ui-patterns)
7. [Navigation](#navigation)
8. [Animations](#animations)
9. [Accessibility](#accessibility)

---

## Design Philosophy

**Core Aesthetic**: Liquid glass minimalism meets BMW M × Apple Health performance energy

**Key Principles**:
- **Minimalism**: Clean, uncluttered interfaces with purposeful whitespace
- **Premium Feel**: Frosted glass effects, smooth gradients, subtle shadows
- **Performance Energy**: Bold typography, clear CTAs, motivating visuals
- **Data Transparency**: Clear visualization of metrics and progress
- **Contextual Design**: Different visual themes for nutrition vs. workout contexts

---

## Color System

### Primary Brand Colors
Located in: `/mobile/src/theme/tokens.ts`

#### Nutrition Theme (Primary App Theme)
- **Primary Blue**: `#4C9EEB` - Main brand color, buttons, primary actions
- **Light Blue**: `#6BADF4` - Lighter variant for gradients
- **Success Green**: `#81E296` - Success states, achievements
- **Accent Pink**: `#FCA7C5` - Highlights, special features
- **Warning Yellow**: `#FFE082` - Warnings, cautions

#### Workout Theme (Cool Precision)
- **Navy**: `#1F3A5F` - Dark backgrounds, headers
- **Blue**: `#4C9EEB` - Primary workout actions (same as nutrition)
- **Red**: `#EA4E4E` - Intensity indicators, workout CTAs
- **Steel Gray**: `#EDEDED` - Backgrounds, dividers
- **White**: `#FFFFFF` - Clean contrast

#### Progress Theme (Health Core)
- **Emerald**: `#4BAE90` - Main progress color, success indicators
- **Emerald Light**: `#A7F0BA` - Progress backgrounds, subtle fills
- **Steel Blue**: `#6C88A6` - Secondary metrics
- **Soft Gray**: `#FAF9F7` - Neutral backgrounds

### Text Colors
- **Primary**: `#1E1E1E` - Main body text, headings
- **Secondary**: `#6E6E73` - Supporting text, labels
- **Tertiary**: `#C7C7CC` - Disabled text, subtle UI
- **White**: `#FFFFFF` - Text on dark backgrounds

### Backgrounds
- **White**: `#FFFFFF` - Primary background
- **Off-White**: `#FAF9F7` - Subtle variation
- **Frosted Glass**: `rgba(255, 255, 255, 0.7)` - Overlay effects
- **Modal Backdrop**: `rgba(0, 0, 0, 0.4)` - Modal overlays

### Borders & Dividers
- **Light**: `rgba(0, 0, 0, 0.06)` - Subtle borders
- **Glass**: `rgba(255, 255, 255, 0.3)` - Glass effect borders
- **Divider**: `#EDEDED` - Clear dividing lines

### Semantic Colors
- **Success**: `#4BAE90` - Positive actions, completions
- **Warning**: `#4C9EEB` - Information, cautions
- **Error**: `#EA4E4E` - Errors, destructive actions
- **Info**: `#4C9EEB` - Informational messages

### Value Demo Colors (Established in Session 40)

#### Nutrition Rings (Apple Fitness-style)
- **Calories** (outer ring): `#2A7FFE` - Primary Blue (high saturation, medium luminance)
- **Protein** (second ring): `#35BEF0` - Bright Cyan-Blue (medium-high saturation, higher luminance)
- **Carbs** (third ring): `#7DD3FF` - Soft Sky Blue (medium saturation, high luminance)
- **Fat** (inner ring): `#5A7FAF` - Muted Slate Blue (low-medium saturation, low luminance)

**Design Rationale**: Progressive luminance from outer to inner rings creates depth. Blue family maintains cohesion while providing clear differentiation.

---

## Typography

### Font System
**Platform Defaults**:
- iOS: SF Pro
- Android: Roboto

### Display Styles (Hero Text, Large Numbers)

**Display XL**:
```typescript
fontSize: 40
lineHeight: 48
fontWeight: '700'
letterSpacing: -0.8
```
Usage: Large metric displays, splash screens

**Display L**:
```typescript
fontSize: 32
lineHeight: 40
fontWeight: '700'
letterSpacing: -0.5
```
Usage: Screen titles, major headings

**Display M**:
```typescript
fontSize: 28
lineHeight: 34
fontWeight: '600'
letterSpacing: -0.3
```
Usage: Section headers, card titles

### Heading Styles

**H1**:
```typescript
fontSize: 20
lineHeight: 26
fontWeight: '700'
letterSpacing: -0.2
```

**H2**:
```typescript
fontSize: 18
lineHeight: 24
fontWeight: '600'
letterSpacing: -0.1
```

**H3**:
```typescript
fontSize: 16
lineHeight: 22
fontWeight: '600'
letterSpacing: -0.1
```

### Body Text

**Body Large**:
```typescript
fontSize: 18
lineHeight: 26
fontWeight: '400'
letterSpacing: 0
```

**Body Medium** (Most Common):
```typescript
fontSize: 16
lineHeight: 24
fontWeight: '400'
letterSpacing: 0
```

**Body Small**:
```typescript
fontSize: 14
lineHeight: 20
fontWeight: '400'
letterSpacing: 0
```

**Caption**:
```typescript
fontSize: 12
lineHeight: 16
fontWeight: '400'
letterSpacing: 0
```

### Interactive Text (Buttons, Links)

**Button Large**:
```typescript
fontSize: 18
lineHeight: 24
fontWeight: '600'
letterSpacing: 0
```

**Button Medium**:
```typescript
fontSize: 16
lineHeight: 22
fontWeight: '500'
letterSpacing: 0
```

**Button Small**:
```typescript
fontSize: 14
lineHeight: 20
fontWeight: '500'
letterSpacing: 0
```

### Special Styles

**Tab Label**:
```typescript
fontSize: 10
lineHeight: 14
fontWeight: '500'
letterSpacing: 0.5
textTransform: 'uppercase'
```

**Logo/Brand Text** (Established Session 40):
```typescript
fontSize: 34
fontWeight: '700'
letterSpacing: -0.5
```
Usage: "Unlock Your Full Plan" title, brand moments

---

## Spacing & Layout

### Spacing Scale
```typescript
xs: 4    // Icon-to-text gap, tight inline spacing
sm: 8    // Label-to-input, small element gaps
md: 12   // Default element separation, card internal padding (tight)
lg: 16   // Card padding (standard), section margins
xl: 20   // Card-to-card spacing (vertical stacks)
2xl: 24  // Major section gaps
3xl: 32  // Page horizontal padding, large breaks
4xl: 40  // Extra-large section dividers
```

### Layout Dimensions

**Screen Padding**:
- Horizontal: `16px` (tokens.spacing.xl)
- Top: `8px` (tokens.spacing.screenTopPadding)
- Safe area respected on all screens

**Card Styling**:
- Border Radius: `20px` (tokens.borderRadius.rounded)
- Internal Padding: `16px` (tokens.layout.cardPadding)
- Vertical Spacing: `20px` (tokens.layout.cardVerticalSpacing)

**Touch Targets**:
- Minimum: `44px` (tokens.sizes.touchTarget) - Accessibility standard
- Button Heights: 48px (large), 40px (medium), 32px (small)

---

## Components

### Button Component
Location: `/mobile/src/components/ui/Button.tsx`

**Variants**:
1. **Primary** - Gradient background, bold CTA
2. **Secondary** - Outlined style, subtle
3. **Text** - No background, link-style

**Sizes**: `large` (48px), `medium` (40px), `small` (32px)

**Context Colors**:
- `nutrition`: Blue theme (default)
- `workout`: Red theme
- `progress`: Green theme

**Usage Example**:
```typescript
<Button
  title="Continue"
  onPress={handleContinue}
  variant="primary"
  context="nutrition"
  size="large"
  fullWidth
/>
```

**Design Details**:
- Border radius: `24px` (pill shape)
- Shadow: Custom shadow for context (blue/red/green glow)
- Gradient: 135° angle for depth
- Disabled state: 50% opacity

### Progress Bar
Location: Implemented inline in screens

**Style**:
```typescript
height: 4px
backgroundColor: rgba(0, 0, 0, 0.06) // Light gray track
filled: tokens.colors.nutrition.blue // Blue progress
borderRadius: 2px
```

**Label Pattern**:
```typescript
"Step X/12" // Right-aligned, tokens.typography.caption.m
```

### Input Fields
Location: `/mobile/src/components/ui/Input.tsx`

**Style**:
- Height: `48px`
- Border: `1px solid rgba(0, 0, 0, 0.1)`
- Border Radius: `12px`
- Focus border: Blue (`#4C9EEB`)
- Padding: `12px 16px`

### Cards
**Standard Card Pattern**:
```typescript
backgroundColor: tokens.colors.background.white
borderRadius: tokens.borderRadius.rounded (20px)
padding: tokens.spacing.lg (16px)
shadow: tokens.shadows.card
```

### Badges
**Pill Badge** (e.g., "Best Value", pace indicators):
```typescript
paddingHorizontal: tokens.spacing.md (12px)
paddingVertical: tokens.spacing.xs (4px)
borderRadius: tokens.borderRadius.pill (24px)
borderWidth: 1
// Color varies by context
```

---

## UI Patterns

### Screen Layout Pattern (Established in Onboarding)

**Standard Screen Structure**:
```tsx
<SafeAreaView style={styles.container}>
  {/* Top Section - Scrollable */}
  <View style={styles.content}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.title}>Screen Title</Text>
      <Text style={styles.subtitle}>Supporting text</Text>
    </View>

    {/* Main Content */}
    {/* ... */}
  </View>

  {/* Fixed Bottom Section */}
  <View style={styles.fixedBottomSection}>
    <Button title="Continue" ... />
    {/* Optional: Progress indicator */}
  </View>
</SafeAreaView>
```

**Layout Dimensions**:
- Content padding: `tokens.spacing.xl` (20px horizontal)
- Fixed bottom: `paddingBottom: tokens.spacing.lg` (16px)
- Title margin bottom: `tokens.spacing.xl` (20px)

### Progress Indicator Pattern (Carousel/Multi-step)

**Dot Indicator** (e.g., Value Demo Carousel):
```typescript
// Inactive dot
width: 8px
height: 8px
borderRadius: 4px (circle)
backgroundColor: tokens.colors.borders.light

// Active dot
width: 24px // Elongated
backgroundColor: tokens.colors.nutrition.blue
```

### Loading Screens Pattern

**Auto-advance Loading** (LoadingBreak screens):
- Display duration: 3-10 seconds
- Progress calculation shown (e.g., "Calculating your targets...")
- Tips/information displayed during wait
- Auto-navigate to next screen
- No user interaction required

**Design**:
```typescript
// Centered content
alignItems: 'center'
justifyContent: 'center'

// Icon/spinner
size: 64px
color: tokens.colors.nutrition.blue

// Supporting text
fontSize: 16
lineHeight: 24
textAlign: 'center'
color: tokens.colors.text.secondary
```

### Selection Patterns

**Single Select Options**:
```typescript
// Card-style buttons
backgroundColor: tokens.colors.background.offWhite
borderWidth: 2
borderColor: 'transparent' // or blue when selected

// Selected state
borderColor: tokens.colors.nutrition.blue
backgroundColor: tokens.colors.nutrition.blue + '15' // 15% opacity
```

**Multi-Select (e.g., workout days)**:
```typescript
// Day circles
width: 48px
height: 48px
borderRadius: 24px

// Selected
backgroundColor: tokens.colors.workout.red
color: white

// Unselected
backgroundColor: tokens.colors.background.offWhite
color: tokens.colors.text.secondary
```

### Value Visualization Patterns

**Apple Fitness-Style Rings** (ValueDemoDailyNutritionScreen):
- Concentric circles using SVG
- Partial arcs with strokeDasharray
- Rotated -90° to start at top
- Stroke width: 12px
- Ring gaps for depth
- Matching color indicators below

**Timeline Graph** (ValueDemoSuccessPathScreen):
- Diagonal line with shaded area
- Badge indicators at start/end points
- Pace badge at top
- Y-axis labels (weights)
- X-axis labels (dates)

**Weekly Calendar** (ValueDemoWorkoutsScreen):
- 7-column grid
- Day abbreviations (M, T, W, T, F, S, S)
- Selected days highlighted
- Compact, scannable layout

### Modal/Overlay Patterns

**Paywall Modal**:
- Full screen ScrollView
- Top section: Value props
- Bottom section: Pricing + CTA
- Sticky bottom with button
- No dismiss button (intentional)

**Account Creation Modal**:
- Three options presented as cards
- Email/Google/Apple
- Skip option at bottom
- Clean, spacious layout

---

## Navigation

### Navigation Structure

**Stack Navigator Pattern** (OnboardingNavigator):
```typescript
headerShown: false // Custom headers in screens
cardStyle: { backgroundColor: tokens.colors.background.white }
```

**Screen Transitions**:
- Default: Slide from right (iOS), fade (Android)
- No custom animations currently

### Back Navigation

**Standard Pattern**:
```tsx
<TouchableOpacity onPress={() => navigation.goBack()}>
  <Text>← Back</Text>
</TouchableOpacity>
```

**Position**: Top-left, 16px from edge

---

## Animations

### Duration Scale
```typescript
instant: 100ms    // State changes (checkbox, button press)
fast: 200ms       // Toasts, micro-interactions, color transitions
normal: 300ms     // Most animations (cards, modals)
medium: 400ms     // Screen transitions, tab switches
slow: 600ms       // Progress fills, complex animations
verySlow: 800ms   // Graph updates, data visualizations
```

### Easing Curves
```typescript
easeOut: [0.25, 0.46, 0.45, 0.94]     // Entering elements
easeIn: [0.55, 0.055, 0.675, 0.19]    // Exiting elements
easeInOut: [0.645, 0.045, 0.355, 1]   // State changes
linear: [0, 0, 1, 1]                   // Continuous motion
```

### Common Animations

**Button Press**:
- Scale down to 0.95 on press
- Duration: 100ms (instant)
- Return to 1.0 on release

**Loading Indicators**:
- Continuous rotation for spinners
- Duration: 1000ms linear loop

**Screen Enter**:
- Fade in from 0 to 1
- Duration: 300ms (normal)
- Easing: easeOut

---

## Accessibility

### Touch Targets
- Minimum: 44×44px (Apple HIG standard)
- All buttons, checkboxes, and interactive elements comply

### Color Contrast
- Text on white: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio
- All color combinations tested for WCAG AA compliance

### Font Sizing
- Respect system font size preferences
- Use relative units where possible
- Test at 200% system font size

### Screen Reader Support
**TODO**: To be implemented in accessibility pass
- Descriptive labels for all interactive elements
- Proper heading hierarchy
- Announce state changes

---

## Design Tokens Reference

### Complete Token Structure
Location: `/mobile/src/theme/tokens.ts`

**Always use tokens instead of hardcoded values**:
```typescript
// ✅ GOOD
backgroundColor: tokens.colors.background.white
padding: tokens.spacing.lg

// ❌ BAD
backgroundColor: '#FFFFFF'
padding: 16
```

### Token Categories
- `colors.*` - All color values
- `typography.*` - All text styles
- `spacing.*` - All spacing values
- `shadows.*` - All shadow definitions
- `borderRadius.*` - All border radius values
- `sizes.*` - Component-specific sizes
- `animation.*` - Animation durations and easing
- `glassmorphism.*` - Glass effect settings

---

## Implementation Guidelines

### When Building New Screens

1. **Start with the layout pattern**:
   - SafeAreaView container
   - Scrollable content area
   - Fixed bottom section (if needed)

2. **Use established components**:
   - Button component for all CTAs
   - Consistent input styling
   - Standard card patterns

3. **Follow spacing system**:
   - Never use arbitrary spacing values
   - Reference tokens for all dimensions

4. **Match context theming**:
   - Nutrition screens: Blue theme
   - Workout screens: Red theme
   - Progress screens: Green theme

5. **Typography hierarchy**:
   - One Display style per screen (title)
   - Body text for main content
   - Caption for supporting info

6. **Test on devices**:
   - iPhone SE (small screen)
   - iPhone 14 Pro (standard)
   - iPhone 14 Pro Max (large)
   - Test light/dark mode compatibility

### Code Style Conventions

**Styling**:
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.white,
  },
  // Always define container first
  // Group related styles together
  // Use tokens for all values
});
```

**Component Props**:
```typescript
interface ScreenProps {
  navigation: NavigationProp;
  route?: RouteProp; // Optional
}
```

**Naming**:
- Screens: `[Feature]Screen.tsx` (e.g., `GoalTypeScreen.tsx`)
- Components: `[Name].tsx` (e.g., `Button.tsx`)
- Styles: Descriptive, match JSX (e.g., `buttonContainer`, not `container2`)

---

## Design Evolution Notes

### Session 40 Decisions
- Changed paywall title to logo font (fontSize: 34, fontWeight: '700')
- Finalized nutrition ring colors with specific saturation/luminance guidelines
- Established protein color as slightly deeper cyan (#35BEF0)
- Carbs color finalized at #7DD3FF for optimal contrast

### Future Considerations
- **Dark Mode**: Currently not implemented, but color system is ready
- **Tablet Layout**: All designs are mobile-first, tablet optimization pending
- **Localization**: Text is hardcoded, i18n system to be implemented
- **Custom Fonts**: Currently using system fonts, custom brand font TBD

---

## Quick Reference Cheat Sheet

### Most Common Patterns

**Screen Title**:
```typescript
fontSize: 32, fontWeight: '200', lineHeight: 40, letterSpacing: -1
color: tokens.colors.text.primary
```

**Primary Button**:
```tsx
<Button variant="primary" context="nutrition" size="large" fullWidth />
```

**Progress Bar**:
```typescript
height: 4, backgroundColor: rgba(0,0,0,0.06)
filled: tokens.colors.nutrition.blue
```

**Card**:
```typescript
borderRadius: 20, padding: 16, backgroundColor: white
shadow: tokens.shadows.card
```

**Section Spacing**:
```typescript
marginBottom: tokens.spacing.xl (20px)
```

---

**Document Maintained By**: Claude Code
**Last Review**: November 13, 2025
**Next Review**: Before Phase 3 Implementation
