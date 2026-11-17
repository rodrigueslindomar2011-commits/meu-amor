/* ===== EDITE AQUI ===== */
const CONFIG = {
  nomes: ['Lindomar', 'Heloisa'],
  inicio: '2025-07-07T20:30:00',
  musica: { arquivo: 'musicas/nossa-musica.mp3', titulo: 'Nossa música', artista: 'Lindomar & Heloisa' },
  boasVindas: 'Heloisa, preparei um pequeno universo para você...',
  fotos: [
    { src: 'imagens/foto1.jpg', legenda: 'Legenda 1' },
    { src: 'imagens/foto2.jpg', legenda: 'Legenda 2' },
    { src: 'imagens/foto3.jpg', legenda: 'Legenda 3' }
  ],
  saudacao: 'Minha Heloisa,',
  carta: [
    'Aqui vai a nossa história. Me conte como tudo começou e eu escrevo esta carta com você.',
    'Cada parágrafo vira uma linha da carta.'
  ],
  assinatura: 'Com todo o meu amor,<br>Lindomar'
};
/* ======================= */
const $ = id => document.getElementById(id);

$('nomes').innerHTML = `${CONFIG.nomes[0]} <span>♡</span> ${CONFIG.nomes[1]}`;
$('titulo').textContent = CONFIG.musica.titulo;
$('artista').textContent = CONFIG.musica.artista;
$('saudacao').textContent = CONFIG.saudacao;
$('textoCarta').innerHTML = CONFIG.carta.map(p => `<p>${p}</p>`).join('');
$('assinatura').innerHTML = CONFIG.assinatura;
$('assinatura').classList.add('ve0');
$('grade').innerHTML = CONFIG.fotos.map(f =>
  `<figure class="foto"><img src="${f.src}" alt="${f.legenda}" onerror="this.remove()"><span>${f.legenda}</span></figure>`).join('');

/* ===== ENTRADA ===== */
const cv = $('ceu'), cx = cv.getContext('2d');
let W, H, CY, estrelas = [], parts = [], faiscas = [], cadentes = [], petalas = [], t0 = performance.now(), parar = false, explodiu = false, saiu = 0, ultimoAnel = 0, aneis = [];
function medir(){
  const d = devicePixelRatio || 1;
  W = cv.clientWidth; H = cv.clientHeight; CY = H * .36;
  cv.width = W*d; cv.height = H*d; cx.setTransform(d,0,0,d,0,0);
  estrelas = Array.from({length:130}, () => ({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.5+.3, f:Math.random()*6, v:Math.random()*.6+.2, n:Math.random()*2500}));
  const N = 260, esc = Math.min(W, H) * .021;
  parts = Array.from({length:N}, (_, i) => {
    const a = i/N*Math.PI*2, hx = 16*Math.pow(Math.sin(a),3), hy = -(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a));
    const k = Math.random() < .35 ? Math.random()*.8 : 1;           // parte preenche o miolo
    return {x:Math.random()*W, y:Math.random()*H, tx:W/2+hx*esc*k, ty:CY+hy*esc*k, ph:Math.random()*6};
  });
}
medir(); addEventListener('resize', medir);

function explodir(){
  for (const p of parts) if (Math.random() < .45){
    const a = Math.random()*Math.PI*2, v = Math.random()*6+2;
    faiscas.push({x:p.tx, y:p.ty, vx:Math.cos(a)*v, vy:Math.sin(a)*v-1, vida:1, r:Math.random()*2+1});
  }
}
function quadro(now){
  if (parar) return;
  const t = now - t0;
  cx.clearRect(0,0,W,H);
  for (const s of estrelas){
    const a = Math.min(1, Math.max(0,(t-s.n)/1500)) * (.5+.5*Math.sin(t/700*s.v+s.f));
    cx.fillStyle = `rgba(255,240,245,${a})`; cx.beginPath(); cx.arc(s.x,s.y,s.r,0,7); cx.fill();
  }
  if (t > 1200 && Math.random() < .012) cadentes.push({x:Math.random()*W*.8, y:Math.random()*H*.3, vida:1});
  cadentes = cadentes.filter(c => c.vida > 0);
  for (const c of cadentes){
    c.x += 11; c.y += 5; c.vida -= .03;
    const g = cx.createLinearGradient(c.x-90, c.y-40, c.x, c.y);
    g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(1,`rgba(255,230,240,${c.vida})`);
    cx.strokeStyle = g; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(c.x-90,c.y-40); cx.lineTo(c.x,c.y); cx.stroke();
  }
  const k = Math.min(1, Math.max(0,(t-2500)/3300)), e = k*k*(3-2*k);
  const pulso = t > 6000 ? 1 + .05*Math.sin((t-6000)/230) : 1;
  if (t > 5900 && !explodiu){ explodiu = true; explodir(); $('iniciais').classList.add('vis'); }
  if (t > 6000 && t - ultimoAnel > 1300){ ultimoAnel = t; aneis.push({r:0, v:1}); }
  aneis = aneis.filter(a => a.v > 0);
  for (const a of aneis){
    a.r += 3.2; a.v -= .012;
    cx.strokeStyle = `rgba(244,166,184,${a.v*.6})`; cx.lineWidth = 2; cx.beginPath(); cx.arc(W/2, CY, a.r*2.2+30, 0, 7); cx.stroke();
  }
  if (explodiu){
    const g = cx.createRadialGradient(W/2,CY,0,W/2,CY,Math.min(W,H)*.45);
    g.addColorStop(0,'rgba(244,166,184,.28)'); g.addColorStop(1,'rgba(244,166,184,0)');
    cx.fillStyle = g; cx.fillRect(0,0,W,H);
  }
  cx.shadowColor = '#f4a6b8'; cx.shadowBlur = 12;
  for (const p of parts){
    const fl = (1-e)*9, x = p.x+(p.tx-p.x)*e+Math.sin(t/900+p.ph)*fl, y = p.y+(p.ty-p.y)*e+Math.cos(t/800+p.ph)*fl;
    const px = W/2+(x-W/2)*pulso, py = CY+(y-CY)*pulso;
    cx.fillStyle = `rgba(255,${190+Math.floor(e*40)},210,${Math.min(1,t/1500)*.95})`;
    cx.beginPath(); cx.arc(px,py,2.3,0,7); cx.fill();
  }
  faiscas = faiscas.filter(f => f.vida > 0);
  for (const f of faiscas){
    f.x += f.vx; f.y += f.vy; f.vx *= .97; f.vy = f.vy*.97 + .08; f.vida -= .014;
    cx.fillStyle = `rgba(255,215,160,${f.vida})`; cx.beginPath(); cx.arc(f.x,f.y,f.r,0,7); cx.fill();
  }
  cx.shadowBlur = 0;
  if (saiu){                                   // corações subindo ao entrar
    if (petalas.length < 90 && now - saiu < 900) for (let i=0;i<3;i++) petalas.push({x:Math.random()*W, y:H+20, v:Math.random()*4+2, s:Math.random()*22+12, o:Math.random()*6});
    cx.textAlign = 'center';
    for (const p of petalas){
      p.y -= p.v; p.x += Math.sin(p.y/40+p.o)*1.2;
      cx.font = p.s+'px serif'; cx.fillStyle = 'rgba(244,166,184,.85)'; cx.fillText('♥', p.x, p.y);
    }
  }
  requestAnimationFrame(quadro);
}
requestAnimationFrame(quadro);

setTimeout(() => {
  const el = $('boasvindas'); let i = 0; const txt = CONFIG.boasVindas;
  const dig = setInterval(() => { el.textContent = txt.slice(0, ++i); if (i >= txt.length) clearInterval(dig); }, 55);
}, 7200);
setTimeout(() => $('entrar').classList.add('vis'), 10500);

/* ===== MÚSICA ===== */
const au = $('audio'), pp = $('playpause'), pr = $('progresso');
au.src = CONFIG.musica.arquivo; au.volume = .8;
const fmt = s => isFinite(s) ? Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0') : '0:00';
function estado(on){ pp.textContent = on ? '❚❚' : '▶'; $('disco').classList.toggle('tocando', on); $('ondas').classList.toggle('tocando', on); }
function tocar(){ return au.play().then(() => $('aviso').textContent = '').catch(err => { if (err.name !== 'AbortError') $('aviso').textContent = 'Toque no ▶ para ouvir a música.'; }); }
pp.onclick = () => au.paused ? tocar() : au.pause();
au.onplay = () => estado(true); au.onpause = () => estado(false);
au.onerror = () => $('aviso').textContent = 'Não foi possível reproduzir "' + CONFIG.musica.arquivo + '". Confira se o arquivo existe, não está vazio e é um MP3 válido.';
au.ontimeupdate = () => { if (au.duration) pr.value = au.currentTime/au.duration*100; $('tempo').textContent = fmt(au.currentTime)+' / '+fmt(au.duration); };
au.onloadedmetadata = au.ontimeupdate;
pr.oninput = () => { if (au.duration) au.currentTime = pr.value/100*au.duration; };
$('volume').oninput = e => au.volume = e.target.value;

$('entrar').onclick = () => {
  tocar();                                      // precisa estar dentro do clique
  $('flash').classList.add('vai'); saiu = performance.now();
  document.body.classList.remove('travado');
  setTimeout(() => $('entrada').classList.add('saindo'), 350);
  setTimeout(() => { parar = true; $('entrada').remove(); }, 2400);
};

/* ===== CONTADOR ===== */
function contar(){
  const ini = new Date(CONFIG.inicio), ag = new Date();
  let a = ag.getFullYear()-ini.getFullYear(), m = ag.getMonth()-ini.getMonth(), d = ag.getDate()-ini.getDate();
  let h = ag.getHours()-ini.getHours(), mi = ag.getMinutes()-ini.getMinutes(), s = ag.getSeconds()-ini.getSeconds();
  if (s<0){s+=60;mi--} if (mi<0){mi+=60;h--} if (h<0){h+=24;d--}
  if (d<0){d+=new Date(ag.getFullYear(),ag.getMonth(),0).getDate();m--} if (m<0){m+=12;a--}
  $('contador').innerHTML = [[a,'anos'],[m,'meses'],[d,'dias'],[h,'horas'],[mi,'minutos'],[s,'segundos']].map(([v,l]) => `<div><b>${v}</b><small>${l}</small></div>`).join('');
}
contar(); setInterval(contar, 1000);

/* ===== PERGAMINHO: desenrola ao chegar ===== */
new IntersectionObserver((es, ob) => {
  if (!es[0].isIntersecting) return;
  ob.disconnect();
  $('selo').classList.add('balanca');
  $('fio').classList.add('aberto');
  document.querySelectorAll('.texto p').forEach((p, i) => setTimeout(() => p.classList.add('ve'), 1800 + i*1100));
}, {threshold:.3}).observe($('perg'));