import fs from 'node:fs';
const S = process.argv[2];
const dec = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x2F;/g, '/').replace(/&times;/g, '×').replace(/&[a-z#0-9]+;/g, ' ');
const strip = h => dec(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const fname = url => url.replace(/^https?:\/\//, '').replace(/[^a-z0-9.]+/gi, '_').slice(0, 90) + '.html';
const lines = fs.readFileSync(`${S}/pages.txt`, 'utf8').split('\n').filter(l => l && !l.startsWith('#'));
const extra = { 'https://lenwood.ru/catalog/brus/': `${S}/html/curl_lenwood.ru_catalog_brus_.html` };
const features = {
  'сосна': /сосн/, 'ель': /(?<!\p{L})ел(ь|и|ей|ью)(?!\p{L})/, 'лиственница': /лиственниц/, 'кедр': /кедр/,
  'обрезной': /обрезн/, 'строганый': /строган/, 'камерная сушка': /камерн/, 'естеств. влажность': /естественн\S* влажност/,
  'антисепт': /антисепт/, 'огнебио': /огнебио|огнезащ/, 'профилированный': /профилирован/, 'клеёный': /кле[её]н/,
  'ГОСТ': /гост/, 'ГОСТ 8486': /8486/, 'сорт': /(?<!\p{L})сорт/, 'влажность %': /\d{1,2}\s?(-|–)?\s?\d{0,2}\s?%/,
  'длина 6 м': /6\s?м(?!\p{L})|6000|6,0 м/, 'длина 3 м': /3\s?м(?!\p{L})|3000/, 'длина 4 м': /4\s?м(?!\p{L})|4000/,
  'цена за шт': /за\s(1\s)?шт|за штуку|поштучн/, 'цена за куб': /за\s?(1\s)?(м3|м³|куб)/, 'шт в кубе': /(штук|шт\.?) в (1 )?(кубе|м3|м³)|в кубе\s?\d|кубатурник/,
  'калькулятор': /калькулятор/, 'вес': /(?<!\p{L})вес(?!\p{L})|масса/, 'применение': /применени|используют|для строительства|стропил|перекрыт|каркас/,
  'как выбрать': /как выбрать|выбор бруса/, 'доставка': /доставк/, 'самовывоз': /самовывоз/, 'оплата': /оплат/,
  'в наличии': /в наличии/, 'под заказ': /под заказ|под размер|индивидуальн/, 'опт': /(?<!\p{L})опт(ом|ов|овый|овые)?(?!\p{L})/, 'отзывы': /отзыв/,
  'фото производства': /производств/, 'сертификат': /сертификат/, 'ЛесЕГАИС/ФГИС': /егаис|фгис/,
  'усадка/трещины': /усадк|трещин|коробл/, 'хранение': /хранени|хранить/, 'обзол': /обзол/,
};
const out = [];
for (const line of lines) {
  const [cluster, url] = line.split('|');
  const p = extra[url] || `${S}/html/${fname(url)}`;
  if (!fs.existsSync(p)) { out.push({ cluster, url, missing: true }); continue; }
  const h = fs.readFileSync(p, 'utf8');
  const body = (h.match(/<body[\s\S]*<\/body>/i) || [h])[0];
  const text = strip(body); const low = text.toLowerCase();
  if (text.split(' ').length < 80) { out.push({ cluster, url, missing: true, note: 'thin/JS' }); continue; }
  const title = dec((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').replace(/\s+/g, ' ').trim();
  const h1 = strip((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '');
  const hx = tag => [...body.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))].map(m => strip(m[1])).filter(Boolean);
  const tables = [...body.matchAll(/<table\b[\s\S]*?<\/table>/gi)].map(m => {
    const rows = [...m[0].matchAll(/<tr\b[\s\S]*?<\/tr>/gi)].map(r => [...r[0].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(c => strip(c[1]).slice(0, 28)));
    return { n: rows.length, head: rows[0] || [], r1: rows[1] || [] };
  });
  const sizes = [...new Set((low.match(/\b(\d{2,3})\s?[хx×*]\s?(\d{2,3})(\s?[хx×*]\s?\d{4})?\b/g) || []).map(s => s.replace(/\s/g, '').replace(/[x×*]/g, 'х').replace(/х\d{4}$/, '')))];
  const feats = Object.fromEntries(Object.entries(features).map(([k, re]) => [k, (low.match(new RegExp(re.source, 'gu')) || []).length]));
  const ld = [...h.matchAll(/<script[^>]+ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
  const schema = [...new Set([...ld.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map(m => m[1]).concat([...h.matchAll(/itemtype=["']https?:\/\/schema\.org\/([A-Za-z]+)/g)].map(m => m[1])))];
  out.push({ cluster, url, title, h1, h2: hx('h2'), h3: hx('h3').slice(0, 30), tables, sizes, feats, schema });
}
fs.writeFileSync(`${S}/deep.json`, JSON.stringify(out, null, 1));
for (const r of out) {
  if (r.missing) { console.log(`\n## [${r.cluster}] ${r.url} — MISSING ${r.note || ''}`); continue; }
  console.log(`\n## [${r.cluster}] ${r.url.replace(/^https?:\/\/(www\.)?/, '')}`);
  console.log(`title: ${r.title.slice(0, 110)}\nh1: ${r.h1.slice(0, 90)}`);
  console.log(`H2: ${r.h2.slice(0, 14).map(x => x.slice(0, 50)).join(' | ')}`);
  console.log(`H3: ${r.h3.slice(0, 18).map(x => x.slice(0, 40)).join(' | ')}`);
  console.log(`tables ${r.tables.length}: ${r.tables.slice(0, 4).map(t => `[${t.n}r] ${t.head.join(' ; ')} => ${t.r1.join(' ; ')}`).join(' || ')}`);
  console.log(`sizes ${r.sizes.length}: ${r.sizes.slice(0, 25).join(' ')}`);
  console.log(`schema: ${r.schema.join(',')}`);
  console.log(`feats: ${Object.entries(r.feats).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(', ')}`);
}
const ok = out.filter(r => !r.missing && /cat|home/.test(r.cluster));
console.log(`\n=== FEATURE COVERAGE on category pages (n=${ok.length}; spb=${ok.filter(r => r.cluster.startsWith('spb')).length}, msk=${ok.filter(r => r.cluster.startsWith('msk')).length}) ===`);
for (const k of Object.keys(features)) {
  const spb = ok.filter(r => r.cluster.startsWith('spb') && r.feats[k] > 0).length, msk = ok.filter(r => r.cluster.startsWith('msk') && r.feats[k] > 0).length;
  console.log(`${k}: СПб ${spb}, Мск ${msk}`);
}
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
console.log(`sizes per page med: СПб ${med(ok.filter(r => r.cluster.startsWith('spb')).map(r => r.sizes.length))}, Мск ${med(ok.filter(r => r.cluster.startsWith('msk')).map(r => r.sizes.length))}`);
const sizeFreq = {}; for (const r of ok) for (const s of r.sizes) sizeFreq[s] = (sizeFreq[s] || 0) + 1;
console.log('size freq (pages):', Object.entries(sizeFreq).filter(([s]) => { const [a, b] = s.split('х').map(Number); return a >= 40 && b >= 40; }).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, v]) => `${k}:${v}`).join(' '));
const sf = {}; for (const r of ok) for (const t of r.schema) sf[t] = (sf[t] || 0) + 1;
console.log('schema freq:', Object.entries(sf).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' '));
