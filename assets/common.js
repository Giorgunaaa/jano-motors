/* JANO MOTORS B2 — საერთო: ვალუტა (₾/$), ფასის ფორმატი, ჯავშნის კალენდარი */
(function(){
const FLEET=window.FLEET;
const byId=id=>FLEET.find(c=>c.id===id);
const sp=n=>Math.round(n).toLocaleString('en-US').replace(/,/g,' ');
/* ---------- ვალუტა ---------- */
const CUR_KEY='jano-currency';
let cur=(()=>{try{return localStorage.getItem(CUR_KEY)==='USD'?'USD':'GEL'}catch(e){return 'GEL'}})();
const money=(gel,usd)=>{ // ფასი არჩეულ ვალუტაში; USD მხოლოდ JANO-ს მონაცემიდან, კურსით არ ვთვლით
  if(cur==='USD'){return usd==null?'—':'$'+sp(usd)}
  return gel==null?'—':sp(gel)+' ₾'};
const carPrice=c=>money(c.gel,c.usd);
const carOld=c=>c.oldGel?money(c.oldGel,c.oldUsd):'';
const listeners=[];
function paintPrices(){
  document.querySelectorAll('[data-gel]').forEach(el=>{
    const g=el.dataset.gel===''?null:+el.dataset.gel,u=el.dataset.usd===''||el.dataset.usd==null?null:+el.dataset.usd;
    el.textContent=money(g,u)});
  document.querySelectorAll('.cur-sw button').forEach(b=>{const on=b.dataset.cur===cur;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  document.documentElement.dataset.cur=cur;
  listeners.forEach(f=>f(cur));
}
function setCur(c){cur=c==='USD'?'USD':'GEL';try{localStorage.setItem(CUR_KEY,cur)}catch(e){}paintPrices()}
document.addEventListener('click',e=>{const b=e.target.closest('.cur-sw button');if(b)setCur(b.dataset.cur)});
window.addEventListener('storage',e=>{if(e.key===CUR_KEY){cur=e.newValue==='USD'?'USD':'GEL';paintPrices()}});
const priceAttr=(gel,usd)=>`data-gel="${gel??''}" data-usd="${usd??''}"`;

/* ---------- ჰედერი: სქროლისას მუქი ზოლი ---------- */
const hdr=document.querySelector('header');
const onScroll=()=>{if(hdr)hdr.classList.toggle('scrolled',scrollY>40)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* ---------- ჯავშანი ---------- */
const DRIVER_RATE_GEL=150; // მაგალითი — JANO MOTORS-ის რეალური ტარიფი არ გვაქვს; $-ში ტარიფი არ არსებობს, ამიტომ ₾-ში რჩება
const MONTHS=['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'];
const MS=['იან','თებ','მარ','აპრ','მაი','ივნ','ივლ','აგვ','სექ','ოქტ','ნოე','დეკ'];
const WD=['ორ','სა','ოთ','ხუ','პა','შა','კვ'];
const WDN=['კვირა','ორშაბათი','სამშაბათი','ოთხშაბათი','ხუთშაბათი','პარასკევი','შაბათი'];
const D=(y,m,d)=>new Date(y,m,d);const today=(()=>{const t=new Date();return D(t.getFullYear(),t.getMonth(),t.getDate())})();
const add=(d,n)=>D(d.getFullYear(),d.getMonth(),d.getDate()+n);
const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const pk=s=>{const [y,m,d]=s.split('-').map(Number);return D(y,m-1,d)};
const gd=d=>d?`${d.getDate()} ${MS[d.getMonth()]}, ${d.getFullYear()}`:'—';
const thumbs={car10:'media/car10/04.jpg'};
const $=id=>document.getElementById(id);

function initBooking(opt){
  if(!$('cal'))return null;
  const st={car:opt.car||'car1',from:add(today,7),to:add(today,10),driver:false,view:D(today.getFullYear(),today.getMonth(),1),months:opt.months||2};
  const carList=$('carList');
  if(carList){
    carList.innerHTML=FLEET.map(c=>`<button type="button" class="ci" role="option" data-car="${c.id}"><img src="${thumbs[c.id]||c.img}" alt=""><span class="n">${c.name}</span><span class="p"><span ${priceAttr(c.gel,c.usd)}></span><small>/დღე</small></span></button>`).join('');
    carList.addEventListener('click',e=>{const b=e.target.closest('.ci');if(b){st.car=b.dataset.car;update()}});
  }

  /* ---- ფოტო-ზოლი კალენდართან (მხოლოდ ფოტოები: მთავარი კადრი, ისრები, მთვლელი, მინიატურები; დაჭერით — lightbox) ---- */
  const ph=$('bkPh');let phCar=null,phI=0;
  function phGo(i){const c=byId(st.car),n=c.imgs.length;phI=(i+n)%n;
    ph.querySelectorAll('.bp-main img').forEach((im,k)=>im.classList.toggle('on',k===phI));
    ph.querySelectorAll('.bp-th button').forEach((b,k)=>{b.classList.toggle('on',k===phI);b.setAttribute('aria-current',k===phI?'true':'false')});
    const tb=ph.querySelectorAll('.bp-th button')[phI],th=ph.querySelector('.bp-th');
    if(tb&&th)th.scrollTo({left:tb.offsetLeft-th.clientWidth/2+tb.clientWidth/2,behavior:'auto'});
    ph.querySelector('.bp-cnt').innerHTML=`<b>${String(phI+1).padStart(2,'0')}</b> / ${String(n).padStart(2,'0')}`}
  function phRender(){if(!ph)return;const c=byId(st.car);if(phCar===c.id)return;phCar=c.id;phI=0;
    ph.dataset.car=c.id;
    ph.innerHTML=`<div class="bp-main" role="button" tabindex="0" aria-label="ფოტოების გახსნა სრულ ეკრანზე">${c.imgs.map((s,k)=>`<img src="${s}" alt="ფოტო ${k+1}" class="${k?'':'on'}" ${k?'loading="lazy"':''}>`).join('')}
      <button type="button" class="gbtn p" aria-label="წინა ფოტო">←</button><button type="button" class="gbtn n" aria-label="შემდეგი ფოტო">→</button>
      <span class="bp-cnt"></span><span class="bp-fs" aria-hidden="true">⛶</span></div>
      <div class="bp-th">${c.imgs.map((s,k)=>`<button type="button" data-i="${k}" aria-label="ფოტო ${k+1}"><img src="${s}" alt="" loading="lazy"></button>`).join('')}</div>`;
    phGo(0)}
  if(ph){
    const open=()=>{const c=byId(st.car);window.Gallery&&Gallery.open(c.imgs,phI,c.name,i=>phGo(i))};
    ph.addEventListener('click',e=>{const b=e.target.closest('button');
      if(b&&b.classList.contains('gbtn')){phGo(phI+(b.classList.contains('n')?1:-1));return}
      if(b&&b.dataset.i!=null){phGo(+b.dataset.i);return}
      if(e.target.closest('.bp-main')&&!(ph._sw&&Date.now()-ph._sw<400))open()});
    ph.addEventListener('keydown',e=>{if(!e.target.classList.contains('bp-main'))return;
      if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}else if(e.key==='ArrowLeft')phGo(phI-1);else if(e.key==='ArrowRight')phGo(phI+1)});
    let x0=null,y0=null; // სვაიპი მთავარ კადრზე (მინიატურების ზოლი ჩვეულებრივ სქროლდება)
    ph.addEventListener('touchstart',e=>{if(!e.target.closest('.bp-main')){x0=null;return}x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
    ph.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
      if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){phGo(phI+(dx<0?1:-1));ph._sw=Date.now()}},{passive:true});
  }
  const days=()=>st.from&&st.to?Math.round((st.to-st.from)/864e5):0;
  function renderCal(){
    let h='';
    for(let k=0;k<st.months;k++){const m0=D(st.view.getFullYear(),st.view.getMonth()+k,1);const y=m0.getFullYear(),m=m0.getMonth();
      const off=(m0.getDay()+6)%7;const n=D(y,m+1,0).getDate();
      h+=`<div class="mo"><h4><span>${MONTHS[m]}</span> ${y}</h4><div class="wd">${WD.map(w=>`<span>${w}</span>`).join('')}</div><div class="days">`;
      for(let i=0;i<off;i++)h+='<span></span>';
      for(let d=1;d<=n;d++){const dt=D(y,m,d);const c=[];
        if(+dt===+today)c.push('today');
        if(st.from&&+dt===+st.from)c.push(st.to?'s':'s solo');
        if(st.to&&+dt===+st.to)c.push('e');
        if(st.from&&st.to&&dt>st.from&&dt<st.to)c.push('in');
        h+=`<button type="button" data-date="${key(dt)}" class="${c.join(' ')}" ${dt<today?'disabled':''}>${d}</button>`}
      h+='</div></div>'}
    $('cal').innerHTML=h;
    $('calPrev').disabled=st.view<=D(today.getFullYear(),today.getMonth(),1);
    $('calHint').textContent=st.from&&!st.to?'აირჩიეთ დაბრუნების თარიღი':(!st.from?'აირჩიეთ აყვანის თარიღი':'');
  }
  $('cal').addEventListener('click',e=>{const b=e.target.closest('button[data-date]');if(!b||b.disabled)return;const d=pk(b.dataset.date);
    if(!st.from||st.to){st.from=d;st.to=null}
    else if(d<=st.from){st.from=d;st.to=null} // დაბრუნება აყვანამდე/იმავე დღეს დაბლოკილია — ხდება ახალი აყვანის თარიღი
    else st.to=d;
    update()});
  $('calPrev').onclick=()=>{st.view=D(st.view.getFullYear(),st.view.getMonth()-1,1);renderCal()};
  $('calNext').onclick=()=>{st.view=D(st.view.getFullYear(),st.view.getMonth()+1,1);renderCal()};
  /* სწრაფი არჩევა (მხოლოდ იქ, სადაც #calQuick არსებობს): აყვანის დღე რჩება, დაბრუნება = აყვანა + N დღე */
  const quick=$('calQuick');
  if(quick)quick.addEventListener('click',e=>{const b=e.target.closest('button[data-n]');if(!b)return;
    if(!st.from)st.from=add(today,1);st.to=add(st.from,+b.dataset.n);
    if(st.to>=D(st.view.getFullYear(),st.view.getMonth()+st.months,1)||st.from<st.view)st.view=D(st.from.getFullYear(),st.from.getMonth(),1);
    update()});
  const drv=document.querySelector('.drv');
  if(drv)drv.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;st.driver=b.dataset.driver==='1';update()});
  if($('drvRate'))$('drvRate').textContent=DRIVER_RATE_GEL;
  function update(){
    const c=byId(st.car),n=days();
    if(carList)carList.querySelectorAll('.ci').forEach(b=>{const on=b.dataset.car===st.car;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
    document.querySelectorAll('.drv button').forEach(b=>{const on=(b.dataset.driver==='1')===st.driver;b.classList.toggle('on',on);b.setAttribute('aria-checked',on)});
    if($('sumImg'))$('sumImg').src=thumbs[c.id]||c.img;
    if($('sumName'))$('sumName').textContent=c.name;
    if($('sumMeta'))$('sumMeta').textContent=`${c.year} · ${c.hp} ცხ.ძ. · ${c.fuel}`;
    if($('sumFrom')){$('sumFrom').textContent=gd(st.from);$('sumTo').textContent=gd(st.to)}
    if($('tkFromD')){ // შეჯამება ბილეთის სახით (მანქანის გვერდი)
      const dm=(d,p)=>{$(p+'D').innerHTML=d?`${d.getDate()}<u>${MS[d.getMonth()]}</u>`:'—';$(p+'W').textContent=d?WDN[d.getDay()]:''};
      dm(st.from,'tkFrom');dm(st.to,'tkTo');$('tkDays').textContent=n?`${n} დღე`:'აირჩიეთ'}
    if(quick)quick.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.n===n));
    const usd=cur==='USD'&&c.usd!=null;
    const daily=usd?c.usd:c.gel,sym=v=>usd?'$'+sp(v):sp(v)+' ₾';
    $('rDaily').textContent=sym(daily);
    $('rDays').textContent=n||'—';
    const carT=daily*n,drvT=st.driver?DRIVER_RATE_GEL*n:0;
    $('rCar').textContent=n?`${sp(daily)} × ${n} = ${sym(carT)}`:'—';
    $('rowDrv').hidden=!st.driver;
    $('rDrv').textContent=n?`${DRIVER_RATE_GEL} × ${n} = ${sp(drvT)} ₾`:'—';
    const t=$('sumTotal');
    if(!n){t.textContent='—';t.dataset.value=0}
    else if(usd){t.textContent=drvT?`${sym(carT)} + ${sp(drvT)} ₾`:sym(carT);t.dataset.value=carT}
    else{t.textContent=sp(carT+drvT)+' ₾';t.dataset.value=carT+drvT}
    t.classList.toggle('mix',!!(usd&&drvT));
    $('sendBtn').disabled=!n;
    const dn=$('demoNote');dn.classList.remove('ok');dn.textContent='სადემონსტრაციო ფორმა — მოთხოვნა არსად იგზავნება';
    if($('calRng'))$('calRng').innerHTML=st.from?`${gd(st.from).replace(/, \d{4}$/,'')}<i>→</i>${st.to?gd(st.to).replace(/, \d{4}$/,''):'?'}`:'—';
    if($('calDays'))$('calDays').textContent=n||'—';
    phRender();renderCal();
  }
  $('sendBtn').onclick=()=>{const dn=$('demoNote');dn.classList.add('ok');dn.textContent='დემო: მოთხოვნა შედგენილია, მაგრამ არსად გაგზავნილა.'};
  listeners.push(()=>update());
  update();
  return {select(id){st.car=id;update()},state:st};
}
window.JANO={byId,sp,money,carPrice,carOld,priceAttr,paintPrices,setCur,get cur(){return cur},onCur:f=>listeners.push(f),initBooking};
})();
/* ჰორიზონტალური ზოლები (სქროლბარის გარეშე): მაუსის ბორბალი და გადათრევა */
(function(){
const SEL='.bp-th,.g-th,.lb-th,#carList';
document.addEventListener('wheel',e=>{const el=e.target.closest(SEL);if(!el||el.scrollWidth<=el.clientWidth)return;
  if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){const max=el.scrollWidth-el.clientWidth;
    if((e.deltaY>0&&el.scrollLeft<max)||(e.deltaY<0&&el.scrollLeft>0)){el.scrollLeft+=e.deltaY;e.preventDefault()}}},{passive:false});
let drag=null;
document.addEventListener('mousedown',e=>{if(e.button!==0)return;const el=e.target.closest(SEL);if(!el||el.scrollWidth<=el.clientWidth)return;
  drag={el,x:e.clientX,s:el.scrollLeft,moved:false}});
document.addEventListener('mousemove',e=>{if(!drag)return;const dx=e.clientX-drag.x;
  if(!drag.moved&&Math.abs(dx)>5){drag.moved=true;drag.el.classList.add('hscroll-drag')}
  if(drag.moved){drag.el.scrollLeft=drag.s-dx;e.preventDefault()}});
document.addEventListener('mouseup',()=>{if(!drag)return;const d=drag;drag=null;
  if(d.moved){d.el.classList.remove('hscroll-drag');const stop=ev=>{ev.stopPropagation();ev.preventDefault()};
    d.el.addEventListener('click',stop,{capture:true,once:true});setTimeout(()=>d.el.removeEventListener('click',stop,{capture:true}),0)}});
})();
