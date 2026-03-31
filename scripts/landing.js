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
    // 자동 포커싱 효과 (화면 뜨자마자 바로 입력 가능하도록)
    if (landingInput) {
      if (window.innerWidth > 768) {
        // 데스크톱: 실제 포커스 (키보드 팝업 없음, 바로 타이핑 가능)
        landingInput.focus();
      } else {
        // 모바일/태블릿: 실제 포커스 시 터치 키보드가 화면을 가리는 현상 방지.
        // 시각적으로만 포커스된 것처럼 보이게 처리.
        landingInput.classList.add('pseudo-focus');
        // 실제 터치 시 가짜 포커스 클래스 제거
        landingInput.addEventListener('focus', function() {
          this.classList.remove('pseudo-focus');
        }, {once: true});
      }
    }
  }, 800);

  // 입장 공통 로직
  function enterSite(mode) {
    landing.classList.add('hidden');
    document.body.classList.remove('landing-active');

    var cp = document.getElementById('chatPanel');
    var isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // 모바일
      if (mode === 'chat') {
        if (cp) cp.classList.add('mobile-open');
        document.body.classList.add('chat-full'); // 독 메뉴 숨김 및 스크롤 락
      } else {
        if (cp) {
          cp.classList.remove('mobile-open');
          cp.setAttribute('data-mode', 'close');
        }
        document.body.classList.remove('chat-full'); // 독 메뉴 보이기
      }
    } else {
      // 데스크톱
      if (mode === 'chat') {
        // 채팅으로 입장 → 전체화면 채팅
        if (window.chatApi && typeof window.chatApi.setMode === 'function') {
          window.chatApi.setMode('full');
        }
      } else {
        // 버튼으로 입장 → 부분 채팅 + 블레틴 보이기
        if (window.chatApi && typeof window.chatApi.setMode === 'function') {
          window.chatApi.setMode('partial');
        }
      }
    }

    // 버튼으로 그냥 입장한 경우에만 인사말 출력
    if (mode === 'button') {
      setTimeout(function () {
        if (window.chatApi && typeof window.chatApi.greet === 'function') {
          window.chatApi.greet(true); // 강제 인사말 출력
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
