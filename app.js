(() => {
  'use strict';
  // Entries published by NOVA Library Studio are combined with the original demo catalog.
  const baseItems = Array.isArray(window.NOVA_CATALOG) ? window.NOVA_CATALOG : [];
  const importedItems = Array.isArray(window.NOVA_IMPORTS) ? window.NOVA_IMPORTS : [];
  const items = [...baseItems, ...importedItems.filter(i => i && i.id && !baseItems.some(b => b.id === i.id))];
  const byId = new Map(items.map(item => [item.id, item]));
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const searchEl = $('#search');
  const genreList = ['All', ...new Set(items.flatMap(i => i.genres || []))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));
  const saveKey = 'nova-saved-v1'; // Keeps V1 My List entries.
  const featuredIds = ['last-signal','orbit-nine','neon-district'].filter(id=>byId.has(id));
  const heroArt = {'last-signal':'assets/hero-signal.svg','orbit-nine':'assets/hero-orbit.svg','neon-district':'assets/hero-neon.svg'};
  const html = input => String(input ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let saved;
  try {saved = new Set(JSON.parse(localStorage.getItem(saveKey) || '[]').filter(id=>byId.has(id)));}
  catch {saved=new Set();}
  let page = ['#movies','#series','#saved'].includes(location.hash) ? location.hash.slice(1) : 'home';
  let genre='All';
  let search='';
  let feature=0;
  let activeOverlay=null;
  let lastFocus=null;
  let toastTimer;
  const safeArtUrl = value => {
    if (typeof value !== 'string') return null;
    try {
      const u = new URL(value, location.href);
      if (u.protocol !== 'https:' && u.origin !== location.origin && u.protocol !== 'file:') return null;
      return u.href;
    } catch { return null; }
  };
  const poster = item => safeArtUrl(item.posterUrl) || `assets/poster-${/^[a-z-]+$/.test(item.art || '') ? item.art : 'signal'}.svg`;
  const backdrop = item => safeArtUrl(item.backdropUrl) || heroArt[item.id] || poster(item);
  const kind = item => item.type==='series' ? 'Series' : 'Movie';
  const meta = item => `${item.year}<span class="bullet">·</span>${html(kind(item))}<span class="bullet">·</span>${html(item.genres?.[0]||'Drama')}`;
  const iconPlay = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  function savedCount() {$('#saved-count').textContent=saved.size;}
  function persistSaved() {try{localStorage.setItem(saveKey,JSON.stringify([...saved]));}catch{}}
  function setSaved(id){
    if(!byId.has(id))return;
    saved.has(id)?saved.delete(id):saved.add(id);
    persistSaved();savedCount();render();
    if(activeOverlay==='details')renderDetails(id);
    if(featuredIds[feature]===id)updateHeroSave();
  }
  function card(item,shape='poster') {
    const isSaved = saved.has(item.id);
    return `<article class="media-card ${shape==='wide'?'wide':'poster-card'}">
      <div class="card-art">
        <button class="card-click" type="button" data-detail="${html(item.id)}" aria-label="Show details for ${html(item.title)}"><img src="${poster(item)}" alt="" loading="lazy"></button>
        <span class="card-status">${html(item.tag || kind(item))}</span>
        <button class="card-save ${isSaved?'saved':''}" type="button" data-save="${html(item.id)}" aria-label="${isSaved?'Remove':'Add'} ${html(item.title)} ${isSaved?'from':'to'} My List">${isSaved?'✓':'+'}</button>
      </div>
      <div class="card-title">${html(item.title)}</div>
      <div class="card-caption">${meta(item)}</div>
    </article>`;
  }
  function rail(id,title,subtitle,arr,shape='poster') {
    if(!arr.length)return '';
    return `<section class="rail" aria-labelledby="${id}-title"><div class="rail-head"><div><h2 id="${id}-title">${html(title)}</h2>${subtitle?`<p class="rail-subtitle">${html(subtitle)}</p>`:''}</div>
      <div class="rail-tools"><button type="button" data-scroll="${id}" data-direction="-1" aria-label="Scroll ${html(title)} left">‹</button><button type="button" data-scroll="${id}" data-direction="1" aria-label="Scroll ${html(title)} right">›</button></div></div>
      <div class="rail-scroller" id="${id}" tabindex="0" aria-label="${html(title)} titles">${arr.map(i=>card(i,shape)).join('')}</div></section>`;
  }
  function renderHero(){
    if(!featuredIds.length){$('#hero').hidden=true;return;}
    const item=byId.get(featuredIds[feature]);
    $('#hero-image').style.backgroundImage=`url('${backdrop(item)}')`;
    const custom={'last-signal':'THE LAST<br>SIGNAL','orbit-nine':'ORBIT<br>NINE','neon-district':'NEON<br>DISTRICT'};
    $('#feature-title').innerHTML=custom[item.id]||html(item.title);
    $('#feature-index').textContent=`${String(feature+1).padStart(2,'0')} / ${String(featuredIds.length).padStart(2,'0')}`;
    $('#feature-meta').innerHTML=`<span class="age-chip">${html(item.age)}</span><span>${html(item.year)}</span><span class="meta-separator"></span><span>${html(item.length)}</span><span class="meta-separator"></span><span>${html(item.genres.slice(0,2).join(' / '))}</span>`;
    $('#feature-description').textContent=item.description;
    $('#feature-play').hidden=!item.video;
    $('#feature-play').innerHTML=`${iconPlay} ${item.video?.demo?'Play sample':'Watch now'}`;
    $('#feature-dots').innerHTML=featuredIds.map((id,i)=>`<button type="button" class="feature-dot ${i===feature?'active':''}" data-feature="${i}" aria-label="Featured story ${i+1}: ${html(byId.get(id).title)}" aria-pressed="${i===feature}"><span></span></button>`).join('');
    updateHeroSave();
  }
  function updateHeroSave(){
    if(!featuredIds.length)return;
    const isSaved=saved.has(featuredIds[feature]);
    const b=$('#feature-save');b.textContent=isSaved?'✓':'+';b.classList.toggle('active',isSaved);b.setAttribute('aria-label',`${isSaved?'Remove':'Add'} ${byId.get(featuredIds[feature]).title} ${isSaved?'from':'to'} My List`);
  }
  function visibleItems(){
    return items.filter(item => {
      if(page==='movies'&&item.type!=='movie')return false;
      if(page==='series'&&item.type!=='series')return false;
      if(page==='saved'&&!saved.has(item.id))return false;
      if(genre!=='All'&&!(item.genres||[]).includes(genre))return false;
      if(search&&!`${item.title} ${item.description} ${(item.genres||[]).join(' ')} ${item.tag||''}`.toLowerCase().includes(search))return false;
      return true;
    });
  }
  function homeRails(){
    const movies=items.filter(i=>i.type==='movie');
    const series=items.filter(i=>i.type==='series');
    const picks=['last-signal','blue-hour','orbit-nine','paper-kings','neon-district','good-company','echo-valley'].map(id=>byId.get(id)).filter(Boolean);
    const collections=['Sci-Fi','Animation','Adventure','Mystery'].filter(g=>items.some(i=>i.genres.includes(g)));
    const collectionSection=`<section class="rail" aria-labelledby="collections-heading"><div class="rail-head"><div><h2 id="collections-heading">Browse by mood</h2><p class="rail-subtitle">A different direction for movie night</p></div></div><div class="collections-grid">${collections.map(g=>`<button type="button" class="collection-card" data-collection="${html(g)}"><span class="collection-overline">NOVA COLLECTION</span><span class="collection-name">${html(g)}</span><span class="collection-action">Explore titles →</span></button>`).join('')}</div></section>`;
    return rail('rail-imported','Library additions','Catalog entries published from Library Studio',importedItems.filter(i=>byId.has(i.id)).slice().reverse(),'wide')+
      rail('rail-picks','NOVA Picks','Handpicked from the demo collection',picks,'wide')+
      rail('rail-movies','Movies to explore','Something for every kind of night',movies)+
      rail('rail-series','Find your next series','One episode becomes three',series,'wide')+
      collectionSection+
      rail('rail-more','More to explore','A few you might have missed',[...items].reverse())+
      '<p class="library-note">Demo entries are fictional. Other entries are catalog metadata and do not imply streaming availability.</p>';
  }
  function render(){
    savedCount();
    $$('.nav-link').forEach(button=>{const active=button.dataset.page===page;button.classList.toggle('active',active);active?button.setAttribute('aria-current','page'):button.removeAttribute('aria-current')});
    const isHome=page==='home'&&!search&&genre==='All';
    $('#hero').hidden=!isHome;
    $('#home-content').hidden=!isHome;
    $('#browse-content').hidden=isHome;
    if(isHome){renderHero();$('#home-library').innerHTML=homeRails();return;}
    $('#genre-bar').innerHTML=genreList.map(g=>`<button type="button" class="chip ${genre===g?'active':''}" data-genre="${html(g)}" aria-pressed="${genre===g}">${html(g)}</button>`).join('');
    const headings={home:['SEARCH THE LIBRARY','Explore the collection','Discover stories across genres.'],movies:['THE MOVIE LIBRARY','All movies','A little of everything, in one place.'],series:['THE SERIES LIBRARY','TV series','Find your next story to follow.'],saved:['YOUR COLLECTION','My List','The titles you saved on this device.']};
    const [eye,title,desc]=headings[page]||headings.home;
    $('#browse-eyebrow').textContent=search?'SEARCH RESULTS':eye;
    $('#browse-title').innerHTML=search?`Search results<span>.</span>`:`${html(title)}<span>.</span>`;
    $('#browse-description').textContent=search?`Looking for “${searchEl.value.trim()}”`:desc;
    const arr=visibleItems();
    $('#library').innerHTML=arr.length?`<p class="results-heading">${arr.length} ${arr.length===1?'title':'titles'}${genre!=='All'?' · '+html(genre):''}</p><div class="browse-grid">${arr.map(i=>card(i)).join('')}</div>`:`<div class="empty"><h2>${page==='saved'&&!search?'Your list is empty.':'No matching titles.'}</h2><p>${page==='saved'&&!search?'Add titles with the + icon and find them here whenever you return on this device.':'Try another title, clear your search, or choose a different genre.'}</p></div>`;
  }
  function changePage(next){
    page=next;genre='All';search='';searchEl.value='';
    try { history.replaceState(null,'',next==='home'?location.pathname+location.search:'#'+next); } catch {}
    render();window.scrollTo({top:0,behavior:'auto'});
  }
  function renderDetails(id){
    const item=byId.get(id); if(!item)return;
    const hasVideo=Boolean(item.video);
    const seasons=Array.isArray(item.seasons)?item.seasons:[];
    $('#details-body').innerHTML=`<div class="details-cover" id="details-cover"></div>
    <div class="details-main"><h2>${html(item.title)}</h2>
    <div class="details-meta"><span>${html(item.year)}</span><span>·</span><span class="age-chip">${html(item.age||'NR')}</span><span>·</span><span>${html(item.length||'')}</span><span>·</span><span>${kind(item)}</span></div>
    <p class="details-description">${html(item.description||'')}</p>
    <div class="details-buttons">${hasVideo?`<button class="btn btn-primary" type="button" data-play="${html(item.id)}">${iconPlay} ${item.video.demo?'Play sample':'Play'}</button>`:''}<button class="btn btn-secondary" type="button" data-save="${html(item.id)}">${saved.has(id)?'✓ In My List':'+ Add to My List'}</button></div>
    ${!hasVideo&&item.type==='movie'?'<p class="library-note">No playable video has been attached to this listing.</p>':''}
    <div class="details-label">GENRES</div><div class="detail-genres">${html((item.genres||[]).join(' · '))}</div>
    ${seasons.length?`<div class="details-label">EPISODES</div><label class="season-select-label">Choose a season <select class="season-select" id="season-select" aria-label="Select season">${seasons.map((season,idx)=>`<option value="${idx}">${html(season.label||'Season '+(idx+1))}</option>`).join('')}</select></label><div id="episodes-list"></div>`:''}</div>`;
    $('#details-cover').style.backgroundImage=`linear-gradient(0deg, #181920, #18192000 70%),url("${backdrop(item).replaceAll('"','%22')}")`;
    if(seasons.length){
      const select=$('#season-select');
      const showEpisodes=()=>{
        const si=Number(select.value),eps=seasons[si]?.episodes||[];
        $('#episodes-list').innerHTML=`<div class="episodes">${eps.length?eps.map((ep,ei)=>`<div class="episode"><span>${String(ei+1).padStart(2,'0')} &nbsp; ${html(ep.title||'Episode '+(ei+1))}</span><span>${html(ep.length||'')} ${ep.video?`<button class="episode-play" type="button" data-episode-id="${html(id)}" data-season="${si}" data-episode="${ei}">▶ Play</button>`:''}</span></div>`).join(''):'<p class="library-note">No episodes listed for this season.</p>'}</div>`;
      };
      select.addEventListener('change',showEpisodes);showEpisodes();
    }
  }
  function openDetails(id){if(!byId.has(id))return;renderDetails(id);openOverlay('details');}
  function getDrivePreview(url){
    if(!url||typeof url!=='string')return null;
    try {const p=new URL(url);if(!['drive.google.com','docs.google.com'].includes(p.hostname))return null;const id=p.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]||(p.pathname==='/open'?p.searchParams.get('id'):null);if(id&&/^[a-zA-Z0-9_-]{10,}$/.test(id))return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;}catch{}return null;
  }
  function play(id, seasonIndex=null, episodeIndex=null){
    const item=byId.get(id);if(!item)return;
    const episode = seasonIndex===null ? null : item.seasons?.[seasonIndex]?.episodes?.[episodeIndex];
    $('#player-title').textContent=episode ? `${item.title} — ${episode.title}` : item.title;
    const v=episode ? episode.video : item.video;const frame=$('#player-frame');
    if(v?.type==='mp4'&&v.url&&(/^(https?:\/\/|media\/)/i.test(v.url))){
      const video=document.createElement('video');video.controls=true;video.playsInline=true;video.autoplay=true;video.src=v.url;video.setAttribute('aria-label',`${item.title} video`);frame.replaceChildren(video);
      $('#player-caption').textContent=v.demo?'Original short test animation, not a complete feature film.':'Only stream content you have permission to share.';
    }else if(v?.type==='drive'&&getDrivePreview(v.url)){
      const iframe=document.createElement('iframe');iframe.src=getDrivePreview(v.url);iframe.title=`${item.title} — Google Drive preview`;iframe.allow='autoplay; fullscreen';iframe.allowFullscreen=true;frame.replaceChildren(iframe);
      $('#player-caption').textContent='Viewers need individual file access. Playback may be limited by Drive or your school.';
    }else{
      frame.innerHTML='<div class="player-placeholder"><h3>No video available</h3><p>No playable video source is attached to this catalog entry.</p></div>';
      $('#player-caption').textContent='';
    }
    if(activeOverlay)closeOverlay(activeOverlay,false);
    openOverlay('player');
  }
  function openOverlay(name){lastFocus=document.activeElement;activeOverlay=name;document.body.classList.add('locked');const o=$(`#${name}-overlay`);o.hidden=false;o.querySelector('[role="dialog"]').focus();}
  function closeOverlay(name,restore=true){const o=$(`#${name}-overlay`);o.hidden=true;if(name==='player')$('#player-frame').replaceChildren();if(activeOverlay===name){activeOverlay=null;document.body.classList.remove('locked');}if(restore&&lastFocus?.isConnected)lastFocus.focus();}
  document.addEventListener('click',event=>{
    const target=event.target;
    const nav=target.closest('[data-page]');if(nav){changePage(nav.dataset.page);return;}
    if(target.closest('#brand-link')){event.preventDefault();changePage('home');return;}
    const collection=target.closest('[data-collection]');if(collection){page='home';genre=collection.dataset.collection;search='';searchEl.value='';render();scrollTo({top:0,behavior:'auto'});return;}
    const featureButton=target.closest('[data-feature]');if(featureButton){feature=Number(featureButton.dataset.feature);renderHero();return;}
    const scroll=target.closest('[data-scroll]');if(scroll){const rail=document.getElementById(scroll.dataset.scroll);if(rail){const first=rail.querySelector('.media-card');rail.scrollBy({left:(first?.getBoundingClientRect().width||300)*Number(scroll.dataset.direction)*2,behavior:'smooth'});}return;}
    const genreButton=target.closest('[data-genre]');if(genreButton){genre=genreButton.dataset.genre;render();return;}
    const close=target.closest('[data-close]');if(close){closeOverlay(close.dataset.close);return;}
    const save=target.closest('[data-save]');if(save){setSaved(save.dataset.save);return;}
    const episodePlay=target.closest('[data-episode-id]');if(episodePlay){play(episodePlay.dataset.episodeId,Number(episodePlay.dataset.season),Number(episodePlay.dataset.episode));return;}
    const playBtn=target.closest('[data-play]');if(playBtn){play(playBtn.dataset.play);return;}
    const detail=target.closest('[data-detail]');if(detail){openDetails(detail.dataset.detail);return;}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&activeOverlay){closeOverlay(activeOverlay);return;}
    if(event.key==='Tab'&&activeOverlay){const overlay=$(`#${activeOverlay}-overlay`);const focusable=[...overlay.querySelectorAll('button:not([disabled]),a[href],video[controls],iframe')].filter(e=>e.getClientRects().length);if(focusable.length){const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}
  });
  searchEl.addEventListener('input',()=>{search=searchEl.value.trim().toLowerCase();genre='All';render();});
  $('#feature-play').addEventListener('click',()=>play(featuredIds[feature]));
  $('#feature-details').addEventListener('click',()=>openDetails(featuredIds[feature]));
  $('#feature-save').addEventListener('click',()=>setSaved(featuredIds[feature]));
  $('#feature-prev').addEventListener('click',()=>{feature=(feature+featuredIds.length-1)%featuredIds.length;renderHero();});
  $('#feature-next').addEventListener('click',()=>{feature=(feature+1)%featuredIds.length;renderHero();});
  const onScroll=()=>$('.site-header').classList.toggle('scrolled',window.scrollY>15);
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  render();
})();
