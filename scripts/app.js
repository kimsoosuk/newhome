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

  // 책 컴포넌트(.book-item)는 스크롤 전에 백그라운드에서 한 번에 
  // 애니메이션 되며 미리딩(로드) 되도록 옵저버 대기에서 제외합니다.
  document.querySelectorAll('.animate-in:not(.book-item)').forEach(function (el) {
    el.style.opacity = '0';
    el.style.animationPlayState = 'paused';
    obs.observe(el);
  });
})();