import {existsSync} from 'node:fs';
import {join} from 'node:path';
export const localMedia=(url='')=>url.replace(/^https?:\/\/(?:www\.)?faayhaus\.com\/wp-content\/uploads\//,'/media/uploads/');
export const clean=(s='')=>s.replace(/<[^>]*>/g,' ')
  .replace(/&nbsp;/g,' ')
  .replace(/&quot;/g,'"')
  .replace(/&hellip;/g,'…')
  .replace(/&#(\d+);/g,(_,code)=>String.fromCharCode(Number(code)))
  .replace(/&amp;/g,'&')
  .replace(/\s+/g,' ').trim();
// Every content page already gets its sole page title from the page template.
// Imported WordPress content often starts with a second, differently-worded H1
// (for example, "About Us" followed by "Our story"), so remove that legacy
// heading instead of comparing its text with the page title.
export const stripDuplicateTitle=(html='')=>
  html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i,'');
// WordPress metadata routinely lists image sizes that were never exported into
// public/media/uploads, so every candidate URL is checked against disk before it
// reaches the browser. A missing candidate in a srcset is never silently
// replaced by the plain src, so an unchecked entry would render as a broken image.
const publicDir=join(process.cwd(),'public');
const existsInPublic=(localPath:string)=>{
  try{return existsSync(join(publicDir,localPath));}catch{return false;}
};
// scripts/optimize-media.mjs writes a .webp sibling next to every exported
// JPEG/PNG that actually compresses smaller. Prefer it when it exists, and fall
// back to the original otherwise — the WordPress export is not uniformly
// convertible, and a missing file renders as a broken image rather than
// degrading to the JPEG.
export const webpOr=(localPath='')=>{
  if(!localPath.startsWith('/media/')) return localPath;
  const webp=localPath.replace(/\.(jpe?g|png)$/i,'.webp');
  return webp!==localPath&&existsInPublic(webp)?webp:localPath;
};
// The one call every template should use for a media `src`.
export const img=(url='')=>webpOr(localMedia(url));
export const localizeSrcset=(srcset='')=>srcset.replace(/https?:\/\/(?:www\.)?faayhaus\.com\/wp-content\/uploads\//g,'/media/uploads/');
// Imported article bodies still point their <img> at the live WordPress host.
// Rewrite each URL to the archived local copy when we actually have the file, so
// the static build stops depending on faayhaus.com at page-view time.
const localizeIfPresent=(url:string)=>{
  const localPath=localMedia(url);
  return localPath.startsWith('/media/')&&existsInPublic(localPath) ? webpOr(localPath) : url;
};
const localizeTagMedia=(tag:string)=>tag
  .replace(/(\s(?:src|href)=)(["'])([^"']+)\2/gi,(_m,attr,q,url)=>`${attr}${q}${localizeIfPresent(url)}${q}`)
  .replace(/(\ssrcset=)(["'])([^"']+)\2/i,(_m,attr,q,value)=>{
    const kept=value.split(',').map((entry:string)=>entry.trim()).filter(Boolean).map((entry:string)=>{
      const split=entry.lastIndexOf(' ');
      const url=split===-1?entry:entry.slice(0,split);
      const descriptor=split===-1?'':entry.slice(split);
      const localPath=localMedia(url);
      return localPath.startsWith('/media/')&&existsInPublic(localPath)?`${webpOr(localPath)}${descriptor}`:null;
    }).filter(Boolean);
    return kept.length?`${attr}${q}${kept.join(', ')}${q}`:'';
  });
export const prepareEmbeddedMedia=(html='')=>html
  .replace(/href=(['"])https?:\/\/(?:www\.)?faayhaus\.com\/product\//gi,'href=$1/product/')
  .replace(
    /(<div class="wp-block-embed__wrapper">\s*)https?:\/\/(?:www\.)?pinterest\.com\/pin\/(\d+)\/(\s*<\/div>)/gi,
    '$1<iframe title="Pinterest pin" src="https://assets.pinterest.com/ext/embed.html?id=$2&src=oembed" width="450" height="775" frameborder="0" scrolling="no"></iframe>$3',
  )
  .replace(/<img\b[^>]*>/gi,(tag)=>{
    let next=localizeTagMedia(tag);
    if(!/\bdata-image-component\b/i.test(next)) next=next.replace('<img','<img data-image-component');
    if(!/\bloading\s*=/i.test(next)) next=next.replace('<img','<img loading="lazy"');
    if(!/\bdecoding\s*=/i.test(next)) next=next.replace('<img','<img decoding="async"');
    return next;
  })
  .replace(/<iframe\b[^>]*>/gi,(tag)=>{
    let next=tag;
    if(/assets\.pinterest\.com\/ext\/embed\.html/i.test(next)){
      const width=next.match(/\swidth=["'](\d+)["']/i)?.[1];
      const height=next.match(/\sheight=["'](\d+)["']/i)?.[1];
      if(width&&height){
        next=/\sstyle=["']/i.test(next)
          ? next.replace(/\sstyle=(["'])/i,` style=$1aspect-ratio:${width} / ${height};`)
          : next.replace('<iframe',`<iframe style="aspect-ratio:${width} / ${height}"`);
      }
    }
    if(!/\s+title\s*=/i.test(next)) next=next.replace('<iframe','<iframe title="Embedded media"');
    if(!/\bloading\s*=/i.test(next)) next=next.replace('<iframe','<iframe loading="lazy"');
    return next;
  });
export const money=(p:any)=>p?.price ? `${p.currency_symbol}${(Number(p.price)/10**p.currency_minor_unit).toFixed(p.currency_minor_unit)}`:'';
export const featured=(post:any)=>img(post?._embedded?.['wp:featuredmedia']?.[0]?.source_url||'');
// WordPress stores a real, human-written alt on most featured media; fall back
// to the post title only for the few that were never given one.
export const featuredAlt=(post:any)=>clean(post?._embedded?.['wp:featuredmedia']?.[0]?.alt_text||post?.title?.rendered||'');
// Serializes a JSON-LD object (or array of them, rendered as separate <script>
// tags by the caller) with `<` escaped so a literal "</script>" in any source
// string can't break out of the script tag.
export const jsonLd=(data:unknown)=>JSON.stringify(data).replace(/</g,'\\u003c');
// WordPress/WooCommerce already generates multiple image sizes on disk; these
// build srcset strings from that existing data so pages stop shipping
// full-resolution originals into small thumbnail slots.
export const productSrcset=(image:any)=>{
  if(!image?.srcset) return undefined;
  const entries=localizeSrcset(image.srcset).split(', ')
    .filter((entry)=>existsInPublic(entry.split(' ')[0]))
    .map((entry)=>{const [url,...rest]=entry.split(' ');return [webpOr(url),...rest].join(' ');});
  return entries.length?entries.join(', '):undefined;
};
// The export gave 108 of 182 product images no alt text at all, and the old
// fallback repeated the product name on every view of the same product. Compose
// something that describes the specific image instead: what it is, what it is
// made of, and which view the reader is on.
export const productAlt=(product:any,image:any,index=0,total=1)=>{
  const authored=clean(image?.alt||'');
  if(authored) return authored;
  const name=clean(product?.name||'');
  const material=/teak/i.test(name)?'':'teak ';
  const base=`Handmade ${material}${name}`.replace(/\s+/g,' ').trim();
  return total>1?`${base} — view ${index+1} of ${total}`:base;
};
export const featuredSrcset=(post:any)=>{
  const media=post?._embedded?.['wp:featuredmedia']?.[0];
  const sizes=media?.media_details?.sizes;
  const entries=sizes
    ? Object.values(sizes).map((s:any)=>[localMedia(s.source_url),s.width] as const)
    : [];
  if(media?.source_url&&media.media_details?.width) entries.push([localMedia(media.source_url),media.media_details.width] as const);
  const valid=entries.filter(([url])=>existsInPublic(url)).map(([url,width])=>`${webpOr(url)} ${width}w`);
  return valid.length?valid.join(', '):undefined;
};
