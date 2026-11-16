/* EVAGELAK EDU LAB — collectible album, synced with homepage projects.
   Uses the existing local-only badge state. Adding a workshop card to
   the homepage automatically adds its slot to this album.
*/
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const card = $('trex-card'), visual = $('trex-visual'), preview = $('trex-preview');
  const view = $('trex-view'), close = $('preview-close');
  const progress = $('album-progress'), track = $('album-progress-track');
  const download = $('trex-download'), quiz = $('trex-quiz-link');
  const grid = $('album-grid');

  function sync(){
    const earned = Boolean(window.EduLabBadges && window.EduLabBadges.unlocked('t-rex'));
    card.classList.toggle('earned', earned);
    visual.classList.toggle('locked', !earned);
    $('trex-status').textContent = earned ? 'ΚΕΡΔΙΣΜΕΝΗ' : 'ΚΛΕΙΔΩΜΕΝΗ';
    $('trex-state-label').textContent = earned ? 'ΑΠΟΚΤΗΘΗΚΕ' : 'ΚΛΕΙΔΩΜΕΝΗ';
    $('trex-description').textContent = earned
      ? 'Η συλλεκτική κάρτα T-Rex LEVEL 3 βρίσκεται στο άλμπουμ σου!'
      : 'Ολοκλήρωσε το quiz του T-Rex για να κερδίσεις τη συλλεκτική κάρτα LEVEL 3.';
    $('collection-count').textContent = (earned ? '1' : '0') + ' / 1 διαθέσιμη κάρτα';
    $('album-earned').textContent = earned ? '1' : '0';
    progress.style.width = earned ? '100%' : '0%';
    track.setAttribute('aria-valuenow', earned ? '1' : '0');
    download.hidden = !earned;
    view.hidden = !earned;
    quiz.textContent = earned ? 'Παίξε ξανά ↗' : 'Παίξε το quiz ↗';
  }

  const shield = '<svg class="placeholder-shield" aria-hidden="true" viewBox="0 0 128 154"><path d="M64 5 115 26 111 96 64 148 17 96 13 26Z"></path><path d="M64 15 105 32 102 93 64 136 26 93 23 32Z"></path><path d="M37 64h54m-27-26v52"></path></svg>';
  function newSlot(project){
    const item = document.createElement('article');
    item.className = 'slot slot-coming';
    item.dataset.projectId = project.id;
    item.setAttribute('aria-label', project.name + ' — σε προετοιμασία');
    // The placeholder is deliberately NOT a fabricated collectible card.
    item.innerHTML = '<div class="slot-top"><span class="slot-num"></span><span class="slot-state">ΣΥΝΤΟΜΑ</span></div>' +
      '<div class="slot-art slot-placeholder">' + shield + '</div>' +
      '<h3 class="slot-name"></h3>' +
      '<p class="slot-help">Η συλλεκτική κάρτα σχεδιάζεται</p>' +
      '<p class="status"><span class="dot" aria-hidden="true"></span>Σε προετοιμασία</p>';
    item.querySelector('.slot-name').textContent = project.name;
    return item;
  }

  function renumber(){
    const slots = Array.from(grid.querySelectorAll('.slot[data-project-id]'));
    const total = slots.length;
    slots.forEach((el,i)=> {
      el.querySelector('.slot-num').textContent = String(i+1).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
    });
    $('album-project-count').textContent = String(total).padStart(2,'0');
    $('album-slot-count').textContent = String(total).padStart(2,'0');
  }

  async function syncProjects(){
    // The homepage is the single source of truth for workshop names/order.
    // This works on GitHub Pages without a server, database, or login.
    try {
      const response = await fetch('../index.html', {cache:'no-store'});
      if(!response.ok) throw new Error('Homepage unavailable');
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const cards = Array.from(html.querySelectorAll('.workshop-card'));
      const seen = new Set(), projects = [];
      for(const element of cards){
        const link = element.querySelector('a.workshop-action[href]');
        const href = link ? link.getAttribute('href') : '';
        if(!href || !/^workshops\/[^?#]+\/index\.html(?:[?#].*)?$/.test(href)) continue;
        const name = element.querySelector('h3')?.textContent.trim();
        const derivedId = href.split('/').at(-2);
        const id = (element.getAttribute('data-id') || derivedId || '').trim();
        if(!id || !name || seen.has(id)) continue;
        seen.add(id);
        projects.push({id,name});
      }
      if(!projects.length) throw new Error('No workshop cards found');
      const existing = new Map(Array.from(grid.querySelectorAll('.slot[data-project-id]')).map(el=>[el.dataset.projectId,el]));
      // Retain any existing earned artwork if a card was temporarily removed.
      for(const p of projects){
        const el = existing.get(p.id) || newSlot(p);
        grid.appendChild(el);  // Also sorts to match the homepage.
        if(!el.id){
          el.querySelector('.slot-name').textContent = p.name;
          el.setAttribute('aria-label', p.name + ' — σε προετοιμασία');
        }
      }
      // Static fallback slots stay visible if the homepage no longer includes them;
      // this avoids silently erasing part of a collection in a temporary edit.
      renumber();
    } catch (error){
      // Offline preview or temporary network failure: show the seven built-in slots.
      renumber();
    }
  }

  function openPreview(){
    if(!window.EduLabBadges || !window.EduLabBadges.unlocked('t-rex')) return;
    if(typeof preview.showModal === 'function') preview.showModal();
    else window.open('../assets/images/cards/t-rex-level3.webp','_blank','noopener,noreferrer');
  }
  view.addEventListener('click',openPreview);
  close.addEventListener('click',()=>preview.close());
  preview.addEventListener('click',event=>{if(event.target===preview)preview.close();});
  window.addEventListener('pageshow',sync);
  window.addEventListener('storage',sync);
  sync();
  renumber();
  syncProjects();
})();
