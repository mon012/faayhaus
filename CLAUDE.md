# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static Astro site for `faayhaus.com` — a story-led brand catalog for handmade
teak objects (kitchenware, tableware, bathing goods). It is **not** an
ecommerce site: there is no cart, account, checkout, or payment flow. All
product "purchase" actions link out to the corresponding Amazon listing.
Content and media originally lived in WordPress but have been exported into
this repo (`src/data/*.json`, `public/media/`) so the production build has no
runtime dependency on WordPress.

## Commands

```sh
npm install
npm run dev       # astro dev
npm run media     # regenerate WebP siblings, icons, hero variants, OG card
npm run build     # npm run media && astro build -> dist/
npm run preview   # astro preview
npm run check     # astro check (TypeScript/template diagnostics)
```

`npm run build` runs `scripts/optimize-media.mjs` first, so a fresh clone builds
correctly without a separate media step. The script is incremental — it skips
anything whose `.webp` sibling is already newer than the source.

There is no test suite and no linter configured. `npm run check` is the
closest thing to CI validation — run it after changing `.astro` files or
`src/lib.ts`. It currently passes with zero errors; keep it that way.

Deploy target is Cloudflare Pages: build command `npm run build`, output
directory `dist`.

## Architecture

### Data flow: WordPress export → static JSON → pages

All content is pre-fetched into three JSON files under `src/data/`, shaped
like raw WordPress REST API / WooCommerce responses:

- `products.json` — array of product objects (`slug`, `name`, `summaryHtml`,
  `descriptionHtml`, `images[]`, `price`, `categories[]`, `amazonUrl`, etc.)
- `posts.json` — WP posts (articles/stories), with `title.rendered`,
  `content.rendered`, `excerpt.rendered`, `categories`, `tags`, `_embedded`
  featured media, etc.
- `pages.json` — WP pages (About, Shipping, Terms, Privacy, Return, Contact,
  ...), same shape as posts minus categories/tags relevance.

Pages import these JSON files directly and use `getStaticPaths()` to
statically render one route per item — there is no CMS or database at
runtime. When product/content data needs to change, edit the JSON exports
directly (or regenerate them from source) rather than adding a fetch layer.

### SEO data layer

Titles and meta descriptions do **not** come from the WordPress export. Product
`summaryHtml` is an Amazon spec dump ("Material Teak Color Brown Size 13″") and
WordPress excerpts are auto-truncated, so both made terrible search snippets.

- `src/data/seo.ts` — `productSeo` and `contentSeo`, keyed by slug, each with an
  optional `title` and a required `description`. Written against Google Search
  Console query/page data and DataForSEO US search volume (both pulled August
  2026; the sourcing and per-page volumes are in the file's comments). One
  primary keyword per page, and pages that would otherwise cannibalise each
  other (the 10″/13″ spatulas, the two ladles, the two large spoons) lead with
  their differentiating attribute.
- `src/data/categories.ts` — `categoryOrder` plus per-category title,
  description, tagline and multi-paragraph `intro`, shared by `/products/` and
  `/product-category/[slug]/`.
- `guidePoolFor()` in `seo.ts` — the article slugs a product or category page
  links out to. Product pages rotate through the pool by product index so links
  spread across the library rather than pointing all 35 pages at the same three.

Templates fall back to the export (`clean(product.name)`, the WP excerpt) when a
slug has no entry, so adding a product does not break the build — but it does
ship a weak snippet. Add the entry.

Brand suffix convention: products and category pages append `| FAAY`; articles
append nothing, because they compete on informational intent where the brand
name only eats into the ~60 characters Google renders.

### Routing

- `src/pages/index.astro` — homepage; hand-curates specific product/story
  slugs (see `productSlugs`/`storySlugs` arrays) rather than deriving them
  from data, so new "featured" items must be added there explicitly.
- `src/pages/products.astro` — full catalog grouped by category, in the
  fixed order defined by `categoryOrder` in `src/data/categories.ts`.
- `src/pages/product/[slug].astro` — one page per product from
  `products.json`; "related products" are same-first-category products.
- `src/pages/product-category/[slug].astro` — one page per category derived
  from the categories found on products.
- `src/pages/articles.astro` — stories/articles index (from `posts.json`).
- `src/pages/[slug].astro` — catch-all for both posts and pages (About,
  Shipping, Terms, etc.), merged into one static path list. It has
  special-cased logic for the `about` slug that reconstructs the About page
  from hand-written sections instead of rendering raw WP HTML, and it
  excludes legacy WordPress slugs (`articles`, `store`, `cart`, `checkout`,
  `my-account`, `h`) that are handled elsewhere or are dead WooCommerce
  routes. Legacy store/cart/checkout/account URLs 301-redirect to
  `/products/` via `public/_redirects`.
- `src/pages/404.astro` — not-found page.

### Content sanitization (`src/lib.ts`)

Because content HTML comes straight from a WordPress/WooCommerce export, most
shared logic exists to clean it up before rendering with `set:html`:

- `localMedia()` rewrites absolute `faayhaus.com/wp-content/uploads/...` URLs
  to the local `/media/uploads/...` path so the build doesn't depend on the
  live WordPress media server.
- `clean()` strips HTML tags and decodes HTML entities generically for
  plain-text contexts (titles, excerpts). Decode generically — the export
  contains numeric entities well beyond the obvious apostrophe and quote.
- `stripDuplicateTitle()` removes a redundant `<h1>` that WP content often
  duplicates, since the page template already renders the title once.
- `prepareEmbeddedMedia()` rewrites internal product links, converts bare
  Pinterest pin URLs into embeds, adds `loading`/`decoding`/component
  attributes, and — via `localizeTagMedia()` — repoints `src`/`srcset`/`href`
  at the archived local copy so article bodies stop hotlinking the live site.
- `money()` formats WooCommerce's minor-unit price integers using the
  product's `currency_symbol`/`currency_minor_unit`.
- `featured()` / `featuredSrcset()` / `productSrcset()` build image URLs and
  responsive `srcset` strings from the export's existing size metadata.

**Every generated media URL is checked against disk with `existsInPublic()`
before it reaches the browser.** WordPress metadata routinely lists sizes that
were never exported, and a missing `srcset` candidate does *not* fall back to
`src` — it renders as a broken image. Keep that guard on any new image helper.

Any new content page that renders raw `content.rendered`/`summaryHtml`/
`descriptionHtml` should route it through `prepareEmbeddedMedia()` (and
`clean()` for plain-text contexts) rather than injecting it directly.

### Structured data

Every page type emits JSON-LD through `Base.astro`'s `schema` prop:

- Homepage — `Organization` (legal name, postal address, contactPoint, email,
  `knowsAbout`) and `WebSite`. The Organization schema mirrors the visible NAP
  block in the footer; keep the two in sync.
- Product pages — `Product` with `sku`/`mpn` set to the Amazon ASIN (resolved
  from the `amzn.to` short link and stored as `asin` in `products.json`), plus
  `BreadcrumbList`. The `Offer` carries a `priceValidUntil` 30 days out because
  the price is a snapshot of the Amazon listing, not a price this site controls
  — re-export before that window closes or Google will see a stale offer.
- `/products/` and category pages — `ItemList` plus `BreadcrumbList`.
- Articles — `Article` (with `mainEntityOfPage`), `BreadcrumbList`, and
  `FAQPage` where the body genuinely contains question-form headings followed by
  prose. The FAQ extraction reads the rendered HTML and emits nothing below two
  pairs, because Google requires the answer to be visible on the page.

### Images

Media lives in `public/media/uploads/`, so `astro:assets` `<Image>` cannot
optimize it — plain `<img>` with an explicit `srcset` is the pattern here.

`scripts/optimize-media.mjs` writes a `.webp` sibling next to every exported
JPEG/PNG **that actually compresses smaller**, and `webpOr()` in `src/lib.ts`
serves it when present. Use `img(url)` — `webpOr(localMedia(url))` — for any
media `src` rather than `localMedia()` directly.

The "smaller or skip" guard matters: roughly 500 of the export's images are
Amazon product photos already compressed to 14–30 KB at 1200–1500px, and
re-encoding those as WebP comes out *larger*. Forcing the format would make
pages slower. Where the wins were real — full-resolution photography and the
editorial PNGs, one of which went 1.39 MB → 121 KB — 1,165 files convert and the
served payload drops from 42.7 MB to 25.3 MB.

For the two full-bleed CSS backgrounds, format was never the issue; dimensions
were. `heroVariants()` emits 960/1440/1920px WebP into `public/media/hero/`, and
`global.css` picks between them with media queries, so a phone no longer
downloads a 2560px hero.

The superseded originals are deliberately kept on disk as the `webpOr()`
fallback. They are never requested by the built site.
Reusable card markup lives in `src/components/` (`ProductCard`, `StoryCard`);
render lists through those rather than re-inlining the markup per page.

### Design constraints

`DESIGN.md` is the design system source of truth — read it before making UI
changes. The load-bearing rules that most often get violated by an ecommerce
mental model:

- No cart, account, checkout, quantity controls, quick-add, or sale-urgency
  UI anywhere, including on product cards.
- Product cards link to the internal `/product/[slug]/` detail page first,
  never straight to Amazon; only the detail page's CTA goes to Amazon, and
  that CTA must make it explicit that it continues to Amazon
  (`target="_blank" rel="sponsored nofollow noopener"`, visible "View on
  Amazon" language).
- Price is a reference only, always labeled as coming from Amazon, never
  positioned as an on-site transaction.
- Implementation tokens (color, type, spacing) live in `src/styles/global.css`.

### Analytics

`Base.astro` renders the Cloudflare Web Analytics beacon only when
`PUBLIC_CF_BEACON_TOKEN` is set (see `.env.example`), so an unconfigured build
ships a clean `<head>` rather than a broken beacon. If Web Analytics is instead
enabled from the Cloudflare Pages dashboard, Pages injects the same beacon
itself — use one route or the other, never both.

It is cookie-free, which is why the Privacy Policy can state that the site sets
no analytics cookies. Keep those two facts in sync: swapping in a
cookie-setting analytics provider means rewriting that section of
`scripts/rewrite-legal.mjs` and re-running it.

Known gap: Cloudflare Web Analytics reports pageviews, not outbound clicks. The
only conversion this site has is the click through to Amazon, so traffic is
currently measurable and conversion is not. Closing that needs either a
click-tracking analytics tool or — better, since it measures revenue rather than
intent — distinct Amazon Associates tracking IDs per placement on the outbound
links, which requires regenerating the `amzn.to` short links in
`products.json`.

### Other notes

- Astro is configured for fully static output (`output: 'static'` in
  `astro.config.mjs`), site origin `https://faayhaus.com`.
- `public/media/` was pruned to only the files the built site actually
  requests. Before deleting anything else there, re-run the check against
  `dist/` rather than against the source JSON — the export references many
  sizes that never render.
- One article image (`2021/01/matteo-cancellieri-…-1024x683.jpg`) is gone from
  the live site, so that single reference intentionally stays remote.
