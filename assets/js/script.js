(() => {
  "use strict";
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-menu');
  menuButton.addEventListener('click', () => {
    const opened = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!opened));
    menuButton.setAttribute('aria-label', opened ? 'Άνοιγμα μενού' : 'Κλείσιμο μενού');
    nav.classList.toggle('open', !opened);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Άνοιγμα μενού');
  }));
  document.querySelector('#year').textContent = new Date().getFullYear();

  // v45: One catalog model for topic, hardware, text search and pagination.
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('#workshop-list .workshop-card')];
  // Keep the newest year/workshop first, even if its card was added at the end.
  const projectRank = card => {
    const href = card.querySelector('.workshop-action')?.getAttribute('href') || '';
    const match = href.match(/workshops\/(\d{4})-\d{4}\/(\d+)-/);
    return match ? Number(match[1]) * 1000 + Number(match[2]) : 0;
  };
  cards.sort((a, b) => projectRank(b) - projectRank(a));
  const workshopGrid = document.querySelector('#workshop-list');
  cards.forEach(card => workshopGrid.appendChild(card));
  const searchInput = document.querySelector('#workshop-search');
  const equipmentSelect = document.querySelector('#workshop-equipment');
  const resultsCount = document.querySelector('#workshop-results-count');
  const emptyState = document.querySelector('#workshop-empty');
  const resetButton = document.querySelector('#workshop-reset');
  const pagination = document.querySelector('#workshop-pagination');
  const numbers = document.querySelector('#workshop-page-numbers');
  const previous = document.querySelector('#workshop-page-prev');
  const next = document.querySelector('#workshop-page-next');
  const ITEMS_PER_PAGE = 8;
  let topic = 'all';
  let currentPage = 1;

  // Equipment choices appear automatically when an actual project uses them.
  // Future cards: data-equipment="microbit" or "tpbot microbit".
  const equipmentNames = { wedo2:'LEGO WeDo 2.0', microbit:'micro:bit', tpbot:'TPBot' };
  const equipmentValues = [...new Set(cards.flatMap(card =>
    (card.dataset.equipment || '').split(/\s+/).filter(Boolean)))];
  const equipmentOrder = ['wedo2', 'microbit', 'tpbot'];
  equipmentValues.sort((a, b) => {
    const ia = equipmentOrder.indexOf(a), ib = equipmentOrder.indexOf(b);
    return (ia < 0 ? 100 : ia) - (ib < 0 ? 100 : ib);
  });
  equipmentValues.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = equipmentNames[value] || value;
    equipmentSelect.appendChild(option);
  });

  const normalize = value => String(value || '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('el').trim();
  const searchable = cards.map(card => ({
    card,
    text: normalize(card.textContent + ' ' + (card.dataset.equipment || '') + ' ' +
      (card.dataset.category || ''))
  }));
  function jumpToCatalog() {
    const heading = document.querySelector('#workshops-title');
    if (heading) heading.scrollIntoView({ behavior:'smooth', block:'start' });
  }
  function createPageButton(page) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'workshop-page-btn' + (page === currentPage ? ' active' : '');
    button.textContent = String(page);
    button.setAttribute('aria-label', `Σελίδα ${page}`);
    if (page === currentPage) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => {
      if (currentPage !== page) {
        currentPage = page;
        renderCatalog(true);
      }
    });
    return button;
  }
  function renderCatalog(scrollAfterPageChange = false) {
    const query = normalize(searchInput.value);
    const equipment = equipmentSelect.value;
    const matches = searchable.filter(({card, text}) =>
      (topic === 'all' || card.dataset.category === topic) &&
      (equipment === 'all' || (card.dataset.equipment || '').split(/\s+/).includes(equipment)) &&
      (!query || text.includes(query)));
    const total = matches.length;
    const pages = Math.ceil(total / ITEMS_PER_PAGE);
    currentPage = Math.max(1, Math.min(currentPage, pages || 1));
    const first = (currentPage - 1) * ITEMS_PER_PAGE;
    const visible = new Set(matches.slice(first, first + ITEMS_PER_PAGE).map(item => item.card));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    emptyState.hidden = total !== 0;
    resultsCount.textContent = total
      ? `Εμφανίζονται ${first + 1}–${Math.min(first + ITEMS_PER_PAGE, total)} από ${total} κατασκευές`
      : '0 κατασκευές';
    pagination.hidden = pages <= 1;
    numbers.replaceChildren();
    for (let page = 1; page <= pages; page++) numbers.appendChild(createPageButton(page));
    previous.disabled = currentPage <= 1;
    next.disabled = currentPage >= pages;
    if (scrollAfterPageChange) jumpToCatalog();
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    topic = button.dataset.filter;
    currentPage = 1;
    filterButtons.forEach(btn => {
      const active = btn === button;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    renderCatalog();
  }));
  searchInput.addEventListener('input', () => { currentPage = 1; renderCatalog(); });
  equipmentSelect.addEventListener('change', () => { currentPage = 1; renderCatalog(); });
  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    equipmentSelect.value = 'all';
    currentPage = 1;
    filterButtons[0]?.click();
    searchInput.focus();
  });
  previous.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderCatalog(true); }
  });
  next.addEventListener('click', () => {
    const equipment = equipmentSelect.value;
    const query = normalize(searchInput.value);
    const total = searchable.filter(({card,text}) =>
      (topic === 'all' || card.dataset.category === topic) &&
      (equipment === 'all' || (card.dataset.equipment || '').split(/\s+/).includes(equipment)) &&
      (!query || text.includes(query))).length;
    if (currentPage < Math.ceil(total / ITEMS_PER_PAGE)) {
      currentPage++;
      renderCatalog(true);
    }
  });
  renderCatalog();

  const workshopDetails = {
    rally: { title:'Ρομποτικό Rally — Drift Car με φτερό', description:'Το πρώτο φετινό μας εργαστήριο είναι ένα αγωνιστικό όχημα LEGO WeDo 2.0 με πίσω φτερό.', learn:'Πώς συνεργάζονται τα εξαρτήματα της κατασκευής και πώς ο προγραμματισμός ελέγχει την κίνηση.', challenge:'Μπορούμε να δοκιμάσουμε διαφορετικές ταχύτητες και να παρατηρήσουμε την κίνηση του αυτοκινήτου;' },
    bin: { title:'Έξυπνος κάδος', description:'Ένα καθημερινό αντικείμενο γίνεται αφορμή για μια έξυπνη ρομποτική λύση.', learn:'Πώς συνδυάζουμε αισθητήρες, εντολές και μηχανισμούς για να λύνουμε προβλήματα.', challenge:'Πώς μπορεί ο κάδος να αντιδρά όταν πλησιάζει ένα αντικείμενο;' },
    keeper: { title:'Τερματοφύλακας', description:'Ένα παιχνίδι ποδοσφαίρου γίνεται η βάση για πειραματισμό με τον προγραμματισμό.', learn:'Πώς οι εντολές επηρεάζουν την κίνηση και πώς δοκιμάζουμε διαφορετικές λύσεις.', challenge:'Μπορούμε να κάνουμε τον τερματοφύλακα να κινείται με διαφορετικό ρυθμό;' },
    shark: { title:'Καρχαρίας', description:'Παρατηρούμε τον κόσμο των θαλάσσιων ζώων και δημιουργούμε μια κινούμενη κατασκευή.', learn:'Πώς μιμούμαστε κινήσεις της φύσης μέσα από μηχανισμούς.', challenge:'Πώς αλλάζει η συμπεριφορά του μοντέλου όταν τροποποιούμε τις εντολές;' }
  };
  const dialog = document.querySelector('#workshop-dialog');
  let lastTrigger = null;
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
    const details = workshopDetails[button.dataset.open];
    if (!details) return;
    lastTrigger = button;
    document.querySelector('#dialog-title').textContent = details.title;
    document.querySelector('#dialog-description').textContent = details.description;
    document.querySelector('#dialog-learn').textContent = details.learn;
    document.querySelector('#dialog-challenge').textContent = details.challenge;
    dialog.showModal();
  }));
  function closeDialog() { dialog.close(); }
  dialog.querySelector('.modal-close').addEventListener('click', closeDialog);
  dialog.querySelector('.modal-done').addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('close', () => lastTrigger?.focus());
})();
