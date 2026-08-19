let players = [];
let selectedLeagueId = '';
let selectedPosition = '';

function Crest({ small = false } = {}) {
  return `<div class="crest ${small ? 'crest--small' : ''}">
    <img src="./assets/xolitas-crest.png" alt="Escudo oficial de Xolitas F.C." width="1230" height="1279">
  </div>`;
}

function renderSite(){
const matches=window.Xolitas.matchesService.all(),today=new Date().toISOString().slice(0,10),live=matches.find(m=>m.estado==='jugando'),upcoming=matches.filter(m=>m.estado==='programado'||(m.estado==='descanso'&&String(m.fecha)>=today)).sort((a,b)=>String(a.fecha).localeCompare(String(b.fecha))),last=matches.filter(m=>m.estado==='finalizado').sort((a,b)=>String(b.fecha).localeCompare(String(a.fecha)))[0],nextEntry=live||upcoming[0],next=upcoming.find(m=>m.estado==='programado')||live;
const leagues=window.Xolitas.leaguesService.all(),selectedLeague=leagues.find(l=>String(l.id)===String(selectedLeagueId)),statPlayers=players.map(p=>({...p,goals:selectedLeagueId?+(p.goalsByLeague?.[selectedLeagueId]||0):p.goals})).sort((a,b)=>b.goals-a.goals),scorers=statPlayers.filter(p=>p.goals>0);
const visiblePlayers=selectedPosition?statPlayers.filter(p=>p.position===selectedPosition):statPlayers;
const dateText=m=>{if(!m)return 'Por definir';const date=new Date(String(m.fecha||'')+'T12:00:00');const day=Number.isNaN(date.getTime())?'Fecha por definir':new Intl.DateTimeFormat('es-MX',{weekday:'short',day:'numeric',month:'short'}).format(date);return `${day} · ${m.hora||'Hora por definir'}`};
document.querySelector('#app').className='';document.querySelector('#app').innerHTML = `
  <nav class="nav">
    <a href="#inicio" class="brand" aria-label="Xolitas inicio">${Crest({ small: true })}<span>XOLITAS <b>F.C.</b></span></a>
    <button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
    <div class="nav__links"><a href="#plantilla">Plantilla</a><a href="#goleadoras">Goleadoras</a><a href="#club">El club</a><a href="./admin/login.html">Acceso</a><a class="live-link" href="./admin/login.html?next=match"><i></i> Acceso modo partido</a></div>
  </nav>

  <main>
    <section class="hero" id="inicio">
      <div class="hero-paws" aria-hidden="true">${Array.from({length:18},(_,i)=>`<img class="hero-paw hero-paw--${i+1}" src="./assets/xolitas-paw.png" alt="">`).join('')}</div>
      <div class="hero__stars" aria-hidden="true">✦　·　✧　·　✦</div>
      <div class="hero__crest">${Crest()}</div>
      <div class="hero__copy"><span class="eyebrow">Orgullo · Fuerza · Comunidad</span><h1>XOLITAS<br><em>F.C.</em></h1><p>Una misma cancha.<br>Una sola manada.</p><a class="button button--gold" href="#plantilla">Ver plantilla <span>↗</span></a></div>
    </section>

    <section class="rounds section" id="jornadas"><header class="rounds__head"><div><span class="eyebrow dark">Calendario oficial</span><h2>HUELLAS EN <em>LA CANCHA</em></h2></div><p>Próximo desafío y resultado más reciente<br>sin perder de vista la temporada.</p></header><div class="rounds__grid">
      <article class="round-card round-card--next"><div class="round-card__top"><span>${nextEntry?.estado==='jugando'?'En vivo':'Próxima jornada'}</span><b>J${nextEntry?.jornada||'—'}</b></div>${nextEntry?.estado==='descanso'?`<div class="round-card__rest"><strong>DESCANSO</strong><p>${dateText(nextEntry)}</p></div>`:nextEntry?`<div class="round-card__teams"><strong>XOLITAS</strong><em>VS</em><strong>${(nextEntry.rival||'RIVAL').toUpperCase()}</strong></div><div class="round-card__details"><span>${dateText(nextEntry)}</span><span>${nextEntry.lugar||'Lugar por definir'}</span></div>`:'<div class="round-card__empty">Sin jornadas programadas</div>'}</article>
      <article class="round-card round-card--result"><div class="round-card__top"><span>Último resultado</span><b>J${last?.jornada||'—'}</b></div>${last?`<div class="round-card__teams"><strong>XOLITAS</strong><em class="round-score">${last.golesXolitas} — ${last.golesRival}</em><strong>${(last.rival||'RIVAL').toUpperCase()}</strong></div><div class="round-card__details"><span>${last.torneo||'Liga'}</span><span>${dateText(last)}</span></div>`:'<div class="round-card__empty">Aún sin resultados</div>'}</article>
    </div><button type="button" class="rounds__all" id="open-rounds">Ver todas las jornadas <span>→</span></button></section>
    <dialog class="journeys-modal" id="journeys-modal"><header><div><span class="eyebrow">Temporada 2026</span><h2>JORNADAS Y RESULTADOS</h2></div><button type="button" data-rounds-close aria-label="Cerrar">×</button></header><div class="journeys-modal__list">${[...matches].sort((a,b)=>String(a.fecha).localeCompare(String(b.fecha))).map(journeyRow).join('')}</div></dialog>

    <section class="team section" id="plantilla">
      <header class="section__head"><div><span class="eyebrow dark">Temporada 2026</span><h2>NUESTRA <em>MANADA</em></h2></div><p>Talento, carácter y corazón.<br>Conoce a quienes defienden nuestros colores.</p></header>
      <div class="position-filters" role="group" aria-label="Filtrar jugadoras por posición">${[['','Todas'],['Portera','Porteras'],['Defensa','Defensas'],['Mediocampista','Mediocampistas'],['Delantera','Delanteras']].map(([value,label])=>`<button type="button" data-position="${value}" class="${selectedPosition===value?'is-active':''}">${label}<span>${value?statPlayers.filter(p=>p.position===value).length:statPlayers.length}</span></button>`).join('')}</div>
      <div class="players players--all">${visiblePlayers.length?visiblePlayers.map((p, i) => playerCard(p,i,true)).join(''):'<p class="public-empty">No hay jugadoras en esta posición.</p>'}</div>
    </section>
    <dialog class="profile-modal" id="profile-modal"><button type="button" data-profile-close aria-label="Cerrar">×</button><div id="profile-content"></div></dialog>

    <section class="scorers section" id="goleadoras">
      <div class="scorers__intro"><span class="eyebrow">El gol tiene nombre</span><h2>LAS QUE<br><em>DEFINEN.</em></h2><p>Precisión, instinto y una ambición que no negocia.</p><label class="league-filter">Estadísticas de<select id="public-league"><option value="">Todas las ligas</option>${leagues.map(l=>`<option value="${l.id}" ${String(l.id)===String(selectedLeagueId)?'selected':''}>${l.nombre}</option>`).join('')}</select></label><div class="season">${selectedLeague?.nombre||'Histórico general'}</div></div>
      <div class="ranking">
        ${scorers.length?scorers.slice(0,3).map((p,i) => `<article class="rank rank--${i+1}"><span class="rank__place">0${i+1}</span><div class="rank__avatar" style="--photo:${p.photo}"></div><div><small>${p.position}</small><h3>${p.name} ${p.last}</h3></div><strong>${p.goals}<small>GOLES</small></strong>${i===0?'<span class="rank__star">✦</span>':''}</article>`).join(''):'<p class="public-empty public-empty--light">No hay goles registrados en esta liga.</p>'}
      </div>
    </section>

    <section class="statement" id="club"><span>NO SOLO JUGAMOS.</span><h2>DEJAMOS <em>HUELLA.</em></h2><div class="paw">✦</div></section>

    <section class="next section"><div><span class="eyebrow dark">${next?.estado==='jugando'?'Partido en vivo':'Próximo encuentro'}</span><p class="date">${next?dateText(next).toUpperCase():'SIN PARTIDOS PROGRAMADOS'}</p></div>${next?`<div class="versus"><div>${Crest({small:true})}<strong>XOLITAS</strong></div><span>VS</span><img class="rival-logo" src="${next.logoRival||'./assets/default-rival.svg'}" alt="Escudo de ${next.rival||'rival'}" onerror="this.onerror=null;this.src='./assets/default-rival.svg'"><div><strong>${(next.rival||'RIVAL').toUpperCase()}</strong><small>${next.estado==='jugando'?'EN VIVO':'F.C.'}</small></div></div><a class="button button--purple" href="./admin/login.html?next=match&matchId=${encodeURIComponent(next.id)}">${next.estado==='jugando'?'Continuar':'Acceder al'} modo partido <span>↗</span></a>`:'<div class="no-next-match">No hay encuentros registrados por el momento.</div>'}</section>
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
document.querySelector('#public-league')?.addEventListener('change',e=>{selectedLeagueId=e.target.value;renderSite();document.querySelector('#goleadoras')?.scrollIntoView()});
const profileModal=document.querySelector('#profile-modal');
document.querySelectorAll('[data-profile-close]').forEach(button=>button.addEventListener('click',()=>profileModal.close()));
document.querySelectorAll('[data-player-index]').forEach(card=>card.addEventListener('click',()=>openPlayerProfile(Number(card.dataset.playerIndex))));
document.querySelectorAll('[data-position]').forEach(button=>button.addEventListener('click',()=>{selectedPosition=button.dataset.position;renderSite();document.querySelector('#plantilla')?.scrollIntoView({behavior:'smooth'})}));
const journeysModal=document.querySelector('#journeys-modal');
document.querySelector('#open-rounds')?.addEventListener('click',()=>journeysModal.showModal());
document.querySelectorAll('[data-rounds-close]').forEach(button=>button.addEventListener('click',()=>journeysModal.close()));
}
function journeyRow(match){const isRest=match.estado==='descanso'||match.tipo==='descanso',isFinal=match.estado==='finalizado',isLive=match.estado==='jugando';const status=isRest?'DESCANSO':isFinal?'FINAL':isLive?'EN VIVO':'PRÓXIMO';return `<article class="journey-row journey-row--${match.estado||'programado'}"><div class="journey-row__number"><small>JORNADA</small><b>${match.jornada||'—'}</b></div><div class="journey-row__date"><strong>${dateForJourney(match.fecha)}</strong><span>${match.hora||'Hora por definir'}</span></div>${isRest?'<div class="journey-row__rest">DESCANSO</div>':`<div class="journey-row__match"><strong>XOLITAS</strong>${isFinal||isLive?`<b>${match.golesXolitas} — ${match.golesRival}</b>`:'<b>VS</b>'}<strong>${escapePublic((match.rival||'Rival').toUpperCase())}</strong></div>`}<span class="journey-row__status">${status}</span></article>`}
function dateForJourney(value){if(!value)return 'Fecha por definir';const date=new Date(String(value)+'T12:00:00');return Number.isNaN(date.getTime())?'Fecha por definir':new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short',year:'numeric'}).format(date)}
function playerCard(p,index,compact){const imageStyle=p.photoUrl?`--player-image:url('${String(p.photoUrl).replace(/'/g,'%27')}');--player-size:cover`:'';return `<button type="button" class="player ${compact?'player--compact':'player--large'}" data-player-index="${p.sourceIndex}" style="--photo:${p.photoIndex};${imageStyle}"><div class="player__photo"></div><div class="player__shade"></div><span class="player__number">${String(p.number).padStart(2,'0')}</span><div class="player__info"><small>${p.position}</small><h3>${p.name}<br><b>${p.last}</b></h3><p><span>⚽</span> ${p.goals} goles</p></div></button>`}
function openPlayerProfile(index){const p=players[index];if(!p)return;const imageStyle=p.photoUrl?`--player-image:url('${String(p.photoUrl).replace(/'/g,'%27')}');--player-size:cover`:'';const presentation=p.notes?.trim()||`${p.name} ${p.last} forma parte de Xolitas F.C. como ${String(p.position).toLowerCase()}. Su compromiso y trabajo en equipo representan la identidad de nuestra manada.`;document.querySelector('#profile-content').innerHTML=`<div class="profile-photo" style="--photo:${p.photoIndex};${imageStyle}"></div><div class="profile-copy"><span class="profile-number">#${p.number}</span><small>${p.position}</small><h2>${p.name}<br><em>${p.last}</em></h2><p>${escapePublic(presentation)}</p><div class="profile-stats"><div><b>${p.matches}</b><span>Partidos</span></div><div><b>${p.goals}</b><span>Goles</span></div><div><b>${p.matches?((p.goals/p.matches).toFixed(2)):'0.00'}</b><span>Promedio</span></div></div></div>`;document.querySelector('#roster-modal')?.close();document.querySelector('#profile-modal').showModal()}
function escapePublic(value){const span=document.createElement('span');span.textContent=value;return span.innerHTML}
function hydrateSite(){players=window.Xolitas.playersService.all().filter(p=>p.activa).map((p,i)=>({name:p.nombre,last:p.apellido,number:p.numero,position:p.posicion,goals:+p.goles||0,matches:+p.partidos||0,goalsByLeague:p.golesPorLiga||{},photoUrl:p.foto||'',photoIndex:p.fotoIndex??i%4,notes:p.notas||'',sourceIndex:i})).sort((a,b)=>b.goals-a.goals).map((p,i)=>({...p,sourceIndex:i}));renderSite()}
// Render immediately from the local cache; refresh once when the remote data arrives.
hydrateSite();
window.addEventListener('xolitas:online',hydrateSite,{once:true});
