/* JANO MOTORS — ძრავის ხმის დროებითი (სადემონსტრაციო) სინთეზატორი.
   ეს არ არის ნამდვილი ჩანაწერი: ხმა გენერირდება Web Audio-თი ძრავის ტიპის მიხედვით
   (ცილინდრების რაოდენობა, უქმი სვლის ბრუნები, დიზელი/ელექტრო).
   როგორც კი data.js-ში მანქანის "sound" ველში ნამდვილი ფაილის გზა ჩაიწერება,
   car.js ამ სინთეზატორს აღარ გამოიყენებს. */
(function(){
// cyl — ცილინდრები · idle/rev — ბრუნები · rumble — დაბალი „ბურბული“ · bright — ტემბრის სიმკვეთრე · noise — მექანიკური ხმაური
const PROFILES={
  car1:{ev:true,vol:.5},                                                        // Porsche Taycan 4 — ელექტრო
  car2:{cyl:8,idle:750,rev:4200,rumble:.9,bright:.55,noise:.25,drive:3.2,vol:.8},  // G63 AMG — 4.0 V8 ბიტურბო
  car3:{cyl:4,idle:800,rev:3600,rumble:.22,bright:.6,noise:.22,drive:1.8,vol:.6},  // Evoque — 2.0 ტურბო
  car4:{cyl:4,idle:760,rev:3200,rumble:.18,bright:.5,noise:.2,drive:1.5,vol:.5},   // GLC 200 — 2.0 R4
  car5:{cyl:6,idle:750,rev:4600,rumble:.3,bright:.7,noise:.2,drive:2.4,vol:.7},    // E53 AMG — 3.0 R6
  car6:{cyl:6,idle:750,rev:4600,rumble:.5,bright:.65,noise:.25,drive:2.6,vol:.72}, // Mustang — 3.7 V6
  car7:{cyl:6,idle:700,rev:3800,rumble:.45,bright:.5,noise:.28,drive:2.2,vol:.65}, // Tacoma TRD — 3.5 V6
  car8:{cyl:6,idle:650,rev:2800,rumble:.4,bright:.4,noise:.6,drive:2,vol:.65,diesel:true}, // Land Cruiser 300 — 3.3 V6 დიზელი
  car9:{cyl:8,idle:800,rev:5000,rumble:.7,bright:.75,noise:.22,drive:3.4,vol:.8},  // M8 Competition — 4.4 V8
  car10:{cyl:8,idle:720,rev:4300,rumble:.95,bright:.55,noise:.25,drive:3.3,vol:.8} // G63 AMG — 4.0 V8 + სტარტერ-გენერატორი
};
const DEFAULT={cyl:4,idle:800,rev:3500,rumble:.25,bright:.55,noise:.22,drive:1.8,vol:.6};

function noiseBuf(ctx){
  const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
function curve(k){const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=Math.tanh(x*k)}return c}

function buildEngine(ctx,p,out,t0){
  const k=p.cyl/120;                       // აალების სიხშირე (ჰც) ერთ ბრ/წთ-ზე
  const rpm=ctx.createConstantSource();rpm.offset.value=0;
  const bus=ctx.createGain();rpm.connect(bus);
  const lfo=ctx.createOscillator();lfo.frequency.value=5.3;const lg=ctx.createGain();lg.gain.value=p.idle*.012;lfo.connect(lg).connect(bus);
  const pre=ctx.createGain();pre.gain.value=.5;
  const sh=ctx.createWaveShaper();sh.curve=curve(p.drive);sh.oversample='2x';
  const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;lp.Q.value=.8;
  const lpg=ctx.createGain();lpg.gain.value=p.bright;bus.connect(lpg).connect(lp.frequency);
  const eng=ctx.createGain();eng.gain.value=0;
  pre.connect(sh).connect(lp).connect(eng).connect(out);
  const nodes=[rpm,lfo];
  const osc=(type,mult,gain,dest)=>{const o=ctx.createOscillator();o.type=type;o.frequency.value=0;
    const fg=ctx.createGain();fg.gain.value=k*mult;bus.connect(fg).connect(o.frequency);
    const og=ctx.createGain();og.gain.value=gain;o.connect(og).connect(dest);nodes.push(o);return o};
  osc('sawtooth',1,.5,pre);                // აალების ძირითადი ტონი
  osc('sawtooth',.5,p.rumble,pre);         // ნახევარი რიგი — „ბურბული“
  if(p.cyl===8)osc('square',.25,p.rumble*.45,pre); // V8-ის არათანაბარი პულსი
  osc('triangle',2,.14,pre);
  // მექანიკური ხმაური, აალების რიტმში მოდულირებული (დიზელზე — კაკუნი)
  const ns=ctx.createBufferSource();ns.buffer=noiseBuf(ctx);ns.loop=true;
  const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=p.diesel?2200:1100;bp.Q.value=p.diesel?1.2:.7;
  const ng=ctx.createGain();ng.gain.value=p.noise*.5;
  const mg=ctx.createGain();mg.gain.value=p.noise*(p.diesel?.9:.4);osc('square',1,1,mg);mg.connect(ng.gain);
  ns.connect(bp).connect(ng).connect(p.diesel?eng:pre);nodes.push(ns);
  // სტარტერი
  const st=ctx.createOscillator();st.type='sawtooth';st.frequency.value=p.diesel?300:410;
  const sbp=ctx.createBiquadFilter();sbp.type='bandpass';sbp.frequency.value=900;sbp.Q.value=2;
  const sg=ctx.createGain();sg.gain.value=0;
  const sl=ctx.createOscillator();sl.type='square';sl.frequency.value=p.diesel?7:9;const slg=ctx.createGain();slg.gain.value=.05;sl.connect(slg).connect(sg.gain);
  st.connect(sbp).connect(sg).connect(out);nodes.push(st,sl);
  const crank=p.diesel?1.0:.7,tc=t0+crank,R=rpm.offset,E=eng.gain;
  sg.gain.setValueAtTime(.12,t0);sg.gain.setValueAtTime(.12,tc);sg.gain.linearRampToValueAtTime(0,tc+.08);
  // ბრუნების სცენარი: დაქოქვა → უქმი სვლა → 2 გაზი → უქმი სვლა
  R.setValueAtTime(230,t0);E.setValueAtTime(.18,t0);
  R.setValueAtTime(230,tc);E.setValueAtTime(.18,tc);
  R.linearRampToValueAtTime(p.idle*1.9,tc+.25);E.linearRampToValueAtTime(1,tc+.2);
  R.setTargetAtTime(p.idle,tc+.3,.35);
  const r1=tc+2.6;
  R.setValueAtTime(p.idle,r1);R.linearRampToValueAtTime(p.rev*.8,r1+.35);R.setTargetAtTime(p.idle,r1+.4,.3);
  const r2=r1+1.7;
  R.setValueAtTime(p.idle,r2);R.linearRampToValueAtTime(p.rev,r2+.4);R.setValueAtTime(p.rev,r2+.7);R.setTargetAtTime(p.idle,r2+.7,.4);
  nodes.forEach(n=>n.start(t0));
  return r2+3.2-t0; // ხანგრძლივობა წამებში
}

function buildEV(ctx,p,out,t0){
  const g=ctx.createGain();g.gain.value=0;g.connect(out);
  const f=ctx.createConstantSource();f.offset.value=0;const nodes=[f];
  const osc=(type,mult,gain,dest)=>{const o=ctx.createOscillator();o.type=type;o.frequency.value=0;
    const fg=ctx.createGain();fg.gain.value=mult;f.connect(fg).connect(o.frequency);
    const og=ctx.createGain();og.gain.value=gain;o.connect(og).connect(dest||g);nodes.push(o)};
  osc('sine',1,.35);osc('sine',1.5,.14);osc('sine',2.01,.1);
  const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=500;lp.connect(g);osc('sawtooth',.25,.3,lp);
  const ns=ctx.createBufferSource();ns.buffer=noiseBuf(ctx);ns.loop=true;
  const hp=ctx.createBiquadFilter();hp.type='bandpass';hp.frequency.value=3000;hp.Q.value=.5;
  const ng=ctx.createGain();ng.gain.value=0;ns.connect(hp).connect(ng).connect(g);nodes.push(ns);
  const F=f.offset,G=g.gain,N=ng.gain;
  F.setValueAtTime(160,t0);G.setValueAtTime(0,t0);G.linearRampToValueAtTime(.5,t0+.4);
  F.exponentialRampToValueAtTime(1050,t0+3.2);N.setValueAtTime(0,t0);N.linearRampToValueAtTime(.12,t0+3.2);
  F.setValueAtTime(1050,t0+3.8);F.exponentialRampToValueAtTime(170,t0+6);N.linearRampToValueAtTime(0,t0+6);
  G.setValueAtTime(.5,t0+5.2);G.linearRampToValueAtTime(0,t0+6.2);
  nodes.forEach(n=>n.start(t0));
  return 6.3;
}

window.EngineSynth={
  play(id,onEnd){
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
    const p=PROFILES[id]||DEFAULT,ctx=new AC();
    if(ctx.state==='suspended')ctx.resume();
    const t0=ctx.currentTime+.06;
    const master=ctx.createGain();master.gain.value=p.vol;
    const comp=ctx.createDynamicsCompressor();master.connect(comp).connect(ctx.destination);
    const dur=p.ev?buildEV(ctx,p,master,t0):buildEngine(ctx,p,master,t0);
    let done=false,timer;
    const finish=()=>{if(done)return;done=true;clearTimeout(timer);ctx.close().catch(()=>{});onEnd&&onEnd()};
    if(!p.ev){master.gain.setValueAtTime(p.vol,t0+dur-.9);master.gain.linearRampToValueAtTime(0,t0+dur-.05)}
    timer=setTimeout(finish,(dur+.1)*1000);
    return{stop(){if(done)return;const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(0,t+.15);clearTimeout(timer);timer=setTimeout(finish,200)}};
  }
};
})();
