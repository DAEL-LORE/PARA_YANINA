const BASE = {x:242, y:420};          
const FLORES = [
  {x:214, y:86,  rot:-8,  s:.98, d:.2},
  {x:302, y:68,  rot: 7,  s:1.00, d:.7},
  {x:258, y:44,  rot: 1,  s:.90, d:.4},
  {x:258, y:136, rot:-2,  s:.90, d:1.3},
  {x:180, y:120, rot:-16, s:.88, d:1.0},
  {x:334, y:118, rot: 17, s:.86, d:1.6},
  {x:158, y:208, rot:-18, s:.94, d:1.9},
  {x:206, y:216, rot:-9,  s:.84, d:2.5},
  {x:312, y:198, rot: 13, s:.96, d:1.4},
  {x:348, y:214, rot: 20, s:.88, d:2.1},
  {x:130, y:246, rot:-27, s:.80, d:2.8},
  {x:378, y:238, rot: 27, s:.78, d:2.3},
  {x:238, y:188, rot: 3,  s:.86, d:3.0}
];

const NS = 'http://www.w3.org/2000/svg';
const gTallos = document.getElementById('tallos');
const gHojas  = document.getElementById('hojas');
const gFlores = document.getElementById('flores');

const bezier   = (p0,p1,p2,t)=>({x:(1-t)*(1-t)*p0.x+2*(1-t)*t*p1.x+t*t*p2.x,
                                 y:(1-t)*(1-t)*p0.y+2*(1-t)*t*p1.y+t*t*p2.y});
const tangente = (p0,p1,p2,t)=>({x:2*(1-t)*(p1.x-p0.x)+2*t*(p2.x-p1.x),
                                 y:2*(1-t)*(p1.y-p0.y)+2*t*(p2.y-p1.y)});

FLORES.forEach((f,i)=>{
  const fin  = {x:f.x, y:f.y+6};
  const ctrl = {x:(BASE.x+fin.x)/2 + (fin.x-BASE.x)*0.40, y:(BASE.y+fin.y)/2 + 26};

  const tallo = document.createElementNS(NS,'path');
  tallo.setAttribute('d', `M${BASE.x},${BASE.y} Q${ctrl.x.toFixed(1)},${ctrl.y.toFixed(1)} ${fin.x},${fin.y}`);
  tallo.setAttribute('stroke','url(#gTallo)');
  tallo.setAttribute('stroke-width',(4.6*f.s).toFixed(1));
  tallo.setAttribute('stroke-linecap','round');
  tallo.setAttribute('fill','none');
  gTallos.appendChild(tallo);

  [0.34, 0.56, 0.78].forEach((t,k)=>{
    if((i+k)%3===0 && k===2) return;
    const p  = bezier(BASE,ctrl,fin,t);
    const tg = tangente(BASE,ctrl,fin,t);
    const ang  = Math.atan2(tg.y,tg.x)*180/Math.PI;
    const lado = ((i+k)%2===0) ? 1 : -1;
    const esc  = (0.78 + 0.22*Math.random()) * f.s;
    const hoja = document.createElementNS(NS,'g');
    hoja.setAttribute('transform',
      `translate(${p.x.toFixed(1)},${p.y.toFixed(1)}) rotate(${(ang + lado*44).toFixed(1)}) scale(${(lado*esc).toFixed(2)},${esc.toFixed(2)})`);
    hoja.innerHTML =
      `<path d="M0,0 C15,-14 42,-16 58,-4 C42,11 15,11 0,0 Z" fill="url(#gHoja)"/>
       <path d="M2,-1 C19,-7 40,-8 54,-4" fill="none" stroke="#a8d48c" stroke-opacity=".45" stroke-width="1.6"/>`;
    gHojas.appendChild(hoja);
  });

  const sitio = document.createElementNS(NS,'g');
  sitio.setAttribute('transform', `translate(${f.x},${f.y+8}) rotate(${f.rot}) scale(${f.s})`);
  const flor = document.createElementNS(NS,'use');
  flor.setAttribute('href','#tulipan');
  flor.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','#tulipan');
  flor.setAttribute('class','flor');
  flor.style.animationDelay    = f.d+'s';
  flor.style.animationDuration = (5.4 + i*0.3)+'s';
  sitio.appendChild(flor);
  gFlores.appendChild(sitio);
});

const cielo = document.getElementById('cielo');
(function estrellas(n){
  const frag = document.createDocumentFragment();
  for(let i=0;i<n;i++){
    const e = document.createElement('div');
    e.className = 'estrella';
    const r = Math.random()*2 + 0.7;
    e.style.width = e.style.height = r.toFixed(1)+'px';
    e.style.left = (Math.random()*100).toFixed(2)+'%';
    e.style.top  = (Math.random()*100).toFixed(2)+'%';
    e.style.setProperty('--d',(2.5+Math.random()*4).toFixed(1)+'s');
    e.style.setProperty('--r',(Math.random()*4).toFixed(1)+'s');
    e.style.opacity = .3;
    frag.appendChild(e);
  }
  cielo.appendChild(frag);
})(130);

let lluviaOn = true;
setInterval(()=>{
  if(!lluviaOn) return;
  const c = document.createElement('div');
  c.className = 'chispa';
  c.style.left = (26 + Math.random()*48).toFixed(1)+'%';
  c.style.top  = (28 + Math.random()*36).toFixed(1)+'%';
  c.style.setProperty('--d',(6+Math.random()*5).toFixed(1)+'s');
  c.style.setProperty('--x', ((Math.random()-.5)*70).toFixed(0)+'px');
  c.style.width = c.style.height = (4+Math.random()*6).toFixed(1)+'px';
  cielo.appendChild(c);
  setTimeout(()=>c.remove(), 12000);
}, 430);

document.getElementById('btnLluvia').addEventListener('click', e=>{
  lluviaOn = !lluviaOn;
  e.currentTarget.textContent = lluviaOn ? '✨ Destellos' : '✨ Apagado';
});

const CANCION_BRUNO_MARS = "when I was your man-Bruno-Mars.mp3"; 

const audio = new Audio(CANCION_BRUNO_MARS);
audio.loop = true; 

const btnMusica = document.getElementById('btnMusica');
let sonando = false;

function reproducir(){
  audio.play().then(() => {
    sonando = true;
    if (btnMusica) btnMusica.textContent = '❚❚ Pausar';
  }).catch(err => {
    console.log("El navegador bloqueó el audio:", err);
  });
}

function pausar(){
  audio.pause();
  sonando = false;
  if (btnMusica) btnMusica.textContent = '♫ When I Was Your Man';
}

if (btnMusica) {
  btnMusica.addEventListener('click', ()=> sonando ? pausar() : reproducir());
}

document.getElementById('abrir').addEventListener('click', () => {
  document.getElementById('portada').classList.add('oculto');
  
  reproducir();
  
  setTimeout(() => {
    document.getElementById('cta').classList.add('mostrar');
  }, 3500);
});

const cta = document.getElementById('cta');
const dim = document.getElementById('dim');
const reveal = document.getElementById('reveal');
const closeBtn = document.getElementById('closeBtn');

function spawnSparks(){
  for (let i = 0; i < 16; i++){
    const s = document.createElement('div');
    s.className = 'spark';
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 90;
    s.style.setProperty('--sx', (Math.cos(angle) * dist).toFixed(0) + 'px');
    s.style.setProperty('--sy', (Math.sin(angle) * dist).toFixed(0) + 'px');
    s.style.left = (45 + Math.random() * 10) + '%';
    s.style.top = (40 + Math.random() * 10) + '%';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
}

cta.addEventListener('click', () => {
  dim.classList.add('show');
  reveal.classList.add('show');
  cta.style.opacity = '0';
  cta.style.pointerEvents = 'none';
  spawnSparks();
});

function cerrarReveal(){
  dim.classList.remove('show');
  reveal.classList.remove('show');
  cta.style.opacity = '';
  cta.style.pointerEvents = '';
}

closeBtn.addEventListener('click', cerrarReveal);
dim.addEventListener('click', cerrarReveal);

document.addEventListener('visibilitychange', ()=>{ 
  if(document.hidden && sonando) pausar(); 
});
setTimeout(() => {
  const estilo = document.createElement('style');
  estilo.innerHTML = `
    @keyframes flotarSuave {
      0% { transform: translate(-50%, -50%) translateY(0px) rotate(var(--rot)); }
      100% { transform: translate(-50%, -50%) translateY(-20px) rotate(calc(var(--rot) + 2deg)); }
    }
  `;
  document.head.appendChild(estilo);

  const ramoPrincipal = document.getElementById('ramo');
  const contenedorFondo = document.createElement('div');
  contenedorFondo.style.position = 'fixed';
  contenedorFondo.style.top = '0';
  contenedorFondo.style.left = '0';
  contenedorFondo.style.width = '100vw';
  contenedorFondo.style.height = '100vh';
  contenedorFondo.style.pointerEvents = 'none';
  contenedorFondo.style.zIndex = '1'; 
  document.body.appendChild(contenedorFondo);

  const CANTIDAD_DE_RAMOS = 20;

  const zonas = [
    { xMin: 0, xMax: 25, yMin: 0, yMax: 100 },
    { xMin: 75, xMax: 100, yMin: 0, yMax: 100 },
    { xMin: 25, xMax: 75, yMin: -5, yMax: 20 },
    { xMin: 25, xMax: 75, yMin: 80, yMax: 105 }
  ];

  for(let i = 0; i < CANTIDAD_DE_RAMOS; i++) {
    const clon = ramoPrincipal.cloneNode(true);
    clon.removeAttribute('id'); 
    
    const escala = 0.08 + Math.random() * 0.12; 
    clon.style.position = 'absolute';
    
    const zona = zonas[i % zonas.length];
    const posX = zona.xMin + Math.random() * (zona.xMax - zona.xMin);
    const posY = zona.yMin + Math.random() * (zona.yMax - zona.yMin);
    
    clon.style.left = posX + 'vw';
    clon.style.top = posY + 'vh';
    clon.style.width = (484 * escala) + 'px';
    clon.style.height = (660 * escala) + 'px';
    
    const rotacion = (Math.random() - 0.5) * 80; 
    clon.style.setProperty('--rot', rotacion + 'deg');
    clon.style.transform = `translate(-50%, -50%) rotate(${rotacion}deg)`;
    
    clon.style.opacity = (0.15 + Math.random() * 0.25).toFixed(2);
    
    const duracion = (4 + Math.random() * 3).toFixed(1);
    const retraso = (Math.random() * 2).toFixed(1);
    clon.style.animation = `flotarSuave ${duracion}s ease-in-out ${retraso}s infinite alternate`;
    
    contenedorFondo.appendChild(clon);
  }
}, 100);