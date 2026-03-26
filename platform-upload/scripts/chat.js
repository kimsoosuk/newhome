/* ═══════════════════════════════════════
   scripts/chat.js — 채팅 패널 로직
   토글, 인사, 메시지 송수신
   ═══════════════════════════════════════ */

function initChat() {
  var cp = document.getElementById('chatPanel');
  var ca = document.getElementById('aiChatArea');
  var greeted = false;

  function toggleChat() {
    cp.classList.toggle('collapsed');
    document.body.classList.toggle('chat-collapsed');
  }

  function addBubble(text, role) {
    var b = document.createElement('div');
    b.className = 'ai-bubble ' + role;
    b.textContent = text;
    ca.appendChild(b);
    ca.scrollTop = ca.scrollHeight;
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    setTimeout(function() { addBubble('안녕! 반가워', 'ai'); }, 400);
    setTimeout(function() { addBubble('오늘 하루 잘 보내고 있어?', 'ai'); }, 1200);
  }

  // 이벤트 바인딩
  document.getElementById('chatCollapseBtn').addEventListener('click', toggleChat);
  document.getElementById('chatBookmark').addEventListener('click', toggleChat);
  document.getElementById('dockChat').addEventListener('click', function(e) {
    e.preventDefault();
    if (cp.classList.contains('collapsed')) toggleChat();
  });

  // 모바일에서는 자동 인사
  if (window.innerWidth <= 768) setTimeout(greet, 600);

  // 채팅 패널이 보이면 인사
  var cObs = new IntersectionObserver(function(es) {
    es.forEach(function(e) { if (e.isIntersecting) greet(); });
  }, { threshold: 0.1 });
  cObs.observe(cp);

  // 메시지 전송
  var responses = [
    '좋은 자세네요! 계속해서 그렇게 해주세요.',
    '궁금한 점이 있으면 언제든 말해주세요.'
  ];
  var ri = 0;

  function sendMsg() {
    var input = document.getElementById('aiInput');
    var t = input.value.trim();
    if (!t) return;
    addBubble(t, 'user');
    input.value = '';
    setTimeout(function() {
      addBubble(responses[ri++ % responses.length], 'ai');
    }, 700);
  }

  document.getElementById('aiSendBtn').addEventListener('click', sendMsg);
  document.getElementById('aiInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMsg();
  });
}
