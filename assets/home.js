(function(){
const {byId,sp,priceAttr,paintPrices,initBooking}=window.JANO;const FLEET=window.FLEET;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- ჰეროს სლაიდშოუ (ნამდვილი JANO ფოტოები) ---------- */
const SLIDES=[{car:'car9',src:'media/car9/10.jpg',pos:'50% 60%',lbl:'M8'},{car:'car1',src:'media/car1/01.jpg',pos:'50% 62%',lbl:'TAYCAN'},{car:'car2',src:'media/car2/04.jpg',pos:'50% 60%',lbl:'G63'},{car:'car6',src:'media/car6/01.jpg',pos:'50% 62%',lbl:'MUSTANG'},{car:'car8',src:'media/car8/06.jpg',pos:'50% 60%',lbl:'LC300'}];
const DUR=6000;
/* ფონური წარწერა: თითო სლაიდს თავისი მოკლე სახელი; ზომა ერგება სიგანეს */
const ghost=document.getElementById('ghost'),heroL=document.querySelector('.hero-l');
ghost.innerHTML=SLIDES.map((s,i)=>`<span class="${i?'':'on'}">${s.lbl}</span>`).join('');
function fitGhost(){
  const mob=matchMedia('(max-width:1000px)').matches,base=mob?(matchMedia('(max-width:640px)').matches?150:200):300;
  const avail=heroL.clientWidth-ghost.offsetLeft-(mob?16:28);
  ghost.querySelectorAll('span').forEach(sp=>{sp.style.fontSize=base+'px';const w=sp.scrollWidth;sp.style.fontSize=Math.floor(Math.min(base,base*avail/w))+'px'});
}
fitGhost();document.fonts&&document.fonts.ready.then(fitGhost);addEventListener('resize',fitGhost);

const heroR=document.getElementById('heroR'),hero=document.querySelector('.hero');
SLIDES.forEach((s,i)=>{const c=byId(s.car);const d=document.createElement('div');d.className='sl'+(i?'':' on');d.setAttribute('aria-hidden',i?'true':'false');
  d.innerHTML=`<img src="${s.src}" alt="${c.name}" style="object-position:${s.pos}" ${i?'loading="lazy"':''}>`;heroR.insertBefore(d,heroR.firstChild===null?null:document.getElementById('hdots'))});
const bar=document.getElementById('hudBar'),hdD=document.getElementById('hdD');
bar.innerHTML=SLIDES.map((s,i)=>`<button type="button" aria-label="სლაიდი ${i+1}: ${byId(s.car).name}"><i></i></button>`).join('');
hdD.innerHTML=SLIDES.map((s,i)=>`<button type="button" aria-label="სლაიდი ${i+1}: ${byId(s.car).name}"><i></i></button>`).join('');
bar.style.setProperty('--dur',DUR/1000+'s');
let cur=0,timer=null,paused=false;
function show(i){
  cur=(i+SLIDES.length)%SLIDES.length;const s=SLIDES[cur],c=byId(s.car);
  heroR.querySelectorAll('.sl').forEach((el,k)=>{el.classList.toggle('on',k===cur);el.setAttribute('aria-hidden',k!==cur)});
  ghost.querySelectorAll('span').forEach((el,k)=>el.classList.toggle('on',k===cur));
  [bar,hdD].forEach(b=>b.querySelectorAll('button').forEach((x,k)=>{x.classList.toggle('on',k===cur);x.setAttribute('aria-current',k===cur?'true':'false');
    if(k===cur){const ii=x.querySelector('i');ii.style.display='none';void ii.offsetWidth;ii.style.display=''}}));
  const hud=document.getElementById('hud');hud.classList.add('sw');
  setTimeout(()=>{document.getElementById('hudN').textContent=c.name.toUpperCase();
    document.getElementById('hudP').innerHTML=`${c.year} · ${c.hp} ცხ.ძ. &nbsp; <b ${priceAttr(c.gel,c.usd)}></b> / დღე`;
    paintPrices();hud.classList.remove('sw')},reduce?0:250);
  document.getElementById('hdT').innerHTML=`${c.name}<small><span ${priceAttr(c.gel,c.usd)}></span> / დღე</small>`;
  document.getElementById('sideN').innerHTML=`<b>${String(FLEET.indexOf(c)+1).padStart(2,'0')}</b>/ 10`;
  paintPrices();schedule();
}
function schedule(){clearTimeout(timer);if(reduce||paused)return;timer=setTimeout(()=>show(cur+1),DUR)}
[bar,hdD].forEach(b=>b.addEventListener('click',e=>{const x=e.target.closest('button');if(x)show([...b.children].indexOf(x))}));
hero.addEventListener('mouseenter',()=>{paused=true;hero.classList.add('paused');clearTimeout(timer)});
hero.addEventListener('mouseleave',()=>{paused=false;hero.classList.remove('paused');schedule()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else schedule()});
Gallery.swipe(heroR,d=>show(cur+d));
window.__hero={show,get i(){return cur},get label(){return SLIDES[cur].lbl}};
/* ---------- ავტოპარკი: ბარათები ფოტო-გალერეით ---------- */
const order=['car1','car6','car7','car3','car4','car10','car5','car8','car2','car9'];
const imgOver={car1:'media/car1/01.jpg',car10:'media/car10/04.jpg',car9:'media/car9/11.jpg'};
const big={car1:'big',car10:'big r'};
const startIdx=c=>Math.max(0,c.imgs.indexOf(imgOver[c.id]||c.img));
document.getElementById('fleetGrid').innerHTML=order.map(id=>{const c=byId(id),i=FLEET.indexOf(c)+1,s=startIdx(c);
  return `<article class="c ${big[c.id]||''}" data-car="${c.id}" data-i="${s}">
<div class="gimg">${c.imgs.map((src,k)=>`<img src="${src}" alt="${c.name} — ფოტო ${k+1}" class="${k===s?'on':''}" ${k===s?'':'loading="lazy"'}>`).join('')}</div>
<span class="no"><b>${String(i).padStart(2,'0')}</b> / 10</span><span class="gcnt">${s+1} / ${c.imgs.length}</span>
<button type="button" class="bkb" data-car="${c.id}">ჯავშანი →</button><button type="button" class="gall" data-car="${c.id}" aria-label="${c.name} — ყველა ფოტო">⛶ ფოტოები</button>
<div class="gnav"><button type="button" class="gbtn p" aria-label="წინა ფოტო">←</button><button type="button" class="gbtn n" aria-label="შემდეგი ფოტო">→</button></div>
<div class="info"><div><h3>${c.name}</h3><div class="sp">${c.year} · ${c.hp} ცხ.ძ. · ${c.fuel}</div><a class="more" href="car.html?id=${c.id}">დეტალები →</a></div>
<div class="pr">${c.oldGel?`<s ${priceAttr(c.oldGel,c.oldUsd)}></s>`:''}<b ${priceAttr(c.gel,c.usd)}></b><span>/ დღე</span></div></div></article>`}).join('');
function step(card,d){const c=byId(card.dataset.car),n=c.imgs.length,i=(+card.dataset.i+d+n)%n;card.dataset.i=i;
  card.querySelectorAll('.gimg img').forEach((im,k)=>im.classList.toggle('on',k===i));card.querySelector('.gcnt').textContent=`${i+1} / ${n}`}
const grid=document.getElementById('fleetGrid');
grid.addEventListener('click',e=>{const card=e.target.closest('.c');if(!card)return;
  if(e.target.closest('.gbtn')){e.stopPropagation();step(card,e.target.closest('.gbtn').classList.contains('n')?1:-1);return}
  if(e.target.closest('.gall')){const c=byId(card.dataset.car);Gallery.open(c.imgs,+card.dataset.i,c.name,i=>{card.dataset.i=i;step(card,0)});return}
  if(e.target.closest('.bkb')){booking.select(card.dataset.car);document.getElementById('book').scrollIntoView({behavior:reduce?'auto':'smooth'});return}
  if(e.target.closest('a'))return;
  location.href='car.html?id='+card.dataset.car});
grid.querySelectorAll('.c').forEach(card=>Gallery.swipe(card,d=>step(card,d)));
/* ---------- marquee + reveal ---------- */
const names=FLEET.map(c=>`<span>${c.name.toUpperCase()}</span><span class="s">✦</span>`).join('');
document.getElementById('mq').innerHTML=names+names;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
/* ---------- ჯავშანი (?car=carN — წინასწარ არჩეული) ---------- */
const q=new URLSearchParams(location.search).get('car');
const booking=initBooking({car:byId(q)?q:'car1'});
show(0);paintPrices();
if(q&&byId(q)&&location.hash==='#book')setTimeout(()=>document.getElementById('book').scrollIntoView(),50);
})();
