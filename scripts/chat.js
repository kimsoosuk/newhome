/* ═══════════════════════════════════════
   scripts/chat.js — 노트 필담 채팅
   API 연동 + 한 줄씩 쓰기 + 연필 소리
   3-state: close / partial / full
   ═══════════════════════════════════════ */

function initChat() {
  var cp = document.getElementById('chatPanel');
  var chatArea = document.getElementById('noteChatArea');
  var input = document.getElementById('aiInput');
  var sendBtn = document.getElementById('aiSendBtn');
  var bookmark = document.getElementById('chatBookmark');
  var dockChat = document.getElementById('dockChat');
  var resizeBtns = document.querySelectorAll('.note-resize-btn, .chat-header-btn.resize-clone');
  var isMobile = window.innerWidth <= 768;
  var greeted = false;
  var sending = false; // 중복 전송 방지
  var chatHistory = [];
  var lastRole = null; // 대화 턴 추적용 (공백 자동 추가용)

  // ── 연필 소리 (Web Audio API) ──
  var audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
    }
  }
  function playPencilSound(duration) {
    if (!audioCtx) return;
    try {
      var bufSize = Math.floor(audioCtx.sampleRate * (duration || 0.15));
      var buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.012 * Math.sin(i / bufSize * Math.PI);
      }
      var src = audioCtx.createBufferSource();
      src.buffer = buf;
      var filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3200 + Math.random() * 2000;
      filter.Q.value = 0.5;
      var gain = audioCtx.createGain();
      gain.gain.value = 0.35;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      src.start();
    } catch (e) { }
  }

  // ── 메시지 추가 (문장 단위 분리 및 한 줄씩 적히는 효과) ──
  function addMessage(text, role, onDone, noSpacer) {
    initAudio();

    // 턴이 바뀌거나, 명시적으로 스페이서가 필요한 경우 한 줄 띄움 효과(margin-top)
    var isTurnStart = false;
    if (chatArea.children.length > 0) {
      if (lastRole !== null && lastRole !== role) {
        isTurnStart = true; // 화자가 바뀌면 무조건 띄움
      } else if (!noSpacer) {
        isTurnStart = true; // 같은 화자인데 noSpacer가 아니면 띄움
      }
    }
    lastRole = role;

    // 실제 픽셀 너비로 maxLen 계산 (canvas.measureText 활용)
    var availableWidth = chatArea.clientWidth - 80; // 좌우 padding 40px씩 (partial 모드: 32px씩)
    var testFont = '"Gowun Batang", serif';
    var charPx = measureCharPx('15px', testFont);
    // 0.78 = 15% 안전 마진 (웹폰트 로딩 전이라면 canvas가 폭을 더 좁게 측정할 수 있음)
    var safePx = availableWidth * 0.78;
    var maxLen = Math.max(8, Math.floor(safePx / charPx));

    // 1. 개행(\n)으로만 먼저 분리
    var blocks = text.split('\n');
    var allLines = [];
    blocks.forEach(function (blk) {
      if (blk.trim() === '') {
        allLines.push(''); // 빈 로우
        return;
      }
      // 2. 캔버스 실측 글자수(또는 구간) 기준으로 분할
      var subLines = splitToLines(blk.trim(), maxLen, safePx, '15px', testFont);
      allLines = allLines.concat(subLines);
    });

    var delay = 0;
    allLines.forEach(function (line, idx) {
      var el = document.createElement('div');
      el.className = 'note-msg ' + role;
      if (idx === 0 && isTurnStart) el.classList.add('turn-start');
      el.textContent = line;
      chatArea.appendChild(el);

      setTimeout(function () {
        el.classList.add('visible');
        playPencilSound(0.1 + Math.random() * 0.1);
        chatArea.scrollTop = chatArea.scrollHeight;
        if (idx === allLines.length - 1 && onDone) onDone();
      }, delay);

      delay += 150 + line.length * 10;
    });
  }

  // canvas 로 한 글자 평균 픽셀 너비 측정
  var _charPxCache = {};
  function measureCharPx(fontSize, fontFamily) {
    var key = fontSize + fontFamily;
    if (_charPxCache[key]) return _charPxCache[key];
    try {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.font = fontSize + ' ' + fontFamily;
      var sample = '가나다라마바사아자차카타파하';
      var w = ctx.measureText(sample).width / sample.length;
      _charPxCache[key] = w;
      return w;
    } catch(e) {
      return 16; // 폴백값
    }
  }

  function splitToLines(text, maxLen, maxPx, fontSize, fontFamily) {
    if (!text) return [''];

    var ctx = null;
    try {
      var c = document.createElement('canvas');
      ctx = c.getContext('2d');
      ctx.font = fontSize + ' ' + fontFamily;
    } catch(e) { ctx = null; }

    var result = [];
    var remaining = text;
    while (remaining.length > 0) {
      if (ctx && maxPx) {
        // 실제 px 지원에 맞는 최대 글자수를 이진탐색으로 찾음
        var lo = 1, hi = remaining.length, fit = 1;
        while (lo <= hi) {
          var mid = (lo + hi) >> 1;
          var w = ctx.measureText(remaining.substr(0, mid)).width;
          if (w <= maxPx) { fit = mid; lo = mid + 1; }
          else { hi = mid - 1; }
        }
        result.push(remaining.substr(0, fit));
        remaining = remaining.substr(fit);
      } else {
        result.push(remaining.substr(0, maxLen));
        remaining = remaining.substr(maxLen);
      }
    }
    return result;

  }

  // ── API 호출 (Worker 경유) ──
  function callAPI(userMsg, callback) {
    chatHistory.push({ role: 'user', content: userMsg });

    fetch('https://home.kimsoosuk1.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: 'kimsoosuk',
        messages: chatHistory
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var reply = data.reply || '미안, 다시 한 번 물어봐줄래?';

        // [디버깅 임시 코드] 에러 원인을 화면에서 파악할 수 있도록 덧붙임
        if (data.error && data.error.length > 0) {
          reply += '\n\n(상세 오류: ' + data.error + ')';
        }

        chatHistory.push({ role: 'assistant', content: reply });
        callback(reply);
      })
      .catch(function (error) {
        var fallback = '지금 연결이 좀 불안정해. 잠시 후에 다시 물어봐줄래?\n\n(네트워크 오류: ' + error.message + ')';
        callback(fallback);
      });
  }

  // ── 메시지 전송 (중복 방지) ──
  function sendMsg() {
    if (sending) return;
    var t = input.value.trim();
    if (!t) return;
    sending = true;
    input.value = '';
    addMessage(t, 'user');

    setTimeout(function () {
      callAPI(t, function (reply) {
        addMessage(reply, 'ai', function () {
          sending = false;
        });
      });
    }, 300);
  }

  sendBtn.addEventListener('click', sendMsg);

  // ── IME 한글 입력 중복 방지 ──
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      sendMsg();
    }
  });
  // compositionend 이벤트로 한글 조합 완료 후 Enter 처리
  var compositionJustEnded = false;
  input.addEventListener('compositionend', function () {
    compositionJustEnded = true;
    setTimeout(function () { compositionJustEnded = false; }, 100);
  });

  // ── 인사 (한 번만) ──
  function greet(force) {
    if (greeted && !force) return;

    // 이미 대화가 진행 중이면 (랜딩에서 바로 질문해서 들어온 경우 등) 인사를 생략 (강제 호출 시 무시)
    if (!force && (chatHistory.length > 0 || chatArea.children.length > 0)) {
      greeted = true;
      return;
    }

    greeted = true;
    setTimeout(function () {
      addMessage('안녕 반가워!', 'ai', function () {
        setTimeout(function () {
          addMessage('오늘 하루 잘 보내고 있어?', 'ai', null, true);
        }, 600);
      });
    }, 400); // 사용자 요청에 따라 조금 더 빠르게 반응하도록 조정
  }

  // 외부에서 호출 가능하도록
  initChat._greet = greet;

  // ── 대화 새로고침 ──
  var refreshBtns = document.querySelectorAll('#noteRefreshBtn, .chat-header-btn[data-action="refresh"]');
  refreshBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // 채팅 내용 초기화
      chatArea.innerHTML = '';
      chatHistory = [];
      greeted = false;
      sending = false;
      lastRole = null; // 초기화

      // 다시 인사하기
      greet(true);
    });
  });

  // ── 리사이즈 모드 (3-state: close / partial / full) ──
  function setMode(mode) {
    cp.setAttribute('data-mode', mode);
    resizeBtns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });
    var ca = document.getElementById('contentArea');
    var bb = document.getElementById('bulletin');

    if (mode === 'close') {
      document.body.classList.add('chat-closed');
      document.body.classList.remove('chat-full');
      cp.classList.remove('mobile-open'); // 모바일 열림 상태도 함께 해제
      if (ca) ca.style.marginLeft = '0';
      if (bb) bb.style.marginLeft = '0';
    } else if (mode === 'full') {
      document.body.classList.remove('chat-closed');
      document.body.classList.add('chat-full');
      if (ca && window.innerWidth > 768) ca.style.marginLeft = '100vw';
      if (bb && window.innerWidth > 768) bb.style.marginLeft = '100vw';
    } else {
      // partial (30vw)
      document.body.classList.remove('chat-closed');
      document.body.classList.remove('chat-full');
      document.body.classList.add('chat-partial'); // 가로 스크롤 차단
      if (ca && window.innerWidth > 768) ca.style.marginLeft = '30vw';
      if (bb && window.innerWidth > 768) bb.style.marginLeft = '30vw';
    }
    // partial 모드가 아닐 때는 chat-partial 해제
    if (mode !== 'partial') document.body.classList.remove('chat-partial');
  }

  // 외부에서 호출 가능하도록 확실한 전역 객체 사용
  window.chatApi = window.chatApi || {};
  window.chatApi.setMode = setMode;
  window.chatApi.greet = greet;

  resizeBtns.forEach(function (b) {
    if (b.hasAttribute('data-mode')) {
      b.addEventListener('click', function () {
        setMode(b.getAttribute('data-mode'));
      });
    }
  });

  // ── 모바일 토글 ──
  function openMobile() {
    cp.classList.add('mobile-open');
    document.body.classList.add('chat-full'); // 모바일에서도 배경 스크롤 락
    greet();
  }

  // ── 북마크 & 독 네비게이션 ──
  bookmark.addEventListener('click', function () {
    if (isMobile) { openMobile(); }
    else { setMode('partial'); greet(); }
  });

  dockChat.addEventListener('click', function (e) {
    e.preventDefault();
    if (isMobile) { openMobile(); }
    else {
      var cur = cp.getAttribute('data-mode');
      if (cur === 'close') { setMode('partial'); }
      else if (cur === 'partial') { setMode('full'); }
      else { setMode('partial'); }
      greet();
    }
  });

  // ── 데스크 조명 효과 ──
  setTimeout(function () {
    cp.classList.add('light-on');
  }, 600);

  // ── 초기 모드: close (랜딩 페이지 사용 시) ──
  if (isMobile) {
    cp.setAttribute('data-mode', 'close');
  } else {
    setMode('close');
  }

  // 리사이즈 감지
  window.addEventListener('resize', function () {
    isMobile = window.innerWidth <= 768;
  });
}