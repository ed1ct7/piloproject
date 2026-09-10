import fs from 'node:fs';
const S = process.argv[2];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const dec = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x2F;/g, '/').replace(/&[a-z#0-9]+;/g, ' ');
const strip = h => dec(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' '));
const words = t => t.split(/\s+/).filter(w => /[A-Za-zА-Яа-яЁё]{2,}/.test(w)).length;
const data = JSON.parse(fs.readFileSync(`${S}/competitors.json`, 'utf8'));
const fname = url => url.replace(/^https?:\/\//, '').replace(/[^a-z0-9.]+/gi, '_').slice(0, 90) + '.html';

// 1. refetch cp1251 pages
for (const r of data) {
  if (r.status === 200 && r.wordsTotal < 50) {
    try {
      const res = await fetch(r.url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) });
      const buf = Buffer.from(await res.arrayBuffer());
      const head = buf.slice(0, 4000).toString('latin1');
      const cs = (head.match(/charset=["']?([\w-]+)/i) || [])[1] || 'utf-8';
      const html = new TextDecoder(cs.toLowerCase() === 'windows-1251' || cs.toLowerCase() === 'cp1251' ? 'windows-1251' : 'utf-8').decode(buf);
      fs.writeFileSync(`${S}/html/${fname(r.url)}`, html);
      const body = strip((html.match(/<body[\s\S]*<\/body>/i) || [html])[0]);
      r.wordsTotal = words(body); r.charsetFixed = cs;
      const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => strip(m[1]).replace(/\s+/g, ' ').trim()).filter(Boolean);
      r.h2 = h2s.slice(0, 18); r.h2Count = h2s.length;
      const title = dec(((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '')).replace(/\s+/g, ' ').trim();
      r.title = title; r.titleLen = [...title].length;
      const low = body.toLowerCase();
      r.faqText = /вопрос[ыа]? и ответ|часто задаваемые|faq/.test(low); r.calc = /калькулятор/.test(low); r.reviews = (low.match(/отзыв/g) || []).length;
      console.log('refetched', r.url, cs, r.wordsTotal);
    } catch (e) { console.log('refetch fail', r.url, e.message); }
  }
}

// 2. h3 inventory from saved html (peers only)
const peers = data.filter(r => !r.cluster.startsWith('ours') && !r.cluster.includes('HYPER') && !r.cluster.includes('ADS') && r.cluster !== 'pilorama' && r.status === 200 && r.wordsTotal >= 50);
const pil = data.filter(r => r.cluster === 'pilorama' && r.status === 200 && r.wordsTotal >= 50 && !/уже в основном/.test(r.source));
console.log(`pilorama cluster (q8/q9 organic homes/contacts): n=${pil.length} words ${pil.map(r => r.wordsTotal).sort((a, b) => a - b).join(',')} | title ${pil.map(r => r.titleLen).sort((a, b) => a - b).join(',')} | FAQ ${pil.filter(r => r.faqText).length} | calc ${pil.filter(r => r.calc).length} | reviews ${pil.filter(r => r.reviews > 0).length} | LocalBusiness/Org schema ${pil.filter(r => r.schema.some(t => /LocalBusiness|Organization/.test(t))).length}`);
for (const r of data) {
  const p = `${S}/html/${fname(r.url)}`;
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, 'utf8');
  r.h3 = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => strip(m[1]).replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 40);
}
fs.writeFileSync(`${S}/competitors.json`, JSON.stringify(data, null, 1));

// 3. stats per cluster
const med = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const clusters = ['pilomaterialy', 'doska', 'suhaya', 'vagonka', 'imitatsiya', 'ognebio'];
const oursMap = { pilomaterialy: ['ours-home', 'ours-catalog'], doska: ['ours-doska'], suhaya: ['ours-suhaya'], vagonka: ['ours-vagonka'], imitatsiya: ['ours-imitatsiya'], ognebio: ['ours-ognebio'] };
console.log('\n=== CLUSTER STATS (peers = non-hyper, status 200) ===');
for (const c of clusters) {
  const P = peers.filter(r => r.cluster === c);
  const O = data.filter(r => oursMap[c].includes(r.cluster));
  const w = P.map(r => r.wordsTotal);
  console.log(`${c}: n=${P.length} words min/med/max ${Math.min(...w)}/${med(w)}/${Math.max(...w)} | h2 med ${med(P.map(r => r.h2Count))} | title med ${med(P.map(r => r.titleLen))} | FAQ ${P.filter(r => r.faqText).length}/${P.length} (schema ${P.filter(r => r.faqSchema).length}) | calc ${P.filter(r => r.calc).length} | reviews>0 ${P.filter(r => r.reviews > 0).length} | tables>0 ${P.filter(r => r.tables > 0).length} | Product schema ${P.filter(r => r.schema.includes('Product')).length} | OURS words ${O.map(r => r.wordsTotal).join('/')} h2 ${O.map(r => r.h2Count).join('/')} title ${O.map(r => r.titleLen).join('/')}`);
}
const all = peers;
console.log(`ALL peers n=${all.length}: words med ${med(all.map(r => r.wordsTotal))}, p25 ${[...all.map(r => r.wordsTotal)].sort((a, b) => a - b)[Math.floor(all.length * 0.25)]}, p75 ${[...all.map(r => r.wordsTotal)].sort((a, b) => a - b)[Math.floor(all.length * 0.75)]} | title med ${med(all.map(r => r.titleLen))}, <=65: ${all.filter(r => r.titleLen <= 65).length} | FAQ ${all.filter(r => r.faqText).length} | schema Product ${all.filter(r => r.schema.includes('Product')).length} FAQPage ${all.filter(r => r.faqSchema).length} Breadcrumb ${all.filter(r => r.breadcrumbs).length}`);
// schema frequency
const sf = {}; for (const r of all) for (const t of r.schema) sf[t] = (sf[t] || 0) + 1;
console.log('schema types:', Object.entries(sf).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' '));

// 4. heading theme buckets
const buckets = {
  'доставка': /доставк/i, 'оплата': /оплат/i, 'преимущества/почему мы': /преимуществ|почему|выгод|гарант/i, 'отзывы': /отзыв/i, 'вопросы-ответы': /вопрос|faq/i,
  'как заказать/купить': /как (заказать|купить|сделать заказ|оформить)/i, 'сорта/характеристики': /сорт|характеристик|гост|влажност|размер|сечени/i, 'цены/прайс': /цен|прайс|стоимост/i,
  'калькулятор/расчёт': /калькулятор|рассчит|расчёт|расчет/i, 'о компании/производство': /о (компании|нас|производстве)|производств|пилорам|наш[аи]/i, 'применение': /примен|использ|где/i,
  'фото/видео': /фото|видео|галере/i, 'сертификаты': /сертификат/i, 'контакты/адрес': /контакт|адрес|склад|база/i, 'акции/скидки': /акци|скидк|распродаж/i, 'популярные/похожие товары': /популярн|похож|также|сопутств|рекоменду/i,
};
console.log('\n=== HEADING THEMES across peers (pages having ≥1 H2/H3 in bucket) ===');
for (const [name, re] of Object.entries(buckets)) {
  const n = all.filter(r => [...(r.h2 || []), ...(r.h3 || [])].some(t => re.test(t))).length;
  console.log(`${name}: ${n}/${all.length}`);
}
// 5. headings dump for key peers
console.log('\n=== H2/H3 of selected peers ===');
for (const r of all) {
  if (!/78dosok|vagonka78|kronawood|vrz-spb|veles-wood|pilorama98|lenwood.ru\/catalog\/doska\/doska-obreznaya|alyansles.ru\/catalog\/doska_obreznaya|fanerapiter|gorodmaster|sofbaz|imitaciya-brusa.ru\/doska|spb.lesobirzha.ru\/katalog\/imitacya|faneraosb|lenles.ru\/product|sevles-spb.ru\/uslugi/.test(r.url)) continue;
  console.log(`\n## ${r.url.replace(/^https?:\/\/(www\.)?/, '')} [${r.wordsTotal}w]`);
  console.log('H2: ' + (r.h2 || []).slice(0, 14).join(' | '));
  console.log('H3: ' + (r.h3 || []).slice(0, 16).map(x => x.slice(0, 40)).join(' | '));
}
