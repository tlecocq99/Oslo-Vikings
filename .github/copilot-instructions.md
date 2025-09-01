# Oslo Vikings Website - AI Coding Agent Instructions

## Project Overview

This is a **Next.js 15.5.2** sports team website for the Oslo Vikings American Football team, built with **App Router**, **TypeScript**, and **Tailwind CSS**. The site uses **shadcn/ui components** and follows modern React patterns.

## Architecture & Key Patterns

### 1. Viking Brand System (Essential)

- **Custom color palette** in `tailwind.config.ts`:
  - `viking-red`: `#C41E3A` (primary)
  - `viking-gold`: `#FFD700` (accent)
  - `viking-charcoal`: `#1F2937` (text)
- **Background images**: All use `/images/` paths (served from `public/images/`)
- **Pattern**: Background image + dark overlay + white text for hero sections

### 2. Navigation Architecture

- **Two-tier structure**: Banner with background image + red navigation bar below
- **Mobile responsive**: Hamburger menu with dropdown
- **Styling pattern**: White text on image backgrounds, red hover states
- **Fixed positioning**: `sticky top-0 z-50` for persistent navigation

### 3. Component Patterns

- Use `prop || "fallback"` pattern for optional props
- Image handling: Support background images via `style={{ backgroundImage: \`url(\${imagePath})\` }}`

#### Page Structure

```tsx
<Navigation />
<main className="min-h-screen">
  {/* Hero with background image */}
  {/* Content sections */}
</main>
<Footer />
```

### 4. Static Assets Organization

```
public/images/
├── navImg.avif          # Navigation background
├── backgrounds/         # Hero section backgrounds
└── players/            # Player photos (named by player)
```

## Development Workflows

### Adding New Components

1. Create component in `app/components/`
2. Define interface with appropriate prop types
3. Use Viking brand colors and styling patterns
4. Follow responsive design patterns

### Styling Guidelines

- Use Viking brand colors from Tailwind config
- Background images: `bg-cover bg-center bg-no-repeat`
- Overlays: `bg-black/30` to `bg-black/50` for text readability
- Shadows: `drop-shadow-lg` or `drop-shadow-2xl` for text over images

### Critical Type Patterns

- **Status types**: Use literal unions like `"upcoming" | "live" | "completed"` with `as const`
- **Player data**: Always include `image?: string` for background images

## Build Configuration

- **Static export**: `output: 'export'` in `next.config.js`
- **Image optimization**: Disabled (`unoptimized: true`)
- **ESLint**: Ignored during builds
- **CSS optimization**: Experimental feature enabled

## Environment Variables

- `NEXT_PUBLIC_SITE_URL`: For API calls in production

## Common Pitfalls

1. **Don't move `public/` folder** - must stay at project root
2. **Type safety**: Always use literal types for status fields, not generic strings
3. **Image paths**: Use `/images/...` not `public/images/...` in code
4. **Navigation z-index**: Use `relative z-10` or higher for interactive elements

## Key Files to Reference

- `tailwind.config.ts` - Viking brand colors
- `app/components/Navigation.tsx` - Two-tier nav pattern
- `app/components/Hero.tsx` - Background image + overlay pattern
