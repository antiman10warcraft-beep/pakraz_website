/* محتوای اختیاری سایت — هر بخش خالی باشد در سایت نمایش داده نمی‌شود.
   هیچ عدد، گواهی، مشتری یا خبر ساختگی ننویسید؛ فقط داده‌های واقعی و تأییدشدهٔ شرکت.
   راهنمای کامل و نمونه: extras/docs/CONTENT_TEMPLATES_FA.md */
window.PAKRAZ_X_CONTENT={
  // نوار «در یک نگاه» زیر بخش اول صفحهٔ اصلی. مثال: {v:'۱۵ سال',l:{fa:'تجربهٔ تیم فنی',en:'Technical team experience'}}
  trust:[],
  // مقاله‌ها / نمونه‌کارها / خبرها. مثال:
  // {slug:'pce-basics',date:'2026-01-15',title:{fa:'مبانی PCE',en:'PCE basics'},summary:{fa:'خلاصه',en:'Summary'},body:{fa:['پاراگراف اول','پاراگراف دوم'],en:['First paragraph','Second paragraph']}}
  articles:[],
  cases:[],
  news:[],
  // مدارک قابل دانلود. فایل PDF را در deploy/docs بگذارید. type: TDS | SDS | COA | Catalog
  // مثال: {product:'pce',type:'TDS',lang:'fa',title:'برگه اطلاعات فنی PCE',file:'docs/pce-tds-fa.pdf'}
  documents:[]
};
