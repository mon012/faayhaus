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
npm run build     # astro build -> dist/
npm run preview   # astro preview
npm run check     # astro check (TypeScript/template diagnostics)
```

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

### Routing

- `src/pages/index.astro` — homepage; hand-curates specific product/story
  slugs (see `productSlugs`/`storySlugs` arrays) rather than deriving them
  from data, so new "featured" items must be added there explicitly.
- `src/pages/products.astro` — full catalog grouped by category, in the
  fixed order defined by `categoryOrder`.
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

### Images

Media lives in `public/media/uploads/`, so `astro:assets` `<Image>` cannot
optimize it — plain `<img>` with an explicit `srcset` is the pattern here.
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

### Other notes

- Astro is configured for fully static output (`output: 'static'` in
  `astro.config.mjs`), site origin `https://faayhaus.com`.
- `public/media/` was pruned to only the files the built site actually
  requests. Before deleting anything else there, re-run the check against
  `dist/` rather than against the source JSON — the export references many
  sizes that never render.
- One article image (`2021/01/matteo-cancellieri-…-1024x683.jpg`) is gone from
  the live site, so that single reference intentionally stays remote.
