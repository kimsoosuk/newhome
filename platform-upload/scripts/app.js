/* ═══════════════════════════════════════
   scripts/app.js — 앱 초기화
   모든 모듈을 순서대로 실행합니다.
   
   이 파일은 index.html에서 가장 마지막에 로드됩니다.
   그래서 data/*.js와 scripts/*.js의 모든 함수를
   사용할 수 있습니다.
   ═══════════════════════════════════════ */

(function() {
  // 1. 콘텐츠 섹션 생성 (data/programs.js 데이터 사용)
  buildSections();
  buildHomework();

  // 2. 플래너 렌더링 (data/schedule.js 데이터 사용)
  initPlanner();

  // 3. 캐러셀 초기화
  initCarousel();

  // 4. 채팅 패널 초기화
  initChat();

  // 5. 타이머 초기화
  initTimer();

  // 6. 독 네비게이션 초기화
  initDock();

  // 7. 스크롤 애니메이션
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.style.opacity = '';
        e.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.animate-in').forEach(function(el) {
    el.style.opacity = '0';
    el.style.animationPlayState = 'paused';
    obs.observe(el);
  });
})();
