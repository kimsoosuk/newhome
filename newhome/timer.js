/* ═══════════════════════════════════════
   scripts/timer.js — 포모도로 타이머
   ═══════════════════════════════════════ */

function initTimer() {
  var WORK = 25 * 60;
  var REST = 5 * 60;
  var CIRC = 2 * Math.PI * 52;
  var total = WORK;
  var remain = WORK;
  var running = false;
  var interval = null;
  var isRest = false;

  var pr = document.getElementById('tP');
  var tt = document.getElementById('tT');
  var ml = document.getElementById('tML');
  var sb = document.getElementById('tS');

  function update() {
    var m = Math.floor(remain / 60);
    var s = remain % 60;
    tt.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    pr.style.strokeDashoffset = CIRC * (1 - remain / total);
  }

  function tick() {
    remain--;
    if (remain < 0) {
      clearInterval(interval);
      running = false;
      if (!isRest) {
        isRest = true; total = REST; remain = REST;
        ml.textContent = '휴식 시간';
        ml.className = 'timer-mode rest-mode';
        pr.classList.add('rest');
        sb.textContent = '시작';
      } else {
        isRest = false; total = WORK; remain = WORK;
        ml.textContent = '공부 시간';
        ml.className = 'timer-mode';
        pr.classList.remove('rest');
        sb.textContent = '시작';
      }
    }
    update();
  }

  sb.addEventListener('click', function() {
    if (running) {
      clearInterval(interval); running = false; sb.textContent = '시작';
    } else {
      running = true; sb.textContent = '정지';
      interval = setInterval(tick, 1000);
    }
  });

  document.getElementById('tR').addEventListener('click', function() {
    clearInterval(interval); running = false; isRest = false;
    total = WORK; remain = WORK;
    ml.textContent = '공부 시간';
    ml.className = 'timer-mode';
    pr.classList.remove('rest');
    sb.textContent = '시작';
    update();
  });

  update();
}
