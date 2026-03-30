/* ═══════════════════════════════════════
   scripts/sections.js — 콘텐츠 섹션 빌더
   ═══════════════════════════════════════ */

function makeBook(b, i) {
  return '<a class="book-item animate-in" style="animation-delay: ' + (0.1 + i * 0.08) + 's" href="' + b.href + '" target="_blank">' +
    '<div class="book-cover"><div class="book-cover-iw">' +
    '<div class="book-cover-bg ' + b.cls + '"></div>' +
    '<div class="book-cover-inner-border"></div>' +
    '<div class="book-cover-shine"></div>' +
    '</div></div>' +
    '<div class="bc-text bc-top"><div class="book-cover-title">' + b.t + '</div></div>' +
    '<div class="bc-text bc-bot"><div class="book-cover-cat">' + b.c + '</div></div>' +
    '</a>';
}

function makeWhiteBook(d, i) {
  return '<a class="book-item animate-in" style="animation-delay: ' + (0.1 + i * 0.08) + 's" href="' + d.h + '" target="_blank">' +
    '<div class="book-cover cover-white"><div class="book-cover-iw">' +
    '<div class="book-cover-bg" style="background:#ffffff"></div>' +
    '<div class="book-cover-inner-border" style="border-color:rgba(91,58,122,.3)"></div>' +
    '<div class="book-cover-shine"></div>' +
    '</div></div>' +
    '<div class="bc-text" style="top:clamp(16px,2.5vw,26px)">' +
    '<div class="white-jamo">' + d.j + '</div>' +
    '<div class="white-sub">' + d.s + '</div></div>' +
    '<div class="bc-text" style="bottom:clamp(14px,2vw,24px)">' +
    '<div style="font-size:clamp(10px,1.4vw,12px);color:#888;font-weight:500;letter-spacing:.2px">' + d.t + '</div></div>' +
    '</a>';
}

function makeRecommendBook(r, i) {
  return '<a class="book-item animate-in" style="animation-delay: ' + (0.1 + i * 0.08) + 's" href="' + r.href + '" target="_blank">' +
    '<div class="book-cover cover-img"><div class="book-cover-iw">' +
    '<div class="book-cover-bg" style="background-image:url(\'' + r.img + '\')"></div>' +
    '<div class="book-cover-shine"></div>' +
    '</div></div>' +
    '<div style="margin-top:10px;padding:0 2px">' +
    '<div style="font-weight:600;font-size:12px;color:var(--text-primary);line-height:1.3">' + r.t + '</div>' +
    '<div style="font-size:10px;color:var(--text-tertiary);margin-top:2px">' + r.pub + '</div>' +
    '</div></a>';
}

function buildSections() {
  var CA = document.getElementById('contentArea');
  var html = '';

  SECTIONS_DATA.forEach(function (sec) {
    html += '<section class="programs-section" id="' + sec.id + '">';
    html += '<div class="program-header animate-in">';
    html += '<div class="program-title">' + sec.title + '</div>';
    html += '<div class="program-subtitle">' + sec.sub + '</div></div>';
    html += '<div class="program-scroll">';
    if (sec.white) {
      METHOD_DATA.forEach(function (d, i) { html += makeWhiteBook(d, i); });
    } else if (sec.books) {
      sec.books.forEach(function (b, i) { html += makeBook(b, i); });
    }
    html += '</div></section>';
  });

  // 타이머
  html += '<section class="timer-section" id="sec-timer">' +
    '<div class="program-header animate-in"><div class="program-title">공부 타이머</div>' +
    '<div class="program-subtitle">25분 집중, 5분 휴식 — 포모도로 기법</div></div>' +
    '<div class="timer-wrap">' +
    '<div class="timer-mode" id="tML">공부 시간</div>' +
    '<svg class="timer-svg" viewBox="0 0 120 120">' +
    '<circle class="timer-bg" cx="60" cy="60" r="52"/>' +
    '<circle class="timer-progress" id="tP" cx="60" cy="60" r="52" stroke-dasharray="326.73" stroke-dashoffset="0"/>' +
    '<text class="timer-text" id="tT" x="60" y="45" text-anchor="middle" dominant-baseline="central">25:00</text>' +
    '<text class="timer-label-txt" x="60" y="80" text-anchor="middle">25분 집중 / 5분 휴식</text></svg>' +
    '<div class="timer-controls">' +
    '<button class="timer-btn start" id="tS">시작</button>' +
    '<button class="timer-btn reset" id="tR">초기화</button>' +
    '</div></div></section>';

  // 수석의 추천도서
  html += '<section class="programs-section" id="sec-recommend">' +
    '<div class="program-header animate-in"><div class="program-title">수석의 추천도서</div>' +
    '<div class="program-subtitle">수석 선생님이 직접 고른 필독서</div></div>' +
    '<div class="program-scroll">';
  RECOMMEND_DATA.forEach(function (r, i) { html += makeRecommendBook(r, i); });
  html += '</div></section>';

  // 진단
  html += '<section class="programs-section" id="sec-diag" style="padding-bottom:20px;background:#fff">' +
    '<div class="program-header animate-in"><div class="program-title">진단</div>' +
    '<div class="program-subtitle">나를 알아가는 공부 진단</div></div>' +
    '<div class="diag-scroll" style="padding-bottom:10px">';
  DIAGNOSTICS_DATA.forEach(function (c, i) {
    html += '<div class="diag-card animate-in delay-' + (i % 4 + 1) + '">' +
      '<div class="diag-card-title">' + c.t + '</div>' +
      '<div class="diag-card-desc">' + c.d + '</div>' +
      '<span class="diag-card-tag">진단하기</span></div>';
  });
  html += '</div></section>';

  CA.innerHTML = html;
}

function buildHomework() {
  var hwScroll = document.getElementById('hwScroll');
  HOMEWORK_DATA.forEach(function (h) {
    hwScroll.innerHTML += '<div class="hw-book"><div class="hw-book-cover">' +
      '<div class="hw-cover-bg ' + h.cls + '"></div>' +
      '<div class="hw-cover-shine"></div><div class="hw-inner-border"></div>' +
      '<div style="position:absolute;top:32px;left:0;right:0;text-align:center;z-index:5">' +
      '<div class="hw-cover-title">' + h.t + '</div></div>' +
      '<div style="position:absolute;bottom:32px;left:0;right:0;text-align:center;z-index:5">' +
      '<div class="hw-cover-subtitle">' + h.s + '</div></div></div></div>';
  });
}