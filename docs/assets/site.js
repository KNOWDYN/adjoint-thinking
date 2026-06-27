(function(){
  const storageKey='adjoint-theme-preference';
  const root=document.documentElement;
  const media=window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const validThemes=new Set(['system','light','dark']);

  function storedTheme(){
    const saved=localStorage.getItem(storageKey);
    return validThemes.has(saved) ? saved : 'system';
  }

  function resolvedTheme(choice){
    return choice==='system' ? (media && media.matches ? 'dark' : 'light') : choice;
  }

  function applyTheme(choice){
    const theme=validThemes.has(choice) ? choice : 'system';
    const resolved=resolvedTheme(theme);
    root.dataset.theme=resolved;
    root.dataset.themeChoice=theme;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', resolved==='dark' ? '#161616' : '#cf2e2e');
    const buttons=document.querySelectorAll('[data-theme-option]');
    buttons.forEach(button=>{
      const active=button.getAttribute('data-theme-option')===theme;
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function ensureThemeControls(){
    const topbar=document.querySelector('.topbar');
    if(!topbar || document.querySelector('.theme-switcher')) return;
    const actions=document.createElement('div');
    actions.className='topbar-actions';
    const group=document.createElement('div');
    group.className='theme-switcher';
    group.setAttribute('role','group');
    group.setAttribute('aria-label','Theme preference');
    [['system','System'],['light','Light'],['dark','Dark']].forEach(([value,label])=>{
      const button=document.createElement('button');
      button.type='button';
      button.className='theme-option';
      button.setAttribute('data-theme-option',value);
      button.textContent=label;
      button.addEventListener('click',()=>{
        localStorage.setItem(storageKey,value);
        applyTheme(value);
      });
      group.appendChild(button);
    });
    actions.appendChild(group);
    topbar.appendChild(actions);
  }

  applyTheme(storedTheme());
  if(media){
    media.addEventListener('change',()=>{
      if(storedTheme()==='system') applyTheme('system');
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{ ensureThemeControls(); applyTheme(storedTheme()); });
  }else{
    ensureThemeControls(); applyTheme(storedTheme());
  }

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
      hits.forEach(h=>{
        const a=document.createElement('a');
        const title=document.createElement('strong');
        const section=document.createElement('small');
        a.className='result';
        a.href=prefix + h.url.replace(/^\.\//,'');
        title.textContent=h.title;
        section.textContent=h.section;
        a.append(title,section);
        box.appendChild(a);
      });
    });
  }).catch(()=>{});
})();
