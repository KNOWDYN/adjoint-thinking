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

  function bindThemeControls(container=document){
    container.querySelectorAll('[data-theme-option]').forEach(button=>{
      if(button.dataset.themeBound) return;
      button.dataset.themeBound='true';
      button.addEventListener('click',()=>{
        const value=button.getAttribute('data-theme-option') || 'system';
        localStorage.setItem(storageKey,value);
        applyTheme(value);
      });
    });
  }

  function ensureThemeControls(){
    const topbar=document.querySelector('.topbar');
    if(!topbar){
      bindThemeControls();
      return;
    }
    if(document.querySelector('.theme-switcher')){
      bindThemeControls();
      return;
    }
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
      group.appendChild(button);
    });
    actions.appendChild(group);
    topbar.appendChild(actions);
    bindThemeControls(actions);
  }

  const languageStorageKey='adjoint-language-preference';
  let translationCache=null;

  function rememberOriginalText(){
    document.querySelectorAll('body *').forEach(node=>{
      if(['SCRIPT','STYLE','SELECT','OPTION'].includes(node.tagName)) return;
      Array.from(node.childNodes).forEach(child=>{
        if(child.nodeType===Node.TEXT_NODE && child.nodeValue.trim()){
          if(!child.__originalText) child.__originalText=child.nodeValue;
        }
      });
    });
  }

  function translateExactText(dictionary){
    rememberOriginalText();
    document.querySelectorAll('body *').forEach(node=>{
      if(['SCRIPT','STYLE','SELECT','OPTION'].includes(node.tagName)) return;
      Array.from(node.childNodes).forEach(child=>{
        if(child.nodeType!==Node.TEXT_NODE || !child.__originalText) return;
        const original=child.__originalText;
        const trimmed=original.trim();
        if(dictionary[trimmed]){
          child.nodeValue=original.replace(trimmed,dictionary[trimmed]);
        }else{
          child.nodeValue=original;
        }
      });
    });
  }

  function applyLanguage(locale){
    const selected=locale==='ar' ? 'ar' : 'en';
    const select=document.getElementById('language-select');
    const button=document.querySelector('.machine-translate-button');
    if(select) select.value=selected;
    document.documentElement.lang=selected;
    document.documentElement.dir=selected==='ar' ? 'rtl' : 'ltr';
    if(button) button.setAttribute('aria-pressed', selected==='ar' ? 'true' : 'false');
    if(selected==='en'){
      translateExactText({});
      return Promise.resolve();
    }
    if(translationCache){
      translateExactText(translationCache.text || {});
      return Promise.resolve();
    }
    const prefix=window.SITE_ROOT_PREFIX || '';
    return fetch(prefix + 'assets/i18n.ar.json')
      .then(r=>r.json())
      .then(data=>{
        translationCache=data;
        translateExactText(data.text || {});
      })
      .catch(()=>{});
  }

  function bindLanguageControls(){
    const select=document.getElementById('language-select');
    const button=document.querySelector('.machine-translate-button');
    if(select && !select.dataset.languageBound){
      select.dataset.languageBound='true';
      select.addEventListener('change',()=>{
        localStorage.setItem(languageStorageKey,select.value);
        applyLanguage(select.value);
      });
    }
    if(button && !button.dataset.languageBound){
      button.dataset.languageBound='true';
      button.addEventListener('click',()=>{
        const next=(localStorage.getItem(languageStorageKey)==='ar') ? 'en' : (button.getAttribute('data-machine-translate') || 'ar');
        localStorage.setItem(languageStorageKey,next);
        applyLanguage(next);
      });
    }
    applyLanguage(localStorage.getItem(languageStorageKey) || 'en');
  }

  applyTheme(storedTheme());
  if(media){
    media.addEventListener('change',()=>{
      if(storedTheme()==='system') applyTheme('system');
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{ ensureThemeControls(); applyTheme(storedTheme()); bindLanguageControls(); });
  }else{
    ensureThemeControls(); applyTheme(storedTheme()); bindLanguageControls();
  }

  const input=document.getElementById('site-search');
  const box=document.getElementById('search-results');
  if(!input||!box) return;
  const prefix=window.SITE_ROOT_PREFIX || '';
  fetch(window.SITE_INDEX_PATH).then(r=>r.json()).then(index=>{
    input.addEventListener('input',()=>{
      const q=input.value.trim().toLowerCase(); box.innerHTML=''; if(q.length<2) return;
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
