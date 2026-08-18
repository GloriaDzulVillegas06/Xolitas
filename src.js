let players = [];

function Crest({ small = false } = {}) {
  return `<div class="crest ${small ? 'crest--small' : ''}">
    <img src="./assets/xolitas-crest.png" alt="Escudo oficial de Xolitas F.C." width="1230" height="1279">
  </div>`;
}

function renderSite(){
const matches=window.Xolitas.matchesService.all(),next=matches.filter(m=>m.estado==='programado').sort((a,b)=>String(a.fecha).localeCompare(String(b.fecha)))[0],last=matches.filter(m=>m.estado==='finalizado').sort((a,b)=>String(b.fecha).localeCompare(String(a.fecha)))[0];
const dateText=m=>m?new Intl.DateTimeFormat('es-MX',{weekday:'short',day:'numeric',month:'short'}).format(new Date(m.fecha+'T12:00:00'))+' · '+m.hora:'Por definir';
document.querySelector('#app').className='';document.querySelector('#app').innerHTML = `
  <nav class="nav">
    <a href="#inicio" class="brand" aria-label="Xolitas inicio">${Crest({ small: true })}<span>XOLITAS <b>F.C.</b></span></a>
    <button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
    <div class="nav__links"><a href="#plantilla">Plantilla</a><a href="#goleadoras">Goleadoras</a><a href="#club">El club</a><a href="./admin/login.html">Acceso</a><a class="live-link" href="./admin/partido.html"><i></i> Modo partido</a></div>
  </nav>

  <main>
    <section class="hero" id="inicio">
      <div class="hero__stars" aria-hidden="true">✦　·　✧　·　✦</div>
      <div class="hero__crest">${Crest()}</div>
      <div class="hero__copy"><span class="eyebrow">Orgullo · Fuerza · Comunidad</span><h1>XOLITAS<br><em>F.C.</em></h1><p>Una misma cancha.<br>Una sola manada.</p><a class="button button--gold" href="#plantilla">Ver plantilla <span>↗</span></a></div>
      <div class="match-strip">
        <article><span>Próximo partido</span><strong>XOLITAS <small>VS</small> ${next?.rival?.toUpperCase()||'POR DEFINIR'}</strong><p>${dateText(next)}</p></article>
        <div class="match-strip__divider"></div>
        <article class="last"><span>Último resultado</span><strong>${last?`XOLITAS <b>${last.golesXolitas} — ${last.golesRival}</b> ${last.rival.toUpperCase()}`:'AÚN SIN RESULTADOS'}</strong><p>${last?`${last.torneo||'Liga'} · Jornada ${last.jornada||'—'}`:''}</p></article>
      </div>
    </section>

    <section class="team section" id="plantilla">
      <header class="section__head"><div><span class="eyebrow dark">Temporada 2026</span><h2>NUESTRA <em>MANADA</em></h2></div><p>Talento, carácter y corazón.<br>Conoce a quienes defienden nuestros colores.</p></header>
      <div class="players">${players.map((p, i) => `<article class="player" tabindex="0" style="--photo:${i}"><div class="player__photo"></div><div class="player__shade"></div><span class="player__number">${String(p.number).padStart(2, '0')}</span><div class="player__info"><small>${p.position}</small><h3>${p.name}<br><b>${p.last}</b></h3><p><span>⚽</span> ${p.goals} goles</p></div></article>`).join('')}</div>
      <a href="#plantilla" class="text-link">Conoce a todo el equipo <span>→</span></a>
    </section>

    <section class="scorers section" id="goleadoras">
      <div class="scorers__intro"><span class="eyebrow">El gol tiene nombre</span><h2>LAS QUE<br><em>DEFINEN.</em></h2><p>Precisión, instinto y una ambición que no negocia.</p><div class="season">${next?.torneo||last?.torneo||'Xolitas F.C.'}</div></div>
      <div class="ranking">
        ${players.slice(0,3).map((p,i) => `<article class="rank rank--${i+1}"><span class="rank__place">0${i+1}</span><div class="rank__avatar" style="--photo:${p.photo}"></div><div><small>${p.position}</small><h3>${p.name} ${p.last}</h3></div><strong>${p.goals}<small>GOLES</small></strong>${i===0?'<span class="rank__star">✦</span>':''}</article>`).join('')}
      </div>
    </section>

    <section class="statement" id="club"><span>NO SOLO JUGAMOS.</span><h2>DEJAMOS <em>HUELLA.</em></h2><div class="paw">✦</div></section>

    <section class="next section"><div><span class="eyebrow dark">Próximo encuentro</span><p class="date">${dateText(next).toUpperCase()}</p></div><div class="versus"><div>${Crest({small:true})}<strong>XOLITAS</strong></div><span>VS</span><img class="rival-logo" src="${next?.logoRival||'./assets/default-rival.svg'}" alt="Escudo de ${next?.rival||'equipo rival'}" onerror="this.onerror=null;this.src='./assets/default-rival.svg'"><div><strong>${next?.rival?.toUpperCase()||'POR DEFINIR'}</strong><small>F.C.</small></div></div><a class="button button--purple" href="./admin/partido.html${next?`?id=${encodeURIComponent(next.id)}`:''}">Iniciar modo partido <span>↗</span></a></section>
  </main>

  <footer><div class="brand">${Crest({small:true})}<span>XOLITAS <b>F.C.</b></span></div><p>Hechas de historia.<br>Jugamos el presente.</p><div><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Contacto</a></div><small>© 2026 Xolitas F.C.</small></footer>

  <dialog class="match-modal">
    <button class="match-close" aria-label="Cerrar">×</button><div class="live"><i></i> EN VIVO</div>
    <div class="score-teams"><div>${Crest({small:true})}<strong>XOLITAS</strong></div><span class="score"><b id="home-score">2</b><em>—</em><b>1</b></span><div class="rival-badge">P</div><strong>PANTERAS</strong></div>
    <div class="clock">38:24</div><button class="goal-button">⚽ &nbsp; GOL XOLITAS</button><p class="match-hint">Toca para registrar un gol</p>
    <div class="goal-flash"><span>✦</span><small>¡GOOOOOOL!</small><h2>JESSICA</h2><b>#10</b></div>
  </dialog>
`;

const modal = document.querySelector('.match-modal');
document.querySelectorAll('[data-open-match]').forEach(b => b.addEventListener('click', () => modal.showModal()));
document.querySelector('.match-close').addEventListener('click', () => modal.close());
document.querySelector('.goal-button').addEventListener('click', () => {
  const score = document.querySelector('#home-score'); score.textContent = Number(score.textContent) + 1;
  modal.classList.remove('is-goal'); void modal.offsetWidth; modal.classList.add('is-goal');
  setTimeout(() => modal.classList.remove('is-goal'), 2100);
});
const toggle = document.querySelector('.nav__toggle');
toggle.addEventListener('click', () => { const open = document.body.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded', open); });
document.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
}
window.Xolitas.ready.finally(()=>{players=window.Xolitas.playersService.all().filter(p=>p.activa).map((p,i)=>({name:p.nombre,last:p.apellido,number:p.numero,position:p.posicion,goals:+p.goles||0,photo:p.foto??i%4})).sort((a,b)=>b.goals-a.goals);renderSite()});
