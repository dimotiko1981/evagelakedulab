/* EVAGELAK EDU LAB — local-only earned badge state; no personal data. */
(function () {
  'use strict';
  const KEY = 'evagelak-edulab-badges-v1';
  const VALID = new Set(['t-rex','octopus','basket','frisbee','electric-scooter','smart-bin']);
  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return {};
      const value = JSON.parse(raw);
      if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
      return value;
    } catch (_) { return {}; }
  }
  function unlocked(id) { return VALID.has(id) && read()[id] === true; }
  function award(id) {
    if (!VALID.has(id)) return false;
    const data = read();
    data[id] = true;
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch (_) { return false; } // Still show the earned badge in the quiz.
  }
  window.EduLabBadges = Object.freeze({ unlocked, award });

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
