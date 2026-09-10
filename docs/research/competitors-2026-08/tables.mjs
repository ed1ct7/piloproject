import fs from 'node:fs';
const S = process.argv[2];
const data = JSON.parse(fs.readFileSync(`${S}/competitors.json`, 'utf8'));
const out = [];
// --- SERP visibility
const serps = [
  ['q1', 'пиломатериалы спб', 'q1-pilomaterialy-spb.json'], ['q2', 'доска обрезная спб', 'q2-doska-obreznaya-spb.json'], ['q3', 'сухая доска спб', 'q3-suhaya-doska-spb.json'],
  ['q4', 'вагонка спб', 'q4-vagonka-spb.json'], ['q5', 'имитация бруса спб', 'q5-imitatsiya-brusa-spb.json'], ['q6', 'огнебиозащита доски спб', 'q6-ognebiozashchita-doski-spb.json'],
  ['q8', 'пилорама спб', 'q8-pilorama-spb.json'], ['q9', 'пилорама ленинградская область', 'q9-pilorama-lenoblast.json'],
];
const WIZ = /^(yandex\.ru|2gis\.ru|avito\.ru|uslugi\.yandex\.ru|derevovdom\.ru)$/; // колдунщики/агрегаторы в q8/q9 (derevovdom = «Может заинтересовать» в q8)
const vis = {}; const serpRows = [];
for (const [q, name, f] of serps) {
  const j = JSON.parse(fs.readFileSync(`${S}/serp/${f}`, 'utf8'));
  const org = []; let rank = 0; let ads = 0;
  for (const [pos, host, ad] of j.items) {
    if (ad) { ads++; continue; }
    if (host === '-' ) continue;
    if (/^q[89]$/.test(q) && (WIZ.test(host) || (q === 'q8' && host === 'arhles.net') || (q === 'q9' && host === 'arhles.net'))) { org.push(`(${host} — колдунщик/агрегатор)`); continue; }
    rank++; org.push(`${rank}. ${host}`);
    if (rank <= 10) { vis[host] = vis[host] || { n: 0, best: 99, qs: [] }; if (!vis[host].qs.includes(q)) vis[host].n++; vis[host].best = Math.min(vis[host].best, rank); vis[host].qs.push(q); }
  }
  serpRows.push(`| ${q} | ${name} | ${ads} | ${org.slice(0, 10).join(', ')} |`);
}
// q7 (only organic captured)
const q7 = ['pilorama98.ru', 'tdlesovik.ru', 'sevles-spb.ru', 'tdlesovik.ru', 'arhles.net', '78dosok.ru', 'lenwood.ru', 'petrovich.ru', 'sofbaz.ru', 'gorodmasterptk.ru', 'kraskidoski.ru'];
// order by position: 3 tdlesovik,4 sevles,5 tdlesovik,6 pilorama98,7 arhles,10 78dosok,11 lenwood,13 petrovich,14 sofbaz,15 gorodmaster,16 kraskidoski
const q7ord = ['tdlesovik.ru', 'sevles-spb.ru', 'tdlesovik.ru', 'pilorama98.ru', 'arhles.net', '78dosok.ru', 'lenwood.ru', 'petrovich.ru', 'sofbaz.ru', 'gorodmasterptk.ru', 'kraskidoski.ru'];
q7ord.forEach((h, i) => { const r = i + 1; if (r <= 10) { vis[h] = vis[h] || { n: 0, best: 99, qs: [] }; if (!vis[h].qs.includes('q7')) vis[h].n++; vis[h].best = Math.min(vis[h].best, r); vis[h].qs.push('q7'); } });
serpRows.splice(6, 0, `| q7 | пиломатериалы ленинградская область | 8 | ${q7ord.map((h, i) => `${i + 1}. ${h}`).join(', ')} |`);
out.push('### Органическая выдача Яндекса (lr=2, 22.08.2026, без рекламы «Промо»; колдунщики и агрегаторы помечены)\n');
out.push('| # | Запрос | Реклама (блоков) | Органика, позиции 1–10 |\n|---|---|---|---|');
out.push(...serpRows);
out.push('\n### Частота доменов в органическом топ-10 (9 запросов)\n');
out.push('| Домен | Запросов в топ-10 | Лучшая позиция | Запросы |\n|---|---|---|---|');
for (const [h, v] of Object.entries(vis).sort((a, b) => b[1].n - a[1].n || a[1].best - b[1].best)) out.push(`| ${h} | ${v.n} | ${v.best} | ${[...new Set(v.qs)].join(', ')} |`);

// --- per cluster page table
const clusters = [['pilomaterialy', 'Пиломатериалы (каталог/главная)', ['ours-home', 'ours-catalog']], ['doska', 'Доска обрезная', ['ours-doska']], ['suhaya', 'Сухая доска', ['ours-suhaya']], ['vagonka', 'Вагонка', ['ours-vagonka']], ['imitatsiya', 'Имитация бруса', ['ours-imitatsiya']], ['ognebio', 'Огнебиозащита', ['ours-ognebio']], ['pilorama', 'Запросы «пилорама спб / ленинградская область» (главные и контакты)', ['ours-home']]];
const yn = b => b ? '✓' : '—';
const row = r => `| ${r.url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70)} | ${r.source.replace(/\|/g, '/')} | ${r.status === 200 ? (r.jsOnly ? 'JS-only' : 'OK') : (r.status || 'BLOCKED/ERR')} | ${r.wordsTotal} | ${r.h2Count} | ${r.titleLen} | ${yn(r.faqText)}${r.faqSchema ? 'S' : ''} | ${yn(r.calc)} | ${r.reviews > 0 ? '✓' : '—'} | ${r.tables} | ${r.schema.filter(t => /Product|Offer|FAQPage|Breadcrumb|LocalBusiness|Organization/.test(t)).map(t => t.replace('BreadcrumbList', 'Crumbs').replace('AggregateOffer', 'AggOffer').replace('Organization', 'Org').replace('LocalBusiness', 'LocalBiz')).join(', ') || '—'} |`;
out.push('\n### Метрики страниц по кластерам\n');
out.push('Колонки: слова — видимый текст всей страницы (шапка/меню/футер включены, метод одинаков для всех); H2 — число; title — длина в символах; FAQ — блок вопросов на странице (S = есть разметка FAQPage); Калк — упоминание калькулятора; Отз — отзывы; Табл — число `<table>`; Schema — ключевые типы разметки.\n');
for (const [c, name, oursKeys] of clusters) {
  out.push(`\n#### ${name}\n`);
  out.push('| Страница | Источник | Статус | Слова | H2 | title | FAQ | Калк | Отз | Табл | Schema |\n|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of data.filter(r => oursKeys.includes(r.cluster))) out.push(row(r).replace('| OURS |', '| **НАШ САЙТ** |'));
  for (const r of data.filter(r => r.cluster === c)) out.push(row(r));
  for (const r of data.filter(r => r.cluster === c + '-HYPER')) out.push(row(r).replace(/\| (serp[^|]*) \|/, '| $1 (гипермаркет) |'));
  for (const r of data.filter(r => r.cluster === c + '-ADS')) out.push(row(r));
}
fs.writeFileSync(`${S}/tables.md`, out.join('\n'));
console.log('tables.md', out.length, 'lines');
// our visibility check
const ours = Object.keys(vis).filter(h => /razbegaevo/.test(h));
console.log('ours in top10:', ours.length ? ours : 'none');
