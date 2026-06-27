(function(){
  const root=document.documentElement;
  const themeStorageKey='adjoint-theme-preference';
  const localeStorageKey='adjoint-locale-preference';
  const media=window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const validThemes=new Set(['system','light','dark']);
  const supportedLocales=new Set(['en','ar']);
  const translateProxy=(window.SITE_TRANSLATE_PROXY || '').trim();
  let activeLocale='en';
  let arCatalog=null;

  function safeStorageGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
  function safeStorageSet(key,value){ try { localStorage.setItem(key,value); } catch(e){} }

  function storedTheme(){ const saved=safeStorageGet(themeStorageKey); return validThemes.has(saved) ? saved : 'system'; }
  function resolvedTheme(choice){ return choice==='system' ? (media && media.matches ? 'dark' : 'light') : choice; }
  function applyTheme(choice){
    const theme=validThemes.has(choice) ? choice : 'system';
    const resolved=resolvedTheme(theme);
    root.dataset.theme=resolved;
    root.dataset.themeChoice=theme;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', resolved==='dark' ? '#161616' : '#cf2e2e');
    document.querySelectorAll('[data-theme-option]').forEach(button=>button.setAttribute('aria-pressed', button.getAttribute('data-theme-option')===theme ? 'true' : 'false'));
  }

  function browserLocale(){
    const saved=safeStorageGet(localeStorageKey);
    if(supportedLocales.has(saved)) return saved;
    const langs=navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    return langs.some(lang=>String(lang).toLowerCase().startsWith('ar')) ? 'ar' : 'en';
  }

  function uiText(key){
    const en={language:'Language',theme:'Theme preference',system:'System',light:'Light',dark:'Dark',english:'English',arabic:'العربية',machine:'Machine translate',machineNotice:'Machine translation preview. This text has not been professionally reviewed.',machineUnavailable:'Machine translation is not configured for this static deployment.',searchLabel:'Search scenarios and method',searchPlaceholder:'Search...',skip:'Skip to main content'};
    const ar={language:'اللغة',theme:'تفضيل المظهر',system:'النظام',light:'فاتح',dark:'داكن',english:'English',arabic:'العربية',machine:'ترجمة آلية',machineNotice:'ترجمة آلية تجريبية. لم تتم مراجعة هذا النص مراجعة مهنية.',machineUnavailable:'الترجمة الآلية غير مفعّلة في هذا النشر الساكن.',searchLabel:'ابحث في السيناريوهات والمنهج',searchPlaceholder:'بحث...',skip:'تجاوز إلى المحتوى الرئيسي'};
    return (activeLocale==='ar' ? ar : en)[key] || key;
  }

  function ensureControls(){
    const topbar=document.querySelector('.topbar');
    if(!topbar) return;
    let actions=document.querySelector('.topbar-actions');
    if(!actions){ actions=document.createElement('div'); actions.className='topbar-actions'; topbar.appendChild(actions); }
    if(!document.querySelector('.theme-switcher')){
      const group=document.createElement('div'); group.className='theme-switcher'; group.setAttribute('role','group'); group.setAttribute('aria-label',uiText('theme'));
      [['system','system'],['light','light'],['dark','dark']].forEach(([value,key])=>{
        const button=document.createElement('button'); button.type='button'; button.className='theme-option'; button.setAttribute('data-theme-option',value); button.textContent=uiText(key);
        button.addEventListener('click',()=>{ safeStorageSet(themeStorageKey,value); applyTheme(value); }); group.appendChild(button);
      });
      actions.appendChild(group);
    }
    if(!document.querySelector('.language-switcher')){
      const group=document.createElement('div'); group.className='language-switcher'; group.setAttribute('role','group'); group.setAttribute('aria-label',uiText('language'));
      [['en','english'],['ar','arabic']].forEach(([value,key])=>{
        const button=document.createElement('button'); button.type='button'; button.className='locale-option'; button.setAttribute('data-locale-option',value); button.textContent=uiText(key);
        button.addEventListener('click',()=>{ safeStorageSet(localeStorageKey,value); applyLocale(value); }); group.appendChild(button);
      });
      actions.appendChild(group);
    }
    if(!document.querySelector('.machine-translate-button')){
      const button=document.createElement('button'); button.type='button'; button.className='machine-translate-button'; button.textContent=uiText('machine'); if(!translateProxy){ button.classList.add('is-disabled'); button.setAttribute('aria-disabled','true'); button.title=uiText('machineUnavailable'); } button.addEventListener('click',requestMachineTranslation); actions.appendChild(button);
    }
  }

  function setStaticLabels(){
    const skip=document.querySelector('.skip-link'); if(skip) skip.textContent=uiText('skip');
    const searchLabel=document.querySelector('.search-box label'); if(searchLabel) searchLabel.textContent=uiText('searchLabel');
    const searchInput=document.getElementById('site-search'); if(searchInput) searchInput.setAttribute('placeholder',uiText('searchPlaceholder'));
    const themeGroup=document.querySelector('.theme-switcher'); if(themeGroup) themeGroup.setAttribute('aria-label',uiText('theme'));
    const localeGroup=document.querySelector('.language-switcher'); if(localeGroup) localeGroup.setAttribute('aria-label',uiText('language'));
    document.querySelectorAll('[data-theme-option="system"]').forEach(el=>el.textContent=uiText('system'));
    document.querySelectorAll('[data-theme-option="light"]').forEach(el=>el.textContent=uiText('light'));
    document.querySelectorAll('[data-theme-option="dark"]').forEach(el=>el.textContent=uiText('dark'));
    document.querySelectorAll('[data-locale-option="en"]').forEach(el=>el.textContent=uiText('english'));
    document.querySelectorAll('[data-locale-option="ar"]').forEach(el=>el.textContent=uiText('arabic'));
    document.querySelectorAll('.machine-translate-button').forEach(el=>el.textContent=uiText('machine'));
  }

  function restoreEnglishText(){
    document.querySelectorAll('[data-i18n-source]').forEach(node=>{ node.nodeValue=node.parentElement ? node.parentElement.getAttribute('data-i18n-source') || node.nodeValue : node.nodeValue; });
    document.querySelectorAll('[data-i18n-original-text]').forEach(el=>{ el.textContent=el.getAttribute('data-i18n-original-text') || el.textContent; });
  }

  function translateExactText(){
    if(activeLocale!=='ar' || !arCatalog || !arCatalog.text) return;
    const map=arCatalog.text;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const parent=node.parentElement; if(!parent || ['SCRIPT','STYLE','TEXTAREA','CODE','PRE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return node.nodeValue && map[node.nodeValue.trim()] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }});
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{ const original=node.nodeValue.trim(); node.parentElement.setAttribute('data-i18n-original-text',original); node.nodeValue=node.nodeValue.replace(original,map[original]); });
  }

  function loadArabicCatalog(){
    if(arCatalog) return Promise.resolve(arCatalog);
    const prefix=window.SITE_ROOT_PREFIX || '';
    return fetch(prefix+'assets/i18n.ar.json').then(r=>r.ok ? r.json() : null).then(data=>{ arCatalog=data; return data; }).catch(()=>null);
  }

  function applyLocale(locale){
    activeLocale=supportedLocales.has(locale) ? locale : 'en';
    root.lang=activeLocale; root.dir=activeLocale==='ar' ? 'rtl' : 'ltr'; root.dataset.locale=activeLocale;
    document.querySelectorAll('[data-locale-option]').forEach(button=>button.setAttribute('aria-pressed', button.getAttribute('data-locale-option')===activeLocale ? 'true' : 'false'));
    restoreEnglishText(); setStaticLabels();
    if(activeLocale==='ar') loadArabicCatalog().then(()=>translateExactText());
    enhanceAudiencePathways();
  }



  function audienceCopy(){
    if(activeLocale==='ar'){
      return {
        eyebrow:'مسارات الجمهور',
        title:'اختر نقطة البداية حسب طريقة عملك',
        intro:'بدلاً من قائمة طويلة، ابدأ من نمط الضغط المهني الأقرب إليك: تحقق من الأدلة، حماية الحكم، أو توسيع الإمكانات الإبداعية.',
        groups:[
          {label:'عمل قائم على الأدلة',desc:'للباحثين والمعلّمين والمستشارين الذين يحتاجون حدوداً واضحة للمصادر والادعاءات.',links:[['باحث','scenarios/ai-literature-summary-verification-for-researchers/'],['معلّم','scenarios/ai-source-grounded-lecture-builder-for-educators/'],['مستشار','scenarios/ai-client-memo-verification-for-consultants/']]},
          {label:'قرار ومخاطر',desc:'للمؤسسين والمستثمرين والمحللين والمهندسين الذين يحتاجون مذكّرات قابلة للدفاع لا مجرد صياغة سلسة.',links:[['مؤسس','scenarios/ai-pitch-deck-claim-verification-for-founders/'],['مستثمر','scenarios/ai-startup-screening-workflow-for-angel-investors/'],['محلل','scenarios/ai-decision-memo-synthesis-for-analysts/'],['مهندس','scenarios/ai-design-review-reasoning-workflow-for-engineers/']]},
          {label:'تعلّم وإبداع',desc:'للطلاب والكتّاب والمبدعين الذين يريدون مساعدة الذكاء الاصطناعي دون فقدان الفهم أو الصوت الأصلي.',links:[['طالب','scenarios/ai-learning-without-outsourcing-understanding-for-students/'],['كاتب','scenarios/ai-fiction-cowriting-without-losing-original-voice/'],['مبدع','scenarios/ai-controlled-divergence-for-artists-and-creators/']]}
        ]
      };
    }
    return {
      eyebrow:'Audience pathways',
      title:'Choose your starting point by work mode',
      intro:'Instead of scanning every page, start from the professional pressure closest to you: evidence, judgment, or creative expansion.',
      groups:[
        {label:'Evidence-led work',desc:'For researchers, educators, and consultants who need source boundaries and claim discipline before reuse.',links:[['Researcher','scenarios/ai-literature-summary-verification-for-researchers/'],['Educator','scenarios/ai-source-grounded-lecture-builder-for-educators/'],['Consultant','scenarios/ai-client-memo-verification-for-consultants/']]},
        {label:'Decision and risk work',desc:'For founders, investors, analysts, and engineers who need defensible decisions rather than fluent summaries.',links:[['Founder','scenarios/ai-pitch-deck-claim-verification-for-founders/'],['Investor','scenarios/ai-startup-screening-workflow-for-angel-investors/'],['Analyst','scenarios/ai-decision-memo-synthesis-for-analysts/'],['Engineer','scenarios/ai-design-review-reasoning-workflow-for-engineers/']]},
        {label:'Learning and creative work',desc:'For students, writers, and creators who want AI support without surrendering understanding or original voice.',links:[['Student','scenarios/ai-learning-without-outsourcing-understanding-for-students/'],['Writer','scenarios/ai-fiction-cowriting-without-losing-original-voice/'],['Creator','scenarios/ai-controlled-divergence-for-artists-and-creators/']]}
      ]
    };
  }

  function enhanceAudiencePathways(){
    const main=document.querySelector('main.content');
    if(!main || document.body.dataset.page!=='index') return;
    let section=document.getElementById('audience-pathways');
    if(!section){
      section=document.createElement('section');
      section.id='audience-pathways';
      section.className='audience-pathways';
      const hero=main.querySelector('.hero');
      if(hero && hero.nextSibling) main.insertBefore(section,hero.nextSibling); else main.prepend(section);
    }
    const copy=audienceCopy();
    section.innerHTML='';
    const eyebrow=document.createElement('p'); eyebrow.className='eyebrow'; eyebrow.textContent=copy.eyebrow;
    const title=document.createElement('h2'); title.textContent=copy.title;
    const intro=document.createElement('p'); intro.className='lede audience-lede'; intro.textContent=copy.intro;
    const grid=document.createElement('div'); grid.className='audience-grid';
    copy.groups.forEach(group=>{
      const card=document.createElement('article'); card.className='audience-card';
      const h=document.createElement('h3'); h.textContent=group.label;
      const p=document.createElement('p'); p.textContent=group.desc;
      const links=document.createElement('div'); links.className='audience-links';
      group.links.forEach(([label,url])=>{ const a=document.createElement('a'); a.href=(window.SITE_ROOT_PREFIX||'')+url; a.textContent=label; links.appendChild(a); });
      card.append(h,p,links); grid.appendChild(card);
    });
    section.append(eyebrow,title,intro,grid);
  }

  function requestMachineTranslation(){
    const proxy=translateProxy;
    const notice=document.getElementById('machine-translation-notice') || document.createElement('div');
    notice.id='machine-translation-notice'; notice.className='callout warning machine-translation-notice';
    const main=document.querySelector('main.content'); if(main && !notice.parentElement) main.prepend(notice);
    if(!proxy){ notice.textContent=uiText('machineUnavailable'); return; }
    notice.textContent=uiText('machineNotice');
    fetch(proxy,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sourceLocale:root.lang || 'en',targetLocale:activeLocale,pagePath:location.pathname,text:main ? main.innerText.slice(0,12000) : document.body.innerText.slice(0,12000)})})
      .then(r=>r.ok ? r.json() : Promise.reject(new Error('translation failed')))
      .then(data=>{ if(data && data.text && main){ notice.textContent=uiText('machineNotice'); const box=document.createElement('section'); box.className='machine-translation-result'; box.textContent=data.text; main.prepend(box); }})
      .catch(()=>{ notice.textContent=uiText('machineUnavailable'); });
  }

  applyTheme(storedTheme());
  if(media){ media.addEventListener('change',()=>{ if(storedTheme()==='system') applyTheme('system'); }); }
  function boot(){ ensureControls(); enhanceAudiencePathways(); applyTheme(storedTheme()); applyLocale(browserLocale()); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();

  const input=document.getElementById('site-search');
  const box=document.getElementById('search-results');
  if(!input||!box) return;
  const prefix=window.SITE_ROOT_PREFIX || '';
  fetch(window.SITE_INDEX_PATH).then(r=>r.json()).then(index=>{
    input.addEventListener('input',()=>{
      const q=input.value.trim().toLowerCase(); box.innerHTML=''; if(q.length<2) return;
      const hits=index.filter(p=>(p.title+' '+p.desc+' '+(p.tags||[]).join(' ')).toLowerCase().includes(q)).slice(0,8);
      hits.forEach(h=>{ const a=document.createElement('a'); const title=document.createElement('strong'); const section=document.createElement('small'); a.className='result'; a.href=prefix + h.url.replace(/^\.\//,''); title.textContent=h.title; section.textContent=h.section; a.append(title,section); box.appendChild(a); });
    });
  }).catch(()=>{});
})();
