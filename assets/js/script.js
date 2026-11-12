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

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.workshop-card')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => {
      const active = btn === button;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  }));

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
