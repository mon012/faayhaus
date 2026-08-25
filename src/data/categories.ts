// Category copy, kept in one place because /products/ and
// /product-category/[slug]/ both render it.
//
// The category pages previously carried a single templated sentence over a grid
// of the same products listed on /products/ — two URLs, near-identical content,
// competing for the same terms. Each now leads with its own primary keyword and
// enough unique prose to stand as the page for that term:
//
//   kitchenware  → "wooden kitchen utensils" 5,400/mo, "teak kitchen utensils" 1,900/mo
//   tableware    → "wooden serving spoon" 390/mo, "chinese soup spoon" 2,400/mo
//   bathing      → "back scrubber for shower" 5,400/mo, "loofah sponge" 22,200/mo
//
// (US monthly volume, DataForSEO Google Ads, August 2026.)

export const categoryOrder = ['kitchenware', 'tableware', 'bathing'];

export type CategoryCopy = {
  title: string;
  description: string;
  tagline: string;
  intro: string[];
};

export const categoryCopy: Record<string, CategoryCopy> = {
  kitchenware: {
    title: 'Teak & Wooden Kitchen Utensils — Handmade',
    description:
      'Hand-carved teak kitchen utensils: spatulas, cooking spoons, ladles, turners and spurtles. Heat resistant, nonstick safe, made in Thailand. Buy on Amazon.',
    tagline: 'The tools that live by the stove.',
    intro: [
      'These are the wooden kitchen utensils that stay out on the counter rather than living in a drawer: spatulas for cast iron, stir paddles for stockpots, ladles for soup, a spurtle for porridge that will not stick to itself. Every one is carved from a single piece of teak, so there is no glued join to split and no handle to work loose.',
      'Teak is the reason they last. It grows dense and naturally oily, which is why it has been used on boat decks for centuries — it resists water rather than drinking it in, so the grain does not swell, crack and go furry the way cheaper woods do after a few months of washing up. That same density is what keeps it from scorching against a hot pan, and what stops it scratching a nonstick coating the way metal does.',
      'Each piece is finished with coconut oil and nothing else: no lacquer, no stain, no plastic coating to flake into food. Colour and grain vary from tool to tool because the wood varies. Care is a two-minute job — wash by hand, dry standing up, re-oil when the surface starts to look dry — and the guides below cover it properly.',
    ],
  },
  tableware: {
    title: 'Teak Wooden Tableware — Soup Spoons & Servers',
    description:
      'Teak tableware: Chinese soup spoons, round wooden soup spoons, large serving spoons and butter spreaders. Warm in the hand, never metallic. See on Amazon.',
    tagline: 'Pieces that make sitting down to eat feel like an occasion.',
    intro: [
      'Wooden tableware changes how food tastes, which sounds like an exaggeration until you eat soup with a metal spoon and then a teak one. Metal is cold, conducts heat straight into your lip, and leaves a faint tang against anything acidic. Teak does none of that: it comes to the temperature of your hand, holds it, and stays out of the way of the food.',
      'The range covers the pieces people actually reach for at the table — Chinese-style soup spoons with a flat base that sits still in the bowl, round soup spoons with a deeper bowl for broth, large serving spoons for family-style plates, and butter spreaders that move through cold butter without tearing bread.',
      'Because the same moisture-resistant teak is used here as in the kitchen range, these survive real use rather than living in a display drawer. They are hand-wash only, and they should not sit soaking — but neither should any wooden spoon, and treated normally they outlast the flatware set they sit beside.',
    ],
  },
  bathing: {
    title: 'Back Scrubbers & Natural Loofah Sponges — FAAY',
    description:
      'A long handle back scrubber that actually reaches, plus natural loofah sponges and refill pads. Real exfoliation, no plastic mesh. Check them on Amazon.',
    tagline: 'Loofah and teak for the two minutes you take for yourself.',
    intro: [
      'The problem with most back scrubbers is reach. A short-handled brush leaves exactly the strip between the shoulder blades that you cannot get to — which is where back acne and dry, itchy patches tend to settle in the first place. The FAAY scrubber puts natural loofah on a 17-inch teak handle, so the part you cannot reach is the part it is designed for.',
      'The loofah itself is a plant, grown and dried, not a plastic mesh puff. It exfoliates because its structure is genuinely fibrous, and it rinses clean and dries out between uses instead of holding water. When a pad eventually wears down you replace the pad, not the whole tool — the teak handle is the part built to last.',
      'The gentler sponges in this range suit anyone who finds a stiff brush too harsh, and the long handle also makes washing possible without help for people with limited shoulder movement. The guides below go into how often to exfoliate and what actually helps back acne.',
    ],
  },
};
