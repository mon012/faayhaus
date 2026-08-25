import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://faayhaus.com',
  output: 'static',
  // Every internal link, canonical and sitemap entry on this site ends in a
  // slash. The default ('ignore') also serves each page at the slash-less URL,
  // so /about and /about/ both resolve — two URLs, one page, split signals.
  // 'always' makes the slashed form the only one the build answers to, and
  // public/_redirects 301s the rest.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Legal boilerplate does not need to compete for crawl budget with the
      // catalog, but it stays indexable — only its priority hint drops.
      serialize(item) {
        if (/\/(privacy|terms|return|shipping)\/$/.test(item.url)) item.priority = 0.3;
        return item;
      },
    }),
  ],
});
