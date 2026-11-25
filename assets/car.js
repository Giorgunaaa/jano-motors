(function(){
const {byId,sp,priceAttr,paintPrices,initBooking,onCur}=window.JANO;const FLEET=window.FLEET;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const id=new URLSearchParams(location.search).get('id');
const c=byId(id)||FLEET[0];
const $=x=>document.getElementById(x);
document.title=`${c.name} — JANO MOTORS`;
$('crName').textContent=c.name;$('bkName').textContent=c.name;
/* სახელი ორ ხაზად: პირველი სავსე, მეორე კონტურით — იყოფა იქ, სადაც ხაზები ყველაზე თანაბარია */
{const w=c.name.split(' ');let k=1,best=1e9;for(let i=1;i<w.length;i++){const d=Math.abs(w.slice(0,i).join(' ').length-w.slice(i).join(' ').length);if(d<best){best=d;k=i}}
 $('cName').innerHTML=w.length>1?`${w.slice(0,k).join(' ')}<br><em>${w.slice(k).join(' ')}</em>`:c.name;$('cName').setAttribute('aria-label',c.name)}
$('cNo').textContent=String(FLEET.indexOf(c)+1).padStart(2,'0')+' / 10';
{const st=(v,u,l,geo)=>`<div><b${geo?' class="geo"':''}>${v}${u?`<small>${u}</small>`:''}</b><span>${l}</span></div>`;
 $('cStats').innerHTML=st(c.hp,'ცხ.ძ.','სიმძლავრე')+(c.spec.acc?st(c.spec.acc,'წმ','0–100 კმ/სთ'):st(c.fuel,'','საწვავი',1))+st(c.year,'','გამოშვების წელი');
 $('sndSub').textContent=c.fuel==='ელექტრო'?'ელექტროძრავის ხმა':`${c.hp} ცხ.ძ. ძრავის ხმა`}
/* ---------- გალერეა ---------- */
const g=$('gMain');let gi=0;
g.insertAdjacentHTML('afterbegin',c.imgs.map((s,k)=>`<img src="${s}" alt="${c.name} — ფოტო ${k+1}" class="${k?'':'on'}" ${k?'loading="lazy"':''}>`).join(''));
$('gTh').innerHTML=c.imgs.map((s,k)=>`<button type="button" data-i="${k}" aria-label="ფოტო ${k+1}" class="${k?'':'on'}"><img src="${s}" alt="" loading="lazy"></button>`).join('');
function go(i){const n=c.imgs.length;gi=(i+n)%n;
  g.querySelectorAll('img').forEach((im,k)=>im.classList.toggle('on',k===gi));
  $('gTh').querySelectorAll('button').forEach((b,k)=>{b.classList.toggle('on',k===gi)});
  const tb=$('gTh').children[gi];if(tb){const p=$('gTh');p.scrollTo({left:tb.offsetLeft-p.clientWidth/2+tb.clientWidth/2,behavior:reduce?'auto':'smooth'})}
  $('gCnt').innerHTML=`<b>${String(gi+1).padStart(2,'0')}</b> / ${String(n).padStart(2,'0')}`}
g.querySelector('.gbtn.p').onclick=e=>{e.stopPropagation();go(gi-1)};
g.querySelector('.gbtn.n').onclick=e=>{e.stopPropagation();go(gi+1)};
$('gTh').addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(+b.dataset.i)});
const openLb=()=>Gallery.open(c.imgs,gi,c.name,i=>go(i));
$('gFs').onclick=e=>{e.stopPropagation();openLb()};
g.addEventListener('click',e=>{if(!e.target.closest('button'))openLb()});
Gallery.swipe(g,d=>go(gi+d));
document.addEventListener('keydown',e=>{if(document.querySelector('.lb.open')||/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
  if(e.key==='ArrowLeft')go(gi-1);else if(e.key==='ArrowRight')go(gi+1)});
go(0);
/* ფოტოების ავტომატური გადასვლა: ყოველ 4.5 წმ-ში. ჩერდება მაუსის მიტანისას, სრულ ეკრანზე გახსნისას,
   ჩანართის დამალვისას და როცა ზედა ეკრანი აღარ ჩანს; ხელით გადართვა ათვლას თავიდან იწყებს.
   „შემცირებული მოძრაობის" პარამეტრით — გამორთულია. */
{const AUTO_MS=4500;let auto=null,hover=false,seen=true;const hero=g.closest('.ch')||g;
 const startAuto=()=>{clearInterval(auto);if(reduce||c.imgs.length<2)return;
   auto=setInterval(()=>{if(hover||!seen||document.hidden||document.querySelector('.lb.open'))return;go(gi+1)},AUTO_MS)};
 [g,$('gTh')].forEach(el=>{el.addEventListener('mouseenter',()=>hover=true);el.addEventListener('mouseleave',()=>hover=false);
   el.addEventListener('click',startAuto);el.addEventListener('touchend',startAuto,{passive:true})});
 document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight')startAuto()});
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{seen=es[0].isIntersecting},{threshold:.25}).observe(hero);
 startAuto()}
/* ---------- ფასი ---------- */
$('pNow').outerHTML=`<span id="pNow" ${priceAttr(c.gel,c.usd)}></span>`;
if(c.oldGel){$('pWas').hidden=false;$('pOld').outerHTML=`<s id="pOld" ${priceAttr(c.oldGel,c.oldUsd)}></s>`;
  const pct=()=>{const usd=JANO.cur==='USD'&&c.usd!=null&&c.oldUsd!=null;const a=usd?c.usd:c.gel,b=usd?c.oldUsd:c.oldGel;return Math.round((1-a/b)*100)};
  const setOff=()=>{$('pOff').textContent=`−${pct()}%`};setOff();onCur(setOff)}
/* ---------- ძრავის ხმა (აუდიო ჯერ არ არის) ---------- */
const sb=$('sndBtn');if(c.sound)sb.dataset.audioSrc=c.sound;
let audio=null,t=null,synth=null,ytBound=false;
sb.addEventListener('click',()=>{
  const src=sb.dataset.audioSrc;
  if(src){ // აუდიო მიბმულია — ვუკრავთ
    if(!audio){audio=new Audio(src);audio.addEventListener('ended',()=>{sb.classList.remove('play');sb.setAttribute('aria-pressed','false')})}
    if(audio.paused){audio.currentTime=0;audio.play().catch(()=>{});sb.classList.add('play');sb.setAttribute('aria-pressed','true')}
    else{audio.pause();sb.classList.remove('play');sb.setAttribute('aria-pressed','false')}
    return}
  // ნამდვილი ჩანაწერი ჯერ არ არის — დროებით YouTube-ის ჩაშენებული ვიდეო იმავე მოდელზე (assets/sound-yt.js)
  // file:// -ით გახსნისას YouTube პლეერი არ მუშაობს — მაშინ გამოიყენება სინთეზირებული ხმა
  const yt=location.protocol!=='file:'&&window.SOUND_YT&&window.SOUND_YT[c.id];
  if(yt){
    // პლეერი უხილავია — მხოლოდ ხმა ისმის
    const old=$('sndYt');
    const off=()=>{const b=$('sndYt');if(b)b.remove();sb.classList.remove('play');sb.setAttribute('aria-pressed','false');$('sndNote').textContent=''};
    if(old){off();return}
    const box=document.createElement('div');box.className='snd-yt';box.id='sndYt';box.setAttribute('aria-hidden','true');
    box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1&start=${yt.s||0}${yt.e?'&end='+yt.e:''}&playsinline=1&rel=0&controls=0&enablejsapi=1" title="${c.name} — ძრავის ხმა" tabindex="-1" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    $('sndNote').after(box);$('sndNote').textContent='დროებითი ხმა YouTube-იდან — იგივე მოდელი, არა კონკრეტულად ეს მანქანა';
    const fr=box.firstChild;
    fr.addEventListener('load',()=>fr.contentWindow.postMessage('{"event":"listening","id":1,"channel":"widget"}','*'));
    if(!ytBound){ytBound=true;addEventListener('message',e=>{ // ვიდეოს დასრულებისას ღილაკი გაითიშოს
      const f=$('sndYt')&&$('sndYt').firstChild;if(!f||e.source!==f.contentWindow||!/youtube/.test(e.origin))return;
      try{const d=JSON.parse(e.data);if(d.info&&d.info.playerState===0)off()}catch(_){}})}
    sb.classList.add('play');sb.setAttribute('aria-pressed','true');return}
  // არც ვიდეოა — სადემონსტრაციო სინთეზირებული ხმა (assets/engine-synth.js)
  if(window.EngineSynth){
    if(synth){synth.stop();return}
    const off=()=>{synth=null;sb.classList.remove('play');sb.setAttribute('aria-pressed','false');$('sndNote').textContent=''};
    synth=EngineSynth.play(c.id,off);
    if(synth){sb.classList.add('play');sb.setAttribute('aria-pressed','true');$('sndNote').textContent=location.protocol==='file:'?'სინთეზირებული ხმა — ნამდვილი ხმისთვის გახსენით http://localhost:5173-ით':'დემო ხმა (სინთეზირებული) — ნამდვილი ჩანაწერი მალე დაემატება';return}}
  sb.classList.add('play');$('sndNote').textContent='ძრავის ხმა მალე დაემატება';
  clearTimeout(t);t=setTimeout(()=>{sb.classList.remove('play');$('sndNote').textContent=''},reduce?1200:2200)});
/* ---------- მახასიათებლები ---------- */
const s=c.spec,NA='—';
const stdName={WLTP:'WLTP',NEDC:'NEDC',EPA:'EPA (აშშ), გადაყვანილი ლ/100კმ-ში',ADR:'ADR 81/02 (ავსტრალია)'};
const tile=(k,v,unit,sub)=>`<div class="t"><div class="k">${k}</div><div class="v ${v?'':'na'}">${v||NA}${v&&unit?`<small>${unit}</small>`:''}</div><div class="s">${sub||''}</div></div>`;
$('spHl').innerHTML=
  tile('0–100 კმ/სთ',s.acc,'წმ',s.acc?'მწარმოებლის მონაცემი':'ოფიციალური მონაცემი არ მოიძებნა')+
  tile('საწვავის ხარჯი',s.cons,'ლ/100კმ',s.cons?`მწარმოებლის/ოფიციალური, ${stdName[s.consStd]||''} · კომბინირებული`:(s.consNote||'ოფიციალური მონაცემი არ მოიძებნა'))+
  tile('სიმძლავრე',String(c.hp),'ცხ.ძ.','JANO MOTORS-ის მონაცემი');
const row=(k,v,tag)=>`<div class="r"><span>${k}</span><b class="${v?'':'na'}">${v||NA}${v&&tag?`<span class="src-tag">${tag}</span>`:''}</b></div>`;
$('spTb').innerHTML=
  row('ძრავი',s.engine,'მწარმ.')+row('გადაცემათა კოლოფი',s.trans,'მწარმ.')+row('წამყვანი თვლები',s.drive,'მწარმ.')+
  row('საწვავი',c.fuel)+row('კარები',c.doors)+row('გამოშვების წელი',String(c.year))+
  `<div class="r"><span>დღიური ფასი</span><b><span ${priceAttr(c.gel,c.usd)}></span>${c.oldGel?` <s style="color:#9a9ca3;font-weight:500;margin-left:6px" ${priceAttr(c.oldGel,c.oldUsd)}></s>`:''}</b></div>`+
  row('სიმძლავრე',c.hp+' ცხ.ძ.');
const notes=[];
notes.push('<p>სახელი, წელი, ფასი (₾ და $), სიმძლავრე, საწვავი და კარები — JANO MOTORS-ის საჯარო მონაცემებიდან (janomotors.com).</p>');
if(s.src.length)notes.push('<p>0–100, საწვავის ხარჯი, ძრავი, კოლოფი და წამყვანი თვლები — მწარმოებლის გამოქვეყნებული მონაცემები ამ მოდელისა და თაობისთვის; კონკრეტული მანქანის კომპლექტაციით შეიძლება ოდნავ განსხვავდებოდეს. წყარო: '+s.src.map(x=>`<a href="${x.u}" target="_blank" rel="noopener">${x.t}</a>`).join(' · ')+'</p>');
if(s.mfrNote)notes.push(`<p>${s.mfrNote}</p>`);
notes.push('<p>„—“ ნიშნავს, რომ სანდო ოფიციალური მონაცემი ვერ მოიძებნა.</p>');
$('spNotes').innerHTML=notes.join('');
/* ---------- სხვა მანქანები ---------- */
const ci=FLEET.indexOf(c);const oth=[1,2,3,4].map(k=>FLEET[(ci+k)%FLEET.length]);
const thumb={car10:'media/car10/04.jpg'};
$('oth').innerHTML=oth.map(x=>`<a href="car.html?id=${x.id}" aria-label="${x.name}"><img src="${thumb[x.id]||x.img}" alt="" loading="lazy"><span class="n" aria-hidden="true">${String(FLEET.indexOf(x)+1).padStart(2,'0')}</span><div class="i"><h3>${x.name}</h3><div class="m">${x.year} · ${x.hp} ცხ.ძ.${x.fuel==='ბენზინი'?'':' · '+x.fuel}</div><div class="p"><span ${priceAttr(x.gel,x.usd)}></span><small>/ დღე</small></div><span class="go">ნახვა →</span></div></a>`).join('');
/* ---------- ჯავშანი (ეს მანქანა წინასწარ არჩეულია) ---------- */
const months=matchMedia('(max-width:640px)').matches?1:2;
initBooking({car:c.id,months});
$('bookBtn').addEventListener('click',e=>{e.preventDefault();$('book').scrollIntoView({behavior:reduce?'auto':'smooth'})});
paintPrices();
})();
