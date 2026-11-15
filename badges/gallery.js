(function(){
  'use strict';
  const earned = Boolean(window.EduLabBadges && window.EduLabBadges.unlocked('t-rex'));
  const card = document.getElementById('trex-card');
  const visual = document.getElementById('trex-visual');
  if (earned) {card.classList.add('earned'); visual.classList.remove('locked');}
  document.getElementById('trex-status').textContent = earned ? 'ΚΕΡΔΙΣΜΕΝΗ' : 'ΚΛΕΙΔΩΜΕΝΗ';
  document.getElementById('collection-count').textContent = (earned ? 1 : 0) + ' / 1 κονκάρδα';
  document.getElementById('trex-description').textContent = earned
    ? 'Μπράβο! Ολοκλήρωσες το quiz του Ρομποτικού T-Rex. Η κονκάρδα είναι πλέον στη συλλογή σου.'
    : 'Ολοκλήρωσε και τις 10 ερωτήσεις του quiz του T-Rex — δεν χρειάζεται να έχεις όλες τις απαντήσεις σωστές.';
  document.getElementById('trex-download').hidden = !earned;
  document.getElementById('trex-quiz-link').textContent = earned ? 'Παίξε ξανά ↗' : 'Παίξε το quiz ↗';
})();
