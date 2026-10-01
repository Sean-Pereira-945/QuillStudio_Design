# QuillStudio website

Marketing site for QuillStudio, the Salesforce-native document generation app by Exceller Tech.

Built with Vite, React 19, TypeScript, Tailwind CSS, framer-motion, GSAP (magnetic cursor) and Lenis (smooth scrolling).

## Run

```bash
npm install
npm run dev            # local development at http://localhost:5173
npm run build          # type-check and production build in dist/
npm run preview        # serve the production build locally
npm run lint           # oxlint
npm run build:single   # one self-contained preview file in dist-single/index.html
```

## Page structure

The page is a stack of sections, in this order (`src/App.tsx`):

| Section | File | Notes |
| --- | --- | --- |
| Landing | `sections/Hero.tsx` | WebGL wave animation on a warm off-white base; floating one-click illustration |
| The problem | `sections/Problem.tsx` | Stacked card deck that cycles on a timer, by click, swipe or the dots |
| How it works | `sections/Demo.tsx` | Looping three-step demo: Word template, processing, PDF |
| Features | `sections/Capabilities.tsx` | Six equal-height cards with pointer tilt, lift and glow |
| Pricing | `sections/Pricing.tsx` | Single plan card; values come from `site.plan` |
| Get early access | `sections/Cta.tsx` | Enquiry form (see below) |
| Footer | `sections/Footer.tsx` | AppExchange trust strip, links, legal |

### Scrolling

`src/lib/use-smooth-scroll.ts` sets up Lenis smooth scrolling. On desktops with a mouse or trackpad it also snaps one section per gesture. Each section is at least one screen tall there (`.scene-inner` in `src/index.css`), so a snapped view shows exactly one section. Snapping is off on touch devices and for reduced motion.

The root font size scales with viewport height on desktop (`src/index.css`), so each section's content fits on one screen down to about 640px tall.

### Motion and accessibility

All animation respects `prefers-reduced-motion`: the waves hold still, the card deck and demo stop auto-playing, and scroll reveals only fade.

## Enquiry form

The form posts JSON to `/api/leads`, the same lead API that www.quillstudio.tech uses:

```json
{ "first_name": "", "last_name": "", "email": "", "company": "",
  "salesforce_edition": "", "biggest_challenge": "", "phone": "" }
```

That API does not accept cross-origin browser requests, so the request goes to this site first and is forwarded server-side:

- **Production:** `vercel.json` rewrites `/api/leads` to `https://www.quillstudio.tech/api/leads`. This needs Vercel hosting; on other hosts, add an equivalent proxy rule.
- **Local:** `vite.config.ts` proxies `/api/leads` the same way for `npm run dev` and `npm run preview`.

The edition and challenge option values in `Cta.tsx` match the live site's, so leads stay consistent. If the lead API ever rejects requests from this domain, whoever maintains it needs to allow it.

## Configuration

Every link, asset and price lives in `src/config/site.ts`.

### Before launch

- [ ] `appExchangeUrl`: the real AppExchange listing (currently the AppExchange home page). Then set `appExchangeConfirmed: true` to show the hero's AppExchange link.
- [ ] `contactEmail`: a fallback shown if the form fails to send.
- [ ] `bookDemoUrl`: a booking link (Calendly, HubSpot and so on). Until set, "Book a demo" scrolls to the form.
- [ ] `docsUrl`, `helpUrl`: footer links stay hidden until these are set.
- [ ] `privacyUrl`, `termsUrl`, `cookiesUrl`: legal links stay hidden while they are `#`.
- [ ] Replace the footer badge's Salesforce logo with the official "Available on AppExchange" badge from the Salesforce Partner Community once the listing is live.
- [ ] Confirm the trust strip copy ("Trusted by Salesforce organizations worldwide", the data-retention footnote) is accurate.

### Brand assets

Served from `public/brand/`:

- `quillstudio-logo.png`, `exceller-tech-logo.png`: shown in the navbar and footer. If a file is missing, a text wordmark stands in.
- `salesforce-logo.svg`: used in the footer's AppExchange badge.

## Where things live

```
src/
  App.tsx                 section order
  config/site.ts          links, assets, pricing plan
  index.css               theme tokens, section spacing, glass buttons, cursor
  components/
    sections/             Hero, Problem, Demo, Capabilities, Pricing, Cta, Footer
    layout/               Navbar, SmudgeLayer, SceneStack (section wrapper and tones), Logo
    ui/                   animated-gradient, glass-button, gradient-card, magnetic-cursor, reveal
  lib/                    use-smooth-scroll, use-media, utils
public/brand/             logos
vercel.json               /api/leads rewrite
```

The hero illustration sits in the `HeroObjectSlot` component in `Hero.tsx` (`data-slot="hero-3d"`), ready to be swapped for a 3D asset.
