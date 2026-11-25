/* EVAGELAK EDU LAB — local-only earned badge state; no personal data. */
(function () {
  'use strict';
  const KEY = 'evagelak-edulab-badges-v1';
  const targets = Object.freeze({
    't-rex': 10, octopus: 6, basket: 8, frisbee: 8, 'electric-scooter': 8, 'smart-bin': 8, forklift: 8, 'forklift-2': 8
  });
  function qualifies(id, score, total) {
    return Object.hasOwn(targets, id) && Number.isInteger(score) && Number.isInteger(total)
      && total > 0 && score <= total && score * 10 >= targets[id] * total;
  }
  function showRetry(root, id, score, total) {
    const result = document.createElement('div');
    result.className = 'result end';
    const message = document.createElement('h2');
    message.textContent = 'Σωστές απαντήσεις: ' + score + '/' + total;
    const target = document.createElement('p');
    target.textContent = 'Ο στόχος για αυτή την κάρτα είναι ' + Math.ceil(targets[id] * total / 10) + '/' + total + '.';
    const button = document.createElement('button');
    button.className = 'btn';
    button.textContent = 'Δοκίμασε ξανά';
    button.onclick = () => location.reload();
    result.append(message, target, button);
    root.replaceChildren(result);
  }
  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return {};
      const value = JSON.parse(raw);
      if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
      return value;
    } catch (_) { return {}; }
  }
  function unlocked(id) { return Object.hasOwn(targets, id) && read()[id] === true; }
  function award(id, score, total) {
    if (!qualifies(id, score, total)) return false;
    const data = read();
    data[id] = true;
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch (_) { return false; } // Still show the earned badge in the quiz.
  }
  window.EduLabBadges = Object.freeze({ unlocked, award, qualifies, showRetry });

  // Collectible-card artwork belongs in the album and quiz award screen,
  // not in the footer area of individual workshop pages.
  function removeWorkshopCardTeasers() {
    if (!document.body || !document.body.classList) return;
    document.querySelectorAll('main .ws-badge-teaser').forEach(section => section.remove());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeWorkshopCardTeasers, { once: true });
  } else {
    removeWorkshopCardTeasers();
  }
})();
