# TIBOX Design System

> Status: complete — tokens, foundations, 7 components, marketing-site UI kit and
> commercial slides are all in place. See the index at the end of this file.

The brand + UI system for **TIBOX**, a Chilean B2B technology company that helps
organizations optimize their operations through IT infrastructure, support,
cybersecurity, monitoring, web development, digital transformation, automation
and managed technology services. TIBOX positions itself as a **consultative
technology partner** — every artifact should read as professional, trustworthy,
innovative, secure and forward-looking.

> Audience is **B2B**: companies and organizations. Avoid informal or cluttered
> styles. Designs are clean, professional, conversion-focused, with strong
> hierarchy and breathing room.

---

## Source materials (provided by the client)

These are the original brand assets this system was built from. No external
links/Figma/codebase were supplied — everything derives from the uploads below.

| File | Use |
|---|---|
| `logo-tibox.png` | Primary wordmark (white text + tri-color cube). For dark backgrounds. |
| `color fondo web@500x-80.jpg` | Corporate background — deep navy gradient. |
| `logo-{analitica,ciberseguridad,consultoria-ti,infraestructura,soluciones-cloud,soluciones-inteligentes}.svg` | Per-business-unit badge icons. |
| `color {unit}.jpg` × 6 | The signature gradient for each business unit. |

Derived assets created here: `assets/logo-tibox-dark.png` (navy wordmark for
light backgrounds) and `assets/mark-cube.png` (cube-only mark for
favicons/avatars).

---

## The brand at a glance

**TIBOX** = **T I B [O→cube] X**. The "O" in the wordmark is a 3-face isometric
cube — the heart of the identity. Its three faces give the brand its accent
colors:

- **Yellow** `#FFC600` (top face)
- **Cyan** `#00C8FA` (left face) — the primary interactive accent
- **Orange** `#FF6707` (right face)

The corporate surface is a **deep navy** (`#021233` / `#001544`). Navy should
predominate in main/hero sections to convey professionalism and brand
coherence; the cube colors appear as accents, highlights and dividers.

### Six business units — each owns a gradient

Every service line has a fixed identity gradient. Use the unit's gradient (and
its matching badge icon in `assets/`) on any page, section, icon or graphic for
that service. Never recolor a unit.

| Unit | Gradient | Token |
|---|---|---|
| Analítica TI | amber → yellow | `--u-analitica-g` |
| Ciberseguridad | magenta → coral-red | `--u-ciber-g` |
| Consultoría TI | amber → coral | `--u-consultoria-g` |
| Infraestructura TI | blue → cyan | `--u-infra-g` |
| Soluciones Cloud | violet → indigo | `--u-cloud-g` |
| Soluciones Inteligentes | lime → green | `--u-smart-g` |

---

## CONTENT FUNDAMENTALS — how TIBOX writes

TIBOX copy is **Spanish (Chile), B2B, consultative**. It sells outcomes
(continuity, security, efficiency), not features.

- **Voice & person:** speaks *to* the client as a partner — uses **"tu empresa",
  "tu organización", "tus procesos"** (second person) and **"nosotros / en
  TIBOX"** for the company. Warm but authoritative — "tu socio tecnológico".
- **Tone:** professional, confident, reassuring. Conveys *technology, trust,
  security, innovation and closeness* (cercanía). Never hypey or jokey.
- **Casing:** Sentence case for body and most headings. Business-unit names are
  Title Case proper nouns (Analítica TI, Soluciones Cloud). UPPERCASE reserved
  for short eyebrows/overlines (e.g. `SOCIO TECNOLÓGICO`) and never for long
  text.
- **Headlines:** short, benefit-led, often noun phrases. Bold weight for
  hierarchy. e.g. *"Continuidad operacional sin interrupciones"*,
  *"Ciberseguridad que protege tu negocio"*, *"Tecnología que impulsa tu
  crecimiento"*.
- **Subcopy:** one or two clean sentences. Concrete, jargon-aware but not
  jargon-drowned. Explains the outcome for the business.
- **CTAs:** clear, action-first verbs — *"Agenda una asesoría"*, *"Solicita una
  cotización"*, *"Conversemos"*, *"Conoce nuestros servicios"*.
- **Numbers / proof:** soft, credible proof points (uptime %, response time,
  years, clients) — used sparingly, never a wall of vanity stats.
- **Emoji:** **none.** Not part of the brand. Use the cube, badge icons or a
  line-icon set instead.
- **Vibe words to lean on:** infraestructura, monitoreo, conectividad, redes,
  automatización, inteligencia artificial, continuidad, ciberseguridad,
  transformación digital, eficiencia.

---

## VISUAL FOUNDATIONS

**Brand inspiration — the Universe.** TIBOX's conceptual anchor is the
**cosmos in constant expansion**, mirroring the company's own growth. This
motif appears across the live tibox.cl site, brochures, banners, pendones and
commercial decks as **starfields, nebulas and deep-space backdrops**. Use it
on hero / above-the-fold sections, section dividers, and any premium
full-bleed visual where the brand wants to convey scale, technology and
forward momentum. Keep starfields subtle (low-opacity stars, soft nebula
glows) layered behind the navy corporate gradient — never busy enough to
compete with copy.

**Colors.** Deep navy is the hero surface; cyan is the primary accent for
interactive elements and tech emphasis; yellow + orange are secondary accents
used for energy/highlights and within the cube spectrum. Each business unit
brings its own gradient when that service is the subject. Light surfaces are
near-white (`--gray-50`/`--white`) with navy text for content-heavy pages.

**Headline gradient.** The signature title treatment is a **cyan → blue**
gradient (`--grad-title`, exposed via `.tbx-gradient-text`) — celeste/azul must
predominate, matching the live tibox.cl hero. Apply it to the emphasized word(s)
in big headlines on the navy surface and to large display numbers. The full cube
spectrum (`--grad-cube`) is reserved for thin decorative accent bars only — never
for title text.

**Typography.** Single family — **Titillium Web** — everywhere. Display and
headings use **700 (bold)**, with tight tracking
(`--ls-tight`). Body is 400 at ~17px with a 1.6 line-height for legibility.
Eyebrows/overlines are 12px, 700, uppercase, `0.16em` tracking, usually in cyan.

**Spacing & layout.** 8px base grid. Generous, even whitespace; consistent
alignment; clear, well-differentiated sections. Container max ~1200px with
fluid padding. Section vertical rhythm is large (`--section-y`,
clamp 4–8rem). Balanced visual weight — never crowded.

**Backgrounds.** Primary sections use the navy corporate gradient
(`--grad-corporate`), most often layered with a **cosmic backdrop** (starfield
+ soft nebula glows) to carry the Universe motif, or — for product/UI
contexts — with the faint **tech grid overlay** (`.tbx-grid-overlay`, cyan
lines at 6% on a 48px grid) to evoke infrastructure/connectivity. Light
sections are flat near-white. Use the cube spectrum gradient (`--grad-cube`)
only for thin accent dividers or a single hero flourish — never as a full page
wash, and never on title text (use `--grad-title` for that).

**Effects.** Subtle and premium: soft cyan glow on primary CTAs
(`--glow-cyan`), light **glassmorphism** for cards floating over the navy
(`.tbx-glass`, 14px blur, white 8% fill, white 16% border). Avoid heavy,
saturated purple gradients and avoid emoji cards.

**Borders & radii.** Soft modern corners — cards 16px (`--radius-lg`),
buttons/inputs 12px, pills 999px. Borders are 1px, low-contrast
(`--border-subtle` on light, white-12% on dark).

**Shadows.** Navy-tinted, restrained. `--shadow-md`/`--shadow-lg` for cards on
light; `--shadow-dark` for elements on navy; the cyan glow is reserved for
interactive emphasis only.

**Cards.** On light: white fill, 16px radius, 1px subtle border + `--shadow-md`,
generous internal padding. On dark: glass panel (blurred, white-alpha border) or
a slightly elevated navy (`--navy-800`) with white-12% border.

**Motion.** Purposeful and quick. Fades + small translateY rises on entrance
(`--ease-out`, 220–420ms). Hovers lift cards 2–4px and deepen shadow. No bounce
on UI chrome (spring easing reserved for playful accents only). Always honor
`prefers-reduced-motion`.

**Hover states.** Solid buttons darken (cyan → `--accent-hover`) and gain glow;
ghost/outline buttons fill faintly. Links underline. Cards rise + shadow.

**Press states.** Slight scale-down (~0.98) and/or darker shade
(`--accent-press`). Quick `--dur-fast`.

**Imagery vibe.** Lead with the **Universe** — starfields, nebulas, soft
deep-space glows tinted cyan/blue against navy — to carry the expansion
motif. When real photography is needed, lean cool/tech-forward: data centers,
networks, abstract connectivity, dashboards, automation. Cyan/blue-leaning
with navy depth; clean, not grainy. Pair photos with a navy overlay so white
text stays legible.

**Iconography.** Line-style, modern, consistent stroke — see ICONOGRAPHY below.

---

## ICONOGRAPHY

- **Business-unit badges** (`assets/logo-*.svg`): each unit has a filled badge
  glyph at 500×500 (shield+check for Ciberseguridad, etc). These are the
  canonical service icons — use them on service cards, section headers and
  navigation for that unit. They carry their unit's colors; don't recolor.
- **The cube** (`assets/mark-cube.png`): brand mark for favicons, avatars,
  loaders and small-space lockups.
- **General UI icons:** TIBOX has no proprietary UI icon font. We standardize on
  **[Lucide](https://lucide.dev)** (loaded from CDN) — a modern, even-stroke,
  rounded line set that matches the brand's clean tech feel. Use ~1.75–2px
  stroke, `currentColor`, sized 18–24px. This is a **substitution** flagged for
  the client (see CAVEATS).
- **Emoji:** never used as iconography.
- **Unicode glyphs:** avoid as icons; use Lucide instead.

To use Lucide in a page:
```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="shield-check"></i>
<script>lucide.createIcons();</script>
```

---

## Index / manifest

**Root**
- `styles.css` — global entry (import-only). Consumers link this.
- `readme.md` — this guide.
- `SKILL.md` — Agent Skills wrapper.

**Tokens** (`tokens/`)
- `fonts.css` — Titillium Web (Google Fonts).
- `colors.css` — navy scale, cube accents, 6 unit gradients, semantic aliases.
- `typography.css` — family, weights, type scale, tracking.
- `spacing.css` — 8px grid, radii, shadows, motion, layering.
- `base.css` — element defaults + helpers (`.tbx-corporate-bg`,
  `.tbx-grid-overlay`, `.tbx-glass`, `.tbx-overline`, `.tbx-gradient-text`).

**Assets** (`assets/`)
- `logo-tibox.png` (white), `logo-tibox-dark.png` (navy), `mark-cube.png`,
  `bg-corporate.jpg`, and 6 `logo-*.svg` unit badges.

**Foundations** (`foundations/`) — specimen cards for the Design System tab
(colors, type, spacing, brand).

**Components** (`components/`) — reusable React primitives (Button, Badge,
Card, ServiceCard, Input, etc). See each directory's card + `.prompt.md`.

**UI kits** (`ui_kits/`)
- `website/` — TIBOX marketing site recreation (hero, services, etc).

**Slides** (`slides/`) — branded commercial-presentation sample slides.

---

## Using this system

- Link `styles.css`; use the semantic aliases (`--bg-base`, `--surface-card`,
  `--text-heading`, `--accent`…) rather than raw scale values where possible.
- Reach for the business-unit gradient + badge whenever a specific service is
  the subject.
- Components read everything from CSS custom properties — restyle by overriding
  tokens, not by editing component internals.
- React components are bundled to `_ds_bundle.js` and exposed on the global
  `window.TIBOXDesignSystem_6dc0b3` (e.g. `const { Button, ServiceCard } =
  window.TIBOXDesignSystem_6dc0b3`).
- Slides (`slides/`) are standalone 1280×720 HTML — copy one and edit its content
  to build a commercial presentation.
