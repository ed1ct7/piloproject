const base='https://pilorama-razbegaevo.ru';
const paths=['/pilomaterialy','/doska','/suhaya-doska','/vagonka','/imitatsiya-brusa','/ognebiozashchita','/'];
const strip=h=>{h=h.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
 h=h.replace(/<header[\s\S]*?<\/header>/i,'').replace(/<footer[\s\S]*?<\/footer>/i,'').replace(/<nav[\s\S]*?<\/nav>/gi,'');
 return h.replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/g,' ').toLowerCase().replace(/[^a-zа-яё0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>=2);};
const texts={};
for(const p of paths){const h=await (await fetch(base+p)).text();texts[p]=strip(h);}
const sh=(w,n=5)=>{const s=new Set();for(let i=0;i+n<=w.length;i++)s.add(w.slice(i,i+n).join(' '));return s;};
const all={};for(const p of paths)all[p]=sh(texts[p]);
console.log('words (без header/footer/nav):');for(const p of paths)console.log(' ',p,texts[p].length);
console.log('\nдоля 5-словных шинглов страницы, встречающихся на ДРУГИХ страницах сайта:');
for(const p of paths){const mine=all[p];let dup=0;for(const s of mine){for(const q of paths){if(q===p)continue;if(all[q].has(s)){dup++;break;}}}console.log(' ',p,(100*dup/mine.size).toFixed(0)+'%','('+dup+'/'+mine.size+')');}
console.log('\nпопарно с /pilomaterialy:');
for(const p of paths){if(p==='/pilomaterialy')continue;const a=all[p],b=all['/pilomaterialy'];let c=0;for(const s of a)if(b.has(s))c++;console.log(' ',p,(100*c/a.size).toFixed(0)+'%');}
