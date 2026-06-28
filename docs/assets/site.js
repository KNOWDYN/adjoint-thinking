(function(){
  const root=document.documentElement;
  const media=window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const themeStorageKey='adjoint-theme-preference';
  const languageStorageKey='adjoint-language-preference';
  const validThemes=new Set(['system','light','dark']);
  let translationCache=null;

  function storedTheme(){
    const saved=localStorage.getItem(themeStorageKey);
    return validThemes.has(saved) ? saved : 'system';
  }
  function resolvedTheme(choice){ return choice==='system' ? (media && media.matches ? 'dark' : 'light') : choice; }
  function applyTheme(choice){
    const theme=validThemes.has(choice) ? choice : 'system';
    const resolved=resolvedTheme(theme);
    root.dataset.theme=resolved;
    root.dataset.themeChoice=theme;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', resolved==='dark' ? '#161616' : '#cf2e2e');
    document.querySelectorAll('[data-theme-option]').forEach(button=>{
      button.setAttribute('aria-pressed', button.getAttribute('data-theme-option')===theme ? 'true' : 'false');
    });
  }
  function bindThemeControls(){
    document.querySelectorAll('[data-theme-option]').forEach(button=>{
      if(button.dataset.themeBound) return;
      button.dataset.themeBound='true';
      button.addEventListener('click',()=>{
        const value=button.getAttribute('data-theme-option') || 'system';
        localStorage.setItem(themeStorageKey,value);
        applyTheme(value);
      });
    });
  }

  function rememberOriginalText(){
    document.querySelectorAll('body *').forEach(node=>{
      if(['SCRIPT','STYLE','SELECT','OPTION','CODE','PRE'].includes(node.tagName)) return;
      Array.from(node.childNodes).forEach(child=>{
        if(child.nodeType===Node.TEXT_NODE && child.nodeValue.trim() && !child.__originalText){
          child.__originalText=child.nodeValue;
        }
      });
    });
  }
  function translateExactText(dictionary){
    rememberOriginalText();
    document.querySelectorAll('body *').forEach(node=>{
      if(['SCRIPT','STYLE','SELECT','OPTION','CODE','PRE'].includes(node.tagName)) return;
      Array.from(node.childNodes).forEach(child=>{
        if(child.nodeType!==Node.TEXT_NODE || !child.__originalText) return;
        const original=child.__originalText;
        const trimmed=original.trim();
        child.nodeValue=dictionary[trimmed] ? original.replace(trimmed,dictionary[trimmed]) : original;
      });
    });
  }
  function machineTranslateFallback(locale){
    const proxy=window.TRANSLATION_PROXY || '';
    if(!proxy || locale!=='ar') return Promise.resolve(false);
    const main=document.querySelector('main.content');
    if(!main) return Promise.resolve(false);
    const source=main.innerHTML;
    return fetch(proxy,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({targetLocale:locale,text:source})})
      .then(r=>r.ok ? r.json() : Promise.reject(new Error('translation failed')))
      .then(data=>{
        if(data && data.text){
          main.dataset.machineTranslated='true';
          main.innerHTML='<aside class="translation-notice">Machine translation fallback. Review before relying on translated wording.</aside>'+data.text;
          return true;
        }
        return false;
      })
      .catch(()=>false);
  }
  function applyLanguage(locale){
    const selected=locale==='ar' ? 'ar' : 'en';
    const select=document.getElementById('language-select');
    const button=document.querySelector('.machine-translate-button');
    if(select) select.value=selected;
    root.lang=selected;
    root.dir=selected==='ar' ? 'rtl' : 'ltr';
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
      .then(r=>r.ok ? r.json() : Promise.reject(new Error('catalog unavailable')))
      .then(data=>{ translationCache=data; translateExactText(data.text || {}); })
      .catch(()=>machineTranslateFallback(selected));
  }
  function bindLanguageControls(){
    const select=document.getElementById('language-select');
    const button=document.querySelector('.machine-translate-button');
    if(select && !select.dataset.languageBound){
      select.dataset.languageBound='true';
      select.addEventListener('change',()=>{ localStorage.setItem(languageStorageKey,select.value); applyLanguage(select.value); });
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

  function bindSearch(){
    const input=document.getElementById('site-search');
    const box=document.getElementById('search-results');
    if(!input||!box||!window.SITE_INDEX_PATH) return;
    const prefix=window.SITE_ROOT_PREFIX || '';
    fetch(window.SITE_INDEX_PATH).then(r=>r.json()).then(index=>{
      input.addEventListener('input',()=>{
        const q=input.value.trim().toLowerCase();
        box.innerHTML='';
        if(q.length<2) return;
        index.filter(p=>(p.title+' '+p.desc+' '+(p.tags||[]).join(' ')+' '+p.section).toLowerCase().includes(q)).slice(0,8).forEach(h=>{
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
  }

  function bindAudiencePathways(){
    document.querySelectorAll('[data-audience-pathway]').forEach(pathway=>{
      if(pathway.dataset.pathwayBound) return;
      pathway.dataset.pathwayBound='true';
      pathway.addEventListener('click',event=>{
        const target=event.target.closest('[data-pathway-target]');
        if(!target) return;
        pathway.querySelectorAll('[data-pathway-target]').forEach(item=>item.setAttribute('aria-selected','false'));
        target.setAttribute('aria-selected','true');
        const selector=target.getAttribute('data-pathway-target');
        pathway.querySelectorAll('[data-pathway-panel]').forEach(panel=>{ panel.hidden=panel.getAttribute('data-pathway-panel')!==selector; });
      });
    });
  }

  applyTheme(storedTheme());
  if(media) media.addEventListener('change',()=>{ if(storedTheme()==='system') applyTheme('system'); });
  function init(){ bindThemeControls(); applyTheme(storedTheme()); bindLanguageControls(); bindSearch(); bindAudiencePathways(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
