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
  var closeMobile = document.getElementById('noteCloseMobile');
  var resizeBtns = document.querySelectorAll('.note-resize-btn');
  var isMobile = window.innerWidth <= 768;
  var greeted = false;
  var sending = false; // 중복 전송 방지
  var chatHistory = [];

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

  // ── 메시지 추가 (한 줄씩 적히는 효과) ──
  function addMessage(text, role, onDone) {
    initAudio();
    if (chatArea.children.length > 0) {
      var sp = document.createElement('div');
      sp.className = 'note-msg-spacer';
      chatArea.appendChild(sp);
    }

    // 화면 너비에 맞춰 줄바꿈 글자 수 계산 (채팅 영역의 80% 정도만 사용하도록)
    var availableWidth = chatArea.clientWidth * 0.80;
    var maxLen = Math.floor(availableWidth / 15);
    if (maxLen < 18) maxLen = 18;

    var lines = splitToLines(text, maxLen);
    var delay = 0;

    lines.forEach(function (line, idx) {
      var el = document.createElement('div');
      el.className = 'note-msg ' + role;
      el.textContent = line;
      chatArea.appendChild(el);

      setTimeout(function () {
        el.classList.add('visible');
        playPencilSound(0.12 + Math.random() * 0.08);
        chatArea.scrollTop = chatArea.scrollHeight;
        if (idx === lines.length - 1 && onDone) onDone();
      }, delay);

      delay += 180 + line.length * 12;
    });
  }

  function splitToLines(text, maxLen) {
    var result = [];
    var cur = '';
    for (var i = 0; i < text.length; i++) {
      cur += text[i];
      // 줄 길이 도달 시 자연스러운 위치에서 분할
      if (cur.length >= maxLen) {
        var ch = text[i];
        if (ch === ' ' || ch === '.' || ch === ',' || ch === '!' || ch === '?') {
          result.push(cur.trim());
          cur = '';
        }
      }
    }
    if (cur.trim()) result.push(cur.trim());
    return result.length ? result : [text];
  }

  // 외부 API 키 (워커 우회를 위해 여기에 직접 삽입하세요)
  var GEMINI_API_KEY = 'AIzaSyCLkHK_uxf0-O9dKeKRBCOxHUZGXDIs-wE';

  // ── API 호출 (Worker 우회 및 브라우저 직접 호출) ──
  function callAPI(userMsg, callback) {
    chatHistory.push({ role: 'user', content: userMsg });

    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      alert("API 키가 누락되었습니다.");
      return;
    }

    var systemPrompt = `당신은 김수석 선생님입니다. 공부법을 가르치며 학생의 마음을 다독이는 멘토입니다.

성격 및 대화 가이드:
- 절대로 사용자를 '학생'이라고 부르지 마세요. 그냥 부드러운 반말을 사용하세요.
- 본인을 지칭할 때 '수석이가~' 라는 표현을 쓰지 마세요. '선생님이~' 혹은 '내가~' 라는 지칭하는 표현도 쓰지 마세요.
- 답변은 무조건 1~2문장으로 아주 짧고 간결하게 작성하세요. 절대 길게 말하지 마세요.
- 질문이나 고민을 들었을 때 바로 완성된 해결책을 던져주기보다는, 먼저 공감하고 상대방의 생각이나 기분을 물어보는 질문을 던져주세요.
- "~해봐", "~하자", "~거야" 등 부드럽고 친근한 반말체를 사용하세요.

전문 분야:
- 공부법, 학습 습관, 멘탈 관리

규칙:
- 항상 한국어로 답변
- 무조건 1~2문장 이내로 짧게 대답할 것.
- "수석의방"이나 프로그램에 대해 물을 때만 가볍게 안내.`;

    var geminiContents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: '네, 알겠습니다. 김수석 선생님으로서 답변하겠습니다.' }] }
    ];

    for (var i = 0; i < chatHistory.length; i++) {
      geminiContents.push({
        role: chatHistory[i].role === 'user' ? 'user' : 'model',
        parts: [{ text: chatHistory[i].content }]
      });
    }

    var modelName = 'gemini-3.1-flash-lite-preview';
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + GEMINI_API_KEY;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          temperature: 0.8,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.error) {
          console.error('API Error:', data.error);
          var errReply = '미안, 지금은 답변이 어려워. \n\n(상세 오류: ' + (data.error.message || 'Unknown') + ')';
          chatHistory.push({ role: 'assistant', content: errReply });
          callback(errReply);
          return;
        }

        var reply = '미안, 지금은 답변이 어려워. 잠시 후에 다시 물어봐줄래?';
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
          reply = data.candidates[0].content.parts[0].text;
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
  function greet() {
    if (greeted) return;

    // 이미 대화가 진행 중이면 (랜딩에서 바로 질문해서 들어온 경우 등) 인사를 생략
    if (chatHistory.length > 0 || chatArea.children.length > 0) {
      greeted = true;
      return;
    }

    greeted = true;
    setTimeout(function () {
      addMessage('안녕! 반가워', 'ai', function () {
        setTimeout(function () {
          addMessage('오늘 하루 잘 보내고 있어?', 'ai');
        }, 600);
      });
    }, 800);
  }

  // 외부에서 호출 가능하도록
  initChat._greet = greet;

  // ── 대화 새로고침 ──
  var refreshBtn = document.getElementById('noteRefreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      // 채팅 내용 초기화
      chatArea.innerHTML = '';
      chatHistory = [];
      greeted = false;
      sending = false;

      // 다시 인사하기
      greet();
    });
  }

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
      if (ca) ca.style.marginLeft = '0';
      if (bb) bb.style.marginLeft = '0';
    } else if (mode === 'full') {
      document.body.classList.remove('chat-closed');
      document.body.classList.add('chat-full');
      if (ca && window.innerWidth > 768) ca.style.marginLeft = '100vw';
      if (bb && window.innerWidth > 768) bb.style.marginLeft = '100vw';
    } else {
      // partial (~340px)
      document.body.classList.remove('chat-closed');
      document.body.classList.remove('chat-full');
      if (ca && window.innerWidth > 768) ca.style.marginLeft = '340px';
      if (bb && window.innerWidth > 768) bb.style.marginLeft = '340px';
    }
  }

  // 외부에서 호출 가능하도록
  initChat._setMode = setMode;

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
    greet();
  }
  function closeMobileFn() {
    cp.classList.remove('mobile-open');
  }

  if (closeMobile) closeMobile.addEventListener('click', closeMobileFn);

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