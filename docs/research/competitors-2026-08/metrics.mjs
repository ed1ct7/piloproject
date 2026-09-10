import fs from 'node:fs';
const S = process.argv[2];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const dec = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x2F;/g, '/').replace(/&[a-z#0-9]+;/g, ' ');
const strip = h => dec(h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' '));
const words = t => t.split(/\s+/).filter(w => /[A-Za-zА-Яа-яЁё]{2,}/.test(w)).length;
const lines = fs.readFileSync(`${S}/pages.txt`, 'utf8').split('\n').filter(l => l && !l.startsWith('#'));
const out = [];
let i = 0;
for (const line of lines) {
  const [cluster, url, source] = line.split('|');
  i++;
  const r = { status: 0, finalUrl: url, html: '', err: '' };
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, 'accept': 'text/html,*/*', 'accept-language': 'ru,en;q=0.8' }, redirect: 'follow', signal: AbortSignal.timeout(25000) });
    r.status = res.status; r.finalUrl = res.url; r.html = await res.text();
  } catch (e) { r.err = String(e.message || e).slice(0, 80); }
  const h = r.html;
  const fname = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9.]+/gi, '_').slice(0, 90) + '.html';
  if (h) fs.writeFileSync(`${S}/html/${fname}`, h);
  const title = dec(((h.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '')).replace(/\s+/g, ' ').trim();
  const desc = dec(((h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || h.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i) || [])[1] || '')).trim();
  const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => strip(m[1]).replace(/\s+/g, ' ').trim()).filter(Boolean);
  const h2s = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => strip(m[1]).replace(/\s+/g, ' ').trim()).filter(Boolean);
  const h3n = (h.match(/<h3[^>]*>/gi) || []).length;
  const bodyHtml = (h.match(/<body[\s\S]*<\/body>/i) || [h])[0];
  const bodyText = strip(bodyHtml);
  const contentHtml = [...bodyHtml.matchAll(/<(p|li|td|th|dd|dt|h1|h2|h3|h4)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => m[2]).join(' ');
  const contentText = strip(contentHtml);
  const pWords = [...bodyHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m => words(strip(m[1]))).filter(n => n >= 15);
  const ld = [...h.matchAll(/<script[^>]+ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
  const types = [...new Set([...ld.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map(m => m[1]).concat([...h.matchAll(/itemtype=["']https?:\/\/schema\.org\/([A-Za-z]+)/g)].map(m => m[1])))];
  const low = bodyText.toLowerCase();
  const cnt = re => (low.match(re) || []).length;
  const rec = {
    cluster, source, url, finalUrl: r.finalUrl, status: r.status, err: r.err, bytes: h.length,
    titleLen: [...title].length, title: title.slice(0, 120), descLen: [...desc].length,
    h1: (h1s[0] || '').slice(0, 90), h1Count: h1s.length, h2Count: h2s.length, h3Count: h3n, h2: h2s.slice(0, 18).map(x => x.slice(0, 55)),
    wordsTotal: words(bodyText), wordsContent: words(contentText), longParas: pWords.length, longParaWords: pWords.reduce((a, b) => a + b, 0),
    faqText: /вопрос[ыа]? и ответ|часто задаваемые|faq/.test(low), faqSchema: /FAQPage/.test(ld),
    schema: types.slice(0, 12),
    priceMentions: cnt(/₽|руб\.|руб\b|рублей/g), tables: (h.match(/<table\b/gi) || []).length, forms: (h.match(/<form\b/gi) || []).length,
    calc: /калькулятор/.test(low), reviews: cnt(/отзыв/g), delivery: cnt(/доставк/g), payment: cnt(/оплат/g), gost: cnt(/гост|сертификат/g), producer: cnt(/производител|собственн(ое|ого) производств|пилорам/g),
    imgs: (h.match(/<img\b/gi) || []).length, videos: (h.match(/<video\b|youtube|rutube|vk\.com\/video/gi) || []).length,
    breadcrumbs: /BreadcrumbList/.test(ld) || /хлебн|breadcrumb/i.test(h),
    jsOnly: h.length > 20000 && words(bodyText) < 80,
  };
  out.push(rec);
  console.log(`${i}/${lines.length} ${rec.status} ${cluster} ${url.slice(0, 60)} | words ${rec.wordsTotal}/${rec.wordsContent} h2 ${rec.h2Count} title ${rec.titleLen} faq ${rec.faqText ? 1 : 0}${rec.faqSchema ? 'S' : ''} ${rec.err}`);
  await sleep(1000);
}
fs.writeFileSync(`${S}/competitors.json`, JSON.stringify(out, null, 1));
