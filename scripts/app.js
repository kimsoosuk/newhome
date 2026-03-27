/* ═══════════════════════════════════════
   scripts/app.js — 앱 초기화
   ═══════════════════════════════════════ */

(function () {
  buildSections();
  buildHomework();
  initPlanner();
  initCarousel();
  initChat();
  initTimer();
  initDock();
  initLanding();

  // 스크롤 애니메이션
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.opacity = '';
        e.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    el.style.opacity = '0';
    el.style.animationPlayState = 'paused';
    obs.observe(el);
  });
})();