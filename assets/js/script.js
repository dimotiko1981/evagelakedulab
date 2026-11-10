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
    wind: { title:'Ανεμογεννήτρια', description:'Μια κατασκευή που μας βοηθά να συνδέσουμε τον άνεμο με την παραγωγή κίνησης.', learn:'Τι είναι η ανανεώσιμη ενέργεια και πώς λειτουργεί ένας μηχανισμός περιστροφής.', challenge:'Μπορούμε να αλλάξουμε τον τρόπο ή την ταχύτητα που περιστρέφεται η κατασκευή;' },
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

  const questions = [
    { question:'Ποιο εξάρτημα βοηθά το ρομπότ να αντιλαμβάνεται το περιβάλλον του;', options:['Αισθητήρας','Τροχός','Καλώδιο φόρτισης'], answer:0, explanation:'Ο αισθητήρας συλλέγει πληροφορίες από το περιβάλλον.' },
    { question:'Τι χρησιμοποιούμε για να δώσουμε οδηγίες σε ένα ρομπότ;', options:['Ένα πρόγραμμα','Ένα πινέλο','Μια φωτογραφία'], answer:0, explanation:'Με ένα πρόγραμμα καθορίζουμε τι θα κάνει το ρομπότ.' },
    { question:'Τι κάνει ένας κινητήρας σε μια κατασκευή LEGO WeDo 2.0;', options:['Μετρά τη βροχή','Δημιουργεί κίνηση','Βγάζει φωτογραφίες'], answer:1, explanation:'Ο κινητήρας μπορεί να κινεί μέρη της κατασκευής.' }
  ];
  const optionsElement = document.querySelector('#quiz-options');
  const questionElement = document.querySelector('#quiz-question');
  const feedbackElement = document.querySelector('#quiz-feedback');
  const countElement = document.querySelector('#quiz-count');
  const nextButton = document.querySelector('#quiz-next');
  const progressElement = document.querySelector('#quiz-progress');
  let questionIndex = 0;
  let score = 0;
  let answered = false;
  function renderQuiz() {
    answered = false;
    const question = questions[questionIndex];
    countElement.textContent = `Ερώτηση ${questionIndex + 1} / ${questions.length}`;
    progressElement.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
    questionElement.textContent = question.question;
    feedbackElement.textContent = '';
    feedbackElement.className = 'quiz-feedback';
    nextButton.hidden = true;
    optionsElement.innerHTML = '';
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      const letter = document.createElement('span');
      letter.className = 'option-letter';
      letter.textContent = ['Α','Β','Γ'][index];
      const text = document.createElement('span');
      text.textContent = option;
      button.append(letter, text);
      button.addEventListener('click', () => answerQuestion(index));
      optionsElement.append(button);
    });
  }
  function answerQuestion(choice) {
    if (answered) return;
    answered = true;
    const question = questions[questionIndex];
    const correct = choice === question.answer;
    if (correct) score++;
    [...optionsElement.children].forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add('correct');
      else if (index === choice) button.classList.add('incorrect');
    });
    feedbackElement.textContent = `${correct ? 'Μπράβο! ' : 'Καλή προσπάθεια! '}${question.explanation}`;
    feedbackElement.classList.add(correct ? 'success' : 'failure');
    nextButton.textContent = questionIndex === questions.length - 1 ? 'Δες το αποτέλεσμα →' : 'Επόμενη ερώτηση →';
    nextButton.hidden = false;
  }
  nextButton.addEventListener('click', () => {
    if (questionIndex < questions.length - 1) {
      questionIndex++;
      renderQuiz();
    } else {
      const panel = document.querySelector('#quiz-panel');
      panel.innerHTML = `<div class="quiz-finished"><div class="final-star" aria-hidden="true">🏆</div><span class="quiz-label">ΟΛΟΚΛΗΡΩΣΕΣ ΤΗΝ ΑΠΟΣΤΟΛΗ!</span><h3>Μπράβο, εξερευνητή!</h3><p>Απάντησες σωστά σε <strong>${score} από τις ${questions.length}</strong> ερωτήσεις.<br>Κάθε δοκιμή μάς βοηθά να μαθαίνουμε!</p><button type="button" id="quiz-restart" class="btn btn-primary">Παίξε ξανά ↗</button></div>`;
      panel.querySelector('#quiz-restart').addEventListener('click', () => window.location.reload());
    }
  });
  renderQuiz();
})();
