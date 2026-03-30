/* ═══════════════════════════════════════
   data/programs.js — 프로그램 목록 데이터
   ═══════════════════════════════════════ */

var SECTIONS_DATA = [
  {
    id: 'sec-today',
    title: '오늘 할 일',
    sub: '오늘 공부는 오늘 끝내기',
    books: [
      { t: '공부하는<br>이유', c: '기본편', cls: 'cover-s1', href: 'https://kimsoosuk.github.io/study-reason/', lt: '공부하는 이유', ls: '기본편' },
      { t: '변환<br>사고력', c: '두정엽', cls: 'cover-m1', href: '#', lt: '변환 사고력', ls: '두정엽' },
    ]
  },
  {
    id: 'sec-method',
    title: '수석의 공부법',
    sub: '공부의 기본기를 세우는 14가지 원칙',
    white: true
  },
  {
    id: 'sec-study',
    title: '나의 공부법',
    sub: '나에게 도움되는 맞춤 공부법',
    books: [
      { t: '공부하는<br>이유', c: '기본편', cls: 'cover-s1', href: 'https://kimsoosuk.github.io/study-reason/', lt: '공부하는 이유', ls: '기본편' },
      { t: '내공부<br>스케줄짜기', c: '기본편', cls: 'cover-s2', href: 'https://kimsoosuk.github.io/myschedule/', lt: '내공부 스케줄짜기', ls: '기본편' },
      { t: '영어 바이블<br>문학', c: '문과편', cls: 'cover-s3', href: 'https://kimsoosuk.github.io/bible-english/', lt: '영어 바이블 문학', ls: '문과편' },
      { t: '고1 3모<br>대비법', c: '과학편', cls: 'cover-s4', href: 'https://kimsoosuk.github.io/science_exam/', lt: '고1 3모 대비법', ls: '과학편' },
      { t: '고1 3모<br>대비법', c: '영어편', cls: 'cover-s5', href: 'https://kimsoosuk.github.io/eng-exam/', lt: '고1 3모 대비법', ls: '영어편' },
    ]
  },
  {
    id: 'sec-mind',
    title: '나의 IQ',
    sub: '머리가 좋아지는 맞춤 사고력 학습지',
    books: [
      { t: '변환<br>사고력', c: '두정엽', cls: 'cover-m1', href: '#', lt: '변환 사고력', ls: '두정엽' },
      { t: '가치<br>사고력', c: '변연계', cls: 'cover-m2', href: '#', lt: '가치 사고력', ls: '변연계' },
    ]
  },
  {
    id: 'sec-life',
    title: '나의 생활',
    sub: '공부 잘하는 체질이 되는 생활 습관',
    books: [
      { t: '겸손', c: '공부 체질', cls: 'cover-h1', href: '#', lt: '겸손', ls: '공부 체질' },
      { t: '연표', c: '공부 체질', cls: 'cover-h2', href: '#', lt: '연표', ls: '공부 체질' },
      { t: '예습', c: '공부 체질', cls: 'cover-h3', href: '#', lt: '예습', ls: '공부 체질' },
      { t: '과정', c: '공부 체질', cls: 'cover-h4', href: '#', lt: '과정', ls: '공부 체질' },
      { t: '훈련', c: '공부 체질', cls: 'cover-h5', href: '#', lt: '훈련', ls: '공부 체질' },
      { t: '실험', c: '공부 체질', cls: 'cover-h6', href: '#', lt: '실험', ls: '공부 체질' },
      { t: '문제집', c: '공부 체질', cls: 'cover-h7', href: '#', lt: '문제집', ls: '공부 체질' },
    ]
  },
  {
    id: 'sec-think',
    title: '나의 창의',
    sub: '생각이 넓어지는 맞춤 창의력 섹션',
    books: [
      { t: '가치관<br>선생님', c: '기본편', cls: 'cover-t1', href: 'https://kimsoosuk.github.io/value/', lt: '가치관 선생님', ls: '기본편' },
    ]
  },
  {
    id: 'sec-dict',
    title: '김수석 선생님',
    sub: '과목별 선생님께 질문해보자',
    books: [
      { t: '과학<br>사전', c: '이과편', cls: 'cover-d1', href: 'https://kimsoosuk.github.io/science_teacher/', lt: '과학 사전', ls: '이과편' },
      { t: '영어<br>사전', c: '문과편', cls: 'cover-d2', href: 'https://kimsoosuk.github.io/eng_dictionary/', lt: '영어 사전', ls: '문과편' },
      { t: '국어<br>사전', c: '문과편', cls: 'cover-d3', href: 'https://kimsoosuk.github.io/kor-dictionary/', lt: '국어 사전', ls: '문과편' },
      { t: '수학<br>사전', c: '이과편', cls: 'cover-d4', href: '#', lt: '수학 사전', ls: '이과편' },
      { t: '역사<br>사전', c: '문과편', cls: 'cover-d5', href: '#', lt: '역사 사전', ls: '문과편' },
      { t: '독서<br>선생님', c: '기본편', cls: 'cover-d6', href: 'https://kimsoosuk.github.io/book_teacher/', lt: '독서 선생님', ls: '기본편' },
    ]
  },
];

var METHOD_DATA = [
  { j: 'ㄱ', s: '공부', t: '공부하는 이유', h: 'https://kimsoosuk.github.io/study-reason/' },
  { j: 'ㄴ', s: '내공부', t: '내공부 스케줄짜기', h: 'https://kimsoosuk.github.io/myschedule/' },
  { j: 'ㄷ', s: '답', t: '공부란 무엇인가', h: '#' },
  { j: 'ㄹ', s: '루틴', t: '영어 단어 암기법', h: '#' },
  { j: 'ㅁ', s: '문해', t: '영어 국어처럼 공부하기', h: '#' },
  { j: 'ㅂ', s: '본질', t: '요약하기', h: '#' },
  { j: 'ㅅ', s: '설명', t: '글 짓기', h: '#' },
  { j: 'ㅇ', s: '원리', t: '수학 공부의 기본', h: '#' },
  { j: 'ㅈ', s: '점검', t: '복습법', h: '#' },
  { j: 'ㅊ', s: '체계', t: '구성하기', h: '#' },
  { j: 'ㅋ', s: '키워드', t: '나에게 맞는 암기법', h: '#' },
  { j: 'ㅌ', s: '탐구', t: '과학 공부법', h: '#' },
  { j: 'ㅍ', s: '파악', t: '과학 이미지법', h: '#' },
  { j: 'ㅎ', s: '학습관', t: '나 가르치기', h: '#' },
];

var HOMEWORK_DATA = [
  { cls: 'hw-cover-sci', t: '과학 단어<br>3단원', s: '이과편' },
  { cls: 'hw-cover-eng', t: '영단어<br>Day 15', s: '문과편' },
  { cls: 'hw-cover-read', t: '독서 감상문<br>제출', s: '사고력편' },
  { cls: 'hw-cover-plan', t: '다음 주<br>계획 세우기', s: '생활편' },
];

var DIAGNOSTICS_DATA = [
  { t: '공부머리 진단', d: 'IQ보다 더 성적에 실질적인 영향을 미치는 공부머리를 진단합니다.' },
  { t: '공부체질 진단', d: '몰입, 보상, 경쟁, 기질 등 수많은 공부 조건들을 분석합니다.' },
  { t: '사춘기 학습유형 진단', d: '부모 자녀 기질 분석으로 사춘기 문제를 예방합니다.' },
  { t: '중학수학능력 진단', d: '과목 별 실력을 파악하기 위한 진단을 실시합니다.' },
  { t: '학습저항성 진단', d: '공부에 대한 감정을 분석하여 학습저항성을 발견합니다.' },
];

// 수석의 추천도서
var RECOMMEND_DATA = [
  {
    t: '경제가 중요해!',
    pub: '리듬문고',
    img: 'https://res.cloudinary.com/dms5vyofw/image/upload/v1774658315/%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8C%E1%85%A6%E1%84%80%E1%85%A1%E1%84%8C%E1%85%AE%E1%86%BC%E1%84%8B%E1%85%AD%E1%84%92%E1%85%A2_mbbqtq.jpg',
    href: 'https://product.kyobobook.co.kr/detail/S000217060441'
  },
  {
    t: '반갑다, 논리야',
    pub: '사계절',
    img: 'https://res.cloudinary.com/dms5vyofw/image/upload/v1774658314/%E1%84%87%E1%85%A1%E1%86%AB%E1%84%80%E1%85%A1%E1%86%B8%E1%84%83%E1%85%A1_%E1%84%82%E1%85%A9%E1%86%AB%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A3_ybbfpg.jpg',
    href: 'https://product.kyobobook.co.kr/detail/S000201433935'
  },
  {
    t: '수학 개념 사전',
    pub: '동양북스',
    img: 'https://res.cloudinary.com/dms5vyofw/image/upload/v1774658314/%E1%84%89%E1%85%AE%E1%84%92%E1%85%A1%E1%86%A8_%E1%84%80%E1%85%A2%E1%84%82%E1%85%A7%E1%86%B7_%E1%84%89%E1%85%A1%E1%84%8C%E1%85%A5%E1%86%AB_qeewql.jpg',
    href: 'https://product.kyobobook.co.kr/detail/S000215829548'
  },
  {
    t: '친절한 경제 신문',
    pub: '썬더키즈',
    img: 'https://res.cloudinary.com/dms5vyofw/image/upload/v1774658314/%E1%84%8E%E1%85%B5%E1%86%AB%E1%84%8C%E1%85%A5%E1%86%AF%E1%84%92%E1%85%A1%E1%86%AB_%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8C%E1%85%A6%E1%84%89%E1%85%B5%E1%86%AB%E1%84%86%E1%85%AE%E1%86%AB_d9gtuy.jpg',
    href: 'https://product.kyobobook.co.kr/detail/S000215015648'
  },
  {
    t: '어린이 한국사',
    pub: '춤추는고래',
    img: 'https://res.cloudinary.com/dms5vyofw/image/upload/v1774658314/%E1%84%8B%E1%85%A5%E1%84%85%E1%85%B5%E1%86%AB%E1%84%8B%E1%85%B5_%E1%84%92%E1%85%A1%E1%86%AB%E1%84%80%E1%85%AE%E1%86%A8%E1%84%89%E1%85%A1_fx78uy.jpg',
    href: 'https://product.kyobobook.co.kr/detail/S000200114495'
  },
];