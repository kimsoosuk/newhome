/* ═══════════════════════════════════════
   scripts/planner.js — 플래너 렌더링
   data/schedule.js의 데이터를 읽어서 그리드 생성
   ═══════════════════════════════════════ */

function initPlanner() {
  var now = new Date();
  var tD = (now.getDay() + 6) % 7; // 월=0 ~ 일=6
  var cH = now.getHours();

  // 요일 헤더
  var pH = document.getElementById('pwH');
  pH.innerHTML = '<div class="planner-day-label"></div>' +
    DAY_LABELS.map(function(d, i) {
      return '<div class="planner-day-label' + (i === tD ? ' today' : '') + '">' + d + '</div>';
    }).join('');

  // 시간 그리드
  var pB = document.getElementById('pwB');
  var html = '';
  for (var h = 6; h <= 22; h++) {
    html += '<div class="planner-row">';
    html += '<div class="planner-time' + (h === cH ? ' current' : '') + '">' + (h < 10 ? '0' : '') + h + ':00</div>';
    for (var d = 0; d < 7; d++) {
      var cc = (d === tD && h === cH) ? ' current-cell' : '';
      var ev = SCHEDULE_DATA.find(function(e) { return e.day === d && h >= e.h && h < e.end; });
      html += '<div class="planner-cell' + cc + '">';
      if (ev) html += '<div class="plan-block ' + ev.type + '">' + ev.l + '</div>';
      html += '</div>';
    }
    html += '</div>';
  }
  pB.innerHTML = html;
}
