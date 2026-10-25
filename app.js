(() => {
  'use strict';
  const items = Array.isArray(window.NOVA_CATALOG) ? window.NOVA_CATALOG : [];
  const byId = new Map(items.map(x => [x.id, x]));
  const el = sel => document.querySelector(sel);
  const library = el('#library');
  const searchEl = el('#search');
  const savedKey = 'nova-saved-v1';
  let page = 'home';
  let genre = 'All';
  let query = '';
  let saved;
  try {saved = new Set(JSON.parse(localStorage.getItem(savedKey) || '[]').filter(id => byId.has(id)));} catch {saved = new Set();}
  let activeOverlay = null;
  let lastFocus = null;

  const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const kindLabel = item => item.type === 'series' ? 'TV SERIES' : 'MOVIE';
  const genreList = ['All','Sci-Fi','Action','Adventure','Drama','Comedy','Mystery','Animation','Thriller','Documentary'];
  function poster(item) {return `assets/poster-${item.art}.svg`;}
  function updateSavedCount() {el('#saved-count').textContent = saved.size;}
  function setSaved(id) {
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    try {localStorage.setItem(savedKey, JSON.stringify([...saved]));} catch {}
    updateSavedCount(); render();
    const btn = document.querySelector(`[data-save-detail="${id}"]`);
    if(btn) {btn.textContent = saved.has(id) ? '✓ In My List' : '+ Add to My List';}
  }
  function itemHTML(item) {
    const inList = saved.has(item.id);
    return `<article class="tile" tabindex="0" role="button" data-detail="${escapeHTML(item.id)}" aria-label="Details for ${escapeHTML(item.title)}">
      <div class="poster"><img src="${poster(item)}" alt=""><span class="poster-badge">${escapeHTML(item.tag||kindLabel(item))}</span><button class="poster-save ${inList?'saved':''}" type="button" data-save="${escapeHTML(item.id)}" aria-label="${inList?'Remove':'Add'} ${escapeHTML(item.title)} ${inList?'from':'to'} My List">${inList?'✓':'+'}</button></div>
      <div class="tile-meta"><div class="tile-name">${escapeHTML(item.title)}</div><div class="tile-info"><span>${escapeHTML(item.year)}</span><b></b><span>${item.type==='movie'?'Movie':'Series'}</span><b></b><span>${escapeHTML(item.age)}</span></div></div>
    </article>`;
  }
  function section(title,subtitle,arr,full=false) {
    return `<section class="rail"><div class="rail-title-row"><div><h2 class="rail-title">${escapeHTML(title)}</h2>${subtitle?`<p class="rail-subtitle">${escapeHTML(subtitle)}</p>`:''}</div><div class="rail-count">${arr.length} TITLES</div></div><div class="rail-grid ${full?'results-grid':''}">${arr.map(itemHTML).join('')}</div></section>`;
  }
  function visibleItems() {
    return items.filter(item => {
      if(page === 'movies' && item.type !== 'movie') return false;
      if(page === 'series' && item.type !== 'series') return false;
      if(page === 'saved' && !saved.has(item.id)) return false;
      if(genre !== 'All' && !item.genres.includes(genre)) return false;
      if(query && !`${item.title} ${item.description} ${item.genres.join(' ')}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }
  function render() {
    updateSavedCount();
    document.querySelectorAll('.nav-link').forEach(b => {let on=b.dataset.page===page;b.classList.toggle('active',on);b.setAttribute('aria-current',on?'page':'false');});
    el('#hero').hidden = page !== 'home' || Boolean(query) || genre !== 'All';
    el('#genre-bar').innerHTML = genreList.map(g => `<button type="button" class="chip ${g === genre?'active':''}" data-genre="${escapeHTML(g)}" aria-pressed="${g===genre}">${escapeHTML(g)}</button>`).join('');
    const heading = el('#section-heading');
    const titles={home:['Good stories live','here.'],movies:['Explore the','movies.'],series:['Find your next','series.'],saved:['Your personal','watchlist.']};
    const pair=titles[page];
    heading.querySelector('h1').innerHTML=`${escapeHTML(pair[0])} <span>${escapeHTML(pair[1])}</span>`;
    heading.querySelector('.eyebrow').textContent=query?'RESULTS FOR YOUR SEARCH':page==='saved'?'YOUR SAVED TITLES':page==='movies'?'THE MOVIE COLLECTION':page==='series'?'BINGE-WORTHY STORIES':'YOUR SCREEN. YOUR STORIES.';
    const arr = visibleItems();
    if(!arr.length) {
      library.innerHTML = `<div class="empty"><div class="magnify">⌕</div><h2>Nothing here yet.</h2><p>${page==='saved'?'Add titles using the + button on movie cards.':'Try another search or choose a different genre.'}</p></div>`;
      return;
    }
    if(query || genre !== 'All' || page !== 'home') {
      let title = query ? `Results for “${searchEl.value.trim()}”` : page==='saved'?'My List':page==='movies'?'All Movies':page==='series'?'All Series':`${genre} Stories`;
      library.innerHTML = section(title,'Browse the collection',arr,true);
      return;
    }
    library.innerHTML = [
      section('Fresh off the reel','A little something for everyone',items.slice(0,6)),
      section('Movie night, sorted','Your next big-screen favorite',items.filter(x=>x.type==='movie').slice(0,6)),
      section('One more episode','Stories worth staying up for',items.filter(x=>x.type==='series'))
    ].join('');
  }
  function details(id) {
    const item=byId.get(id);if(!item)return;
    el('#details-body').innerHTML=`
      <div class="details-cover" style="background-image:linear-gradient(90deg, #16181e44, #16181e11),url('${poster(item)}')"></div>
      <div class="details-main"><h2>${escapeHTML(item.title)}</h2><div class="details-meta"><span>${escapeHTML(item.year)}</span><span>•</span><span class="age-chip">${escapeHTML(item.age)}</span><span>•</span><span>${escapeHTML(item.length)}</span><span>•</span><span>${kindLabel(item)}</span></div>
      <p class="details-description">${escapeHTML(item.description)}</p>
      <div class="details-buttons"><button class="btn btn-primary" data-play="${escapeHTML(item.id)}"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>${item.video?.demo?'Play sample':item.video?'Watch now':'Playback unavailable'}</button><button class="btn btn-outline" data-save-detail="${escapeHTML(item.id)}">${saved.has(id)?'✓ In My List':'+ Add to My List'}</button></div>
      <div class="details-label">GENRES</div><div class="detail-genres">${escapeHTML(item.genres.join('  •  '))}</div>
      ${item.seasons?`<div class="details-label">EPISODES</div>${item.seasons.map(season=>`<div class="episodes"><strong>${escapeHTML(season.label)}</strong>${season.episodes.map((ep,i)=>`<div class="episode"><span>${String(i+1).padStart(2,'0')}. ${escapeHTML(ep.title)}</span><span>${escapeHTML(ep.length)}</span></div>`).join('')}</div>`).join('')}`:''}
      </div>`;
    openOverlay('details');
  }
  function getDrivePreview(url) {
    if (!url || typeof url !== 'string') return null;
    try {
      const parsed=new URL(url);
      if(parsed.hostname!=='drive.google.com' && parsed.hostname!=='docs.google.com')return null;
      const id = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || (parsed.pathname==='/open' ? parsed.searchParams.get('id') : null);
      if(id && /^[a-zA-Z0-9_-]{10,}$/.test(id)) return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
    } catch {} return null;
  }
  function player(id) {
    const item=byId.get(id);if(!item)return;
    el('#player-title').textContent=item.title;
    const v=item.video;
    const frame=el('#player-frame');
    if(v && v.type==='mp4' && v.url && !/^(javascript|data):/i.test(v.url)) {
      const vid=document.createElement('video'); vid.setAttribute('controls',''); vid.setAttribute('playsinline','');vid.autoplay=true;vid.src=v.url;vid.setAttribute('aria-label',`${item.title} video`);frame.replaceChildren(vid);
      el('#player-caption').textContent=v.demo?'Original short test animation included to demonstrate the player. This is not the full fictional movie.':'Play only videos you are authorized to share.';
    } else if(v && v.type==='drive' && getDrivePreview(v.url)) {
      const iframe=document.createElement('iframe');iframe.src=getDrivePreview(v.url);iframe.allow='autoplay; fullscreen';iframe.allowFullscreen=true;iframe.title=`${item.title} — Google Drive player`;iframe.referrerPolicy='strict-origin-when-cross-origin';frame.replaceChildren(iframe);
      el('#player-caption').textContent='Google Drive preview. Playback requires access to the file and permission from the account or school administrator.';
    } else {
      frame.innerHTML=`<div class="player-placeholder"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5M12 16v1"/></svg><h3>Coming to the library</h3><p>This is a fictional placeholder. Add an authorized MP4 or Google Drive video link in <strong>catalog.js</strong> to enable playback.</p></div>`;
      el('#player-caption').textContent='No video attached to this demo title.';
    }
    closeOverlay('details');openOverlay('player');
  }
  function openOverlay(which){lastFocus=document.activeElement;activeOverlay=which;document.body.style.overflow='hidden';const o=el(`#${which}-overlay`);o.hidden=false;o.querySelector('[role="dialog"]').focus();}
  function closeOverlay(which){const o=el(`#${which}-overlay`);o.hidden=true;if(which==='player')el('#player-frame').replaceChildren();if(activeOverlay===which){activeOverlay=null;document.body.style.overflow='';}if(lastFocus?.isConnected)lastFocus.focus();}
  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-page]');if(nav){page=nav.dataset.page;genre='All';query='';searchEl.value='';render();window.scrollTo({top:0,behavior:'smooth'});return;}
    const g=e.target.closest('[data-genre]');if(g){genre=g.dataset.genre;render();return;}
    const close=e.target.closest('[data-close]');if(close){closeOverlay(close.dataset.close);return;}
    const saveDetail=e.target.closest('[data-save-detail]');if(saveDetail){setSaved(saveDetail.dataset.saveDetail);return;}
    const save=e.target.closest('[data-save]');if(save){setSaved(save.dataset.save);return;}
    const play=e.target.closest('[data-play]');if(play){player(play.dataset.play);return;}
    const detail=e.target.closest('[data-detail]');if(detail){details(detail.dataset.detail);return;}
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&activeOverlay){closeOverlay(activeOverlay);return;}
    const tile=e.target.closest?.('[data-detail]');if(tile && (e.key==='Enter'||e.key===' ') && e.target===tile){e.preventDefault();details(tile.dataset.detail);}
  });
  searchEl.addEventListener('input',()=>{query=searchEl.value.trim().toLowerCase();render();});
  el('#feature-play').addEventListener('click',()=>player('last-signal'));
  el('#feature-details').addEventListener('click',()=>details('last-signal'));
  if(location.hash==='#movies'||location.hash==='#series'||location.hash==='#saved')page=location.hash.slice(1);
  render();
})();
