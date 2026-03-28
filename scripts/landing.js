/* ═══════════════════════════════════════
   scripts/landing.js — 랜딩 페이지 로직
   ═══════════════════════════════════════ */

function initLanding() {
  var landing = document.getElementById('landingPage');
  var landingInput = document.getElementById('landingInput');
  var enterBtn = document.getElementById('landingEnterBtn');

  if (!landing) return;

  // 데스크 조명 효과 — 약간의 딜레이 후 스탠딩 라이트 켜짐
  setTimeout(function () {
    landing.classList.add('light-on');
  }, 800);

  // 입장 공통 로직
  function enterSite(mode) {
    landing.classList.add('hidden');
    document.body.classList.remove('landing-active');

    var cp = document.getElementById('chatPanel');
    var isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // 모바일: 채팅 열기
      if (cp) cp.classList.add('mobile-open');
    } else {
      // 데스크톱
      if (mode === 'chat') {
        // 채팅으로 입장 → 전체화면 채팅
        if (typeof initChat._setMode === 'function') {
          initChat._setMode('full');
        }
      } else {
        // 버튼으로 입장 → 부분 채팅 + 블레틴 보이기
        if (typeof initChat._setMode === 'function') {
          initChat._setMode('partial');
        }
      }
    }

    // 버튼으로 그냥 입장한 경우에만 인사말 출력
    if (mode === 'button') {
      setTimeout(function () {
        if (typeof initChat._greet === 'function') {
          initChat._greet();
        }
      }, 400);
    }
  }

  // 입력창으로 들어가기 (한글 IME 대응)
  landingInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      submitLandingChat();
    }
  });

  // 랜딩 챗 전송 버튼 (새로 추가됨)
  var landingSendBtn = document.getElementById('landingSendBtn');
  if (landingSendBtn) {
    landingSendBtn.addEventListener('click', function(e) {
      e.preventDefault();
      submitLandingChat();
    });
  }

  function submitLandingChat() {
    var msg = landingInput.value.trim();
    if (!msg) return;

    enterSite('chat');

    // 사용자의 첫 메시지를 채팅에 전달
    setTimeout(function () {
      var chatInput = document.getElementById('aiInput');
      if (chatInput) {
        chatInput.value = msg;
        var sendBtn = document.getElementById('aiSendBtn');
        if (sendBtn) sendBtn.click();
      }
    }, 1200);
  }

  // 입장 버튼으로 들어가기
  enterBtn.addEventListener('click', function () {
    enterSite('button');
  });

  // 랜딩 활성화 시 배경 스크롤 방지
  document.body.classList.add('landing-active');
}
