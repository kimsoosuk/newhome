/* ═══════════════════════════════════════
   scripts/chat.js — 노트 필담 채팅
   API 연동 + 한 줄씩 쓰기 + 연필 소리
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
    // 이전 메시지와 간격
    if (chatArea.children.length > 0) {
      var sp = document.createElement('div');
      sp.className = 'note-msg-spacer';
      chatArea.appendChild(sp);
    }

    // 텍스트를 줄 단위로 분할 (약 18자 기준)
    var lines = splitToLines(text, 18);
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
    var words = text.split('');
    var lines = [];
    var cur = '';
    for (var i = 0; i < words.length; i++) {
      cur += words[i];
      if (cur.length >= maxLen && (words[i] === ' ' || words[i] === '.' || words[i] === ',' || words[i] === '!' || words[i] === '?' || words[i] === '요' || words[i] === '다' || words[i] === '는' || words[i] === '을' || words[i] === '를')) {
        lines.push(cur.trim());
        cur = '';
      }
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines.length ? lines : [text];
  }

  // ── API 호출 ──
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
        chatHistory.push({ role: 'assistant', content: reply });
        callback(reply);
      })
      .catch(function () {
        var fallback = '지금 연결이 좀 불안정해. 잠시 후에 다시 물어봐줄래?';
        callback(fallback);
      });
  }

  // ── 메시지 전송 ──
  function sendMsg() {
    var t = input.value.trim();
    if (!t) return;
    input.value = '';
    addMessage(t, 'user');

    setTimeout(function () {
      callAPI(t, function (reply) {
        addMessage(reply, 'ai');
      });
    }, 300);
  }

  sendBtn.addEventListener('click', sendMsg);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendMsg(); });

  // ── 인사 ──
  function greet() {
    if (greeted) return;
    greeted = true;
    setTimeout(function () {
      addMessage('안녕! 반가워', 'ai', function () {
        setTimeout(function () {
          addMessage('오늘 하루 잘 보내고 있어?', 'ai');
        }, 600);
      });
    }, 800);
  }

  // ── 리사이즈 모드 (PC/태블릿) ──
  function setMode(mode) {
    cp.setAttribute('data-mode', mode);
    resizeBtns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });
    // content-area margin 업데이트
    var ca = document.getElementById('contentArea');
    var bb = document.getElementById('bulletin');
    if (mode === 'close') {
      document.body.classList.add('chat-closed');
      if (ca) ca.style.marginLeft = '0';
      if (bb) bb.style.marginLeft = '0';
    } else {
      document.body.classList.remove('chat-closed');
      var w = mode === 'full' ? '100vw' : mode === 'half' ? '50vw' : '340px';
      if (ca && window.innerWidth > 768) ca.style.marginLeft = w;
      if (bb && window.innerWidth > 768) bb.style.marginLeft = w;
    }
  }

  resizeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      setMode(b.getAttribute('data-mode'));
    });
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
    else { setMode('label'); greet(); }
  });

  dockChat.addEventListener('click', function (e) {
    e.preventDefault();
    if (isMobile) { openMobile(); }
    else {
      var cur = cp.getAttribute('data-mode');
      if (cur === 'close') { setMode('label'); }
      else { setMode('half'); }
      greet();
    }
  });

  // ── 데스크 조명 효과 ──
  setTimeout(function () {
    cp.classList.add('light-on');
  }, 600);

  // ── 초기 모드 ──
  if (isMobile) {
    cp.setAttribute('data-mode', 'label');
  } else {
    setMode('label');
    // PC에서 채팅 패널이 보이면 인사
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) greet(); });
    }, { threshold: 0.1 });
    obs.observe(cp);
  }

  // 리사이즈 감지
  window.addEventListener('resize', function () {
    isMobile = window.innerWidth <= 768;
  });
}