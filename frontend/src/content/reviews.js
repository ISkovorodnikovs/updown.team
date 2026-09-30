// Отзывы из группы @UpDownReview (отобраны и согласованы 30.09.2026).
// Тексты по языкам — в siteText.js (reviewsPage.items, в том же порядке).
// author: ключ из siteText (member/memberF/graduateF) или имя: { ru, uk, lat }.
export const REVIEWS = [
  { author: 'memberF', date: '2026-08-26', tag: 'magnet', types: ['ind'], img: '/reviews/r99.webp', feature: true },
  { author: { ru: 'Дмитрий А.', uk: 'Дмитро А.', lat: 'Dmitry A.' }, date: '2026-01-24', tag: 'signals', types: ['sig'], img: '/reviews/r21.webp' },
  { author: { ru: 'Игорь', uk: 'Ігор', lat: 'Igor' }, date: '2026-02', tag: 'edu', types: ['edu'], sub: 'intensive', feature: true },
  { author: 'memberF', date: '2026-02-02', tag: 'pro', types: ['sig'] },
  { author: { ru: 'Наталія Я.', uk: 'Наталія Я.', lat: 'Nataliia Ya.' }, date: '2026-08-28', tag: 'indEdu', types: ['ind', 'edu'], img: '/reviews/r104.webp' },
  { author: { ru: 'Леонид Р.', uk: 'Леонід Р.', lat: 'Leonid R.' }, date: '2026-04-24', tag: 'community', types: ['com'] },
  { author: { ru: 'Константин В.', uk: 'Костянтин В.', lat: 'Konstantin V.' }, date: '2026-01-24', tag: 'lz', types: ['ind'] },
  { author: { ru: 'Денис', uk: 'Денис', lat: 'Denis' }, date: '2026-02', tag: 'edu', types: ['edu'], sub: 'intensive' },
  { author: { ru: 'Ирина', uk: 'Ірина', lat: 'Irina' }, date: '2025-11-05', tag: 'signals', types: ['sig'], img: '/reviews/r5.webp' },
  { author: { ru: 'Леонид Р.', uk: 'Леонід Р.', lat: 'Leonid R.' }, date: '2026-04-04', tag: 'ind', types: ['ind'] },
  { author: 'graduateF', date: '2026-02-14', tag: 'edu', types: ['edu'] },
  { author: { ru: 'Клара', uk: 'Клара', lat: 'Klara' }, date: '2026-08', tag: 'live', types: ['com'] },
  { author: { ru: 'Елена', uk: 'Олена', lat: 'Elena' }, date: '2026-02-15', tag: 'edu', types: ['edu'] },
  { author: { ru: 'Оксана', uk: 'Оксана', lat: 'Oksana' }, date: '2026-06-20', tag: 'live', types: ['com'] },
  { author: 'member', date: '2026-08-03', tag: 'community', types: ['com'] },
]

// Отзывы для ленты на главной (индексы в REVIEWS)
export const HOME_REVIEWS = [0, 1, 2, 5, 4, 7]

// Скриншоты результатов (подписи — reviewsPage.shots)
export const REVIEW_SHOTS = ['/reviews/r98.webp', '/reviews/r82.webp', '/reviews/r96.webp', '/reviews/r0.webp', '/reviews/r1.webp']

export const REVIEWS_TG = 'https://t.me/UpDownReview'
