/* PAK RAZ ESPADANA — افزونه‌های ۱۵.۸ (جدا از site.js تا ظاهر و منطق قبلی دست‌نخورده بماند)
   قابلیت‌ها: جست‌وجوی کل سایت، مگامنو، دکمهٔ استعلام شناور/نوار موبایل، فوتر کامل، فهرست محتوا،
   نوار اعتماد، پل به فروشگاه عمده، و صفحه‌های: راهنمای انتخاب، ابزارها، مرکز دانلود، استعلام چندمرحله‌ای،
   قالب‌های مقاله/نمونه‌کار/خبر. اگر این فایل بارگذاری نشود، سایت مثل ۱۵.۷ کار می‌کند. */
(function(){'use strict';
const C=window.PAKRAZ_CTX;if(!C||!window.PAKRAZ_X_I18N)return;
const {D,T,lang,page,slug,prefix,esc,tr,route,asset,productURL}=C;
const I=window.PAKRAZ_X_I18N,L=I[lang]||I.en,E=I.en,t=k=>L[k]??E[k]??k;
const X=window.PAKRAZ_X_CONTENT||{},CFG=window.PAKRAZ_CONFIG||{};
const fa=lang==='fa';
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const num=n=>{try{return Number(n).toLocaleString(fa?'fa-IR':lang==='ar'?'ar-EG':'en')}catch(e){return String(n)}};
const toEn=s=>String(s).replace(/[۰-۹]/g,d=>d.charCodeAt(0)-1776).replace(/[٠-٩]/g,d=>d.charCodeAt(0)-1632);
const norm=s=>toEn(String(s||'')).normalize('NFKC').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[ً-ٰٟ‌‏‎]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const num2=v=>{const n=parseFloat(toEn(v).replace(/٫/g,'.').replace(/[^\d.]/g,''));return isFinite(n)&&n>0?n:null};
const active=D.products.filter(p=>p.active);
const SHOP_LANGS=['fa'];
const shopOn=SHOP_LANGS.includes(lang)&&CFG.shopEnabled!==false;
const shopBase=(CFG.orderPortalUrl&&/^https:\/\//i.test(CFG.orderPortalUrl))?CFG.orderPortalUrl.replace(/\/?$/,'/'):prefix+'shop/';
const shopHome=shopBase+'index.html';
const SHOP_ID={pce:'pce-superplasticizer'};
const shopProd=s=>SHOP_ID[s]?shopBase+'product-'+SHOP_ID[s]+'.html':shopBase+'catalog.html';
const phoneOk=CFG.phoneNumber&&/^[+0-9 ()-]{7,24}$/.test(CFG.phoneNumber);
const url=u=>/^https:\/\//i.test(u||'')?u:'';
const chat=url(CFG.whatsappUrl)||url(CFG.telegramDirectUrl);
const P=(k)=>route(lang,k);
const pages={finder:'finder.html',tools:'tools.html',downloads:'downloads.html',inquiry:'inquiry.html'};
const has={articles:(X.articles||[]).length>0,cases:(X.cases||[]).length>0,news:(X.news||[]).length>0};
const pname=p=>tr(p.name);
const hero=(title,lead,tag)=>`<section class="page-hero"><div><span class="eyebrow">${esc(tag)}</span><h1>${esc(title)}</h1><p>${esc(lead)}</p></div><div class="page-art">PR<span>+</span></div></section><div class="breadcrumb"><a href="${route(lang)}">${esc(T.home)}</a>　/　${esc(title)}</div>`;
const ico={search:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'};

/* ---------- header: search + CTA ---------- */
function shopIsSameOrigin(){try{return new URL(shopBase,location.href).origin===location.origin}catch(e){return false}}
function headerAdds(){
  const ha=$('.head-actions');if(!ha||$('.x-search-btn'))return;
  const sb=document.createElement('button');sb.type='button';sb.className='x-search-btn';sb.setAttribute('aria-label',t('search'));sb.setAttribute('aria-haspopup','dialog');sb.innerHTML=ico.search;sb.addEventListener('click',openSearch);
  ha.insertBefore(sb,ha.firstChild);
  const cta=document.createElement('a');cta.className='x-cta';
  if(shopOn){cta.href=shopHome;cta.textContent=t('wholesale')}else{cta.href=P(pages.inquiry);cta.textContent=t('inquiry')}
  ha.insertBefore(cta,ha.firstChild);
  if(fa&&shopOn&&shopIsSameOrigin()){
    const a=document.createElement('a');a.className='x-rfq-link';a.href=shopBase+'rfq.html';a.setAttribute('aria-label','لیست استعلام');
    a.innerHTML='<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l3 3v15H4V3z"/><path d="M8 10h8M8 14h8M8 18h5"/></svg><span>استعلام</span><b class="x-rfq-count" aria-live="polite">۰</b>';
    const badge=a.querySelector('.x-rfq-count');
    const refresh=()=>{let n=0;try{const rows=JSON.parse(localStorage.getItem('pakraz_rfq_v1')||'[]');if(Array.isArray(rows))n=rows.length}catch(e){}badge.textContent=n>99?'۹۹+':String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[+d]);a.setAttribute('aria-label','لیست استعلام، '+n+' ردیف')};
    ha.insertBefore(a,cta.nextSibling);refresh();
    window.addEventListener('storage',e=>{if(!e.key||e.key==='pakraz_rfq_v1')refresh()});
    window.addEventListener('pageshow',refresh);window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
  }
}

/* ---------- mega menu ---------- */
function mega(){
  const hdr=$('.header'),link=$('#nav a[href$="products/index.html"]');if(!hdr||!link||$('.x-mega'))return;
  const m=document.createElement('div');m.className='x-mega';m.id='xMega';m.hidden=true;
  const prods=active.map(p=>`<a href="${productURL(lang,p.slug)}"><b>${esc(pname(p))}</b><small>${esc(tr(p.category))}</small></a>`).join('');
  const soon=D.products.filter(p=>!p.active).length;
  m.innerHTML=`<div class="x-mega-in"><div><h3>${esc(t('megaHead'))}</h3><div class="x-mega-list">${prods}</div>${soon?`<p class="x-mega-soon">+${num(soon)} ${esc(t('megaSoon'))}</p>`:''}<a class="x-mega-all" href="${P('products/index.html')}">${esc(t('megaMore'))} ↗</a></div><div><h3>${esc(t('fTools'))}</h3><div class="x-mega-list"><a href="${P(pages.finder)}"><b>${esc(t('finder'))}</b></a><a href="${P(pages.tools)}"><b>${esc(t('tools'))}</b></a><a href="${P(pages.downloads)}"><b>${esc(t('downloads'))}</b></a><a href="${P(pages.inquiry)}"><b>${esc(t('inquiryPage'))}</b></a></div></div></div>`;
  hdr.appendChild(m);
  link.setAttribute('aria-haspopup','true');link.setAttribute('aria-expanded','false');link.setAttribute('aria-controls','xMega');
  let to;const open=()=>{if(!matchMedia('(min-width:1181px) and (hover:hover)').matches)return;clearTimeout(to);m.hidden=false;link.setAttribute('aria-expanded','true')};
  const close=()=>{to=setTimeout(()=>{m.hidden=true;link.setAttribute('aria-expanded','false')},140)};
  [link,m].forEach(e=>{e.addEventListener('mouseenter',open);e.addEventListener('mouseleave',close)});
  link.addEventListener('focus',open);m.addEventListener('focusout',e=>{if(!m.contains(e.relatedTarget)&&e.relatedTarget!==link)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!m.hidden){m.hidden=true;link.setAttribute('aria-expanded','false')}});
}

/* ---------- footer ---------- */
function footerCols(){
  const ft=$('.footer .footer-top');if(!ft||$('.x-fcols'))return;
  const navs=T.nav.map((n,i)=>[n,P(['','about.html','areas.html','products/index.html','quality.html','resources.html','contact.html'][i])]);
  const col=(h,items)=>`<div><h4>${esc(h)}</h4>${items.map(([a,b,x])=>`<a href="${esc(b)}"${x?' rel="noopener"':''}>${esc(a)}</a>`).join('')}</div>`;
  const prods=active.map(p=>[pname(p),productURL(lang,p.slug)]);prods.push([t('allProducts'),P('products/index.html')]);
  const tools=[[t('finder'),P(pages.finder)],[t('tools'),P(pages.tools)],[t('downloads'),P(pages.downloads)],[t('inquiryPage'),P(pages.inquiry)]];
  if(has.articles)tools.push([t('artT'),P('article.html')]);if(has.cases)tools.push([t('caseT'),P('case.html')]);if(has.news)tools.push([t('newsT'),P('news.html')]);
  const sales=[];if(shopOn)sales.push([t('shopTitle'),shopHome]);sales.push([T.nav[6],P('contact.html')]);
  const legal=[];if(['fa','en'].includes(lang))legal.push([t('privacy'),P('privacy.html')]);
  const d=document.createElement('div');d.className='x-fcols';
  d.innerHTML=col(t('fPages'),navs)+col(t('fProducts'),prods)+col(t('fTools'),tools)+col(t('fSales'),sales.concat(legal));
  ft.parentNode.insertBefore(d,ft.nextSibling);
}

/* ---------- dock: floating CTA / mobile bar ---------- */
function dock(){
  if(['inquiry','contact','feedback'].includes(page)||$('.x-dock'))return;
  const d=document.createElement('div');d.className='x-dock';d.setAttribute('role','region');d.setAttribute('aria-label',t('inquiry'));
  const items=[];
  if(phoneOk)items.push(`<a class="x-d-call" href="tel:${esc(CFG.phoneNumber.replace(/[^+0-9]/g,''))}">${esc(t('call'))}</a>`);
  if(chat)items.push(`<a class="x-d-msg" href="${esc(chat)}" target="_blank" rel="noopener">${esc(t('msg'))}</a>`);
  const mainCta=fa&&shopOn&&shopIsSameOrigin()?shopBase+'rfq.html':P(pages.inquiry);
  items.push(`<a class="x-d-main" href="${esc(mainCta)}">${esc(t('inquiry'))}</a>`);
  d.innerHTML=items.join('');document.body.appendChild(d);document.body.classList.add('has-dock');
  const on=()=>d.classList.toggle('show',scrollY>360);addEventListener('scroll',on,{passive:true});on();
}

/* ---------- TOC ---------- */
function toc(){
  if($('.x-toc'))return;const main=$('main#main');if(!main||['finder','tools','downloads','inquiry','home','contact','products'].includes(page))return;
  const hs=$$('h2',main).filter(h=>h.textContent.trim()&&!h.closest('.x-toc'));if(hs.length<4)return;
  hs.forEach((h,i)=>{if(!h.id)h.id='x-h'+(i+1)});
  const d=document.createElement('details');d.className='x-toc';d.open=matchMedia('(min-width:900px)').matches;
  d.innerHTML=`<summary>${esc(t('toc'))}</summary><ol>${hs.map(h=>`<li><a href="#${h.id}">${esc(h.textContent.trim())}</a></li>`).join('')}</ol>`;
  const first=main.firstElementChild;(first&&first.classList.contains('section-head')?first:main).insertAdjacentElement(first&&first.classList.contains('section-head')?'afterend':'afterbegin',d);
}

/* ---------- home: trust + shop band ---------- */
function homeAdds(){
  if(page!=='home')return;
  const hero=$('section.hero');
  if((X.trust||[]).length&&hero){const s=document.createElement('section');s.className='x-trust';s.setAttribute('aria-label',t('trustT'));s.innerHTML=X.trust.map(i=>`<div><b>${esc(i.v)}</b><span>${esc(tr(i.l))}</span></div>`).join('');hero.insertAdjacentElement('afterend',s)}
  if(shopOn&&!$('.home-v16')){const f=$('footer.footer');if(f&&!$('.x-shop-band')){const s=document.createElement('section');s.className='x-shop-band';s.innerHTML=`<div><span class="eyebrow">${esc(t('shopNote'))}</span><h2>${esc(t('shopCta'))}</h2><p>${esc(t('shopCtaText'))}</p></div><a class="btn btn-primary" href="${shopHome}">${esc(t('shopGo'))} ↗</a>`;f.parentNode.insertBefore(s,f)}}
}
function productAdds(){
  if(page!=='product'||!shopOn)return;const note=$('.order-portal-note');
  const a=document.createElement('a');a.className='btn btn-outline x-shop-link';a.href=shopProd(slug);a.textContent=t('shopProd')+' ↗';
  if(note)note.replaceWith(a);else if(!$('.order-portal-link')){const b=$('.product-info .btn-primary');if(b)b.insertAdjacentElement('afterend',a)}
}

/* ---------- search ---------- */
let idx=null;
function flat(o,out){if(typeof o==='string')out.push(o);else if(Array.isArray(o))o.forEach(x=>flat(x,out));else if(o&&typeof o==='object')Object.values(o).forEach(x=>flat(x,out));return out}
function buildIndex(){
  const r=[];const add=(kind,title,href,text)=>r.push({kind,title,href,h:norm(title+' '+text),t:norm(title)});
  const nav=['','about.html','areas.html','products/index.html','quality.html','resources.html','contact.html'];
  T.nav.forEach((n,i)=>add(t('kPage'),n,P(nav[i]),[T.hero_desc,T.about_lead,T.areas_page_lead,T.quality_page_lead,T.resources_page_lead,T.contact_page_lead][i-1]||''));
  [['finder',t('finder'),t('finderLead')],['tools',t('tools'),t('toolsLead')],['downloads',t('downloads'),t('dlLead')],['inquiry',t('inqT'),t('inqLead')]].forEach(([k,a,b])=>add(t('kTool'),a,P(pages[k]),b));
  D.products.forEach(p=>{const deep=window.PAKRAZ_DEEP&&window.PAKRAZ_DEEP.p&&window.PAKRAZ_DEEP.p[p.slug];const extra=deep?flat(deep[lang]||deep.en||deep.fa||[],[]).join(' '):'';
    add(t('kProduct'),pname(p)+(p.active?'':' ·'),p.active?productURL(lang,p.slug):P('products/index.html'),tr(p.desc)+' '+tr(p.use)+' '+tr(p.category)+' '+extra)});
  (T.faq_q||[]).forEach((q,i)=>add(t('kFaq'),q,P('resources.html'),T.faq_a[i]||''));
  [['articles','kArticle'],['cases','kCase'],['news','kNews']].forEach(([k,kk])=>(X[k]||[]).forEach(a=>add(t(kk),tr(a.title),P((k==='cases'?'case':k==='news'?'news':'article')+'.html')+'?s='+encodeURIComponent(a.slug),tr(a.summary)+' '+flat(a.body&&(a.body[lang]||a.body.en),[]).join(' '))));
  (X.documents||[]).forEach(d=>add(d.type,d.title,P(pages.downloads),d.type+' '+d.product));
  return r;
}
let dlg,lastFocus;
function openSearch(){
  if(!idx)idx=buildIndex();lastFocus=document.activeElement;
  if(!dlg){dlg=document.createElement('div');dlg.className='x-sdlg';dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');dlg.setAttribute('aria-label',t('search'));
    dlg.innerHTML=`<div class="x-sbox"><div class="x-sbar">${ico.search}<input id="xq" type="search" autocomplete="off" spellcheck="false" placeholder="${esc(t('searchPh'))}" aria-label="${esc(t('search'))}"><button type="button" class="x-sclose" aria-label="${esc(t('close'))}">✕</button></div><ul class="x-sres" id="xres" role="listbox"></ul><p class="x-shint">${esc(t('searchHint'))}</p></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('mousedown',e=>{if(e.target===dlg)closeSearch()});$('.x-sclose',dlg).addEventListener('click',closeSearch);
    const q=$('#xq',dlg);q.addEventListener('input',()=>run(q.value));
    dlg.addEventListener('keydown',e=>{const items=$$('.x-sres a',dlg);const cur=items.indexOf(document.activeElement);
      if(e.key==='Escape'){e.preventDefault();closeSearch()}
      else if(e.key==='ArrowDown'){e.preventDefault();(items[cur+1]||items[0])&&(items[cur+1]||items[0]).focus()}
      else if(e.key==='ArrowUp'){e.preventDefault();if(cur<=0)q.focus();else items[cur-1].focus()}
      else if(e.key==='Enter'&&document.activeElement===q&&items[0]){e.preventDefault();location.href=items[0].href}
      else if(e.key==='Tab'){const f=[q,$('.x-sclose',dlg),...items];const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
  }
  dlg.hidden=false;document.body.classList.add('x-lock');const q=$('#xq',dlg);q.value='';run('');setTimeout(()=>q.focus(),30);
}
function closeSearch(){if(!dlg)return;dlg.hidden=true;document.body.classList.remove('x-lock');if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function run(v){
  const ul=$('#xres'),q=norm(v),toks=q.split(' ').filter(Boolean);
  let list=[];
  if(toks.length){list=idx.map(e=>{let s=0;for(const k of toks){if(e.t.includes(k))s+=3;else if(e.h.includes(k))s+=1;else return null}return{e,s}}).filter(Boolean).sort((a,b)=>b.s-a.s).slice(0,12).map(x=>x.e)}
  else list=idx.filter(e=>e.kind===t('kPage')||e.kind===t('kTool')).slice(0,10);
  ul.innerHTML=list.length?list.map(e=>`<li><a href="${esc(e.href)}"><span class="x-k">${esc(e.kind)}</span><b>${esc(e.title)}</b></a></li>`).join(''):`<li class="x-none">${esc(t('noRes'))}</li>`;
}
document.addEventListener('keydown',e=>{const tag=(document.activeElement&&document.activeElement.tagName)||'';const typing=/INPUT|TEXTAREA|SELECT/.test(tag)||(document.activeElement&&document.activeElement.isContentEditable);
  if((e.key==='/'&&!typing&&!e.ctrlKey&&!e.metaKey)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();openSearch()}});

/* ---------- ext pages ---------- */
function mainEl(){return $('main#main.ext-main')}
function setPage(title,lead,tag,html){const app=document.getElementById('app');const m=mainEl();if(!m)return;m.insertAdjacentHTML('beforebegin',hero(title,lead,tag));m.className='section x-sec';m.innerHTML=html;document.title=title+' | '+(D.brand.en||'PAK RAZ ESPADANA')}

function pageFinder(){
  const m=mainEl();
  setPage(t('finderTitle'),t('finderLead'),'PAK RAZ / TECHNICAL NEEDS','<div id="xf"></div>');
  const root=$('#xf');
  const st={step:1,app:'',goal:'',cement:'unknown',cementSource:'',scm:'unknown',conditions:'',volume:'unknown',supply:'unknown',pack:'unknown',docs:[]};
  const groups={
    app:[['ready', 'app_ready'],['precast','app_precast'],['stone','app_stone'],['other','app_other']],
    goal:[['water','goal_water'],['flow','goal_flow'],['retention','goal_retention'],['cycle','goal_cycle'],['other','goal_other']],
    volume:[['small','volume_small'],['mid','volume_mid'],['large','volume_large'],['unknown','volume_unknown']],
    supply:[['raw','supply_raw'],['concentrate','supply_concentrate'],['ready','supply_ready'],['unknown','supply_unknown']],
    pack:[['20','pack_20'],['drum','pack_drum'],['ibc','pack_ibc'],['bulk','pack_bulk'],['unknown','pack_unknown']],
    docs:[['tds','doc_tds'],['sds','doc_sds'],['coa','doc_coa'],['sample','doc_sample'],['other','doc_other']]
  };
  const label=(k,v)=>{const a=(groups[k]||[]).find(x=>x[0]===v);return a?t(a[1]):t('notSpecified')};
  const radio=(labelKey,items,value,inputName=labelKey,legendKey=labelKey)=>`<fieldset class="x-opts"><legend>${esc(t(legendKey))}</legend>${items.map(([v,k])=>`<label class="x-opt"><input type="radio" name="${esc(inputName)}" value="${esc(v)}"${value===v?' checked':''}><span>${esc(t(k))}</span></label>`).join('')}</fieldset>`;
  const checks=(name,items,selected)=>`<fieldset class="x-opts x-checks"><legend>${esc(t(name))}</legend>${items.map(([v,k])=>`<label class="x-opt"><input type="checkbox" name="${esc(name)}" value="${esc(v)}"${selected.includes(v)?' checked':''}><span>${esc(t(k))}</span></label>`).join('')}</fieldset>`;
  const textArea=(name,label,placeholder,value)=>`<label class="x-f">${esc(t(label))}<textarea name="${name}" rows="3" maxlength="600" placeholder="${esc(t(placeholder))}">${esc(value||'')}</textarea></label>`;
  function summary(){
    const lines=[
      `${t('resApplication')}: ${label('app',st.app)}`,
      `${t('resGoal')}: ${label('goal',st.goal)}`,
      `${t('resSystem')}: ${st.cementSource||t(st.cement==='known'?'cement_known':'cement_unknown')}`,
      `${t('resMaterials')||t('resSystem')}: ${t('scm_'+st.scm)}`,
      `${t('resConditions')}: ${st.conditions||t('notSpecified')}`,
      `${t('resVolume')}: ${label('volume',st.volume)}`,
      `${t('resSupply')}: ${label('supply',st.supply)}`,
      `${t('resPackage')}: ${label('pack',st.pack)}`,
      `${t('resDocs')}: ${st.docs.length?st.docs.map(x=>label('docs',x)).join('، '):t('notSpecified')}`
    ];
    return lines.join('\n');
  }
  function finderPayload(){return {app:st.app,goal:st.goal,cement:st.cement,cementSource:st.cementSource,scm:st.scm,conditions:st.conditions,volume:st.volume,supply:st.supply,pack:st.pack,docs:st.docs.slice(),summary:summary(),lang:lang}}
  function briefUrl(){
    if(fa&&shopOn&&shopIsSameOrigin())return shopBase+'rfq.html?source=finder';
    return P(pages.inquiry)+'?source=finder';
  }
  function result(){
    const data=[['resApplication',label('app',st.app)],['resGoal',label('goal',st.goal)],['resSystem',st.cementSource||t(st.cement==='known'?'cement_known':'cement_unknown')],['resMaterials',t('scm_'+st.scm)],['resConditions',st.conditions||t('notSpecified')],['resVolume',label('volume',st.volume)],['resSupply',label('supply',st.supply)],['resPackage',label('pack',st.pack)],['resDocs',st.docs.length?st.docs.map(x=>label('docs',x)).join('، '):t('notSpecified')]];
    root.innerHTML=`<div class="x-wiz-progress"><span>${esc(t('resSummary'))}</span><b>04 / 04</b></div><section class="x-card x-wiz-result"><h2>${esc(t('resSummary'))}</h2><div class="x-result-grid">${data.map(([k,v])=>`<article class="x-result-item"><small>${esc(t(k))}</small><b>${esc(v)}</b></article>`).join('')}</div><p class="x-note">${esc(t('finderDisclaimer'))}</p><p class="x-wiz-private">${esc(t('finderNote'))}</p><div class="x-nav"><button type="button" class="btn btn-outline" data-a="again">${esc(t('restart'))}</button><span class="x-actions"><button type="button" class="btn btn-outline" data-a="copy">${esc(t('resCopy'))}</button><a class="btn btn-primary" href="${esc(briefUrl())}" data-a="go">${esc(t('resGo'))} ↗</a></span></div></section>`;
    $('[data-a=again]',root).addEventListener('click',()=>{Object.assign(st,{step:1,app:'',goal:'',cement:'unknown',cementSource:'',scm:'unknown',conditions:'',volume:'unknown',supply:'unknown',pack:'unknown',docs:[]});view()});
    $('[data-a=go]',root).addEventListener('click',ev=>{ev.preventDefault();const h=window.PAKRAZ_HANDOFF;const ok=!!(h&&h.write(finderPayload()));if(!ok&&h)h.clear();const target=briefUrl()+(ok?'':'&handoff=failed');location.href=target});
    $('[data-a=copy]',root).addEventListener('click',()=>{const b=$('[data-a=copy]',root),txt=summary();const fallback=()=>{const a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand('copy');b.textContent=t('resCopied')}catch(e){}a.remove()};if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(txt).then(()=>b.textContent=t('resCopied')).catch(fallback);else fallback()});
  }
  function view(){
    if(st.step===5){result();return}
    const n=st.step;
    const dots=`<ol class="x-steps" aria-label="${esc(t('finderTitle'))}">${[1,2,3,4].map(i=>`<li class="${i===n?'on':i<n?'done':''}" aria-current="${i===n?'step':'false'}">${num(i)}</li>`).join('')}</ol>`;
    let body='';
    if(n===1)body=radio('fq1',groups.app,st.app,'app','chooseOne');
    if(n===2)body=radio('fq2',groups.goal,st.goal,'goal','chooseOne');
    if(n===3)body=`<fieldset class="x-opts"><legend>${esc(t('cement_label'))}</legend><label class="x-opt"><input type="radio" name="cement" value="known"${st.cement==='known'?' checked':''}><span>${esc(t('cement_known'))}</span></label><label class="x-opt"><input type="radio" name="cement" value="unknown"${st.cement==='unknown'?' checked':''}><span>${esc(t('cement_unknown'))}</span></label></fieldset><label class="x-f">${esc(t('cement_source'))}<input name="cementSource" maxlength="160" value="${esc(st.cementSource)}" placeholder="${esc(t('cement_ph'))}"></label><label class="x-f">${esc(t('scm_label'))}<select name="scm">${['none','flyash','slag','silica','limestone','mixed','other','unknown'].map(v=>`<option value="${v}"${st.scm===v?' selected':''}>${esc(t('scm_'+v))}</option>`).join('')}</select></label>${textArea('conditions','conditions_label','conditions_ph',st.conditions)}`;
    if(n===4)body=radio('volume_label',groups.volume,st.volume,'volume_label')+radio('supply_label',groups.supply,st.supply,'supply_label')+radio('pack_label',groups.pack,st.pack,'pack_label')+checks('docs_label',groups.docs,st.docs);
    const heading=t('fq'+n);
    root.innerHTML=`${dots}<form class="x-card x-wiz-form" novalidate><div class="x-wiz-progress"><span>${esc(t('stepNext'))} ${num(n)} ${esc(t('of')||'/')} ${num(4)}</span><b>${Math.round(n/4*100)}%</b></div><h2>${esc(heading)}</h2>${body}<p class="x-note x-wiz-hint">${esc(t('finderDisclaimer'))}</p><div class="x-nav">${n>1?`<button type="button" class="btn btn-outline" data-a="back">${esc(t('stepBack'))}</button>`:'<span></span>'}<button type="submit" class="btn btn-primary" data-next>${esc(n===4?t('stepReview'):t('stepNext'))} ↗</button></div></form>`;
    const f=$('form',root),next=$('[data-next]',f);
    const update=()=>{next.disabled=(n===1&&!$('input[name=app]:checked',f))||(n===2&&!$('input[name=goal]:checked',f))};
    f.addEventListener('change',update);update();
    f.addEventListener('submit',e=>{
      e.preventDefault();
      if(n===1)st.app=$('input[name=app]:checked',f)?.value||'';
      if(n===2)st.goal=$('input[name=goal]:checked',f)?.value||'';
      if(n===3){st.cement=$('input[name=cement]:checked',f)?.value||'unknown';st.cementSource=$('input[name=cementSource]',f).value.trim();st.scm=$('select[name=scm]',f).value;st.conditions=$('textarea[name=conditions]',f).value.trim()}
      if(n===4){st.volume=$('input[name=volume_label]:checked',f)?.value||'unknown';st.supply=$('input[name=supply_label]:checked',f)?.value||'unknown';st.pack=$('input[name=pack_label]:checked',f)?.value||'unknown';st.docs=$$('input[name=docs_label]:checked',f).map(x=>x.value)}
      st.step++;view();root.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
    const back=$('[data-a=back]',f);if(back)back.addEventListener('click',()=>{if(n===3){st.cement=$('input[name=cement]:checked',f)?.value||'unknown';st.cementSource=$('input[name=cementSource]',f).value.trim();st.scm=$('select[name=scm]',f).value;st.conditions=$('textarea[name=conditions]',f).value.trim()}if(n===4){st.volume=$('input[name=volume_label]:checked',f)?.value||'unknown';st.supply=$('input[name=supply_label]:checked',f)?.value||'unknown';st.pack=$('input[name=pack_label]:checked',f)?.value||'unknown';st.docs=$$('input[name=docs_label]:checked',f).map(x=>x.value)}st.step--;view()});
  }
  view();
}
function pageTools(){
  const html=`<div class="x-grid2"><section class="x-card" id="xcalc"><h2>${esc(t('calcT'))}</h2><p class="x-note">${esc(t('calcWarn'))}</p>
<label class="x-f">${esc(t('calcT'))}<select id="cm"><option value="c">${esc(t('cMode1'))}</option><option value="l">${esc(t('cMode2'))}</option></select></label>
<div data-m="c"><label class="x-f">${esc(t('cM3'))}<input id="c1" inputmode="decimal"></label><label class="x-f">${esc(t('cCem'))}<input id="c2" inputmode="decimal"></label><label class="x-f">${esc(t('cDos'))}<input id="c3" inputmode="decimal"></label><label class="x-f">${esc(t('cDen'))}<input id="c4" inputmode="decimal"></label></div>
<div data-m="l" hidden><label class="x-f">${esc(t('cL'))}<input id="c5" inputmode="decimal"></label></div><div id="cout" class="x-out" aria-live="polite"></div></section>
<section class="x-card" id="xconv"><h2>${esc(t('convT'))}</h2><label class="x-f">${esc(t('convT'))}<select id="vm"><option value="l2k">${esc(t('convL2K'))}</option><option value="k2l">${esc(t('convK2L'))}</option></select></label><label class="x-f">${esc(t('convIn'))}<input id="v1" inputmode="decimal"></label><label class="x-f">${esc(t('convDen'))}<input id="v2" inputmode="decimal"></label><div id="vout" class="x-out" aria-live="polite"></div></section></div>
<section class="x-card x-expl"><h2>${esc(t('explT'))}</h2><p>${esc(t('explLead'))}</p><div class="x-seg" role="group"><button type="button" data-s="0" aria-pressed="true">${esc(t('explS1'))}</button><button type="button" data-s="1" aria-pressed="false">${esc(t('explS2'))}</button></div>
<svg id="xsvg" class="x-sim" viewBox="0 0 400 220" role="img" aria-label="${esc(t('explT'))}"><rect width="400" height="220" rx="4" class="x-sim-bg"/><g id="xparts"></g></svg><p class="x-cap" id="xcap">${esc(t('explS1'))}</p><p class="x-note">${esc(t('explNote'))}</p></section>`;
  setPage(t('toolsTitle'),t('toolsLead'),'PAK RAZ / TOOLS',html);
  // calculator
  const cm=$('#cm'),co=$('#cout'),show=()=>$$('[data-m]').forEach(e=>e.hidden=e.dataset.m!==cm.value);
  const packs=[['packG',20],['packD',200],['packI',1000]];
  const calc=()=>{let Lt=null,extra='';
    if(cm.value==='c'){const a=num2($('#c1').value),b=num2($('#c2').value),c=num2($('#c3').value),d=num2($('#c4').value);if(!(a&&b&&c&&d)){co.innerHTML=`<p>${esc(t('cFill'))}</p>`;return}const kg=a*b*c/100;Lt=kg/d;extra=`<div class="x-row"><span>${esc(t('cKg'))}</span><b>${num(Math.round(kg*10)/10)} ${esc(t('cKgUnit'))}</b></div>`}
    else{Lt=num2($('#c5').value);if(!Lt){co.innerHTML=`<p>${esc(t('cFill'))}</p>`;return}}
    co.innerHTML=`<h3>${esc(t('cRes'))}</h3><div class="x-big">${num(Math.round(Lt*10)/10)} ${esc(t('cLitUnit'))}</div>${extra}`+packs.map(([k,v])=>`<div class="x-row"><span>${esc(t(k))}</span><b>${num(Math.ceil(Lt/v))} ${esc(t('unitCnt'))}</b></div>`).join('')};
  cm.addEventListener('change',()=>{show();calc()});$('#xcalc').addEventListener('input',calc);show();calc();
  // converter
  const vc=()=>{const a=num2($('#v1').value),d=num2($('#v2').value),o=$('#vout');if(!(a&&d)){o.innerHTML=`<p>${esc(t('cFill'))}</p>`;return}const r=$('#vm').value==='l2k'?a*d:a/d;o.innerHTML=`<div class="x-row"><span>${esc(t('convOut'))}</span><b>${num(Math.round(r*100)/100)} ${esc($('#vm').value==='l2k'?t('cKgUnit'):t('cLitUnit'))}</b></div>`};
  $('#xconv').addEventListener('input',vc);$('#vm').addEventListener('change',vc);vc();
  // PCE explainer: deterministic particle layout (no randomness → stable screenshots)
  const g=$('#xparts'),pts=[];let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const clump=[[170,100],[205,95],[235,110],[185,130],[220,135],[160,128],[250,138],[200,110],[175,112],[230,120],[210,150],[190,85]];
  const spread=[[50,45],[130,40],[215,50],[300,45],[360,60],[70,110],[160,105],[250,110],[330,115],[45,175],[135,170],[230,178]];
  clump.forEach((c,i)=>pts.push({c,s:spread[i]}));
  g.innerHTML=pts.map((p,i)=>`<g class="x-p" style="--cx:${p.c[0]}px;--cy:${p.c[1]}px;--sx:${p.s[0]}px;--sy:${p.s[1]}px"><circle r="15" class="x-c"/><g class="x-chain"><path d="M-15 0q-9 -8 -14 -2M0 -15q2 -11 9 -13M15 0q9 8 14 2M0 15q-2 11 -9 13M-11 -11q-8 -6 -9 -13M11 11q8 6 9 13" /></g></g>`).join('')+[[110,75],[300,80],[100,150],[320,160],[40,100],[360,100]].map(([x,y])=>`<path class="x-drop" d="M${x} ${y-8}q7 10 0 14q-7 -4 0 -14z"/>`).join('');
  const seg=$$('.x-seg button'),svg=$('#xsvg');
  seg.forEach(b=>b.addEventListener('click',()=>{const s=b.dataset.s==='1';svg.classList.toggle('on',s);seg.forEach(x=>x.setAttribute('aria-pressed',x===b));$('#xcap').textContent=s?t('explS2'):t('explS1')}));
}

function pageDownloads(){
  const types=['TDS','SDS','COA','Catalog'],docs=(X.documents||[]).slice();
  setPage(t('dlT'),t('dlLead'),'PAK RAZ / DOWNLOADS','<div id="xd"></div>');
  const root=$('#xd');
  const prodOpts=D.products.filter(p=>p.active).map(p=>`<option value="${esc(p.slug)}">${esc(pname(p))}</option>`).join('');
  const langs=[...new Set(docs.map(d=>d.lang).filter(Boolean))];
  root.innerHTML=`<div class="x-filters"><label class="x-f">${esc(t('dlProd'))}<select id="dp"><option value="">${esc(t('dlAll'))}</option>${prodOpts}</select></label><label class="x-f">${esc(t('dlType'))}<select id="dt"><option value="">${esc(t('dlAll'))}</option>${types.map(x=>`<option>${x}</option>`).join('')}</select></label>${langs.length?`<label class="x-f">${esc(t('dlLang'))}<select id="dl"><option value="">${esc(t('dlAll'))}</option>${langs.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>`:''}</div><div id="xdl"></div>`;
  const out=$('#xdl');
  const draw=()=>{const fp=$('#dp').value,ft=$('#dt').value,fl=$('#dl')?$('#dl').value:'';
    const prods=D.products.filter(p=>p.active&&(!fp||p.slug===fp));
    out.innerHTML=prods.map(p=>{const rows=types.filter(x=>!ft||x===ft).map(x=>{const hit=docs.filter(d=>d.product===p.slug&&d.type===x&&(!fl||d.lang===fl));
      return `<tr><th>${esc(x)}</th><td>${hit.length?hit.map(d=>`<a class="x-dl" href="${esc(prefix+d.file)}" download>${esc(d.title||x)}${d.lang?' · '+esc(d.lang):''} ↓</a>`).join(''):`<span class="x-pend">${esc(t('dlPending'))}</span> <a class="x-ask" href="${P(pages.inquiry)}?product=${encodeURIComponent(pname(p))}&topic=documents">${esc(t('dlAsk'))}</a>`}</td></tr>`}).join('');
      return `<div class="x-card"><h3><a href="${productURL(lang,p.slug)}">${esc(pname(p))}</a></h3><table class="x-tbl"><tbody>${rows}</tbody></table></div>`}).join('')+(docs.length?'':`<p class="x-note">${esc(t('dlEmpty'))}</p>`)};
  ['dp','dt','dl'].forEach(i=>{const e=$('#'+i);e&&e.addEventListener('change',draw)});draw();
}

function pageInquiry(){
  const q=new URLSearchParams(location.search);const topics=[['info','tInfo'],['quote','tQuote'],['sample','tSample'],['documents','tDocs'],['other','tOther']];
  const fromFinder=q.get('source')==='finder';
  const handoffResult=fromFinder&&q.get('handoff')!=='failed'&&window.PAKRAZ_HANDOFF?window.PAKRAZ_HANDOFF.read():{ok:false,reason:'missing'};
  const finderData=handoffResult&&handoffResult.ok?handoffResult.data:null;
  const pre={product:q.get('product')||(finderData?t('pceProduct'):''),qty:q.get('qty')||(finderData?t('volume_'+finderData.volume):''),topic:q.get('topic')||'quote',supply:q.get('supply')||(finderData?finderData.supply:'unknown'),brief:(q.get('brief')|| (finderData?finderData.summary:'')).slice(0,1800)};
  const finderBanner=fromFinder?(finderData?`<div class="x-handoff-banner" role="status"><b>${esc(lang==='fa'?'خلاصه راهنمای نیاز فنی منتقل شد':lang==='en'?'Technical-needs brief transferred':lang==='zh'?'技术需求摘要已传递':lang==='ar'?'تم نقل ملخص الاحتياجات الفنية':lang==='ru'?'Описание технической потребности передано':'Teknik ihtiyaç özeti aktarıldı')}</b><p>${esc(t('finderNote'))}</p></div>`:`<div class="x-handoff-banner is-fallback" role="status"><b>${esc(lang==='fa'?'خلاصه به‌طور خودکار منتقل نشد':lang==='en'?'The brief was not transferred automatically':lang==='zh'?'摘要未能自动传递':lang==='ar'?'تعذر نقل الملخص تلقائيًا':lang==='ru'?'Не удалось автоматически передать описание':'Özet otomatik olarak aktarılamadı')}</b><p>${esc(lang==='fa'?'برای بازیابی همان خلاصه، از دکمه بازگشت مرورگر استفاده کنید و آن را کپی کنید؛ پیوند راهنما یک راهنمای تازه باز می‌کند. اطلاعات تماس را دوباره در همین فرم وارد کنید.':lang==='en'?'Return to the technical-needs guide and copy the brief. Enter your contact details in this form.':lang==='zh'?'请返回技术需求指南复制摘要，并在此表单中重新填写联系信息。':lang==='ar'?'يمكنك العودة إلى دليل الاحتياجات الفنية ونسخ الملخص، ثم إدخال بيانات الاتصال في هذا النموذج.':lang==='ru'?'Вернитесь к руководству по техническим потребностям и скопируйте описание. Контактные данные заполните в этой форме.':'Teknik ihtiyaç rehberine dönüp özeti kopyalayın. İletişim bilgilerinizi bu forma yeniden girin.')}</p><a href="${P(pages.finder)}">${esc(t('finder'))} ↗</a></div>`):'';
  const html=`${finderBanner}${shopOn?`<p class="x-note">${esc(t('iShopHint'))} <a href="${shopHome}">${esc(t('shopGo'))} ↗</a></p>`:''}<ol class="x-steps" id="xs">${[1,2,3].map(n=>`<li class="${n===1?'on':''}">${num(n)}</li>`).join('')}</ol>
<form id="xi" class="x-card" novalidate><div class="x-step" data-s="1"><h2>${esc(t('st1'))}</h2><label class="x-f">${esc(t('iName'))} *<input name="name" autocomplete="name" maxlength="120"><span class="x-err"></span></label><label class="x-f">${esc(t('iOrg'))}<input name="org" autocomplete="organization" maxlength="160"></label><label class="x-f">${esc(t('iEmail'))}<input name="email" type="email" autocomplete="email" maxlength="254" dir="ltr"><span class="x-err"></span></label><label class="x-f">${esc(t('iPhone'))}<input name="phone" type="tel" autocomplete="tel" maxlength="40" dir="ltr"><span class="x-err"></span></label></div>
<div class="x-step" data-s="2" hidden><h2>${esc(t('st2'))}</h2><label class="x-f">${esc(t('iType'))}<select name="topic">${topics.map(([v,k])=>`<option value="${v}"${v===pre.topic?' selected':''}>${esc(t(k))}</option>`).join('')}</select></label><label class="x-f">${esc(t('iProd'))} *<input name="product" maxlength="160" value="${esc(pre.product)}"><span class="x-err"></span></label><label class="x-f">${esc(t('iForm'))}<select name="supply"><option value="unknown"${pre.supply==='unknown'?' selected':''}>${esc(t('supply_unknown'))}</option><option value="raw"${pre.supply==='raw'?' selected':''}>${esc(t('supply_raw'))}</option><option value="concentrate"${pre.supply==='concentrate'?' selected':''}>${esc(t('supply_concentrate'))}</option><option value="ready"${pre.supply==='ready'?' selected':''}>${esc(t('supply_ready'))}</option></select><small class="x-hint">${esc(t('iFormNote'))}</small></label><label class="x-f">${esc(t('iQty'))}<input name="qty" maxlength="120" value="${esc(pre.qty)}"></label><label class="x-f">${esc(t('iCity'))}<input name="city" maxlength="160"></label><label class="x-f">${esc(t('iMsg'))}<textarea name="msg" rows="5" maxlength="2000">${esc(pre.brief)}</textarea></label></div>
<div class="x-step" data-s="3" hidden><h2>${esc(t('st3'))}</h2><p>${esc(t('iReview'))}</p><pre id="xrev" class="x-pre"></pre></div>
<div class="hp-field" aria-hidden="true" style="position:absolute;inset-inline-start:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
<div class="x-nav"><button type="button" class="btn btn-outline" id="xb" hidden>${esc(t('back'))}</button><button type="submit" class="btn btn-primary" id="xn">${esc(t('next'))} ↗</button></div><p class="x-status" id="xst" role="status" aria-live="polite"></p></form>`;
  setPage(t('inqT'),t('inqLead'),'PAK RAZ / ENQUIRY',html);
  const f=$('#xi'),steps=$$('.x-step',f),dots=$$('#xs li');let cur=1;
  const val=(n)=>{let ok=true;const set=(name,msg)=>{const el=f.elements[name];const w=el.closest('label');const er=w&&$('.x-err',w);if(er)er.textContent=msg||'';if(msg)ok=false};
    if(n===1){set('name',f.elements.name.value.trim().length<2?t('iReq'):'');const em=f.elements.email.value.trim(),ph=f.elements.phone.value.trim();const bad=!em&&!ph;set('email',bad?t('iNeedContact'):(em&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)?t('iNeedContact'):''));set('phone',(ph&&toEn(ph).replace(/\D/g,'').length<7)?t('iNeedContact'):'')}
    if(n===2)set('product',f.elements.product.value.trim().length<2?t('iReq'):'');return ok};
  const text=()=>{const v=Object.fromEntries(new FormData(f).entries());const tp=topics.find(x=>x[0]===v.topic);return [`${t('iType')}: ${t(tp?tp[1]:'tOther')}`,`${t('iName')}: ${v.name}`,`${t('iOrg')}: ${v.org||'—'}`,`${t('iEmail')}: ${v.email||'—'}`,`${t('iPhone')}: ${v.phone||'—'}`,`${t('iProd')}: ${v.product}`,`${t('iForm')}: ${t('supply_'+(v.supply||'unknown'))}`,`${t('iQty')}: ${v.qty||'—'}`,`${t('iCity')}: ${v.city||'—'}`,`${t('iMsg')}: ${v.msg||'—'}`].join('\n')};
  const go=n=>{cur=n;steps.forEach(s=>s.hidden=+s.dataset.s!==n);dots.forEach((d,i)=>d.className=(i+1===n?'on':i+1<n?'done':''));$('#xb').hidden=n===1;$('#xn').textContent=n===3?t('iSend'):t('next')+' ↗';if(n===3)$('#xrev').textContent=text();$('#xst').textContent='';const h=$('h2',steps[n-1]);if(h){h.tabIndex=-1;h.focus({preventScroll:true})}};
  $('#xb').addEventListener('click',()=>go(cur-1));
  f.addEventListener('submit',async e=>{e.preventDefault();if(f.elements.website.value)return;
    if(cur<3){if(val(cur))go(cur+1);return}
    const st=$('#xst'),btn=$('#xn'),body=text(),v=Object.fromEntries(new FormData(f).entries());
    btn.disabled=true;st.textContent=t('iSending');
    const none=()=>{st.innerHTML=`${esc(t('iDoneNone'))}<br><button type="button" class="btn btn-outline" id="xcp">${esc(t('iCopy'))}</button>`;$('#xcp').addEventListener('click',()=>{(navigator.clipboard&&isSecureContext?navigator.clipboard.writeText(body):Promise.reject()).then(()=>{$('#xcp').textContent=t('iCopied');if(fromFinder&&window.PAKRAZ_HANDOFF)window.PAKRAZ_HANDOFF.clear()},()=>{const a=document.createElement('textarea');a.value=body;document.body.appendChild(a);a.select();try{document.execCommand('copy');$('#xcp').textContent=t('iCopied');if(fromFinder&&window.PAKRAZ_HANDOFF)window.PAKRAZ_HANDOFF.clear()}catch(e){}a.remove()})})};
    try{
      if(location.protocol!=='file:'&&CFG.formMode==='web3forms'&&CFG.web3formsKey){
        const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:CFG.web3formsKey,subject:'PAK RAZ ESPADANA — '+v.topic,from_name:'PAK RAZ ESPADANA website',name:v.name,email:v.email||undefined,phone:v.phone||'',organization:v.org||'',product:v.product,quantity:v.qty||'',topic:v.topic,message:body,supply_form:v.supply||'unknown',language:lang,botcheck:v.website||''})});
        const j=await r.json();if(!r.ok||!j.success)throw 0;if(fromFinder&&window.PAKRAZ_HANDOFF)window.PAKRAZ_HANDOFF.clear();st.textContent=t('iDoneOk');f.reset();go(1);st.textContent=t('iDoneOk');
      }else if(location.protocol!=='file:'&&CFG.formMode==='php'){
        const r=await fetch(prefix+'api/submit.php',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:v.name,reply:v.email,organization:v.org,phone:v.phone,product:v.product,quantity:v.qty,topic:v.topic,message:body,supply_form:v.supply||'unknown',lang})});
        const j=await r.json();if(!r.ok||!j.ok)throw 0;if(fromFinder&&window.PAKRAZ_HANDOFF)window.PAKRAZ_HANDOFF.clear();f.reset();go(1);st.textContent=t('iDoneOk');
      }else none();
    }catch(err){st.textContent=t('iFail')}
    btn.disabled=false;
  });
}

function pageList(kind){
  const key=kind==='case'?'cases':kind==='news'?'news':'articles',label=t(kind==='case'?'caseT':kind==='news'?'newsT':'artT');
  const list=(X[key]||[]).slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const s=new URLSearchParams(location.search).get('s');const item=s&&list.find(a=>a.slug===s);
  if(item){const body=(item.body&&(item.body[lang]||item.body.en||item.body.fa))||[];
    setPage(tr(item.title),tr(item.summary),'PAK RAZ / '+label.toUpperCase(),`<article class="x-article content-main">${item.date?`<p class="x-meta">${esc(t('published'))}: ${esc(item.date)}</p>`:''}${body.map(p=>/^##\s/.test(p)?`<h2>${esc(p.slice(3))}</h2>`:`<p>${esc(p)}</p>`).join('')}</article>`);
    toc();return}
  setPage(label,'',' PAK RAZ / '+label.toUpperCase(),list.length?`<div class="x-list">${list.map(a=>`<a class="x-card x-li" href="${P(kind+'.html')}?s=${encodeURIComponent(a.slug)}"><b>${esc(tr(a.title))}</b><p>${esc(tr(a.summary))}</p><span>${esc(t('readMore'))} ↗</span></a>`).join('')}</div>`:`<p class="x-note">${esc(t('noItems'))}</p>`);
  if(!list.length){const mt=document.createElement('meta');mt.name='robots';mt.content='noindex';document.head.appendChild(mt)}
}
function resourcesAdds(){
  if(page!=='resources')return;const m=$('main#main');if(!m)return;
  [['articles','artT','article'],['cases','caseT','case'],['news','newsT','news']].forEach(([k,lab,pg])=>{const list=(X[k]||[]).slice(0,3);if(!list.length)return;
    const s=document.createElement('section');s.className='x-res-sec';s.innerHTML=`<h2>${esc(t(lab))}</h2><div class="x-list">${list.map(a=>`<a class="x-card x-li" href="${P(pg+'.html')}?s=${encodeURIComponent(a.slug)}"><b>${esc(tr(a.title))}</b><p>${esc(tr(a.summary))}</p><span>${esc(t('readMore'))} ↗</span></a>`).join('')}</div>`;m.appendChild(s)})
}

/* ---------- boot ---------- */
try{
  headerAdds();mega();footerCols();homeAdds();productAdds();resourcesAdds();
  const extOk=!!mainEl();
  if(!extOk){}else if(page==='finder')pageFinder();else if(page==='tools')pageTools();else if(page==='downloads')pageDownloads();else if(page==='inquiry')pageInquiry();
  else if(page==='article'||page==='case'||page==='news')pageList(page);
  toc();dock();
}catch(err){if(window.console)console.error('extend.js',err)}
})();
