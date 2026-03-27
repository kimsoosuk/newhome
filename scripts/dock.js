/* ═══════════════════════════════════════
   scripts/dock.js — 하단 독 네비게이션
   ═══════════════════════════════════════ */

function initDock() {
  document.querySelectorAll('.dock-item[href]').forEach(function (l) {
    l.addEventListener('click', function (e) {
      var h = l.getAttribute('href');
      if (!h || h === '#') return;
      e.preventDefault();
      var t = document.querySelector(h);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelectorAll('.dock-item').forEach(function (i) { i.classList.remove('active'); });
      l.classList.add('active');
    });
  });

  var spy = [
    { id: 'bulletin', el: document.getElementById('dockHome') },
    { id: 'sec-today', el: document.getElementById('dockToday') },
    { id: 'sec-study', el: document.getElementById('dockStudy') },
  ];
  var st;
  window.addEventListener('scroll', function () {
    clearTimeout(st);
    st = setTimeout(function () {
      var y = window.scrollY + window.innerHeight / 3;
      var active = spy[0];
      spy.forEach(function (s) {
        var el = document.getElementById(s.id);
        if (el && el.offsetTop <= y) active = s;
      });
      document.querySelectorAll('.dock-item').forEach(function (i) { i.classList.remove('active'); });
      if (active.el) active.el.classList.add('active');
    }, 80);
  });
}