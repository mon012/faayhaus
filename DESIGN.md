# FAAY HAUS Design System

## Brand position

FAAY HAUS is a story-led brand catalog for handmade teak objects. It is not an
online store: the site explains the material, makers, use, and care before a
visitor knowingly continues to Amazon to purchase.

The visual tone is premium but grounded—documentary, warm, useful, and human.
Avoid luxury styling, ornamental excess, shopping-bag language, cart patterns,
and price-led merchandising.

## Visual world

- Deep workwear blue anchors the brand and gives the interface confidence.
- Warm off-white and teak tones keep product and community photography natural.
- Leaf green is a restrained accent for provenance and sustainability cues.
- Photography should show hands, material, process, everyday kitchens, and the
  honest variation of wood. Avoid anonymous white-box ecommerce imagery as the
  only visual language.
- Composition is editorial: strong image fields, clear type hierarchy, crisp
  modules, generous negative space, and occasional asymmetric layouts.

## Core tokens

The implementation source of truth is `src/styles/global.css`.

- Canvas: warm off-white
- Primary ink: near-black blue
- Brand field: deep workwear blue
- Material accent: teak brown
- Living accent: restrained leaf green
- Lines: low-contrast neutral rules
- Corners: mostly square or subtly softened; never pill-heavy
- Shadows: minimal; separation should come from spacing, color, and rules

## Typography

- Headlines are compact, confident, and editorial rather than decorative.
- Body copy stays highly readable with comfortable line length and leading.
- Labels, prices, paths, and metadata use smaller restrained type.
- Sentence case is preferred. Avoid excessive uppercase and promotional copy.

## Layout

- Content width is controlled by a shared page gutter and maximum width.
- Homepage sequence: origin and material → brand story → selected objects →
  people and process → useful editorial content.
- Product pages use a gallery-and-information split on larger screens and a
  single reading flow on mobile.
- Product grids prioritize image and object name. Price is explicitly labeled
  as an Amazon reference, not an onsite transaction.

## Components

### Header

- Keep the original FAAY HAUS wordmark treatment.
- Primary navigation: Products, Our craft, Stories, About.
- No shopping bag, cart count, account, or checkout affordance.
- Mobile uses a native disclosure menu with a clear accessible label.

### Buttons and links

- Primary onsite actions use direct language such as “Explore the products.”
- Product purchase actions must say that they continue to Amazon and open the
  external destination intentionally.
- Editorial text links may use a restrained arrow to signal progression.

### Product cards

- Link first to the FAAY HAUS product detail page, not directly to Amazon.
- Show product title, price reference, and a detail-page action.
- Never add quantity controls, quick-add, cart icons, or sale urgency.

### Product detail

- Lead with useful product imagery and concise specifications.
- Explain material, making, care, and natural variation where source content
  supports it.
- Amazon is the sole purchase destination; the CTA must remain transparent.

### Stories

- Preserve original article HTML so video, PDF, and other embeds can render.
- Keep story cards editorial and information-led rather than promotional.

## Motion

- Motion is optional and restrained: short fades or small translations only.
- Respect `prefers-reduced-motion`.
- Do not use looping decoration, parallax, or motion that competes with reading.

## Responsive behavior

- Desktop navigation collapses to the disclosure menu at the mobile breakpoint.
- Multi-column grids become one column without shrinking text below readable
  sizes.
- Product imagery keeps natural proportions and remains the visual priority.
- Touch targets remain comfortably sized and keyboard focus stays visible.

## Content and migration rules

- WordPress is not required at runtime; content and media ship with the static
  Astro build.
- Preserve existing public slugs whenever possible for SEO continuity.
- Legacy store, cart, checkout, and account URLs redirect to `/products/`.
- Canonical URLs use `https://faayhaus.com`.
- Any future content transformation must retain iframe, video, object, embed,
  and PDF references instead of reducing articles to plain text.

## Design guardrails

- Prefer story, provenance, and useful detail over price competition.
- Premium means clarity, confidence, material honesty, and finish—not luxury.
- Every commerce cue must accurately reflect that checkout happens on Amazon.
- New sections should strengthen the path from maker and material to object and
  use; generic ecommerce modules should not be introduced.
