const base='https://pilorama-razbegaevo.ru';
const paths=['/','/pilomaterialy','/doska','/suhaya-doska','/vagonka','/imitatsiya-brusa','/ognebiozashchita','/o-nas','/foto','/dostavka','/kontakty','/politika-konfidencialnosti','/sitemap.xml','/robots.txt','/nope-404'];
const strip=h=>h.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&[a-z]+;/g,' ');
for(const p of paths){
  const r=await fetch(base+p,{headers:{'user-agent':'Mozilla/5.0 Chrome/128'},redirect:'manual'});
  const h=await r.text();
  if(p.endsWith('.xml')||p.endsWith('.txt')){console.log(p,r.status,'\n'+h.slice(0,1500));continue;}
  const t=(h.match(/<title>([^<]*)<\/title>/i)||[])[1]||'';
  const d=(h.match(/name="description" content="([^"]*)"/i)||[])[1]||'';
  const can=(h.match(/rel="canonical" href="([^"]*)"/i)||[])[1]||'';
  const words=strip(h).split(/\s+/).filter(w=>/[a-zа-яё]{2,}/i.test(w)).length;
  const h1=(h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]?.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim()||'';
  const h2=[...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>m[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
  const ld=[...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  const types=new Set();let q=0;
  for(const s of ld){try{const j=JSON.parse(s);const walk=o=>{if(Array.isArray(o))return o.forEach(walk);if(o&&typeof o==='object'){if(o['@type']){[].concat(o['@type']).forEach(t=>types.add(t));if(o['@type']==='Question')q++;}Object.values(o).forEach(walk);}};walk(j);}catch(e){types.add('PARSE_ERR');}}
  const noindex=/noindex/i.test(h);
  console.log(JSON.stringify({p,status:r.status,tlen:t.length,t,dlen:d.length,can,words,h1,h2,ld:[...types].join(','),faqQ:q,noindex}));
}
