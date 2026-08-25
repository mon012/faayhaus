// Generates a WebP sibling for every exported JPEG/PNG under public/media, plus
// the brand icon and social-card derivatives.
//
// The originals are kept: `localMedia()` still resolves them, and the WebP is
// only used where `webpOr()` confirms the sibling exists on disk. That keeps the
// "never emit a URL we don't have" rule from src/lib.ts intact, and leaves a
// working fallback if a conversion is ever removed.
//
// Run with `npm run media` after adding new images to public/media, or
// `npm run media -- --force` to re-encode everything after changing the quality
// settings below.

import { readdir, stat, writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname, relative, sep } from 'node:path';
// sharp reaches this project as an *optional* transitive dependency of astro,
// so an install that omits optional packages, or a platform without a prebuilt
// binary, would leave it missing. Every file this script produces is committed,
// so the right failure mode is to skip and let the build continue rather than
// to break a deploy over work that is already done.
let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.warn('media: sharp unavailable, using the committed derivatives as-is');
  process.exit(0);
}

// Presence, not timestamps, decides whether a conversion is skipped.
//
// Git does not preserve mtimes: on a fresh clone every file is stamped with the
// checkout time, so a "is the .webp newer than its source?" test is decided by
// checkout order — which meant Cloudflare Pages could re-encode most of the
// ~1,700-image library on a deploy, costing minutes of build time to reproduce
// files that are already committed. The derived files are in the repo, so if one
// exists it is current; pass --force when the sources or settings actually change.
const force = process.argv.includes('--force');

// Roughly 500 images in the export are Amazon product photos already compressed
// to 14-30 KB at 1200-1500px. WebP cannot beat them, so `convert()` writes no
// sibling — which means the presence check above never fires for them and they
// were being re-encoded and thrown away on every single run, ~27s of pure waste
// per build. This manifest records that verdict so it is computed once. The size
// is stored alongside so a genuinely edited source is picked up again.
const manifestPath = join(process.cwd(), 'scripts', 'media-manifest.json');
const manifest = existsSync(manifestPath)
  ? JSON.parse(await readFile(manifestPath, 'utf8'))
  : {};

const publicDir = join(process.cwd(), 'public');
const mediaDir = join(publicDir, 'media', 'uploads');
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function convert() {
  let converted = 0;
  let skipped = 0;
  let savedBytes = 0;

  for await (const file of walk(mediaDir)) {
    const ext = extname(file).toLowerCase();
    if (!SOURCE_EXT.has(ext)) continue;

    const target = file.slice(0, -ext.length) + '.webp';
    const source = await stat(file);
    const key = relative(publicDir, file).split(sep).join('/');

    if (!force && (existsSync(target) || manifest[key] === source.size)) {
      skipped += 1;
      continue;
    }

    try {
      // Effort 5 is the useful knee of the curve here: near-identical output to
      // effort 6 on photographs, roughly half the build time across ~1,700 files.
      const buffer = await sharp(file)
        .webp({ quality: 78, effort: 5 })
        .toBuffer();

      // A WebP that is bigger than the original helps nobody — some small,
      // flat PNGs compress worse as WebP. Leave those alone so `webpOr()`
      // keeps serving the smaller original.
      if (buffer.length >= source.size) {
        manifest[key] = source.size;
        skipped += 1;
        continue;
      }
      delete manifest[key];

      await writeFile(target, buffer);
      converted += 1;
      savedBytes += source.size - buffer.length;
    } catch (error) {
      console.warn(`skip ${file}: ${error.message}`);
      skipped += 1;
    }
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `webp: ${converted} converted, ${skipped} skipped, ${(savedBytes / 1e6).toFixed(1)} MB saved`,
  );
}

// The logo is the only brand mark in the export, so every icon derives from it.
async function icons() {
  const logo = join(mediaDir, '2019', '06', 'logo.png');
  if (!existsSync(logo)) {
    console.warn('icons: logo.png missing, skipped');
    return;
  }

  const sizes = [
    ['favicon-32.png', 32],
    ['favicon-192.png', 192],
    ['favicon-512.png', 512],
    ['apple-touch-icon.png', 180],
  ];

  for (const [name, size] of sizes) {
    if (existsSync(join(publicDir, name)) && !force) continue;
    // Apple ignores transparency and composites on black, so the touch icon
    // gets the paper background baked in rather than inheriting it.
    const background =
      name === 'apple-touch-icon.png'
        ? { r: 242, g: 243, b: 239, alpha: 1 }
        : { r: 0, g: 0, b: 0, alpha: 0 };

    await sharp(logo)
      .resize(size, size, { fit: 'contain', background })
      .flatten(name === 'apple-touch-icon.png' ? { background } : false)
      .png({ compressionLevel: 9, palette: true })
      .toFile(join(publicDir, name));
  }

  console.log(`icons: ${sizes.length} written`);
}

// A dedicated 1200x630 card. The default share image was a 1200x1200 product
// photo, which every social platform centre-crops into an unrecognisable square.
async function socialCard() {
  const source = join(mediaDir, '2023', '03', 'faayhaus-main-scaled.jpg');
  if (!existsSync(source)) {
    console.warn('og image: source missing, skipped');
    return;
  }

  const out = join(publicDir, 'og-default.jpg');
  if (existsSync(out) && !force) {
    console.log('og image: already present');
    return;
  }
  await mkdir(dirname(out), { recursive: true });
  await sharp(source)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);

  console.log('og image: og-default.jpg written');
}

// The two full-bleed CSS backgrounds ship a 2560px original to every device,
// including phones. Format is not the problem here — the exported JPEGs are
// already near-optimally compressed, and re-encoding one at the same dimensions
// as WebP comes out *larger*. Size is the problem. Downscaling first is what
// actually wins, and at reduced dimensions WebP then beats JPEG comfortably.
async function heroVariants() {
  const heroes = [
    ['2023/03/faayhaus-main-scaled.jpg', 'faayhaus-main'],
    ['2023/03/faayhaus-kitchen-utensils.jpg', 'faayhaus-kitchen-utensils'],
  ];
  const widths = [960, 1440, 1920];
  const outDir = join(publicDir, 'media', 'hero');
  await mkdir(outDir, { recursive: true });

  for (const [relative, name] of heroes) {
    const source = join(mediaDir, ...relative.split('/'));
    if (!existsSync(source)) {
      console.warn(`hero: ${relative} missing, skipped`);
      continue;
    }
    for (const width of widths) {
      const out = join(outDir, `${name}-w${width}.webp`);
      if (existsSync(out) && !force) continue;
      await sharp(source)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 72, effort: 5 })
        .toFile(out);
    }
  }
  console.log(`hero: ${heroes.length * widths.length} variants written`);
}

await convert();
await heroVariants();
await icons();
await socialCard();
