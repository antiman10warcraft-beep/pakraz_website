/* پاک‌راز اسپادانا — فروشگاه B2B | بدون وابستگی، بدون ردیاب */
(function(){'use strict';
var D=window.SHOP_DATA||{segments:[],formats:[],categories:[],products:[]},C=window.SHOP_CONFIG||{};
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function toEn(s){return String(s).replace(/[۰-۹]/g,function(d){return d.charCodeAt(0)-1776}).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})}
function fa(n){try{return Number(n).toLocaleString('fa-IR')}catch(e){return String(n)}}
function norm(s){return toEn(String(s||'')).replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌‏‎]/g,' ').replace(/\s+/g,' ').trim().toLowerCase()}
function map(a){var m={};a.forEach(function(x){m[x.id]=x});return m}
var P=map(D.products),F=map(D.formats),S=map(D.segments),CAT=map(D.categories);
function supplyLabel(v){var labels={raw:'ماده اولیه / پلیمر پایه PCE',concentrate:'محلول یا کنسانتره مبتنی بر PCE',ready:'فوق‌روان‌کننده آماده مصرف'};return labels[v&&v.supplyForm]||'نیاز به راهنمایی / هنوز مشخص نیست'}
var mem={};
function store(k,v){try{if(v===undefined){var r=localStorage.getItem(k);return r}localStorage.setItem(k,v)}catch(e){if(v===undefined)return mem[k]||null;mem[k]=v}}

/* ---------- toast ---------- */
var tt;function toast(m){var t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},2600)}

/* ---------- theme / menu ---------- */
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);var meta=$('meta[name="theme-color"]');if(meta)meta.setAttribute('content',t==='dark'?'#0c1917':'#103a37');$$('[data-theme-toggle]').forEach(function(b){b.setAttribute('aria-pressed',t==='dark');b.setAttribute('aria-label',t==='dark'?'حالت روشن':'حالت تاریک');var u=b.querySelector('use');if(u)u.setAttribute('href',t==='dark'?'#i-sun':'#i-moon')})}
var themeMedia=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
var savedTheme=store('pakraz-theme')||store('pz_theme');var userThemeChoice=savedTheme==='dark'||savedTheme==='light';
(function(){var t=userThemeChoice?savedTheme:(themeMedia&&themeMedia.matches?'dark':'light');applyTheme(t)})();
if(themeMedia&&themeMedia.addEventListener)themeMedia.addEventListener('change',function(e){if(!userThemeChoice)applyTheme(e.matches?'dark':'light')});
window.addEventListener('storage',function(e){if((e.key==='pakraz-theme'||e.key==='pz_theme')&&(e.newValue==='dark'||e.newValue==='light')){userThemeChoice=true;applyTheme(e.newValue)}});
document.addEventListener('click',function(e){
 var tg=e.target.closest('[data-theme-toggle]');if(tg){var n=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';userThemeChoice=true;store('pakraz-theme',n);store('pz_theme',n);applyTheme(n);return}
 var mb=e.target.closest('[data-menu]');if(mb){var nv=$('#nav');var o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o);return}
 var ad=e.target.closest('[data-add]');if(ad){var pid=ad.getAttribute('data-add');var fid=ad.getAttribute('data-fmt')||(P[pid]&&P[pid].formats[0]);add(pid,fid,1);toast(P[pid]&&P[pid].status==='planned'?'نیاز شما به لیست اضافه شد':'به لیست استعلام اضافه شد');return}
});

/* ---------- config-driven bits ---------- */
function digits(s){return toEn(String(s||'')).replace(/\D/g,'')}
function phoneHref(){var p=digits(C.phone);return p?'tel:'+p:''}
function chanLinks(msg){
 var h=[],t=encodeURIComponent(msg||'');
 if(C.whatsapp)h.push(['واتس‌اپ','https://wa.me/'+digits(C.whatsapp)+(msg?'?text='+t:'')]);
 if(C.telegram)h.push(['تلگرام','https://t.me/'+String(C.telegram).replace(/^@/,'')]);
 if(C.bale)h.push(['بله','https://ble.ir/'+String(C.bale).replace(/^@/,'')]);
 if(C.eitaa)h.push(['ایتا','https://eitaa.com/'+String(C.eitaa).replace(/^@/,'')]);
 if(C.email)h.push(['ایمیل','mailto:'+C.email+(msg?'?subject='+encodeURIComponent('درخواست استعلام')+'&body='+t:'')]);
 if(C.phone)h.push(['تماس تلفنی',phoneHref()]);
 return h;
}
function chanHtml(msg,cls){return chanLinks(msg).map(function(c){return '<a class="btn '+(cls||'btn-ghost btn-sm')+'" href="'+esc(c[1])+'" target="_blank" rel="noopener">'+esc(c[0])+'</a>'}).join('')}
function initConfig(){
 $$('[data-if]').forEach(function(el){var k=el.getAttribute('data-if');var ok=k==='corp'?!!C.corporateUrl:k==='phone'?!!C.phone:k==='email'?!!C.email:!!C[k];if(ok){el.hidden=false;if(k==='corp'&&el.tagName==='A')el.href=C.corporateUrl;if(k==='phone'){var l=el.querySelector('[data-phone-text]');if(l)l.textContent=fa(digits(C.phone)).replace(/٬/g,'');if(el.tagName==='A')el.href=phoneHref()}}else el.hidden=true});
 $$('[data-channels]').forEach(function(el){var h=chanHtml('', 'btn-ghost btn-sm');el.innerHTML=h||'<p class="noch">راه‌های ارتباطی هنوز در این نسخه ثبت نشده است. (مالک سایت: فایل <b>assets/config.js</b> را تکمیل کند.)</p>'});
}

/* ---------- cart ---------- */
var KEY='pakraz_rfq_v1';
function okItem(i){return i&&P[i.pid]&&F[i.fid]&&P[i.pid].formats.indexOf(i.fid)>-1&&isFinite(i.qty)&&i.qty>=1&&i.qty<=99999}
function load(){try{var a=JSON.parse(store(KEY)||'[]');return Array.isArray(a)?a.filter(okItem):[]}catch(e){return[]}}
function save(a){store(KEY,JSON.stringify(a));badge()}
function add(pid,fid,qty){if(!P[pid]||!F[fid])return;qty=Math.max(1,Math.min(99999,Math.floor(qty)||1));var a=load(),f=a.filter(function(i){return i.pid===pid&&i.fid===fid})[0];if(f)f.qty=Math.min(99999,f.qty+qty);else a.push({pid:pid,fid:fid,qty:qty});save(a)}
function badge(){var n=load().length;$$('[data-badge]').forEach(function(b){b.textContent=fa(n);b.setAttribute('data-n',n)});if(typeof renderCart==='function'&&$('#items'))renderCart()}
function liters(i){var l=F[i.fid].liters;return l?l*i.qty:null}

/* ---------- catalog ---------- */
function initCatalog(){
 var box=$('#plist');if(!box)return;
 var q=$('#f-q'),s=$('#f-s'),c=$('#f-c'),f=$('#f-f'),cnt=$('#f-count'),emp=$('#f-empty');
 var cards=$$('.pcard',box);
 function fromUrl(){var u=new URLSearchParams(location.search);if(q)q.value=u.get('q')||'';if(s)s.value=u.get('s')||'';if(c)c.value=u.get('c')||'';if(f)f.value=u.get('f')||''}
 function apply(){
  var nq=norm(q&&q.value),sv=s&&s.value,cv=c&&c.value,fv=f&&f.value,n=0;
  cards.forEach(function(el){var ok=(!nq||el.getAttribute('data-search').indexOf(nq)>-1)&&(!sv||(' '+el.getAttribute('data-seg')+' ').indexOf(' '+sv+' ')>-1)&&(!cv||el.getAttribute('data-cat')===cv)&&(!fv||(' '+el.getAttribute('data-fmt')+' ').indexOf(' '+fv+' ')>-1);el.hidden=!ok;if(ok)n++});
  if(cnt)cnt.textContent=fa(n)+' مورد';if(emp)emp.hidden=n>0;
  try{var u=new URLSearchParams();if(nq)u.set('q',q.value.trim());if(sv)u.set('s',sv);if(cv)u.set('c',cv);if(fv)u.set('f',fv);var qs=u.toString();history.replaceState(null,'',location.pathname+(qs?'?'+qs:''))}catch(e){}
 }
 fromUrl();apply();
 [q,s,c,f].forEach(function(el){if(el)el.addEventListener('input',apply);if(el)el.addEventListener('change',apply)});
 var r=$('#f-reset');if(r)r.addEventListener('click',function(){[q,s,c,f].forEach(function(el){if(el)el.value=''});apply()});
}

/* ---------- product page ---------- */
function initProduct(){
 var pid=document.body.getAttribute('data-pid'),p=P[pid],box=$('#buybox');if(!p||!box)return;
 var planned=p.status==='planned',sel=p.formats[0];
 function fchoices(){return p.formats.map(function(id,i){var x=F[id];return '<label class="fch"><input type="radio" name="fmt" value="'+id+'"'+(i===0?' checked':'')+'><svg class="il" aria-hidden="true"><use href="#il-'+x.icon+'"/></svg><span><b>'+esc(x.name)+'</b><small>'+esc(x.desc)+'</small></span></label>'}).join('')}
 var price=(C.showPrices&&p.priceFrom)?'<p class="price"><b>'+fa(p.priceFrom)+'</b> '+esc(C.currencyLabel||'تومان')+' <small>(از، به ازای هر واحد قالب؛ قیمت نهایی با استعلام)</small></p>':'<p class="price"><b>قیمت: با استعلام</b></p>';
 var savedDraft={};try{savedDraft=JSON.parse(store('pz_draft')||'{}')}catch(e){}
 var savedSupply=['raw','concentrate','ready'].indexOf(savedDraft.supplyForm)>-1?savedDraft.supplyForm:'';
 var supplyOptions=[['','نیاز به راهنمایی / هنوز مشخص نیست'],['raw','ماده اولیه / پلیمر پایه PCE'],['concentrate','محلول یا کنسانتره مبتنی بر PCE'],['ready','فوق‌روان‌کننده آماده مصرف']];
 var supplySelect='<label class="field" style="display:block;margin:14px 0 8px"><b>شکل عرضه موردنظر</b><select id="psupply" aria-describedby="psupply-note" style="width:100%;margin-top:8px">'+supplyOptions.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===savedSupply?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select><small id="psupply-note" style="display:block;color:var(--muted);line-height:1.8;margin-top:7px">این فقط ترجیح اولیه شماست؛ شکل واقعی محصول، امکان عرضه و نیاز به رقیق‌سازی باید با سند همان گرید تأیید شود.</small></label>';
 box.innerHTML='<h2>'+(planned?'ثبت نیاز':'ساخت استعلام')+'</h2>'+(planned?'<p class="tag warn">هنوز برای عرضه تأیید نشده — فقط ثبت نیاز</p>':'')+price+
  supplySelect+
  '<div role="radiogroup" aria-label="قالب بسته‌بندی درخواستی" class="fchoices">'+fchoices()+'</div>'+
  '<label for="pq" style="font-size:14px;color:var(--muted)">تعداد (<span id="pu">'+esc(F[sel].unit)+'</span>)</label>'+
  '<div class="qty"><button type="button" id="qm" aria-label="کم">−</button><input id="pq" type="text" inputmode="numeric" value="'+fa(1)+'" aria-label="تعداد"><button type="button" id="qp" aria-label="زیاد">+</button></div>'+
  '<div class="est" id="est" aria-live="polite"></div>'+
  '<button class="btn btn-amber" id="padd" style="width:100%">'+(planned?'ثبت نیاز در لیست':'افزودن به لیست استعلام')+'</button>'+
  '<a class="btn btn-ghost" href="rfq.html" style="width:100%;margin-top:10px">مشاهدهٔ لیست استعلام</a>'+
  (p.moq?'<p style="font-size:13.5px;color:var(--muted);margin:10px 0 0">حداقل سفارش: '+fa(p.moq)+' واحد قالب</p>':'');
 var qi=$('#pq');
 function qty(){var v=parseInt(toEn(qi.value).replace(/\D/g,''),10);return isFinite(v)&&v>0?Math.min(v,99999):1}
 function est(){var f=F[sel],n=qty(),e=$('#est');$('#pu').textContent=f.unit;e.textContent=f.liters?'ظرفیت اسمی محاسباتی ظرف‌های درخواستی (نه مقدار محصول تأییدشده): '+fa(f.liters*n)+' لیتر ('+fa(n)+' × '+fa(f.liters)+')؛ امکان عرضه باید تأیید شود.':'تعداد واحد در هر '+f.unit+' پس از تأیید بسته‌بندی اعلام می‌شود.'}
 $$('input[name=fmt]',box).forEach(function(r){r.addEventListener('change',function(){sel=r.value;est()})});
 $('#qm').onclick=function(){qi.value=fa(Math.max(1,qty()-1));est()};$('#qp').onclick=function(){qi.value=fa(Math.min(99999,qty()+1));est()};
 qi.addEventListener('input',est);qi.addEventListener('blur',function(){qi.value=fa(qty())});
 var supplyEl=$('#psupply');if(supplyEl){supplyEl.addEventListener('change',function(){var d={};try{d=JSON.parse(store('pz_draft')||'{}')}catch(e){}d.supplyForm=supplyEl.value;store('pz_draft',JSON.stringify(d))})}
 $('#padd').onclick=function(){var d={};try{d=JSON.parse(store('pz_draft')||'{}')}catch(e){}d.supplyForm=supplyEl?supplyEl.value:'';store('pz_draft',JSON.stringify(d));add(pid,sel,qty());toast(planned?'نیاز شما به لیست اضافه شد':'به لیست استعلام اضافه شد')};
 est();
}

/* ---------- RFQ ---------- */
var renderCart;
function refCode(){var d=new Date();return 'PZ-'+String(d.getFullYear()).slice(2)+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2)+'-'+Math.random().toString(36).slice(2,6).toUpperCase()}
function dateFa(){try{return new Date().toLocaleDateString('fa-IR',{year:'numeric',month:'long',day:'numeric'})}catch(e){return new Date().toISOString().slice(0,10)}}
function validPhone(v){v=digits(v);return v.length>=8&&v.length<=15}
function lineText(i,k){var p=P[i.pid],f=F[i.fid],l=liters(i);return fa(k+1)+') '+p.name+(p.status==='planned'?' [ثبت نیاز]':'')+' — '+f.name+' × '+fa(i.qty)+(l?' (≈ '+fa(l)+' لیتر)':'')}
function buildMsg(ref,v,items){
 var L=['درخواست استعلام — شناسه مرجع تولیدشده در مرورگر: '+ref,'تاریخ: '+dateFa(),'',
  'نام: '+v.name,'شرکت/واحد: '+(v.company||'—'),'حوزه: '+v.segment,'تلفن اصلی: '+digits(v.phone),'تلفن دوم: '+(v.phone2?digits(v.phone2):'—'),'شهر/استان/کشور: '+v.city,'نشانی مقصد: '+(v.destination||'پس از توافق اعلام می‌شود')];
 if(v.email)L.push('ایمیل: '+v.email);
 L.push('','اقلام:');items.forEach(function(i,k){L.push(lineText(i,k))});
 L.push('','شکل عرضه موردنظر: '+supplyLabel(v),'نحوه تحویل: '+v.delivery,'زمان نیاز: '+v.urgency);
 if(v.note)L.push('توضیحات: '+v.note);
 L.push('','— این پیام فقط درخواست استعلام است و تعهد خرید یا فروش ایجاد نمی‌کند.');
 return L.join('\n');
}
function copyText(t){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t).then(function(){toast('کپی شد')},function(){fallbackCopy(t)});fallbackCopy(t)}
function fallbackCopy(t){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('کپی شد')}catch(e){toast('کپی خودکار ممکن نشد؛ متن را دستی انتخاب کنید')}a.remove()}
function download(name,text,mime){var b=new Blob([text],{type:mime+';charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function csvOf(ref,items){var q=function(s){return '"'+String(s).replace(/"/g,'""')+'"'};var r=[['شناسه مرجع مرورگر','محصول','قالب درخواستی','تعداد','حجم اسمی ظرف‌ها (لیتر)'].map(q).join(',')];items.forEach(function(i){var l=liters(i);r.push([ref,P[i.pid].name,F[i.fid].name,i.qty,l||''].map(q).join(','))});return '﻿'+r.join('\r\n')}
function printHtml(ref,v,items,msgNote){
 var rows=items.map(function(i,k){var l=liters(i);return '<tr><td>'+fa(k+1)+'</td><td>'+esc(P[i.pid].name)+'</td><td>'+esc(F[i.fid].name)+'</td><td>'+fa(i.qty)+'</td><td>'+(l?fa(l):'—')+'</td></tr>'}).join('');
 $('#print-area').innerHTML='<h1>پیش‌نویس استعلام — '+esc(C.siteName||'')+'</h1><p>شناسه محلی (فقط روی این دستگاه): <b>'+esc(ref)+'</b> — تاریخ: '+esc(dateFa())+'</p><p>'+esc(v.name)+(v.company?' — '+esc(v.company):'')+' | '+esc(digits(v.phone))+(v.phone2?' / '+esc(digits(v.phone2)):'')+' | '+esc(v.city)+'</p>'+(v.destination?'<p>نشانی مقصد: '+esc(v.destination)+'</p>':'')+(v.email?'<p>ایمیل: '+esc(v.email)+'</p>':'')+'<table><thead><tr><th>#</th><th>محصول</th><th>قالب درخواستی</th><th>تعداد</th><th>حجم اسمی ظرف‌ها (لیتر)</th></tr></thead><tbody>'+rows+'</tbody></table><p>ترجیح تحویل: '+esc(v.delivery)+' | زمان نیاز: '+esc(v.urgency)+'</p><p>شکل عرضه موردنظر: '+esc(supplyLabel(v))+'</p>'+(v.note?'<p>توضیحات: '+esc(v.note)+'</p>':'')+'<div class="note">'+(state==='sent'?'این نسخه چاپیِ درخواست ارسالی است؛ شناسه بالا کد پیگیری در سامانه سفارش نیست.':'این سند پیش‌نویس محلی است؛ به شرکت ارسال نشده و فاکتور، پیش‌فاکتور، کد پیگیری یا تعهد خرید و فروش نیست.')+'</div>';
 window.print();
}
function lastSubmitOk(){var t=parseInt(store('pz_last')||'0',10);return !t||Date.now()-t>20000}
function deliver(subject,message,extra,done){
 var mode=C.submitMode||'none';
 if(mode==='web3forms'&&C.web3formsKey){
  var body={access_key:C.web3formsKey,subject:subject,from_name:C.siteName||'shop',message:message,botcheck:''};
  for(var k in extra)body[k]=extra[k];
  fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)})
   .then(function(r){return r.json()}).then(function(j){done(j&&j.success?'sent':'fail')}).catch(function(){done('fail')});
 }else done(mode==='channels'?'manual':'none');
}
function resultPanel(state,ref,msg,v,items){
 var el=$('#result');if(!el)return;
 var head={sent:['ok','درخواست از طریق سرویس ارسال شد. شناسه مرجع: '+ref+' — این شناسه، سامانه پیگیری سفارش نیست.'],
  none:['info','هیچ اطلاعاتی به شرکت ارسال نشد. متن زیر فقط روی همین دستگاه ساخته شده است. پس از تأیید تلفن یا ایمیل رسمی، آن را شخصاً برای شرکت ارسال کنید. شناسه محلی: '+ref],
  manual:['info','متن پیش‌نویس آماده است. آن را کپی یا دانلود کنید؛ ارسال به شرکت از این صفحه انجام نمی‌شود. شناسه محلی: '+ref],
  fail:['err','ارسال از سرویس انجام نشد و درخواستی ثبت نشده است. متن را ذخیره کنید و بعداً از راه تماس تأییدشده ارسال کنید. شناسه محلی: '+ref]}[state];
 el.className='status show '+head[0];
 el.innerHTML='<p style="margin:0 0 10px"><b>'+esc(head[1])+'</b></p><pre id="msgtxt" style="white-space:pre-wrap;font:14px/1.9 var(--font);background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:12px;margin:0 0 10px">'+esc(msg)+'</pre><div class="channels"><button type="button" class="btn btn-primary btn-sm" id="r-copy">کپی متن</button><button type="button" class="btn btn-ghost btn-sm" id="r-print">چاپ / PDF</button><button type="button" class="btn btn-ghost btn-sm" id="r-csv">دانلود CSV</button><button type="button" class="btn btn-ghost btn-sm" id="r-txt">دانلود متن</button>'+(state==='sent'?'':chanHtml(msg))+'</div>';
 $('#r-copy').onclick=function(){copyText(msg)};$('#r-print').onclick=function(){printHtml(ref,v,items,state)};
 $('#r-csv').onclick=function(){download(ref+'.csv',csvOf(ref,items),'text/csv')};$('#r-txt').onclick=function(){download(ref+'.txt',msg,'text/plain')};
 el.scrollIntoView({behavior:'smooth',block:'center'});
}
function setErr(name,m){var f=$('[name='+name+']');if(!f)return;var w=f.closest('.field');if(!w)return;w.classList.toggle('bad',!!m);var e=w.querySelector('.err');if(e)e.textContent=m||''}
function initRfq(){
 var list=$('#items');if(!list)return;
 var handoffBox=$('#finder-handoff');
 function showFinderHandoff(){
  if(!handoffBox||new URLSearchParams(location.search).get('source')!=='finder')return;
  handoffBox.hidden=false;handoffBox.textContent='';
  var params=new URLSearchParams(location.search),result=(params.get('handoff')==='failed'||!window.PAKRAZ_HANDOFF)?{ok:false,reason:'unavailable'}:window.PAKRAZ_HANDOFF.read();
  function node(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
  if(!result.ok){
   var h=node('h2','','انتقال خلاصه انجام نشد');handoffBox.appendChild(h);
   handoffBox.appendChild(node('p','','برای بازیابی همان خلاصه، از دکمه بازگشت مرورگر استفاده کنید تا به نتیجه قبلی راهنما برگردید و آن را کپی کنید. لینک زیر راهنمای تازه‌ای باز می‌کند. اطلاعات تماس را فقط در فرم استعلام وارد کنید.'));
   var back=node('button','btn btn-outline','بازگشت به خلاصه قبلی');back.type='button';back.addEventListener('click',function(){if(window.history&&window.history.length>1)window.history.back();else message.textContent='از دکمه بازگشت مرورگر استفاده کنید.'});handoffBox.appendChild(back);
   var a=node('a','','شروع دوباره راهنمای نیاز فنی ↗');a.href='../fa/finder.html';handoffBox.appendChild(a);return;
  }
  var d=result.data;
  handoffBox.appendChild(node('h2','','خلاصه نیاز فنی از راهنمای پاک راز'));
  handoffBox.appendChild(node('p','','این اطلاعات فقط در همین زبانه مرورگر نگهداری شده و هنوز به پاک راز ارسال نشده است. هیچ گرید یا سازگاری محصولی توصیه یا تأیید نشده است.'));
  var details=node('details','handoff-summary');var summary=node('summary','','مشاهده خلاصه فنی منتقل‌شده');var pre=node('pre','',d.summary);details.appendChild(summary);details.appendChild(pre);handoffBox.appendChild(details);
  var controls=node('div','handoff-controls');
  var pkgLabel=node('label','','قالب بسته‌بندی درخواستی (برای افزودن به فهرست انتخاب کنید)');
  var select=node('select');select.name='finder_package';var empty=node('option','','انتخاب قالب بسته‌بندی');empty.value='';select.appendChild(empty);
  D.formats.forEach(function(f){var o=node('option','',f.name+' — '+f.desc);o.value=f.id;select.appendChild(o)});
  var suggested={ '20':'g20',drum:'d200',ibc:'ibc1000' }[d.pack]||'';if(suggested&&P['pce-superplasticizer']&&P['pce-superplasticizer'].formats.indexOf(suggested)>-1)select.value=suggested;
  pkgLabel.appendChild(select);
  var qtyLabel=node('label','','تعداد بسته');var qty=node('input');qty.type='number';qty.min='1';qty.max='99999';qty.step='1';qty.value='1';qty.inputMode='numeric';qtyLabel.appendChild(qty);
  var apply=node('button','btn btn-primary','اعمال خلاصه و افزودن PCE به لیست استعلام');apply.type='button';
  controls.appendChild(pkgLabel);controls.appendChild(qtyLabel);controls.appendChild(apply);handoffBox.appendChild(controls);
  handoffBox.appendChild(node('p','', 'تعداد پیش‌فرض ۱ واحد بسته‌بندی است؛ آن را متناسب با نیاز واقعی خود تغییر دهید. انتخاب بسته‌بندی صرفاً درخواست شماست و موجودی یا امکان عرضه را تأیید نمی‌کند.'));
  var message=node('p','handoff-message','');message.setAttribute('role','status');message.setAttribute('aria-live','polite');handoffBox.appendChild(message);
  apply.addEventListener('click',function(){
   var fid=select.value,quantity=parseInt(toEn(qty.value).replace(/\D/g,''),10);
   if(!fid||!F[fid]||!P['pce-superplasticizer']||P['pce-superplasticizer'].formats.indexOf(fid)<0){message.textContent='ابتدا قالب بسته‌بندی درخواستی را انتخاب کنید.';select.focus();return}
   if(!isFinite(quantity)||quantity<1||quantity>99999){message.textContent='تعداد باید عددی بین ۱ و ۹۹٬۹۹۹ باشد.';qty.focus();return}
   var rows=load(),exists=rows.some(function(x){return x.pid==='pce-superplasticizer'&&x.fid===fid});
   if(!exists)add('pce-superplasticizer',fid,quantity);else renderCart();
   var form=$('#rfqform');if(form){
    var segMap={ready:'تولیدکننده بتن آماده',precast:'تولیدکننده قطعات بتنی پیش‌ساخته',stone:'تولیدکننده سنگ مصنوعی پایه سیمانی',other:'سایر کاربردهای مرتبط'};
    if(form.elements.segment)form.elements.segment.value=segMap[d.app]||'';
    if(form.elements.supplyForm)form.elements.supplyForm.value=['raw','concentrate','ready'].indexOf(d.supply)>=0?d.supply:'';
    if(form.elements.note){var src='خلاصه منتقل‌شده از راهنمای تعیین نیاز فنی (شرح اولیه؛ نه پیشنهاد گرید یا تأیید سازگاری):\n'+d.summary;form.elements.note.value=src;form.elements.note.dispatchEvent(new Event('input',{bubbles:true}))}
   }
   apply.disabled=true;select.disabled=true;qty.disabled=true;
   message.textContent=exists?'این قالب از قبل در لیست استعلام وجود داشت؛ تعداد قبلی تغییر نکرد و خلاصه به فرم اضافه شد.':'قالب درخواستی به لیست استعلام اضافه شد. اطلاعات تماس و مقصد را تکمیل کنید.';
   apply.textContent='خلاصه اعمال شد';
   var formEl=$('#rfqform');if(formEl){formEl.hidden=false;formEl.scrollIntoView({behavior:'smooth',block:'start'})}
  });
 }
 renderCart=function(){
  var a=load(),sum=$('#sum');
  if(!a.length){list.innerHTML='<div class="empty"><p><b>لیست استعلام خالی است.</b></p><p>از کاتالوگ محصول و قالب بسته‌بندی را انتخاب کنید.</p><a class="btn btn-primary" href="catalog.html">رفتن به کاتالوگ</a></div>';if(sum)sum.innerHTML='';var fm=$('#rfqform');if(fm)fm.hidden=true;return}
  var fm2=$('#rfqform');if(fm2)fm2.hidden=false;
  list.innerHTML=a.map(function(i,k){var p=P[i.pid],f=F[i.fid],l=liters(i);return '<div class="item"><svg class="il" aria-hidden="true"><use href="#il-'+f.icon+'"/></svg><div><h3><a href="product-'+p.id+'.html">'+esc(p.name)+'</a></h3><div class="meta">'+esc(f.name)+(l?' — ≈ '+fa(l)+' لیتر':'')+'</div>'+(p.status==='planned'?'<span class="tag warn">ثبت نیاز</span>':'')+'</div><div class="ctrl"><div class="qty"><button type="button" data-q="-1" data-k="'+k+'" aria-label="کم">−</button><input type="text" inputmode="numeric" value="'+fa(i.qty)+'" data-k="'+k+'" aria-label="تعداد '+esc(p.name)+'"><button type="button" data-q="1" data-k="'+k+'" aria-label="زیاد">+</button></div><button type="button" class="rm" data-rm="'+k+'">حذف</button></div></div>'}).join('');
  var tl=0,unk=0;a.forEach(function(i){var l=liters(i);if(l)tl+=l;else unk++});
  if(sum)sum.innerHTML='<div class="sumrow"><span>تعداد ردیف</span><b>'+fa(a.length)+'</b></div><div class="sumrow"><span>جمع ظرفیت اسمی ظرف‌های درخواستی</span><b>'+(tl?fa(tl)+' لیتر':'—')+'</b></div>'+(unk?'<div class="sumrow"><span>ردیف بدون حجم مشخص (پالت/تانکر)</span><b>'+fa(unk)+'</b></div>':'')+'<p style="font-size:13.5px;color:var(--muted);margin:10px 0 0">قیمت و موجودی پس از استعلام اعلام می‌شود.</p>';
 };
 list.addEventListener('click',function(e){var b=e.target.closest('[data-q],[data-rm]');if(!b)return;var a=load();if(b.hasAttribute('data-rm')){a.splice(+b.getAttribute('data-rm'),1)}else{var i=a[+b.getAttribute('data-k')];if(i)i.qty=Math.max(1,Math.min(99999,i.qty+(+b.getAttribute('data-q'))))}save(a)});
 list.addEventListener('change',function(e){var inp=e.target.closest('input[data-k]');if(!inp)return;var a=load(),i=a[+inp.getAttribute('data-k')];if(i){var v=parseInt(toEn(inp.value).replace(/\D/g,''),10);i.qty=isFinite(v)&&v>0?Math.min(v,99999):1;save(a)}});
 var clr=$('#clear');if(clr)clr.onclick=function(){if(confirm('همهٔ ردیف‌های لیست حذف شود؟')){save([])}};
 renderCart();
 showFinderHandoff();
 var form=$('#rfqform');if(!form)return;
 // پیش‌نویس فیلدهای غیرحساس
 try{var dr=JSON.parse(store('pz_draft')||'{}');['company','segment','supplyForm','city','delivery','urgency'].forEach(function(k){if(dr[k]&&form.elements[k])form.elements[k].value=dr[k]})}catch(e){}
 form.addEventListener('input',function(){var d={};['company','segment','supplyForm','city','delivery','urgency'].forEach(function(k){d[k]=form.elements[k].value});store('pz_draft',JSON.stringify(d))});
 form.addEventListener('submit',function(e){
  e.preventDefault();
  var f=form.elements,v={name:f.name.value.trim(),company:f.company.value.trim(),segment:f.segment.value,supplyForm:f.supplyForm?f.supplyForm.value:'',phone:f.phone.value,phone2:f.phone2?f.phone2.value:'',city:f.city.value.trim(),destination:f.destination?f.destination.value.trim():'',email:f.email.value.trim(),delivery:f.delivery.value,urgency:f.urgency.value,note:f.note.value.trim()},bad=false;
  if(f.website&&f.website.value){return}
  function chk(n,c,m){setErr(n,c?'':m);if(!c)bad=true}
  chk('name',v.name.length>=3,'نام و نام خانوادگی را وارد کنید');
  chk('segment',!!v.segment,'حوزه فعالیت را انتخاب کنید');
  chk('phone',validPhone(v.phone),'شماره تماس معتبر با کد کشور وارد کنید.');
  if(v.phone2)chk('phone2',validPhone(v.phone2),'شماره تماس دوم معتبر نیست.');
  chk('city',v.city.length>=2,'شهر یا استان را وارد کنید');
  chk('email',!v.email||/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email),'ایمیل معتبر نیست');
  chk('delivery',!!v.delivery,'نحوه تحویل را انتخاب کنید');
  chk('urgency',!!v.urgency,'زمان نیاز را انتخاب کنید');
  var cons=$('#consent');setErr('consent',cons.checked?'':'برای ادامه، تأیید لازم است');if(!cons.checked)bad=true;
  var items=load();if(!items.length){toast('لیست خالی است');return}
  if(bad){var first=$('.field.bad',form);if(first)first.scrollIntoView({behavior:'smooth',block:'center'});return}
  if(!lastSubmitOk()){toast('لطفاً چند ثانیه صبر کنید');return}
  var ref=refCode(),msg=buildMsg(ref,v,items),btn=$('#submit');btn.disabled=true;btn.textContent='در حال آماده‌سازی…';
  deliver('استعلام جدید '+ref,msg,{name:v.name,phone:digits(v.phone),email:v.email||undefined,company:v.company,city:v.city,supply_form:v.supplyForm||'unknown',ref:ref},function(st){
   btn.disabled=false;btn.textContent='آماده‌سازی درخواست';
   if(st==='sent'){store('pz_last',String(Date.now()));save([])}
   resultPanel(st,ref,msg,v,items);
  });
 });
}

/* ---------- contact ---------- */
function initContact(){
 var form=$('#cform');if(!form)return;
 form.addEventListener('submit',function(e){
  e.preventDefault();var f=form.elements;if(f.website&&f.website.value)return;
  var v={name:f.name.value.trim(),phone:f.phone.value,msg:f.message.value.trim()},bad=false;
  function chk(n,c,m){setErr(n,c?'':m);if(!c)bad=true}
  chk('name',v.name.length>=3,'نام را وارد کنید');chk('phone',validPhone(v.phone),'شماره تماس معتبر با کد کشور وارد کنید');chk('message',v.msg.length>=10,'پیام را کمی کامل‌تر بنویسید');
  if(bad)return;if(!lastSubmitOk()){toast('لطفاً چند ثانیه صبر کنید');return}
  var ref=refCode(),msg='پیام تماس — کد: '+ref+'\nنام: '+v.name+'\nتلفن: '+digits(v.phone)+'\n\n'+v.msg;
  deliver('پیام تماس '+ref,msg,{name:v.name,phone:digits(v.phone),ref:ref},function(st){
   if(st==='sent')store('pz_last',String(Date.now()));
   resultPanel(st,ref,msg,{name:v.name,phone:v.phone,city:'—',segment:'—',delivery:'—',urgency:'—'},[]);
  });
 });
}

/* ---------- boot ---------- */
function docLinks(pid,list){var m=(C.docs&&C.docs[pid])||{};return list.map(function(d){return m[d]?'<a class="btn btn-ghost btn-sm" href="'+esc(m[d])+'" target="_blank" rel="noopener">'+esc(d)+' (دانلود)</a>':'<span class="tag warn">'+esc(d)+': در حال تکمیل</span>'}).join(' ')}
function initDocs(){$$('[data-doc-row]').forEach(function(el){el.innerHTML=docLinks(el.getAttribute('data-doc-row'),el.getAttribute('data-docs').split(','))});var b=$('#pdocs'),pid=document.body.getAttribute('data-pid');if(b&&pid)b.innerHTML='<div class="channels">'+docLinks(pid,b.getAttribute('data-docs').split(','))+'</div>'}
function boot(){initConfig();initDocs();badge();initCatalog();initProduct();initRfq();initContact()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('storage',function(e){if(e.key===KEY)badge()});
})();
