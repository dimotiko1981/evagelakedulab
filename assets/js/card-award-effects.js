/* EVAGELAK EDU LAB | one ceremony per LEVEL (gold/silver/bronze).
   Presentation only: quiz answers, badge award(), and localStorage are unchanged. */
(() => {
  'use strict';
  const TIER = document.body.dataset.awardTier;
  if (!['gold', 'silver', 'bronze'].includes(TIER)) return;
  const host = document.getElementById('quiz-content') || document.getElementById('game');
  if (!host) return;

  const decorate = () => {
    let stage = host.querySelector('.award-stage, .basket-award-stage, .scooter-award-stage, .edulab-award');
    if (!stage) {
      const frisbee = host.querySelector('.result img.frisbee-award-art');
      if (!frisbee) return;
      stage = document.createElement('div');
      frisbee.parentNode.insertBefore(stage, frisbee);
      stage.appendChild(frisbee);
    }
    if (stage.dataset.edulabCeremony) return;
    stage.dataset.edulabCeremony = TIER;
    stage.classList.add('edulab-award', `edulab-award--${TIER}`);

    const ring = document.createElement('span');
    ring.className = 'edulab-award__ring';
    ring.setAttribute('aria-hidden', 'true');
    stage.insertBefore(ring, stage.firstChild);

    const sparks = TIER === 'gold' ? 10 : TIER === 'silver' ? 5 : 7;
    for (let i = 0; i < sparks; i += 1) {
      const spark = document.createElement('span');
      spark.className = 'edulab-award__spark';
      spark.setAttribute('aria-hidden', 'true');
      const angle = (-90 + i * 360 / sparks) * Math.PI / 180;
      spark.style.setProperty('--sx', `${Math.round(Math.cos(angle) * (TIER === 'gold' ? 165 : 139))}px`);
      spark.style.setProperty('--sy', `${Math.round(Math.sin(angle) * (TIER === 'gold' ? 147 : 126))}px`);
      spark.style.setProperty('--delay', `${Math.round(i * 75 + 260)}ms`);
      stage.appendChild(spark);
    }
  };

  // Observe only the quiz output, never the entire page. The existing result
  // renderer may rebuild its DOM on retries, so decorate each new result once.
  const observer = new MutationObserver(decorate);
  observer.observe(host, {childList: true, subtree: true});
  decorate();
})();
