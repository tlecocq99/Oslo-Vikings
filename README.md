# Oslo Vikings — Norwegian American Football Team Website

A modern, content-driven site for the Oslo Vikings American Football club built with Next.js 15, TypeScript, Tailwind CSS, and the App Router.

## 🌐 Live Site

Catch the latest roster, schedule, and club news at **[oslovikings.vercel.app](https://oslovikings.vercel.app/)**.

## 🏈 Feature Highlights

- **Animated Rosters** – Multi-team roster switcher with side filters, grid/list toggles, and IntersectionObserver-powered reveal animations that keep cards evenly sized across breakpoints.
- **Real-Time Standings** – Serverless API route scrapes Superserien standings on a timed cache and pipes results into a sortable, refreshable table with team logos.
- **Schedule & Events Hub** – Tabs for upcoming fixtures and completed results, reusable `GameCard` UI, and a marquee-style `Upcoming Events` bar blending team games with club-wide happenings.
- **News Center with Search** – Category filters, live search, featured story spotlight, and responsive news grid.
- **Interactive Contact Page** – Validated contact form with success states plus a dynamically loaded Google Map displaying key club locations.
- **Recruitment Funnel** – Benefits grid, anchored CTAs, and an accordion FAQ to drive prospective players to interest forms.
- **Sponsor & Fan Experience** – Splash screen intro, dark mode support, hero sections, sponsor highlights, and consistent Viking-themed branding.

## 🧱 Tech Stack

- **Next.js 15** with App Router & Route Handlers
- **TypeScript** for type-safe components and services
- **Tailwind CSS** + `tailwind-merge` for utility-first styling
- **shadcn/ui** component primitives (accordion, tabs, sheet, dialog, etc.)
- **Lucide Icons** for consistent iconography
- **Cheerio** for HTML scraping of league standings
- **Google Sheets API** for roster and schedule content ingestion
- **Vercel** hosting with ISR/route revalidation

## � Environment Variables

Set the following secrets in your hosting platform to enable live data integrations:

| Variable                                                       | Purpose                                                                                                               |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `SHEET_ID`                                                     | Google Sheet ID that stores roster and schedule data.                                                                 |
| `SHEET_NAME` / `SHEET_RANGE` (optional)                        | Override defaults for sheet tab name and value range.                                                                 |
| `SERVICE_ACCOUNT_JSON`                                         | Service-account JSON blob for Google Sheets access (used by `lib/googleSheets.ts`).                                   |
| `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Alternate credential set used by `app/services/googleSheets.ts` for server-only fetching.                             |
| `GOOGLE_EVENTS_SHEET` / `GOOGLE_EVENTS_RANGE` (optional)       | Configure the tab name and range for the unified upcoming events feed consumed by the homepage bar and `/api/events`. |
| `CACHE_TTL` (optional)                                         | Overrides the cached lifetime (seconds) for Google Sheets fetches.                                                    |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`                              | Enables the interactive map on the contact page.                                                                      |

> Tip: store secrets in Vercel project settings or your preferred secret manager; never commit them to the repository.

## �🗺️ Architecture & Data Flow

- **Google Sheets Content Pipeline** – `app/services/googleSheets.ts` authenticates with Google and hydrates roster (`fetchRoster`) and schedule (`fetchSchedule`) data for the roster pages and schedule tables.
- **Superserien Standings API** – `app/api/standings/route.ts` calls `fetchStandings`, scraping standings data, caching the payload, and exposing it to the client-side `Standings` component with on-demand refresh.
- **Roster Experience** – `RosterSwitcher` wires up global roster UI state (filters, view mode, selected team) and renders `RosterClient` rows that animate into view.
- **UI Composition** – Shared UI primitives live in `components/ui`, while page-level compositions reside under `app/components` for reusability across routes.
- **Dark Mode & Theming** – `next-themes` integrates with Tailwind to deliver seamless dark/light palettes and toggles persisted per user.

## 📈 Monitoring & DX

- **Error Boundary** – `app/components/ErrorBoundary.tsx` shields the UI and surfaces stack traces during development.
- **Vercel Analytics & Speed Insights** – baked into `app/layout.tsx` for traffic tracking and performance telemetry.
- **Theming Provider** – `next-themes` keeps light/dark preferences synced via the `ThemeProvider` wrapper.
- **Splash Screen Experience** – `SplashScreen` component orchestrates branded entry animations without blocking page content.

## 🎨 Design System

### Color Palette

- **Viking Red**: `#AC1416` – Primary brand color
- **Viking Red Dark**: `#7C0F11` – Depth variant for hover/active states
- **Viking Silver**: `#C0C0C0` – Secondary accent for UI chrome
- **Viking Charcoal**: `#2C2C2C` – Base neutral for dark surfaces
- **Viking Surface Alt**: `#333333` – Elevated dark surfaces/cards

### Typography

- **Inter** – Primary sans-serif for body copy and UI
- **Teko** – Display font for hero stats and scoreboard callouts

### Utility Highlights

- Tailwind config encapsulates brand colors, drop shadows, and animations.
- Shared helpers in `lib/utils.ts` pair with `tailwind-merge` for safer class composition.

## 📁 Project Structure

```text
Oslo-Vikings/
├── app/
│   ├── api/standings/              # Route handler exposing live standings JSON
│   ├── components/                 # Reusable feature components (Hero, RosterClient, GoogleMap, etc.)
│   ├── config/                     # Position group metadata & constants
│   ├── services/                   # Google Sheets + standings data fetchers
│   ├── types/                      # Shared TypeScript types (Player, Game, etc.)
│   ├── about/ | contact/ | news/   # Top-level routes
│   ├── recruitment/ | schedule/    # Specialized marketing & schedule pages
│   ├── team/                       # Roster hub with dynamic subroutes
│   ├── globals.css                 # Base styles
│   ├── layout.tsx                  # Root layout & theme provider
│   └── page.tsx                    # Home page composition
├── components/ui/                  # shadcn/ui primitives wired with Tailwind tokens
├── hooks/                          # Custom hooks (e.g., toast helpers)
├── lib/                            # Shared utilities and configuration glue
├── public/                         # Static assets and imagery
├── tailwind.config.ts              # Tailwind theme customization
├── next.config.js                  # Next.js configuration (includes Storyblok, analytics, etc.)
└── package.json                    # Dependencies & scripts
```

## 🔎 Key Pages & Components

- **`app/page.tsx`** – Landing experience with splash screen, stats, featured news, and sponsor grid.
- **`app/team/page.tsx`** – Roster index routing to team-specific lineups and coaching staff spotlights.
- **`app/schedule/page.tsx`** – Season overview with tabbed upcoming/results views plus live standings.
- **`app/news/page.tsx`** – Searchable news archive with category filters and featured story hero.
- **`app/contact/page.tsx`** – Contact form, quick action cards, and a dynamic Google Map of locations.
- **`app/recruitment/page.tsx`** – Player pipeline, program benefits, and accordion-based FAQs.

## � Content Management

Roster, schedule, and several homepage modules are populated from shared Google Sheets tabs:

1. **Log into the Oslo Vikings Google Sheets workspace.**
2. **Edit the relevant tab** (e.g., `Players`, `Schedule`).
3. **Save the sheet** — changes propagate automatically via scheduled ISR and API cache refresh.

### Content Reference

#### Player Rows (`Players` sheet)

- **Name / Position / Number** – Displayed on cards and modals (number automatically cleans `#`).
- **Height & Weight** – Optional stats shown in detail view.
- **Bio** – Short blurb surfaced in list/desktop cards.
- **Image & Alt Text** – Player portrait; falls back to branded filler if omitted.
- **Nationality** – Renders flag badge using `country-flag-icons`.

#### Schedule Rows (`Schedule` tab)

- Smart header detection maps sheet columns into schedule table keys.
- Supports upcoming and completed games (scores become available fields when provided).
- Entries surface in page tabs and `TeamScheduleSection` modules.
- Rows in each team tab also power the homepage `UpcomingEventsBar` (only future dates are shown automatically).

#### Upcoming Events (`UpcomingEvents` tab)

- Provide a header row with columns such as `Date`, `Time`, `Title`, `Team`, `Type`, `Location`, `Description`, `Home Team`, and `Away Team`.
- Rows are parsed into unified events that power the homepage bar and `/api/events` endpoint.
- Set the `Team` value to `All` for club-wide happenings so they remain visible regardless of the team filter.
- Mark the `Type` as `Game`, `Match`, or include both `Home Team` and `Away Team` to render fixtures with versus styling.
- Avoid duplicating regular season games here—team schedules already sync into the bar. Use this tab for club-wide events, clinics, fundraisers, and other non-schedule highlights.

#### News Articles (`News` tab)

- Managed entirely through the shared Google Sheet so editorial updates publish automatically.
- Follow the [News Google Sheet Guide](./docs/news-sheet-guide.md) for column definitions, image placement rules, and troubleshooting tips.
- Articles marked as `Featured` power the hero story on `/news` and flow onto the homepage "Latest News" grid.

## 🛡️ Accessibility & Performance

- Semantic headings, aria labels, and keyboard navigable menus.
- High-contrast Viking palette tuned for WCAG 2.1 AA compliance.
- Lazy-loaded imagery, dynamic imports, and route segment streaming for faster interactions.
- Splash screen and row animations respect reduced motion preferences.

## ⚙️ Deployment

- Hosted on **Vercel** with automatic previews for pull requests.
- Incremental revalidation keeps roster, schedule, and standings fresh without manual redeploys.

## 🤝 Contributing

Have improvements or bug fixes? Open an issue or submit a pull request on GitHub. Internal contributors can reference the engineering handbook for workflow details.

## � License

Released under the MIT License — see `LICENSE` for terms.

---

Built with ❤️ for the Oslo Vikings community.
