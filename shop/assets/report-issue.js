/* PAK RAZ — local issue-report export; no network request and no browser storage. */
(function(){'use strict';
 var form=document.getElementById('issue-form');
 if(!form)return;
 var result=document.getElementById('issue-result');
 var category=form.elements.category, page=form.elements.page, actual=form.elements.actual, email=form.elements.email;
 try{if(page&&!page.value)page.value=window.location.href.split('#')[0]}catch(e){}
 function msg(el,text){var w=el.closest('.field');if(!w)return;w.classList.toggle('bad',!!text);var er=w.querySelector('.err');if(er)er.textContent=text||''}
 form.addEventListener('input',function(e){var el=e.target;if(el.name==='category'||el.name==='page'||el.name==='actual'||el.name==='email')msg(el,'')});
 form.addEventListener('submit',function(e){
  e.preventDefault();
  var bad=false;
  if(!category.value){msg(category,'نوع مشکل را انتخاب کنید.');bad=true}
  if(!page.value||!/^https?:\/\//i.test(page.value)){msg(page,'نشانی صفحه باید با http:// یا https:// شروع شود.');bad=true}
  if(actual.value.trim().length<10){msg(actual,'شرح مشکل را با حداقل ۱۰ نویسه وارد کنید.');bad=true}
  if(email.value&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){msg(email,'ساختار ایمیل معتبر نیست.');bad=true}
  if(bad){var first=form.querySelector('.field.bad');if(first)first.scrollIntoView({behavior:'smooth',block:'center'});return}
  var lines=[
   'PAK RAZ ESPADANA — گزارش مشکل وب‌سایت',
   'زمان تهیه گزارش: '+new Date().toLocaleString(),
   'نوع مشکل: '+category.value,
   'صفحه: '+page.value,
   '',
   'شرح مشکل:',actual.value.trim(),
   '',
   'مراحل تکرار:',form.elements.steps.value.trim()||'ذکر نشده',
   '',
   'رفتار مورد انتظار:',form.elements.expected.value.trim()||'ذکر نشده',
   '',
   'ایمیل اختیاری برای پاسخ: '+(email.value.trim()||'ارائه نشده'),
   ''
  ];
  if(form.elements['include-tech'].checked){
   lines.push('اطلاعات فنی مرورگر و دستگاه (با انتخاب کاربر):');
   lines.push('User-Agent: '+navigator.userAgent);
   lines.push('Language: '+navigator.language);
   lines.push('Screen: '+screen.width+' × '+screen.height);
   lines.push('Viewport: '+window.innerWidth+' × '+window.innerHeight);
   lines.push('');
  }
  lines.push('یادآوری: این فایل به‌صورت محلی ساخته شده و هیچ گزارشی به سرور ارسال نشده است.');
  var blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/plain;charset=utf-8'});
  var url=URL.createObjectURL(blob),a=document.createElement('a');
  var d=new Date(),stamp=d.getFullYear()+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2)+'-'+('0'+d.getHours()).slice(-2)+('0'+d.getMinutes()).slice(-2);
  a.href=url;a.download='pakraz-website-issue-'+stamp+'.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1000);
  result.className='status show info';
  result.textContent='فایل گزارش ساخته شد. این فایل فقط روی دستگاه شما دانلود شده و به شرکت ارسال نشده است؛ آن را از مسیر ارتباط رسمی ارسال کنید.';
 });
})();
