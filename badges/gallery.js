/* EVAGELAK EDU LAB — collectible album, synced with homepage projects.
   Uses the existing local-only card state. Adding a workshop card to
   the homepage automatically adds its slot to this album.
*/
(function(){
  'use strict';
  const $ = id => document.getElementById(id);
  const grid = $('album-grid');
  const progress = $('album-progress');
  const track = $('album-progress-track');

  const cards = [
    {
      id: 't-rex', prefix: 'trex', name: 'Ρομποτικός T-Rex',
      earnedLabel: 'ΚΕΡΔΙΣΜΕΝΗ', lockedLabel: 'ΚΛΕΙΔΩΜΕΝΗ',
      earnedDesc: 'Η συλλεκτική κάρτα T-Rex LEVEL 3 βρίσκεται στο άλμπουμ σου!',
      lockedDesc: 'Ολοκλήρωσε το quiz του T-Rex για να κερδίσεις τη συλλεκτική κάρτα LEVEL 3.',
      quizTextEarned: 'Παίξε ξανά →', quizTextLocked: 'Παίξε το κουίζ →',
      fallbackHref: '../assets/images/cards/t-rex-level3.webp'
    },
    {
      id: 'octopus', prefix: 'octopus', name: 'Ρομποτικό Χταπόδι',
      earnedLabel: 'ΚΕΡΔΙΣΜΕΝΗ', lockedLabel: 'ΚΛΕΙΔΩΜΕΝΗ',
      earnedDesc: 'Η συλλεκτική κάρτα Ρομποτικό Χταπόδι LEVEL 1 βρίσκεται στο άλμπουμ σου!',
      lockedDesc: 'Ολοκλήρωσε το quiz του Χταποδιού για να κερδίσεις τη συλλεκτική κάρτα LEVEL 1.',
      quizTextEarned: 'Παίξε ξανά →', quizTextLocked: 'Παίξε το κουίζ →',
      fallbackHref: '../assets/images/cards/octopus-level1.webp'
    },
    {
      id: 'basket', prefix: 'basket', name: 'Ρομποτική Μπασκέτα',
      earnedLabel: 'ΚΕΡΔΙΣΜΕΝΗ', lockedLabel: 'ΚΛΕΙΔΩΜΕΝΗ',
      earnedDesc: 'Η συλλεκτική κάρτα Μπασκέτα LEVEL 2 βρίσκεται στο άλμπουμ σου!',
      lockedDesc: 'Ολοκλήρωσε το quiz της Μπασκέτας για να κερδίσεις τη συλλεκτική κάρτα LEVEL 2.',
      quizTextEarned: 'Παίξε ξανά →', quizTextLocked: 'Παίξε το κουίζ →',
      fallbackHref: '../assets/images/cards/basket-level2.webp?v=20261118'
    },
    {
      id: 'frisbee', prefix: 'frisbee', name: 'Ρομποτικός Στόχος Frisbee',
      earnedLabel: 'ΚΕΡΔΙΣΜΕΝΗ', lockedLabel: 'ΚΛΕΙΔΩΜΕΝΗ',
      earnedDesc: 'Η συλλεκτική κάρτα Frisbee LEVEL 2 βρίσκεται στο άλμπουμ σου!',
      lockedDesc: 'Quiz προσωρινά μη διαθέσιμο. Η συλλεκτική κάρτα παραμένει στο άλμπουμ.',
      quizTextEarned: 'Παίξε ξανά →', quizTextLocked: 'Παίξε το κουίζ →',
      fallbackHref: '../assets/images/cards/frisbee-level2.webp?v=20261118'
    },
    {
      id: 'jetfighter', prefix: 'jetfighter', name: 'Jet Fighter',
      earnedLabel: 'ΚΕΡΔΙΣΜΕΝΗ', lockedLabel: 'ΚΛΕΙΔΩΜΕΝΗ',
      earnedDesc: 'Η συλλεκτική κάρτα Jet Fighter LEVEL 2 βρίσκεται στο άλμπουμ σου!',
      lockedDesc: 'Το quiz του Jet Fighter θα προστεθεί σύντομα. Η κάρτα παραμένει κλειδωμένη μέχρι τότε.',
      quizTextEarned: 'Παίξε ξανά →', quizTextLocked: 'Σύντομα διαθέσιμο ↗',
      fallbackHref: '../assets/images/cards/jet-fighter-level2.webp?v=20261118'
    },
    {
      id: 'scorpion', prefix: 'scorpion', name: 'Ρομποτικός Σκορπιός',
      earnedLabel: 'ΚΕΡΔΙΣΜΕΝΗ', lockedLabel: 'ΚΛΕΙΔΩΜΕΝΗ',
      earnedDesc: 'Η συλλεκτική κάρτα Ρομποτικός Σκορπιός LEVEL 2 βρίσκεται στο άλμπουμ σου!',
      lockedDesc: 'Το quiz του Ρομποτικού Σκορπιού θα προστεθεί σύντομα. Η κάρτα παραμένει κλειδωμένη μέχρι τότε.',
      quizTextEarned: 'Παίξε ξανά →', quizTextLocked: 'Σύντομα διαθέσιμο ↗',
      fallbackHref: '../assets/images/cards/scorpion-level2.webp?v=20261118b'
    },
    {
      id: 'electric-scooter', prefix: 'electricscooter', name: 'Electric Scooter',
      earnedLabel: 'ΚΕΡΔΙΣΜΕΝΗ', lockedLabel: 'ΚΛΕΙΔΩΜΕΝΗ',
      earnedDesc: 'Η συλλεκτική κάρτα Electric Scooter LEVEL 2 βρίσκεται στο άλμπουμ σου!',
      lockedDesc: 'Ολοκλήρωσε το quiz του Electric Scooter για να κερδίσεις τη συλλεκτική κάρτα LEVEL 2.',
      quizTextEarned: 'Παίξε ξανά →', quizTextLocked: 'Παίξε το κουίζ →',
      fallbackHref: '../assets/images/cards/electric-scooter-level2.webp?v=20261118b'
    }
    ,{
      id: 'smart-bin', prefix: 'smartbin', name: 'Έξυπνος Κάδος',
      earnedLabel: 'ΚΕΡΔΙΣΜΕΝΗ', lockedLabel: 'ΚΛΕΙΔΩΜΕΝΗ',
      earnedDesc: 'Η συλλεκτική κάρτα Έξυπνος Κάδος LEVEL 2 βρίσκεται στο άλμπουμ σου!',
      lockedDesc: 'Ολοκλήρωσε το quiz του Έξυπνου Κάδου για να κερδίσεις τη συλλεκτική κάρτα LEVEL 2.',
      quizTextEarned: 'Παίξε ξανά →', quizTextLocked: 'Παίξε το κουίζ →',
      fallbackHref: '../assets/images/cards/smart-bin-level2.webp'
    }
  ];

  function sync(){
    let earnedCount = 0;
    cards.forEach(cfg => {
      const earned = Boolean(window.EduLabBadges && window.EduLabBadges.unlocked(cfg.id));
      if (earned) earnedCount += 1;
      const card = $(cfg.prefix + '-card');
      const visual = $(cfg.prefix + '-visual');
      const download = $(cfg.prefix + '-download');
      const view = $(cfg.prefix + '-view');
      const status = $(cfg.prefix + '-status');
      const stateLabel = $(cfg.prefix + '-state-label');
      const description = $(cfg.prefix + '-description');
      const quizLink = $(cfg.prefix + '-quiz-link');
      if (!card || !visual) return;
      card.classList.toggle('earned', earned);
      visual.classList.toggle('locked', !earned);
      if (status) status.textContent = earned ? cfg.earnedLabel : cfg.lockedLabel;
      const stateBadge = stateLabel || card.querySelector('.slot-state');
      if (stateBadge) {
        stateBadge.dataset.initialLabel ??= stateBadge.textContent;
        stateBadge.textContent = earned ? 'Αποκτήθηκε ✓' : (stateLabel ? cfg.lockedLabel : stateBadge.dataset.initialLabel);
      }
      if (description) description.textContent = earned ? cfg.earnedDesc : cfg.lockedDesc;
      if (download) download.hidden = !earned;
      if (view) view.hidden = !earned;
      if (quizLink) quizLink.textContent = earned ? cfg.quizTextEarned : cfg.quizTextLocked;
    });

    // Derive the collection target from the actual album slots, not the
    // fixed badge registry. New projects add slots automatically.
    // A slot represents one card to collect, even while its artwork/quiz
    // is being prepared. Earned badges retain their existing local storage.
    const totalSlots = grid.querySelectorAll('.slot[data-project-id]').length;
    const collected = grid.querySelectorAll('.slot.earned[data-project-id]').length;
    $('collection-count').textContent = collected + ' / ' + totalSlots + ' κάρτες προς συλλογή';
    $('album-earned').textContent = String(collected);
    progress.style.width = (totalSlots ? collected / totalSlots * 100 : 0) + '%';
    track.setAttribute('aria-valuenow', String(collected));
    track.setAttribute('aria-valuemax', String(totalSlots));
  }

  const shield = '<svg class="placeholder-shield" aria-hidden="true" viewBox="0 0 128 154"><path d="M64 5 115 26 111 96 64 148 17 96 13 26Z"></path><path d="M64 15 105 32 102 93 64 136 26 93 23 32Z"></path><path d="M37 64h54m-27-26v52"></path></svg>';
  function newSlot(project){
    const item = document.createElement('article');
    item.className = 'slot slot-coming';
    item.dataset.projectId = project.id;
    item.setAttribute('aria-label', project.name + ' — σε προετοιμασία');
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
      const slotNum = el.querySelector('.slot-num');
      if (slotNum) slotNum.textContent = String(i+1).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
    });
    $('album-project-count').textContent = String(total).padStart(2,'0');
    $('album-slot-count').textContent = String(total).padStart(2,'0');
  }

  async function syncProjects(){
    try {
      const response = await fetch('../index.html', {cache:'no-store'});
      if(!response.ok) throw new Error('Homepage unavailable');
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const cardsOnHome = Array.from(html.querySelectorAll('.workshop-card'));
      const seen = new Set(), projects = [];
      for(const element of cardsOnHome){
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
      for(const p of projects){
        const el = existing.get(p.id) || newSlot(p);
        grid.appendChild(el);
        if(!el.id){
          const nameNode = el.querySelector('.slot-name');
          if (nameNode) nameNode.textContent = p.name;
          el.setAttribute('aria-label', p.name + ' — σε προετοιμασία');
        }
      }
      renumber();
      sync();
    } catch (error){
      renumber();
      sync();
    }
  }

  cards.forEach(cfg => {
    const view = $(cfg.prefix + '-view');
    const preview = $(cfg.prefix + '-preview');
    const close = $(cfg.prefix + '-preview-close');
    function openPreview(){
      if(!window.EduLabBadges || !window.EduLabBadges.unlocked(cfg.id)) return;
      if(preview && typeof preview.showModal === 'function') preview.showModal();
      else window.open(cfg.fallbackHref,'_blank','noopener,noreferrer');
    }
    if (view) view.addEventListener('click', openPreview);
    if (close && preview) close.addEventListener('click',()=>preview.close());
    if (preview) preview.addEventListener('click',event=>{if(event.target===preview)preview.close();});
  });

  window.addEventListener('pageshow',sync);
  window.addEventListener('storage',sync);
  sync();
  renumber();
  syncProjects();
})();
