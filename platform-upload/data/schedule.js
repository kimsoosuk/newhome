/* ═══════════════════════════════════════
   data/schedule.js — 플래너 시간표 데이터
   
   시간표를 수정하려면 이 배열만 바꾸면 됩니다.
   day: 0=월 ~ 6=일
   h: 시작 시간, end: 끝 시간
   type: math/eng/sci/read (CSS 색상 매칭)
   l: 표시 라벨
   ═══════════════════════════════════════ */

var SCHEDULE_DATA = [
  // 월요일
  { day:0, h:8,  end:9,  type:'eng',  l:'영단어' },
  { day:0, h:9,  end:10, type:'math', l:'수학' },
  { day:0, h:14, end:15, type:'read', l:'독서' },
  { day:0, h:15, end:16, type:'sci',  l:'과학' },
  { day:0, h:17, end:18, type:'eng',  l:'영작문' },
  { day:0, h:19, end:20, type:'math', l:'수학복습' },
  // 화요일
  { day:1, h:8,  end:9,  type:'math', l:'수학' },
  { day:1, h:9,  end:10, type:'sci',  l:'과학' },
  { day:1, h:14, end:15, type:'eng',  l:'영단어' },
  { day:1, h:16, end:17, type:'read', l:'독서' },
  { day:1, h:18, end:19, type:'math', l:'수학심화' },
  // 수요일
  { day:2, h:8,  end:9,  type:'eng',  l:'영단어' },
  { day:2, h:10, end:11, type:'read', l:'독서' },
  { day:2, h:15, end:16, type:'math', l:'수학' },
  { day:2, h:17, end:18, type:'sci',  l:'과학실험' },
  { day:2, h:19, end:20, type:'eng',  l:'영어듣기' },
  // 목요일
  { day:3, h:8,  end:9,  type:'math', l:'수학' },
  { day:3, h:9,  end:10, type:'eng',  l:'영단어' },
  { day:3, h:14, end:15, type:'sci',  l:'과학' },
  { day:3, h:16, end:17, type:'read', l:'독서토론' },
  { day:3, h:18, end:19, type:'math', l:'수학복습' },
  // 금요일
  { day:4, h:8,  end:9,  type:'sci',  l:'과학' },
  { day:4, h:14, end:15, type:'read', l:'독서' },
  { day:4, h:15, end:16, type:'eng',  l:'영단어' },
  { day:4, h:17, end:18, type:'math', l:'수학심화' },
  { day:4, h:19, end:20, type:'sci',  l:'과학정리' },
  // 토요일
  { day:5, h:9,  end:10, type:'eng',  l:'영단어' },
  { day:5, h:10, end:11, type:'math', l:'수학' },
  { day:5, h:14, end:15, type:'sci',  l:'과학' },
  { day:5, h:16, end:17, type:'read', l:'독서' },
  { day:5, h:18, end:19, type:'eng',  l:'영작문' },
  // 일요일
  { day:6, h:10, end:11, type:'read', l:'독서' },
  { day:6, h:15, end:16, type:'eng',  l:'영단어' },
  { day:6, h:17, end:18, type:'math', l:'수학복습' },
  { day:6, h:19, end:20, type:'sci',  l:'과학정리' },
];

var DAY_LABELS = ['월','화','수','목','금','토','일'];
