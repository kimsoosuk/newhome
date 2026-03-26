/* ═══════════════════════════════════════
   scripts/carousel.js — 무한 루프 캐러셀
   블레틴 보드의 슬라이드 전환 로직
   ═══════════════════════════════════════ */

function initCarousel() {
  var slides = document.getElementById('bbSlides');
  var dots = document.querySelectorAll('.bb-dot');
  var total = 3;
  var allSlides = slides.querySelectorAll('.bb-slide');
  var sw = 20; // 각 슬라이드는 컨테이너의 20%
  var pos = 1;
  var animating = false;

  // 무한 루프를 위해 첫/마지막 슬라이드 클론
  var cloneFirst = allSlides[0].cloneNode(true);
  var cloneLast = allSlides[allSlides.length - 1].cloneNode(true);
  slides.appendChild(cloneFirst);
  slides.insertBefore(cloneLast, allSlides[0]);
  // 구조: [clone-last, 0, 1, 2, clone-first]

  function setPos(p, animate) {
    if (!animate) slides.style.transition = 'none';
    else slides.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    slides.style.transform = 'translateX(-' + (p * sw) + '%)';
  }

  function updateDots() {
    var real = (pos - 1 + total) % total;
    dots.forEach(function(d, j) { d.classList.toggle('active', j === real); });
  }

  function goDir(dir) {
    if (animating) return;
    animating = true;
    pos += dir;
    setPos(pos, true);
    updateDots();
    setTimeout(function() {
      if (pos <= 0) { pos = total; setPos(pos, false); }
      else if (pos >= total + 1) { pos = 1; setPos(pos, false); }
      animating = false;
    }, 520);
  }

  function goTo(realIdx) {
    if (animating) return;
    pos = realIdx + 1;
    setPos(pos, true);
    updateDots();
    animating = true;
    setTimeout(function() { animating = false; }, 520);
  }

  // 초기 위치 설정
  setPos(pos, false);
  updateDots();

  // 이벤트 바인딩
  dots.forEach(function(d) {
    d.addEventListener('click', function() { goTo(+d.dataset.slide); });
  });

  // 터치 스와이프
  var car = document.getElementById('bbCarousel');
  var tx = 0;
  car.addEventListener('touchstart', function(e) { tx = e.touches[0].clientX; }, { passive: true });
  car.addEventListener('touchend', function(e) {
    var d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) goDir(d > 0 ? 1 : -1);
  }, { passive: true });

  // 화살표 버튼
  document.getElementById('bbPrev').addEventListener('click', function() { goDir(-1); });
  document.getElementById('bbNext').addEventListener('click', function() { goDir(1); });
}
