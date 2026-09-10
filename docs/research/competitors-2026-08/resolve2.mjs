import fs from 'node:fs';
const S = process.argv[2];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => s.toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/g,' ').trim();
const cache = new Map();
async function get(url, ms=20000) {
  if (cache.has(url)) return cache.get(url);
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  let res;
  try { const r = await fetch(url, { headers: { 'user-agent': UA, 'accept': 'text/html,*/*', 'accept-language': 'ru,en;q=0.8' }, redirect: 'follow', signal: c.signal }); const text = await r.text(); res = { status: r.status, url: r.url, text }; }
  catch (e) { res = { status: 0, url, text: '', err: String(e.message || e).slice(0,80) }; }
  finally { clearTimeout(t); }
  cache.set(url, res); await sleep(700); return res;
}
const KW = {
  'пиломатериал': ['pilomat','catalog','katalog','lumber','doska','brus'],
  'доска': ['dosk','doska','board'],
  'обрезн': ['obrezn','obrez'],
  'сух': ['suh','sukh','dry','kamern','strogan'],
  'строган': ['strogan','planed'],
  'вагонк': ['vagonk','evrovagonka','shtil'],
  'имитац': ['imitac','imitat','brusa'],
  'брус': ['brus'],
  'бруск': ['brusok','bruski','brusk'],
  'осин': ['osin','aspen'],
  'штиль': ['shtil'],
};
function kwFor(title) {
  const t = norm(title); const ks = new Set();
  for (const [ru, lat] of Object.entries(KW)) if (t.includes(ru)) lat.forEach(x => ks.add(x));
  return [...ks];
}
async function siteLinks(host) {
  const home = await get('https://' + host + '/');
  const base = home.url || ('https://' + host + '/');
  const links = new Map();
  for (const m of home.text.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let u; try { u = new URL(m[1], base); } catch { continue; }
    if (!u.hostname.replace(/^www\./,'').endsWith(host.replace(/^www\./,''))) continue;
    if (/\.(jpg|png|pdf|svg|webp|css|js)(\?|$)/i.test(u.pathname)) continue;
    const text = m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    const key = u.origin + u.pathname;
    links.set(key, (links.get(key) || '') + ' ' + text);
  }
  // sitemap
  let smUrls = [];
  const robots = await get('https://' + host + '/robots.txt');
  const sms = [...robots.text.matchAll(/Sitemap:\s*(\S+)/gi)].map(m => m[1]);
  if (!sms.length) sms.push('https://' + host + '/sitemap.xml');
  for (const sm of sms.slice(0,2)) {
    const x = await get(sm);
    if (x.status !== 200) continue;
    let locs = [...x.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m => m[1]);
    if (/<sitemapindex/.test(x.text)) { // nested: take up to 3 children
      const kids = locs.slice(0,3); locs = [];
      for (const k of kids) { const y = await get(k); locs.push(...[...y.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m => m[1])); }
    }
    smUrls.push(...locs);
  }
  return { homeStatus: home.status, links, smUrls: smUrls.slice(0, 5000) };
}
const lines = fs.readFileSync(`${S}/resolve-input.txt`, 'utf8').trim().split('\n');
const siteCache = new Map(); const out = [];
for (const line of lines) {
  const [host, title, q] = line.split('|');
  if (!siteCache.has(host)) siteCache.set(host, await siteLinks(host));
  const site = siteCache.get(host);
  const kws = kwFor(title); const tn = norm(title).split(' ');
  const scored = [];
  for (const [u, text] of site.links) {
    const p = u.toLowerCase(); const tx = norm(text);
    let s = 0; for (const k of kws) if (p.includes(k)) s += 2;
    for (const w of tn) if (w.length > 3 && tx.includes(w)) s += 1;
    if (s > 0) scored.push([s, u]);
  }
  for (const u of site.smUrls) { const p = u.toLowerCase(); let s = 0; for (const k of kws) if (p.includes(k)) s += 2; if (s > 0) scored.push([s - 0.5, u]); }
  scored.sort((a,b) => b[0]-a[0]);
  const cands = [...new Set(scored.map(x => x[1]))].slice(0, 8);
  let best = null;
  for (const u of cands) {
    const p = await get(u);
    const pt = ((p.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').replace(/\s+/g,' ').trim();
    const a = norm(title), b = norm(pt);
    const score = a && b ? (b.includes(a) ? 1 : (b.includes(a.split(' ').slice(0,3).join(' ')) ? 0.7 : 0)) : 0;
    const rec = { url: u, status: p.status, pageTitle: pt.slice(0,110), score };
    if (!best || score > best.score) best = rec;
    if (score === 1) break;
  }
  out.push({ q, host, serpTitle: title, homeStatus: site.homeStatus, links: site.links.size, smUrls: site.smUrls.length, cands: cands.length, best });
  console.log(q, host, '| home', site.homeStatus, 'links', site.links.size, 'sm', site.smUrls.length, '|', best ? `${best.score} ${best.status} ${best.url}` : 'NO CANDIDATES');
}
fs.writeFileSync(`${S}/resolved2.json`, JSON.stringify(out, null, 1));
