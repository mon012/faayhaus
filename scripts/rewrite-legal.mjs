// Rewrites the Privacy, Terms and Shipping page bodies in src/data/pages.json.
//
// The imported WordPress copy was Shopify/WooCommerce boilerplate describing a
// store that took payments. It told visitors that faayhaus.com collects
// "billing address, payment information (including credit card numbers)" and
// that orders are placed "through the Site" — none of which is true of this
// build, which has no cart, no checkout and no payment path at all. It also
// claimed Google Analytics was in use before any analytics existed.
//
// Stating collection practices that do not match the site is a compliance
// problem in its own right, and it teaches both readers and answer engines the
// wrong thing about how this business works. These bodies describe what the
// site actually does.
//
// This rewrites content that a lawyer should still review before launch; it
// corrects factual claims, it is not legal advice.
//
// Run once with `node scripts/rewrite-legal.mjs`. It is idempotent.

import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('../src/data/pages.json', import.meta.url);
const pages = JSON.parse(await readFile(path, 'utf8'));

const p = (text) => `<p class="wp-block-paragraph">${text}</p>`;
const h = (text) => `<p class="wp-block-paragraph"><strong>${text}</strong></p>`;
const ul = (items) =>
  `<ul class="wp-block-list">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;

const ADDRESS =
  '<em>Fresh for Life Co., Ltd.</em><br>248/52 Mu17 Sala Thammasop, Thawi Wattana, Bangkok 10170 Thailand<br><a href="mailto:support@faayhaus.com">support@faayhaus.com</a>';

const privacy = [
  p('This Privacy Policy describes what happens to your information when you visit faayhaus.com (the “Site”). It was last updated in August 2026.'),
  h('THE SHORT VERSION'),
  p('faayhaus.com is a catalog and a library of guides. You cannot buy anything here. Every product page links out to Amazon, and any purchase, payment, address and delivery detail is handled by Amazon under Amazon’s own privacy policy — we never see it. This Site takes no payments, has no accounts, and has no shopping cart.'),
  h('WHAT WE COLLECT'),
  p('Two things, and only two:'),
  ul([
    '<strong>Basic analytics.</strong> We use Cloudflare Web Analytics to understand which pages people read. It is privacy-first and <strong>sets no cookies and stores no fingerprint</strong>: it records the page visited, the referring site, and general device and country information, all in aggregate. It cannot identify you or follow you across other websites.',
    '<strong>What you send us.</strong> If you email us or use the contact form, we receive whatever you choose to put in that message — typically your name, email address and your question. The contact form is provided by Deftform, which processes the submission on our behalf.',
  ]),
  p('We do not collect payment card details, billing addresses, shipping addresses or order histories, because no orders are placed on this Site.'),
  h('COOKIES AND SIMILAR TECHNOLOGIES'),
  p('<strong>This Site sets no analytics or advertising cookies.</strong> Cloudflare Web Analytics is cookie-free by design, and we run no advertising, retargeting or social tracking pixels. Our hosting provider, Cloudflare Pages, keeps standard server logs, including IP addresses, for security and abuse prevention.'),
  p('Web fonts are loaded from Google Fonts, which means your browser makes a request to Google’s servers when a page loads.'),
  h('AMAZON LINKS'),
  p('FAAY HAUS is a participant in the Amazon Associates Program. Product links on this Site are affiliate links: if you follow one and buy something, we may earn a commission at no extra cost to you. Following such a link takes you to Amazon, where Amazon’s privacy policy and cookies apply, not ours.'),
  h('HOW WE USE AND SHARE INFORMATION'),
  p('Messages you send us are used to answer you and nothing else. We do not sell your information, and we do not share it for advertising. It is shared only with the service providers named above — Cloudflare and Deftform — acting on our behalf, and where we are legally required to disclose it.'),
  h('RETENTION'),
  p('Contact messages are kept only as long as needed to resolve your question and keep a record of it. Cloudflare Web Analytics retains aggregate page statistics only, with no record tied to an individual visitor.'),
  h('YOUR RIGHTS'),
  p('If you are in the UK, EEA or another region with data protection rights, you can ask us for a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it. Because we hold very little, that is usually just your correspondence with us. Email us and we will act on it.'),
  h('CHILDREN'),
  p('This Site is not directed at children under 16, and we do not knowingly collect their information.'),
  h('CHANGES'),
  p('We may update this policy to reflect changes to the Site or to legal requirements. The date at the top shows when it last changed.'),
  h('CONTACT US'),
  p('Questions, requests or complaints about privacy can be sent to <a href="mailto:support@faayhaus.com">support@faayhaus.com</a>, or by post to:'),
  p(ADDRESS),
].join('\n\n');

const terms = [
  p('These terms cover your use of faayhaus.com (the “Site”), operated by Fresh for Life Co., Ltd. (“FAAY HAUS”, “we”, “us”). They were last updated in August 2026. By using the Site you agree to them; if you do not, please do not use the Site.'),
  h('WHAT THIS SITE IS'),
  p('faayhaus.com is a product catalog and a library of guides about the objects we make. <strong>It is not a shop.</strong> There is no cart, no account, no checkout and no payment on this Site, and nothing you do here forms a contract of sale with us.'),
  h('BUYING OUR PRODUCTS'),
  p('Every product page links out to that product’s listing on Amazon. When you follow that link you leave this Site, and any purchase you make is a transaction between you and Amazon, governed by Amazon’s terms, privacy policy, pricing, delivery and returns policies. Questions about payment, delivery, order status, returns and refunds go to Amazon, who hold the current information about your order.'),
  h('AFFILIATE DISCLOSURE'),
  p('FAAY HAUS is a participant in the Amazon Associates Program, an affiliate advertising program. We may earn a commission on qualifying purchases made through links on this Site, at no additional cost to you. This does not change what we recommend or how we describe a product.'),
  h('PRICES SHOWN HERE'),
  p('Prices on this Site are a reference copied from the Amazon listing at the time the page was built. Amazon sets and changes its own prices, and the price on Amazon at the moment you buy is the one that applies. We do not guarantee that a price shown here is current.'),
  h('ACCURACY OF CONTENT'),
  p('We take care with the guides and product descriptions here, but they are general information, not professional advice. Wood is a natural material: grain, colour, weight and dimensions vary from piece to piece, and photographs are indicative rather than exact. Care instructions are our best guidance and cannot cover every kitchen, product or circumstance.'),
  h('INTELLECTUAL PROPERTY'),
  p('The FAAY HAUS name and logo, the photography, and the written content on this Site belong to us or are used with permission. You may quote short extracts with a link back for the purpose of review or comment. You may not republish the content wholesale, or use our name or marks in a way that suggests we endorse you.'),
  h('LINKS TO OTHER SITES'),
  p('The Site links to Amazon and occasionally to other third-party pages. We are not responsible for their content, their policies or anything you do on them.'),
  h('LIMITATION OF LIABILITY'),
  p('The Site is provided as it is. To the fullest extent permitted by law, we are not liable for any indirect or consequential loss arising from your use of the Site or your reliance on its content. Nothing in these terms limits liability that cannot lawfully be limited, and nothing here affects your statutory rights as a consumer in relation to any product you buy from Amazon.'),
  h('CHANGES'),
  p('We may update these terms. The current version is always the one on this page, and the date at the top shows when it last changed.'),
  h('GOVERNING LAW'),
  p('These terms are governed by the laws of Thailand, where Fresh for Life Co., Ltd. is registered.'),
  h('CONTACT'),
  p('Questions about these terms can be sent to <a href="mailto:support@faayhaus.com">support@faayhaus.com</a>, or by post to:'),
  p(ADDRESS),
].join('\n\n');

const shipping = [
  p('<strong>FAAY HAUS products are shipped by Amazon, not by us.</strong> There is no checkout on this Site — every product page links to that product’s Amazon listing, and Amazon handles delivery from there.'),
  h('DELIVERY TIMES AND COSTS'),
  p('Shipping speed, tracking and delivery cost are set by Amazon and shown on the product listing before you pay. Our products are in the Fulfilment by Amazon (FBA) programme, so where a listing is eligible, Amazon’s own delivery options — including Prime shipping — apply.'),
  p('For current rates and delivery estimates, see <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GZXW7RVDR6ZZUX55" target="_blank" rel="noopener">Amazon’s shipping rates and policies</a>.'),
  h('WHERE WE SHIP'),
  p('Availability depends on the Amazon marketplace you are buying from. If a product is listed and in stock in your marketplace, Amazon will ship it to the destinations that marketplace serves.'),
  h('WHERE IS MY ORDER?'),
  p('Order status, tracking, late or missing deliveries and address changes are all handled by Amazon through your Amazon account — they hold the live information about your parcel, and we do not.'),
  p('If your item arrives chipped, broken or otherwise not in the condition we promise, do get in touch with us as well: email <a href="mailto:support@faayhaus.com">support@faayhaus.com</a> with your order ID and a photograph. See our <a href="/return/">returns page</a> for how that works.'),
].join('\n\n');

const bodies = { privacy, terms, shipping };
let updated = 0;

for (const page of pages) {
  const body = bodies[page.slug];
  if (!body) continue;
  const heading = page.content.rendered.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/i)?.[0] || '';
  page.content.rendered = `<div class="gb-container">\n\n${heading}\n\n${body}\n\n</div>`;
  updated += 1;
}

await writeFile(path, JSON.stringify(pages, null, 2));
console.log(`legal pages rewritten: ${updated}`);
