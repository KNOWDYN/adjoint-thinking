
(function(){
  const input=document.getElementById('site-search');
  const box=document.getElementById('search-results');
  if(!input||!box) return;
  const prefix=window.SITE_ROOT_PREFIX || '';
  fetch(window.SITE_INDEX_PATH).then(r=>r.json()).then(index=>{
    input.addEventListener('input',()=>{
      const q=input.value.trim().toLowerCase();
      box.innerHTML='';
      if(q.length<2) return;
      const hits=index.filter(p=>(p.title+' '+p.desc+' '+(p.tags||[]).join(' ')).toLowerCase().includes(q)).slice(0,8);
      hits.forEach(h=>{ const a=document.createElement('a'); a.className='result'; a.href=prefix + h.url.replace(/^\.\//,''); a.innerHTML='<strong>'+h.title+'</strong><small>'+h.section+'</small>'; box.appendChild(a); });
    });
  }).catch(()=>{});
})();
