/* ფოტო-გალერეა / lightbox (ისრები, მინიატურები, სვაიპი, კლავიატურა) */
(function(){
let lb,st={imgs:[],i:0,name:''},lastFocus=null;
function build(){
  lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','ფოტოები');
  lb.innerHTML=`<div class="lb-top"><h4><span class="nm"></span><span class="ct"></span></h4><button type="button" class="lb-x" aria-label="დახურვა">✕</button></div>
  <div class="lb-main"><button type="button" class="gbtn p" aria-label="წინა ფოტო">←</button><img alt=""><button type="button" class="gbtn n" aria-label="შემდეგი ფოტო">→</button></div>
  <div class="lb-th"></div>`;
  document.body.appendChild(lb);
  lb.querySelector('.lb-x').onclick=close;
  lb.querySelector('.gbtn.p').onclick=()=>go(st.i-1);
  lb.querySelector('.gbtn.n').onclick=()=>go(st.i+1);
  lb.querySelector('.lb-th').addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(+b.dataset.i)});
  lb.querySelector('.lb-main').addEventListener('click',e=>{if(e.target.classList.contains('lb-main'))close()});
  swipe(lb.querySelector('.lb-main'),d=>go(st.i+d));
  document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();else if(e.key==='ArrowLeft')go(st.i-1);else if(e.key==='ArrowRight')go(st.i+1)});
}
function go(i){const n=st.imgs.length;st.i=(i+n)%n;
  const im=lb.querySelector('.lb-main img');im.src=st.imgs[st.i];im.alt=`${st.name} — ფოტო ${st.i+1}`;
  lb.querySelector('.ct').textContent=`${st.i+1} / ${n}`;
  lb.querySelectorAll('.lb-th button').forEach((b,k)=>{b.classList.toggle('on',k===st.i);if(k===st.i)b.scrollIntoView({block:'nearest',inline:'center'})});
  if(st.onChange)st.onChange(st.i)}
function open(imgs,i,name,onChange){if(!lb)build();lastFocus=document.activeElement;
  st={imgs,i:i||0,name,onChange};lb.querySelector('.nm').textContent=name;
  lb.querySelector('.lb-th').innerHTML=imgs.map((s,k)=>`<button type="button" data-i="${k}" aria-label="ფოტო ${k+1}"><img src="${s}" alt="" loading="lazy"></button>`).join('');
  lb.classList.add('open');document.body.style.overflow='hidden';go(st.i);lb.querySelector('.lb-x').focus()}
function close(){lb.classList.remove('open');document.body.style.overflow='';if(lastFocus)lastFocus.focus()}
function swipe(el,cb){let x0=null,y0=null;
  el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  el.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))cb(dx<0?1:-1);x0=null},{passive:true})}
window.Gallery={open,swipe};
})();
