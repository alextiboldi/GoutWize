# GoutWize Design System

## Color Palette

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `gw-blue` | `#4A7C9E` | Primary brand, buttons, links, interactive elements |
| `gw-blue-dark` | `#3A6280` | Hover states for primary elements |
| `gw-navy` | `#2C3E50` | Headings, dark sections, text color |
| `gw-navy-deep` | `#1a252f` | Footer background, deepest dark |
| `gw-orange` | `#E8956F` | Accent, secondary CTAs, attention |
| `gw-green` | `#7FB069` | Success, positive indicators, checkmarks |
| `gw-gold` | `#F4D35E` | Highlights, badges, star ratings |
| `gw-gold-dark` | `#d4a712` | Gold text on light backgrounds |
| `gw-cyan` | `#A8DADC` | Subtle accent, text on dark backgrounds |

### Neutral & Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#ffffff` | Page background |
| `foreground` | `#2C3E50` | Default text |
| `gw-bg-light` | `#EFF6FA` | Light section backgrounds, cards |
| `gw-bg-mid` | `#E3EDF4` | Alternate section backgrounds |
| `gw-border` | `#D6E4ED` | Borders, dividers |
| `gw-text-gray` | `#6C757D` | Secondary/body text |

## Typography

### Font Families

- **Headings**: `Outfit` (Google Fonts) — CSS variable `--font-outfit`, class `font-heading`
- **Body**: `Plus Jakarta Sans` (Google Fonts) — CSS variable `--font-plus-jakarta`, class `font-sans`

### Weight Scale

| Weight | Usage |
|--------|-------|
| 400 (Regular) | Body text, descriptions |
| 500 (Medium) | Nav links, labels |
| 600 (Semibold) | Badges, buttons, subtitles |
| 700 (Bold) | Headings, stat values, emphasis |

### Heading Sizes

| Level | Classes | Usage |
|-------|---------|-------|
| H1 | `text-4xl sm:text-5xl lg:text-6xl font-bold` | Hero heading |
| H2 | `text-3xl sm:text-4xl lg:text-5xl font-bold` | Section headings |
| H3 | `text-xl font-bold` | Card titles, sub-sections |
| H4 | `font-bold text-lg` | Feature titles, list headings |

## Layout

### Container

- Max width: `max-w-7xl` (80rem / 1280px)
- Padding: `px-4 sm:px-6 lg:px-8`
- Centered: `mx-auto`

### Section Spacing

- Standard: `py-20 lg:py-28`
- CTA: `py-16 lg:py-24`
- Hero: `py-20 lg:py-32`

### Responsive Grid

- 2-column: `grid lg:grid-cols-2 gap-12`
- 3-column: `grid md:grid-cols-3 gap-8`
- 4-column (footer): `grid md:grid-cols-2 lg:grid-cols-4 gap-8`

## Component Patterns

### Buttons

**Primary**: `bg-gw-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gw-blue-dark transition-all`

**Outline**: `border-2 border-gw-blue text-gw-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gw-blue hover:text-white transition-all`

**White (on dark bg)**: `bg-white text-gw-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all`

**Nav CTA**: `bg-gw-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-gw-blue-dark transition-colors`

### Cards

- Background: `bg-gw-bg-light` or `bg-white`
- Border radius: `rounded-2xl`
- Padding: `p-8`
- Hover: `hover:shadow-xl transition-shadow duration-300`

### Badges / Tags

`inline-block bg-{color}/10 text-{color} px-4 py-2 rounded-full text-sm font-semibold`

### Icon Containers

- Small: `w-8 h-8 rounded-full flex items-center justify-center`
- Medium: `w-12 h-12 rounded-xl flex items-center justify-center`
- Large: `w-14 h-14 rounded-xl flex items-center justify-center`
- Step number: `w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold`

## Icon System

**Library**: Lucide React (`lucide-react`)

| Icon | Usage |
|------|-------|
| `Stethoscope` | Medical/conflicting advice |
| `CircleHelp` | Questions/trial & error |
| `UsersRound` | Community/people |
| `CheckCircle` | Verified/trust badges |
| `Check` | List checkmarks |
| `ArrowRight` | Link arrows |
| `TrendingUp` | Analytics/evidence |
| `Shield` | Privacy/security |
| `Heart` | Love/support |
| `Star` | Ratings |
| `Menu` / `X` | Mobile navigation toggle |

## Section Backgrounds

| Section | Background |
|---------|------------|
| Header | `bg-white shadow-sm` (sticky) |
| Hero | `bg-gradient-to-br from-gw-bg-light via-gw-bg-mid to-gw-border` |
| Pain Points | `bg-white` |
| Community | `bg-gradient-to-br from-gw-navy to-gw-navy-deep` |
| How It Works | `bg-gw-bg-light` |
| Features | `bg-white` |
| CTA | `bg-gradient-to-r from-gw-blue to-gw-blue-dark` |
| Footer | `bg-gw-navy` |

## Responsive Breakpoints

Uses Tailwind CSS v4 default breakpoints:

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| `sm` | 640px | Button row layouts, floating cards |
| `md` | 768px | 3-column grids, footer columns |
| `lg` | 1024px | 2-column hero, desktop nav, full layouts |
