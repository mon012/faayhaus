// Keyword-mapped titles and meta descriptions.
//
// Sourced from two datasets pulled in August 2026, not from intuition:
//   - Google Search Console (sc-domain:faayhaus.com), 2025-08-25 → 2026-08-20,
//     for the queries and pages that already earn impressions.
//   - DataForSEO Google Ads search volume (location 2840 / en) for US monthly
//     volume, used to pick which of several near-synonyms to lead with.
//
// The site earns nothing on-site: every purchase happens on Amazon. So each
// description does two jobs — win the click from the SERP, and set the
// expectation that the click leads to a page whose CTA continues to Amazon.
// A visitor who arrives already knowing that converts; one who feels
// bait-and-switched bounces. That is why the Amazon hand-off is stated in the
// description rather than hidden until the product page.
//
// One primary keyword per page. Where two products would otherwise fight for
// the same term (the 10" and 13" spatulas, the two ladles, the two large
// spoons), the descriptions deliberately lead with the differentiating
// attribute — size, handle, or use — so they stop competing with each other.
//
// `title` is optional: it is only overridden where the product's Amazon-style
// name buries the term people actually search for.

export type SeoEntry = { title?: string; description: string };

// Keyed by product slug. Volumes in comments are US searches/month.
export const productSeo: Record<string, SeoEntry> = {
  // "wooden spatula" 6,600/mo — the head term of the whole catalog.
  'teak-wooden-spatula': {
    title: 'Teak Wooden Spatula, 12.5" — Nonstick Safe',
    description:
      'A 12.5" teak wooden spatula, hand-carved and coconut-oil finished. Heat resistant, safe on nonstick, and it will not scratch your pans. See it on Amazon.',
  },
  // "wooden slotted spatula" 320 / "slotted spatula" 880. GSC: 1,317
  // impressions at position 6.5 and a single click — the worst CTR on the site.
  'teak-wood-slotted-spatula': {
    // Sep 2026: the Aug rewrite led with "Teak Wooden" and the page fell from
    // position 6.7 to 13, dropping out for "slotted spatula" entirely. Lead with
    // the query again.
    title: 'Slotted Spatula — Teak Wood, Wide Head, Long Handle',
    description:
      'A wide teak wooden slotted spatula that drains as it lifts. Long handle, heat resistant, gentle on nonstick and cast iron. Check the current price on Amazon.',
  },
  // "flat wooden spatula" 720/mo. Paired with the 10" below — each leads with
  // its own size so the two listings stop cannibalising one term.
  '13-inch-flat-wooden-spatula': {
    title: '13" Flat Wooden Spatula for Cast Iron — Teak',
    description:
      'A 13" flat teak spatula built for cast iron: a straight edge that scrapes fond without gouging seasoning. Handmade in Thailand. View it on Amazon.',
  },
  'flat-wooden-spatula-for-cast-iron': {
    title: '10" Flat Wooden Spatula for Cast Iron — Teak',
    description:
      'The 10" flat teak spatula, sized for skillets and smaller pans. Straight scraping edge, no scratched seasoning, no melted plastic. View it on Amazon.',
  },
  'teak-12-inch-flat-edge-spatula': {
    title: 'XL Teak Wooden Turner — 12" Flat Edge Spatula',
    description:
      'An XL 12" teak turner with a flat edge for lifting whole fillets and pancakes in one pass. Lightweight for its size, heat resistant. See it on Amazon.',
  },
  'teak-compact-spatula': {
    title: 'Small Teak Spatula — Compact, Nonstick Safe',
    description:
      'A compact teak spatula for small pans, one-egg mornings and jars you cannot reach into. Heat resistant, nonstick safe, easy to store. View it on Amazon.',
  },
  'stir-fry-wooden-spatula-right-hand': {
    title: 'Stir Fry Wooden Spatula 13.5" — Right Hand Wok',
    description:
      'A 13.5" teak stir fry spatula angled for right-handed wok work, so the blade meets the pan flat instead of on its corner. Handmade. See it on Amazon.',
  },
  'right-hand-chopper-wooden-spoon-spatula': {
    title: 'Wooden Chopper Spatula — Spoon & Spatula in One',
    description:
      'One teak tool that chops, stirs and scrapes: a flat chopping edge on a spoon body, angled for the right hand. Safe on nonstick. Check it on Amazon.',
  },
  // "wooden ladle" 5,400/mo. GSC: 769 impressions, zero clicks at position 7.8.
  'teak-kitchen-ladle': {
    title: 'Teak Wooden Ladle for Soup & Gravy — Hand Carved',
    description:
      'A hand-carved teak wooden ladle with a deep bowl for soup, stock and gravy. Will not scratch pots, will not melt on the rim. See the price on Amazon.',
  },
  'teak-duck-tail-ladle': {
    title: "Teak Duck's Tail Gravy Ladle — Pouring Spout",
    description:
      "A teak gravy ladle with a duck's-tail spout that pours a clean line instead of dribbling down the side. Serves straight from pot to plate. View on Amazon.",
  },
  'short-handle-ladle': {
    title: 'Short Handle Wooden Ladle — 9" Teak Serving Ladle',
    description:
      'A 9" short-handle teak ladle for shallow pots and tabletop serving, where a long handle just gets in the way. Hand carved. Check the price on Amazon.',
  },
  'small-serving-ladle': {
    title: 'Small Wooden Serving Ladle — Teak Gravy Ladle',
    description:
      'A small teak serving ladle sized for sauces, dressings and gravy boats. Eco-friendly, hand carved, and it will not taint delicate flavours. See on Amazon.',
  },
  // "spurtle" 12,100 / "wooden spurtle" 1,300 — the highest-volume single term
  // in the kitchenware range.
  'skinny-spurtle': {
    title: 'Skinny Wooden Spurtle — 11" Teak Stirring Stick',
    description:
      'An 11" skinny teak spurtle that stirs porridge, risotto and sauces without dragging. Slim enough for narrow pans, heat resistant. View it on Amazon.',
  },
  // "wooden cooking spoon" 4,400 / "teak wooden spoon" 590. The site's
  // strongest product page already (16 clicks, position 4.1).
  'teak-wooden-spoon': {
    title: 'Teak Wooden Cooking Spoon — Mixing & Serving',
    description:
      'A teak wooden cooking spoon that mixes, tastes and serves. Moisture-resistant grain that resists cracking, hand carved and oil finished. See it on Amazon.',
  },
  // "large wooden spoon" 1,000. GSC: position 3.1, 403 impressions, zero clicks.
  'teak-large-wooden-spoon-spatula': {
    title: '18" Large Wooden Spoon Spatula — Stir Paddle',
    description:
      'An 18" teak stir paddle for stockpots, gumbo and batch cooking, with a flat spatula edge that reaches the bottom corners. Heavy duty. View it on Amazon.',
  },
  // "long handle wooden spoon" 170 — deliberately narrower than the 18" paddle
  // above so the two large spoons target different intents.
  'large-wooden-spoon-long-handle': {
    title: '18" Long Handle Wooden Spoon — Deep Pot Cooking',
    description:
      'An 18" long handle wooden spoon that keeps your hand clear of steam and spatter over deep pots. Solid teak, no joins, no glue. Check the price on Amazon.',
  },
  '12-inch-big-scoop-spoon': {
    title: '12" Big Scoop Spoon — Teak Cooking & Serving Spoon',
    description:
      'A 12" teak scoop spoon with a deep bowl that moves rice, stew and grains in fewer trips. Hand carved from a single piece. See it on Amazon.',
  },
  'teak-long-leaf-spoon': {
    title: 'Teak Long Leaf Spoon — Slim Wooden Cooking Spoon',
    description:
      'A slim, leaf-shaped teak cooking spoon that slides along the curve of a pan instead of fighting it. Non-toxic and nonstick safe. View it on Amazon.',
  },
  'teak-corner-spoon': {
    title: 'Wooden Corner Spoon — Teak Spoon for Pan Edges',
    description:
      'A teak corner spoon with an angled tip that gets into the seam where pan wall meets base, so nothing scorches there. Nonstick safe. See it on Amazon.',
  },
  'teak-slotted-spoon': {
    title: 'Teak Wooden Slotted Spoon — Drains as It Lifts',
    description:
      'A teak slotted spoon that lifts dumplings, greens and poached eggs clear of the water. Heat resistant, non-toxic, safe on nonstick. Check it on Amazon.',
  },
  // "wooden rice paddle" 720.
  'versatile-teak-cooking-serving-spoon': {
    title: 'Teak Wooden Rice Paddle & Serving Spoon',
    description:
      'A teak rice paddle with a flat face that separates grains instead of crushing them, and doubles as a serving spoon. Hand carved. View it on Amazon.',
  },
  // "wooden utensil set" 5,400 / "teak utensil set" 260.
  'handcrafted-teak-spoons': {
    title: 'Teak Wooden Utensil Set — 3 Handcrafted Spoons',
    description:
      'A three-piece teak utensil set: mixing spoon, slotted spoon and rice paddle. The three you actually reach for, hand carved in Thailand. See on Amazon.',
  },
  // "teak kitchen utensils" 1,900. GSC: 9 clicks, 232 impressions.
  'teak-kitchen-utensils': {
    title: 'Teak Kitchen Utensils Set — 3-in-1 Spatula & Turner',
    description:
      'A 3-in-1 teak kitchen utensils set: stir fry spatula, slotted turner and compact spatula. Non-toxic, heat resistant, nonstick safe. Check on Amazon.',
  },
  // "pan scraper" 1,300 / "wooden pot scraper" 20.
  'dishwashing-scrub-for-cleans-kitchen-pans': {
    title: 'Wooden Pan Scraper — Teak Pot & Dish Scraper',
    description:
      'A teak pan scraper cut from one piece of wood, with firm edges that lift burnt-on food without scratching. No plastic, no bending. View it on Amazon.',
  },
  // "chinese soup spoon" 2,400 — the strongest term in the tableware range.
  'teak-chinese-soup-spoons': {
    title: 'Teak Chinese Soup Spoons — Wooden Ramen Spoons',
    description:
      'Chinese-style soup spoons carved from teak: a flat base that sits still in the bowl and a rim that stays cool on the lip. Set of spoons. See on Amazon.',
  },
  // "wooden soup spoon" 480.
  'round-wood-soup-spoons': {
    title: 'Round Wooden Soup Spoons — Teak Flatware',
    description:
      'Round teak soup spoons with a deep bowl and a warm rim, for people who find metal spoons cold and clattering. Moisture resistant. View them on Amazon.',
  },
  'long-handle-teak-soup-spoon': {
    title: 'Long Handle Teak Soup Spoon, 10.5"',
    description:
      'A 10.5" long handle teak soup spoon that reaches the bottom of tall mugs, jars and noodle bowls without dunking your knuckles. See it on Amazon.',
  },
  // "teak spoons" 140 — eating rather than cooking intent.
  'teak-spoons-for-eating': {
    title: 'Teak Spoons for Eating — 8" Wooden Soup Spoons',
    description:
      'Eight-inch teak spoons for everyday eating: no metallic aftertaste, no cold shock, no scratched bowls. Handcrafted from moisture-resistant teak. On Amazon.',
  },
  // "wooden serving spoon" 390 / "wooden salad servers" 390.
  '2-large-serving-spoons': {
    title: 'Large Wooden Serving Spoons — Pair of Teak Servers',
    description:
      'A pair of large teak serving spoons for salad, rice and family-style plates. Light in the hand, warm on the table, and they will not scratch. On Amazon.',
  },
  // "wooden butter knife" 390.
  'teak-butter-spreaders': {
    title: 'Wooden Butter Knife — Teak Butter Spreaders',
    description:
      'Teak butter spreaders that glide through cold butter without tearing the bread, and never taste of metal. Eco-friendly condiment knives. See on Amazon.',
  },
  'mini-seasoning-condiment-teak-spoons': {
    title: 'Mini Wooden Spoons — Teak Condiment Spoons',
    description:
      'A set of three mini teak spoons, half-teaspoon size, for salt cellars, spice jars and condiment bowls. Hand carved, 4.3" long. View them on Amazon.',
  },
  // "loofah on a stick" 1,600 / "long handle back scrubber" 1,900 / "back
  // scrubber for shower" 5,400. GSC: 695 impressions, zero clicks.
  'loofah-back-scrubber-stick-with-loofah-sponge-pads': {
    // Sep 2026: "back scrubber" slid to position 17 after the Aug rewrite moved
    // it to the end of the title. It is the 5,400/mo head term, so it leads.
    title: 'Back Scrubber — Loofah on a 17" Long Teak Handle',
    description:
      'A back scrubber that actually reaches: 17" teak handle, two natural loofah pads, real exfoliation and relief from itchy skin you cannot get to. On Amazon.',
  },
  'loofah-sponge-refill-back-scrubber-on-stick': {
    title: 'Loofah Back Scrubber Refill — 3 Replacement Pads',
    description:
      'Three replacement loofah pads for the FAAY 17" back scrubber on a stick. Two-sided, natural loofah — keep the handle, refresh the sponge. See on Amazon.',
  },
  // "loofah sponge" 22,200 — the highest-volume term the catalog can target.
  'gentle-texture-loofah-sponge': {
    title: 'Gentle Loofah Sponge, 4 Pack — Natural Bath Sponge',
    description:
      'Four 6" natural loofah sponges with a gentle texture that exfoliates without scraping, for men and women. Plant-grown, not plastic. Check on Amazon.',
  },
  '3-layers-loofah': {
    title: 'Loofah Dish Sponges, 6 Pack — Non-Scratch',
    description:
      'Six three-layer loofah dish sponges: enough grip to clear stuck-on food, soft enough for nonstick pans and glassware. Plant-based. View them on Amazon.',
  },
};

// Keyed by post or page slug. Priorities were chosen from GSC impressions:
// these are pages already ranking on page one that nobody clicks.
export const contentSeo: Record<string, SeoEntry> = {
  // 2,821 impressions, 32 clicks (1.1% CTR) at position 6.0 — the single
  // biggest CTR loss on the site. Query cluster is comparison intent.
  'teak-bamboo-cooking-utensils': {
    // Sep 2026: now also the home of is-teak-good-cooking-utensils, merged in
    // because both pages competed for "is teak wood good for cooking utensils"
    // (453 impressions/25 days) and the weaker one sat at position 14.6.
    title: 'Is Teak Good for Cooking Utensils? Teak vs Bamboo',
    description:
      'Yes — teak is dense, oily and water-resistant, so it outlasts most woods. How it compares to bamboo on cracking, heat, hygiene and lifespan, and how to use it safely.',
  },
  // 751 impressions, 1 click at position 9.4.
  'minimum-water-temperature-sanitizing-utensils': {
    title: 'Minimum Water Temperature for Sanitizing Utensils',
    description:
      'The minimum water temperature for sanitizing utensils, what the 171°F and 110°F figures actually mean, and how to check you are really hitting them.',
  },
  // 708 impressions, 1 click at position 7.3.
  'can-use-wooden-utensils-nonstick-pans': {
    title: 'Can You Use Wooden Utensils on Nonstick Pans?',
    description:
      'Yes — and wooden utensils are the safest choice for nonstick. Why metal ruins the coating, what wood does differently, and how to use it without damage.',
  },
  // 589 impressions, zero clicks at position 9.3.
  'why-wooden-cutting-board-splintering': {
    title: 'Why Your Wooden Cutting Board Is Splintering (and the Fix)',
    description:
      'Four reasons wooden cutting boards splinter — dryness, moisture, harsh cleaning and grain quality — and how to sand, oil and save a board you already own.',
  },
  // 493 impressions, zero clicks at position 13.5.
  'how-to-treat-bamboo-utensils-a-step-by-step-guide-to-nourishing-your-kitchen-essentials': {
    title: 'How to Treat Bamboo Utensils: Oiling, Drying, Storing',
    description:
      'A step-by-step guide to treating bamboo utensils: which oil to use, how often to reapply, and the drying habit that stops splitting before it starts.',
  },
  // 627 impressions at position 24 — ranking poorly, so this leans on
  // specificity rather than trying to win a head term it cannot hold.
  'best-herbal-teas-for-relaxation': {
    title: 'Best Herbal Teas for Relaxation and Sleep',
    description:
      'Chamomile, valerian, lemon balm, passionflower and lavender compared: what each one actually does, when to drink it, and how strong to brew it.',
  },
  // 376 impressions, 3 clicks at position 7.4.
  'can-wooden-spoons-grow-mold': {
    title: 'Can Wooden Spoons Grow Mold? How to Spot and Remove It',
    description:
      'Wooden spoons can grow mold — here is what causes it, how to tell mold from stain, how to remove it safely, and when a spoon is past saving.',
  },
  // 346 impressions, zero clicks at position 10.4.
  'best-way-sharpen-kitchen-knife': {
    title: 'The Best Way to Sharpen a Kitchen Knife at Home',
    description:
      'Whetstone, pull-through or electric? How each sharpener treats your edge, which one suits your knives, and the angle that matters more than the tool.',
  },
  // 360 impressions, 2 clicks at position 10.9.
  'how-to-care-for-teak-utensils-a-heartcrafted-guide-to-preserving-your-kitchen-treasures': {
    title: 'How to Care for Teak Utensils: Washing, Oiling, Drying',
    description:
      'Care for teak utensils properly and they outlast every plastic tool in the drawer. Washing, oiling with coconut oil, drying, and what never to do.',
  },
  // 321 impressions, zero clicks at position 12.6.
  'are-wooden-spoons-safe-to-use': {
    title: 'Are Wooden Spoons Safe to Use? What the Research Says',
    description:
      'Are wooden spoons hygienic, or a bacteria trap? What studies actually found about wood versus plastic, plus the care routine that keeps them safe.',
  },
  // 277 impressions, zero clicks at position 12.6.
  'apple-cider-vinegar-clean-fruit': {
    title: 'Apple Cider Vinegar to Clean Fruit: Ratio and Soak Time',
    description:
      'The apple cider vinegar to water ratio for washing fruit, how long to soak, which produce it suits, and what a vinegar wash does and does not remove.',
  },
  // 253 impressions, 2 clicks at position 16.2.
  'best-back-scrubbers-for-men': {
    title: 'Best Back Scrubbers for Men: 7 Tested Picks',
    description:
      'Seven back scrubbers compared for reach, grip and exfoliation — loofah on a stick, brushes and straps — with who each one actually suits. Buy on Amazon.',
  },
  // 229 impressions, 5 clicks at position 8.4.
  'best-bath-sponge-for-elderly': {
    title: 'Best Bath Sponge for Elderly: Long Handle Picks',
    description:
      'Bath sponges chosen for limited reach and grip strength: long handles, light weight and gentle texture, so washing stays independent. Buy on Amazon.',
  },
  // 227 impressions, 1 click at position 10.8.
  'benefits-using-back-scrubber': {
    title: 'Benefits of Using a Back Scrubber: Skin, Reach, Circulation',
    description:
      'What a back scrubber does for skin you cannot reach — clearing back acne, exfoliating dead skin, and improving circulation — and how often to use one.',
  },
  // 216 impressions, zero clicks at position 13.8.
  // 189 impressions, zero clicks at position 8.3.
  'steam-and-pump-espresso-machines': {
    title: 'Steam vs Pump Espresso Machines: Which to Buy',
    description:
      'Steam and pump espresso machines compared on pressure, crema, cost and learning curve — and which one suits the coffee you actually drink at home.',
  },
  // 184 impressions, zero clicks.
  'how-to-store-utensils-without-drawers': {
    title: 'How to Store Utensils Without Drawers: 6 Ideas',
    description:
      'Six ways to store kitchen utensils with no drawer space — magnetic strips, hooks, crocks, rolling carts and wall rails — for small and rented kitchens.',
  },
  // 178 impressions, zero clicks at position 20.7.
  'coffee-machine-mold': {
    title: 'Mold in Your Coffee Machine: How to Spot and Clean It',
    description:
      'Where mold hides in a coffee machine, how to tell it from scale, and the descale-and-clean routine that clears it out of the tank, lines and drip tray.',
  },
  // 151 impressions, zero clicks at position 11.1.
  'how-to-remove-oil-grease-from-utensils': {
    title: 'How to Remove Oil and Grease From Wooden Utensils',
    description:
      'Grease sinks into wood grain and turns rancid. How to draw it out with salt, baking soda, vinegar and hot water — and reseal the wood afterwards.',
  },
  'best-sustainable-cookware': {
    title: 'Best Sustainable Cookware: Materials That Last',
    description:
      'Sustainable cookware judged on lifespan rather than labels — cast iron, stainless, ceramic and wood — and what "eco-friendly" leaves out. Buy on Amazon.',
  },
  'award-best-soup-spoons': {
    title: 'Award-Winning Teak Soup Spoons — FAAY',
    description:
      'The design story behind FAAY teak soup spoons: how the bowl depth and rim thickness were shaped by hand for the way people actually eat soup.',
  },
  'best-way-cook-acorn-squash': {
    title: 'The Best Way to Cook Acorn Squash',
    description:
      'Roast, microwave or air fry acorn squash — timings, temperatures and how to cut it safely, plus the caramelised finish that makes it worth the oven.',
  },
  'best-way-reheat-steak': {
    title: 'The Best Way to Reheat Steak Without Overcooking It',
    description:
      'How to reheat steak and keep it pink: low-oven and reverse-sear methods, target temperatures, and the sear that brings the crust back at the end.',
  },
  'fridge-organization-ideas': {
    title: 'Fridge Organization Ideas That Cut Food Waste',
    description:
      'Where each food actually belongs in a fridge, how zoning by temperature slows spoilage, and container habits that stop leftovers being forgotten.',
  },
  'vegan-matcha-cookies': {
    title: 'Vegan Matcha Cookies: 5 Steps to Chewy Centres',
    description:
      'Vegan matcha cookies with real green flavour: choosing the matcha grade, the flaxseed egg, chilling the dough, and pulling them out while underdone.',
  },
  'popular-thai-food-recipes': {
    title: 'Popular Thai Food Recipes to Cook at Home',
    description:
      'Thai dishes worth cooking at home, with the pantry staples they share and the pan technique behind them — from the country FAAY HAUS is made in.',
  },
  'best-authentic-thai-recipes': {
    title: 'Authentic Thai Recipes From a Thai Kitchen',
    description:
      'Authentic Thai recipes as they are actually cooked in Thailand — balance of salt, sour, sweet and heat, and the tools that make it easier.',
  },
  'grocery-shopping-mistake': {
    title: 'The Grocery Shopping Mistakes That Waste Your Money',
    description:
      'The habits that quietly inflate a grocery bill and fill the bin — shopping order, bulk buys, storage errors — and the simple fixes for each one.',
  },
  'how-to-create-eco-friendly-minimalist-kitchen': {
    title: 'How to Create an Eco-Friendly Minimalist Kitchen',
    description:
      'Build a kitchen around fewer, longer-lasting tools: what to keep, what to replace only when it breaks, and the materials worth paying more for.',
  },
  'benefits-of-living-sustainably': {
    title: 'The Real Benefits of Living Sustainably',
    description:
      'What sustainable living changes day to day — cost, waste, and the quality of the things you own — beyond the environmental headline figures.',
  },
  // Static pages.
  shipping: {
    title: 'Shipping — Orders Are Fulfilled by Amazon',
    description:
      'FAAY HAUS products ship through Amazon, so delivery speed, tracking and shipping costs are set by Amazon and shown at checkout on the product listing.',
  },
  return: {
    title: 'Returns — Handled Through Your Amazon Order',
    description:
      'Returns and refunds for FAAY HAUS products are handled by Amazon under its return policy. Here is how to start one, and when to contact us instead.',
  },
  terms: {
    title: 'Terms of Use',
    description:
      'The terms covering use of faayhaus.com — a catalog and guide site. Purchases happen on Amazon under Amazon’s own terms, not ours.',
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'What faayhaus.com collects, what it does not, and who we share it with. No payments are taken on this site, so no payment details are ever collected.',
  },
  contact: {
    title: 'Contact FAAY HAUS — Product and Care Questions',
    description:
      'Questions about a FAAY HAUS product, its material or how to care for it? Email us or use the form. Order and delivery questions go to Amazon.',
  },
};

// Guides worth reading while looking at a given object. Product pages had no
// outbound links into the article library at all, so the 167 links running from
// articles to products were a one-way street: the guides passed authority and
// context down to the catalog, and the catalog passed nothing back. These pools
// close that loop, and the rotation in product/[slug].astro spreads the links
// across the library instead of pointing all 35 pages at the same three posts.
const kitchenGuides = [
  'how-to-care-for-teak-utensils-a-heartcrafted-guide-to-preserving-your-kitchen-treasures',
  'can-use-wooden-utensils-nonstick-pans',
  'are-wooden-spoons-safe-to-use',
  'can-wooden-spoons-grow-mold',
  'teak-bamboo-cooking-utensils',
  'how-to-remove-oil-grease-from-utensils',
  'how-to-store-utensils-without-drawers',
  'minimum-water-temperature-sanitizing-utensils',
  'why-wooden-cutting-board-splintering',
];

const bathingGuides = [
  'benefits-using-back-scrubber',
  'best-back-scrubbers-for-men',
  'best-bath-sponge-for-elderly',
  'benefits-of-living-sustainably',
];

export const guidePoolFor = (categorySlug?: string) =>
  categorySlug === 'bathing' ? bathingGuides : kitchenGuides;
