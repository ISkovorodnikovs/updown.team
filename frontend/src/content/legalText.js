// Правовые страницы /terms, /privacy, /refunds (Спринт 3b), 9 языков.
// ЧЕРНОВИК по предложенным вариантам — заменить после решения и проверки юристом (см. TODO).
export const LEGAL_DATE = '2026-10-01'

export default {
  "en": {
    "nav": {
      "legal": "Legal",
      "terms": "Terms of use",
      "privacy": "Privacy",
      "refunds": "Refund policy"
    },
    "updated": "Version of {date}",
    "contactsTitle": "Questions about this document",
    "contactsText": "Contact support: @Agent_X_support on Telegram or support@updown.team.",
    "seo": {
      "termsTitle": "Terms of use — UpDown",
      "termsDesc": "UpDown terms of use: account, payment, access to indicators and channels, trading risks and limitation of liability.",
      "privacyTitle": "Privacy policy — UpDown",
      "privacyDesc": "What data UpDown collects, why, who it is shared with, how long it is kept and how to request a copy or deletion.",
      "refundsTitle": "Refund policy — UpDown",
      "refundsDesc": "When UpDown refunds a payment, when it does not, how to request a refund within 7 days and how money is returned in USDT."
    },
    "terms": {
      "title": "Terms of use",
      "intro": "By signing up on updown.team or paying for a product, you accept these terms.",
      "sections": [
        {
          "h": "1. What UpDown is",
          "t": "UpDown is a platform of market analysis tools: TradingView indicators, Telegram signal channels, education and a personal account on updown.team."
        },
        {
          "h": "2. Account",
          "t": "You need an account with a valid email. One account per person. You are responsible for keeping access to your email and account secure. Only adults may use the service."
        },
        {
          "h": "3. Payment",
          "t": "Prices are listed on the website in USDT. Payment is made in cryptocurrency through a payment provider. Access is granted for the paid period and does not renew automatically. Refunds follow the rules on the Refund policy page."
        },
        {
          "h": "4. Access to products",
          "t": "Indicators are granted to your TradingView username, channels via personal Telegram links. Access is personal: you may not share it, resell it or publish signals or materials elsewhere. If you do, we may revoke access without a refund."
        },
        {
          "h": "5. Risks",
          "t": "Trading cryptocurrency, forex and other instruments involves high risk, including the loss of all funds. UpDown materials are analysis and education tools, not personal investment advice. You make your own trading decisions. Past results and reviews do not guarantee future returns."
        },
        {
          "h": "6. Limitation of liability",
          "t": "UpDown is not liable for trading losses, for the operation of exchanges, TradingView or Telegram, or for service interruptions. Our maximum liability is limited to the amount you paid for the product."
        },
        {
          "h": "7. Intellectual property",
          "t": "Indicators, algorithms, lessons, texts and design belong to UpDown and their authors. You may not copy or distribute them without permission."
        },
        {
          "h": "8. Changes",
          "t": "We may change these terms. A new version takes effect on the date it is published; we will notify you of significant changes in your account."
        }
      ]
    },
    "privacy": {
      "title": "Privacy policy",
      "intro": "We collect only the data we need to grant access and help you, and we never sell it.",
      "tableTitle": "What data we collect",
      "head": [
        "Data",
        "Why"
      ],
      "rows": [
        [
          "Email, name (optional), language",
          "Signing in, emails with codes and notifications"
        ],
        [
          "TradingView username",
          "Granting access to indicators"
        ],
        [
          "Telegram ID (if you connected the bot)",
          "Channel access and notifications"
        ],
        [
          "Payment details: amount, date, transaction ID",
          "Tracking subscriptions and refunds; we never receive card details"
        ],
        [
          "Where you came from: ad tags, referring site, referral code",
          "Understanding which ads work; crediting the referrer's bonus"
        ],
        [
          "Technical data: IP address, browser, sign-in time",
          "Security and protection against account takeover"
        ]
      ],
      "sections": [
        {
          "h": "Browser storage",
          "t": "The site stores your sign-in, language and theme in your browser, and keeps the referral code and visit source for 30 days. Google Tag Manager is used for visit statistics."
        },
        {
          "h": "Who we share data with",
          "t": "Only services the platform cannot work without: Resend for sending emails; Heleket for payments; Telegram for channels and notifications; TradingView for granting access by username; Google for visit statistics. We also disclose data when lawfully required by public authorities."
        },
        {
          "h": "Retention",
          "t": "For as long as your account exists. After the account is deleted, only payment records needed for accounting are kept."
        },
        {
          "h": "Your rights",
          "t": "You can request a copy of your data, correct it or delete your account. Email support@updown.team from the address your account is registered with. We will reply within 30 days."
        },
        {
          "h": "Security",
          "t": "The connection to the site is encrypted (HTTPS), passwords are stored in encrypted form, and only platform administrators have access to the data."
        },
        {
          "h": "Changes",
          "t": "A new version of this policy takes effect on the date it is published on this page."
        }
      ]
    },
    "refunds": {
      "title": "Refund policy",
      "intro": "You can request a refund within 7 days of payment. Subscriptions do not renew automatically: you make every payment yourself.",
      "fullTitle": "When we refund in full",
      "full": [
        "access was not granted through our fault within 48 hours of payment, and support could not resolve the issue;",
        "you paid for the same product twice or the payment was made by mistake;",
        "“UpDown Strategy” intensive: you cancelled before the first lesson."
      ],
      "noTitle": "When there is no refund",
      "no": [
        "access to the indicator, channel or plan has already been granted, including for unused subscription days;",
        "the intensive has already started;",
        "access was revoked for breaking the terms (sharing access, reselling signals);",
        "trading losses — UpDown materials do not guarantee profit."
      ],
      "sections": [
        {
          "h": "How to request a refund",
          "t": "Within 7 days of payment, message @Agent_X_support on Telegram or email support@updown.team. Include your account email, the transaction ID and the reason."
        },
        {
          "h": "How we refund",
          "t": "In USDT to the same address and network the payment came from, minus the network fee. Within 14 days of approval. Access to the product is closed after the refund."
        }
      ]
    }
  },
  "ru": {
    "nav": {
      "legal": "Документы",
      "terms": "Условия использования",
      "privacy": "Конфиденциальность",
      "refunds": "Правила возврата"
    },
    "updated": "Редакция от {date}",
    "contactsTitle": "Вопросы по документу",
    "contactsText": "Пишите в поддержку: @Agent_X_support в Telegram или support@updown.team.",
    "seo": {
      "termsTitle": "Условия использования — UpDown",
      "termsDesc": "Условия использования платформы UpDown: аккаунт, оплата, доступ к индикаторам и каналам, риски торговли и ограничение ответственности.",
      "privacyTitle": "Политика конфиденциальности — UpDown",
      "privacyDesc": "Какие данные собирает UpDown, зачем они нужны, кому передаются, сколько хранятся и как запросить их копию или удаление.",
      "refundsTitle": "Правила возврата — UpDown",
      "refundsDesc": "Когда UpDown возвращает оплату, когда возврата нет, как подать запрос в течение 7 дней и как возвращаются деньги в USDT."
    },
    "terms": {
      "title": "Условия использования",
      "intro": "Регистрируясь на updown.team или оплачивая продукт, вы принимаете эти условия.",
      "sections": [
        {
          "h": "1. Что такое UpDown",
          "t": "UpDown — платформа с инструментами анализа рынка: индикаторы для TradingView, сигнальные каналы в Telegram, обучение и личный кабинет на сайте updown.team."
        },
        {
          "h": "2. Аккаунт",
          "t": "Для работы нужен аккаунт с действующим email. Один аккаунт — один человек. Вы отвечаете за сохранность доступа к почте и аккаунту. Пользоваться сервисом могут только совершеннолетние."
        },
        {
          "h": "3. Оплата",
          "t": "Цены указаны на сайте в USDT. Оплата проходит в криптовалюте через платёжный сервис. Доступ выдаётся на оплаченный срок и не продлевается автоматически. Возвраты — по правилам на странице «Правила возврата»."
        },
        {
          "h": "4. Доступ к продуктам",
          "t": "Индикаторы открываются на ваш ник TradingView, каналы — по личным ссылкам в Telegram. Доступ личный: нельзя передавать его другим, перепродавать и публиковать сигналы или материалы в других местах. При нарушении мы можем закрыть доступ без возврата оплаты."
        },
        {
          "h": "5. Риски",
          "t": "Торговля криптовалютой, форекс и другими инструментами связана с высоким риском, включая полную потерю средств. Материалы UpDown — инструменты анализа и обучения, а не индивидуальные инвестиционные рекомендации. Решение о сделке вы принимаете сами. Прошлые результаты и отзывы не гарантируют будущей доходности."
        },
        {
          "h": "6. Ограничение ответственности",
          "t": "UpDown не отвечает за торговые убытки, работу бирж, TradingView и Telegram, а также за перерывы в работе сервиса. Максимальная ответственность ограничена суммой, которую вы заплатили за продукт."
        },
        {
          "h": "7. Интеллектуальная собственность",
          "t": "Индикаторы, алгоритмы, уроки, тексты и дизайн принадлежат UpDown и авторам. Копировать и распространять их без разрешения нельзя."
        },
        {
          "h": "8. Изменения",
          "t": "Мы можем менять эти условия. Новая редакция действует с даты публикации; о существенных изменениях предупредим в кабинете."
        }
      ]
    },
    "privacy": {
      "title": "Политика конфиденциальности",
      "intro": "Мы собираем только те данные, без которых не можем выдать доступ и помочь, и не продаём их.",
      "tableTitle": "Какие данные собираем",
      "head": [
        "Данные",
        "Зачем"
      ],
      "rows": [
        [
          "Email, имя (по желанию), язык",
          "Вход в кабинет, письма с кодами и уведомлениями"
        ],
        [
          "Ник TradingView",
          "Выдача доступа к индикаторам"
        ],
        [
          "Telegram ID (если вы привязали бота)",
          "Доступ в каналы и уведомления"
        ],
        [
          "Сведения об оплатах: сумма, дата, номер транзакции",
          "Учёт подписок и возвратов; данные карт мы не получаем"
        ],
        [
          "Откуда вы пришли: рекламные метки, сайт-источник, реферальный код",
          "Понять, какая реклама работает; начислить бонус пригласившему"
        ],
        [
          "Технические данные: IP-адрес, браузер, время входа",
          "Безопасность и защита от взлома"
        ]
      ],
      "sections": [
        {
          "h": "Хранение в браузере",
          "t": "Сайт сохраняет в вашем браузере вход в аккаунт, язык и тему, а также на 30 дней — реферальный код и источник визита. Для статистики посещений используется Google Tag Manager."
        },
        {
          "h": "Кому передаём данные",
          "t": "Только сервисам, без которых платформа не работает: Resend — отправка писем; Heleket — приём оплаты; Telegram — каналы и уведомления; TradingView — выдача доступа по нику; Google — статистика посещений. Также передаём данные по законному требованию государственных органов."
        },
        {
          "h": "Срок хранения",
          "t": "Пока существует аккаунт. После удаления аккаунта остаются только записи об оплатах, нужные для учёта."
        },
        {
          "h": "Ваши права",
          "t": "Вы можете запросить копию своих данных, исправить их или удалить аккаунт. Напишите на support@updown.team с почты, на которую зарегистрирован аккаунт. Ответим в течение 30 дней."
        },
        {
          "h": "Безопасность",
          "t": "Соединение с сайтом защищено (HTTPS), пароли хранятся в зашифрованном виде, доступ к данным есть только у администраторов платформы."
        },
        {
          "h": "Изменения",
          "t": "Новая редакция политики действует с даты публикации на этой странице."
        }
      ]
    },
    "refunds": {
      "title": "Правила возврата",
      "intro": "Возврат можно запросить в течение 7 дней с оплаты. Подписки не продлеваются автоматически: каждую оплату вы делаете сами.",
      "fullTitle": "Когда вернём деньги полностью",
      "full": [
        "доступ не был открыт по нашей вине в течение 48 часов после оплаты, и поддержка не смогла решить вопрос;",
        "вы оплатили один и тот же продукт дважды или платёж прошёл по ошибке;",
        "интенсив «Стратегия UpDown»: вы отказались до начала первого урока."
      ],
      "noTitle": "Когда возврата нет",
      "no": [
        "доступ к индикатору, каналу или тарифу уже выдан, — в том числе за неиспользованные дни подписки;",
        "интенсив уже начался;",
        "доступ закрыт за нарушение условий (передача доступа, перепродажа сигналов);",
        "торговые убытки — материалы UpDown не гарантируют прибыль."
      ],
      "sections": [
        {
          "h": "Как запросить возврат",
          "t": "В течение 7 дней с оплаты напишите в Telegram @Agent_X_support или на support@updown.team. Укажите email аккаунта, номер транзакции и причину."
        },
        {
          "h": "Как возвращаем",
          "t": "В USDT на тот же адрес и в той же сети, с которых пришла оплата, за вычетом комиссии сети. Срок — до 14 дней после одобрения. После возврата доступ к продукту закрывается."
        }
      ]
    }
  },
  "uk": {
    "nav": {
      "legal": "Документи",
      "terms": "Умови використання",
      "privacy": "Конфіденційність",
      "refunds": "Правила повернення коштів"
    },
    "updated": "Редакція від {date}",
    "contactsTitle": "Питання щодо документа",
    "contactsText": "Пишіть у підтримку: @Agent_X_support у Telegram або support@updown.team.",
    "seo": {
      "termsTitle": "Умови використання — UpDown",
      "termsDesc": "Умови використання платформи UpDown: акаунт, оплата, доступ до індикаторів і каналів, ризики торгівлі та обмеження відповідальності.",
      "privacyTitle": "Політика конфіденційності — UpDown",
      "privacyDesc": "Які дані збирає UpDown, навіщо вони потрібні, кому передаються, скільки зберігаються і як запросити їх копію або видалення.",
      "refundsTitle": "Правила повернення коштів — UpDown",
      "refundsDesc": "Коли UpDown повертає оплату, коли повернення немає, як подати запит протягом 7 днів і як повертаються кошти в USDT."
    },
    "terms": {
      "title": "Умови використання",
      "intro": "Реєструючись на updown.team або оплачуючи продукт, ви приймаєте ці умови.",
      "sections": [
        {
          "h": "1. Що таке UpDown",
          "t": "UpDown — платформа з інструментами аналізу ринку: індикатори для TradingView, сигнальні канали в Telegram, навчання та особистий кабінет на сайті updown.team."
        },
        {
          "h": "2. Акаунт",
          "t": "Для роботи потрібен акаунт із чинною електронною поштою. Один акаунт — одна особа. Ви відповідаєте за збереження доступу до пошти та акаунта. Користуватися сервісом можуть лише повнолітні особи."
        },
        {
          "h": "3. Оплата",
          "t": "Ціни вказано на сайті в USDT. Оплата здійснюється в криптовалюті через платіжний сервіс. Доступ надається на оплачений строк і не продовжується автоматично. Повернення коштів — відповідно до правил на сторінці «Правила повернення коштів»."
        },
        {
          "h": "4. Доступ до продуктів",
          "t": "Індикатори відкриваються на ваш нікнейм у TradingView, канали — за особистими посиланнями в Telegram. Доступ є особистим: його не можна передавати іншим, перепродавати, а також публікувати сигнали чи матеріали деінде. У разі порушення ми можемо закрити доступ без повернення оплати."
        },
        {
          "h": "5. Ризики",
          "t": "Торгівля криптовалютою, на ринку форекс та іншими інструментами пов’язана з високим ризиком, зокрема повної втрати коштів. Матеріали UpDown — це інструменти аналізу та навчання, а не індивідуальні інвестиційні рекомендації. Рішення про угоду ви ухвалюєте самостійно. Минулі результати та відгуки не гарантують майбутньої прибутковості."
        },
        {
          "h": "6. Обмеження відповідальності",
          "t": "UpDown не відповідає за торгові збитки, роботу бірж, TradingView і Telegram, а також за перерви в роботі сервісу. Максимальна відповідальність обмежена сумою, яку ви сплатили за продукт."
        },
        {
          "h": "7. Інтелектуальна власність",
          "t": "Індикатори, алгоритми, уроки, тексти та дизайн належать UpDown і авторам. Копіювати й поширювати їх без дозволу заборонено."
        },
        {
          "h": "8. Зміни",
          "t": "Ми можемо змінювати ці умови. Нова редакція діє з дати публікації; про суттєві зміни попередимо в кабінеті."
        }
      ]
    },
    "privacy": {
      "title": "Політика конфіденційності",
      "intro": "Ми збираємо лише ті дані, без яких не можемо надати доступ і допомогти, і не продаємо їх.",
      "tableTitle": "Які дані ми збираємо",
      "head": [
        "Дані",
        "Навіщо"
      ],
      "rows": [
        [
          "Email, ім’я (за бажанням), мова",
          "Вхід до кабінету, листи з кодами та сповіщеннями"
        ],
        [
          "Нікнейм у TradingView",
          "Надання доступу до індикаторів"
        ],
        [
          "Telegram ID (якщо ви підключили бота)",
          "Доступ до каналів і сповіщення"
        ],
        [
          "Відомості про оплати: сума, дата, номер транзакції",
          "Облік підписок і повернень; даних карток ми не отримуємо"
        ],
        [
          "Звідки ви прийшли: рекламні мітки, сайт-джерело, реферальний код",
          "Зрозуміти, яка реклама працює; нарахувати бонус тому, хто запросив"
        ],
        [
          "Технічні дані: IP-адреса, браузер, час входу",
          "Безпека та захист від зламу"
        ]
      ],
      "sections": [
        {
          "h": "Зберігання в браузері",
          "t": "Сайт зберігає у вашому браузері вхід до акаунта, мову та тему, а також на 30 днів — реферальний код і джерело візиту. Для статистики відвідувань використовується Google Tag Manager."
        },
        {
          "h": "Кому ми передаємо дані",
          "t": "Лише сервісам, без яких платформа не працює: Resend — надсилання листів; Heleket — прийом оплати; Telegram — канали та сповіщення; TradingView — надання доступу за нікнеймом; Google — статистика відвідувань. Також ми передаємо дані на законну вимогу державних органів."
        },
        {
          "h": "Строк зберігання",
          "t": "Доки існує акаунт. Після видалення акаунта залишаються лише записи про оплати, потрібні для обліку."
        },
        {
          "h": "Ваші права",
          "t": "Ви можете запросити копію своїх даних, виправити їх або видалити акаунт. Напишіть на support@updown.team з пошти, на яку зареєстровано акаунт. Відповімо протягом 30 днів."
        },
        {
          "h": "Безпека",
          "t": "З’єднання із сайтом захищене (HTTPS), паролі зберігаються в зашифрованому вигляді, доступ до даних мають лише адміністратори платформи."
        },
        {
          "h": "Зміни",
          "t": "Нова редакція політики діє з дати публікації на цій сторінці."
        }
      ]
    },
    "refunds": {
      "title": "Правила повернення коштів",
      "intro": "Повернення коштів можна запросити протягом 7 днів з дати оплати. Підписки не продовжуються автоматично: кожну оплату ви здійснюєте самостійно.",
      "fullTitle": "Коли повернемо кошти повністю",
      "full": [
        "доступ не було відкрито з нашої вини протягом 48 годин після оплати, і підтримка не змогла вирішити питання;",
        "ви оплатили той самий продукт двічі або платіж пройшов помилково;",
        "інтенсив «Стратегія UpDown»: ви відмовилися до початку першого уроку."
      ],
      "noTitle": "Коли повернення немає",
      "no": [
        "доступ до індикатора, каналу або тарифу вже надано, — зокрема за невикористані дні підписки;",
        "інтенсив уже розпочався;",
        "доступ закрито за порушення умов (передача доступу, перепродаж сигналів);",
        "торгові збитки — матеріали UpDown не гарантують прибутку."
      ],
      "sections": [
        {
          "h": "Як запросити повернення коштів",
          "t": "Протягом 7 днів з дати оплати напишіть у Telegram @Agent_X_support або на support@updown.team. Вкажіть email акаунта, номер транзакції та причину."
        },
        {
          "h": "Як ми повертаємо кошти",
          "t": "В USDT на ту саму адресу й у тій самій мережі, з яких надійшла оплата, за вирахуванням комісії мережі. Строк — до 14 днів після схвалення. Після повернення коштів доступ до продукту закривається."
        }
      ]
    }
  },
  "de": {
    "nav": {
      "legal": "Rechtliches",
      "terms": "Nutzungsbedingungen",
      "privacy": "Datenschutz",
      "refunds": "Rückerstattungsrichtlinie"
    },
    "updated": "Fassung vom {date}",
    "contactsTitle": "Fragen zu diesem Dokument",
    "contactsText": "Wenden Sie sich an den Support: @Agent_X_support auf Telegram oder support@updown.team.",
    "seo": {
      "termsTitle": "Nutzungsbedingungen — UpDown",
      "termsDesc": "Nutzungsbedingungen von UpDown: Konto, Zahlung, Zugang zu Indikatoren und Kanälen, Handelsrisiken und Haftungsbeschränkung.",
      "privacyTitle": "Datenschutzerklärung — UpDown",
      "privacyDesc": "Welche Daten UpDown erhebt, wozu, an wen sie weitergegeben werden, wie lange sie gespeichert werden und wie Sie eine Kopie oder Löschung anfordern.",
      "refundsTitle": "Rückerstattungsrichtlinie — UpDown",
      "refundsDesc": "Wann UpDown eine Zahlung erstattet und wann nicht, wie Sie innerhalb von 7 Tagen eine Rückerstattung beantragen und wie das Geld in USDT zurückgezahlt wird."
    },
    "terms": {
      "title": "Nutzungsbedingungen",
      "intro": "Mit der Registrierung auf updown.team oder der Bezahlung eines Produkts akzeptieren Sie diese Bedingungen.",
      "sections": [
        {
          "h": "1. Was UpDown ist",
          "t": "UpDown ist eine Plattform mit Tools zur Marktanalyse: TradingView-Indikatoren, Telegram-Signalkanäle, Schulungen und ein persönliches Konto auf updown.team."
        },
        {
          "h": "2. Konto",
          "t": "Sie benötigen ein Konto mit einer gültigen E-Mail-Adresse. Pro Person ist ein Konto erlaubt. Sie sind dafür verantwortlich, den Zugang zu Ihrer E-Mail-Adresse und Ihrem Konto zu schützen. Der Dienst darf nur von Volljährigen genutzt werden."
        },
        {
          "h": "3. Zahlung",
          "t": "Die Preise sind auf der Website in USDT angegeben. Die Zahlung erfolgt in Kryptowährung über einen Zahlungsanbieter. Der Zugang wird für den bezahlten Zeitraum gewährt und verlängert sich nicht automatisch. Für Rückerstattungen gelten die Regeln auf der Seite „Rückerstattungsrichtlinie“."
        },
        {
          "h": "4. Zugang zu den Produkten",
          "t": "Indikatoren werden für Ihren TradingView-Benutzernamen freigeschaltet, Kanäle über persönliche Telegram-Links. Der Zugang ist persönlich: Sie dürfen ihn nicht weitergeben oder weiterverkaufen und keine Signale oder Materialien an anderer Stelle veröffentlichen. Andernfalls können wir den Zugang ohne Rückerstattung entziehen."
        },
        {
          "h": "5. Risiken",
          "t": "Der Handel mit Kryptowährungen, Forex und anderen Instrumenten ist mit hohen Risiken verbunden, bis hin zum Verlust des gesamten Kapitals. Die Materialien von UpDown sind Analyse- und Lernwerkzeuge und keine persönliche Anlageberatung. Ihre Handelsentscheidungen treffen Sie selbst. Frühere Ergebnisse und Erfahrungsberichte garantieren keine zukünftigen Erträge."
        },
        {
          "h": "6. Haftungsbeschränkung",
          "t": "UpDown haftet nicht für Handelsverluste, für den Betrieb von Börsen, TradingView oder Telegram oder für Unterbrechungen des Dienstes. Unsere Haftung ist höchstens auf den Betrag begrenzt, den Sie für das Produkt bezahlt haben."
        },
        {
          "h": "7. Geistiges Eigentum",
          "t": "Indikatoren, Algorithmen, Lektionen, Texte und Design gehören UpDown und den jeweiligen Urhebern. Sie dürfen sie ohne Erlaubnis weder kopieren noch verbreiten."
        },
        {
          "h": "8. Änderungen",
          "t": "Wir können diese Bedingungen ändern. Eine neue Fassung tritt mit dem Tag ihrer Veröffentlichung in Kraft; über wesentliche Änderungen informieren wir Sie in Ihrem Konto."
        }
      ]
    },
    "privacy": {
      "title": "Datenschutzerklärung",
      "intro": "Wir erheben nur die Daten, die wir benötigen, um Ihnen Zugang zu gewähren und Ihnen zu helfen, und wir verkaufen sie niemals.",
      "tableTitle": "Welche Daten wir erheben",
      "head": [
        "Daten",
        "Zweck"
      ],
      "rows": [
        [
          "E-Mail-Adresse, Name (optional), Sprache",
          "Anmeldung, E-Mails mit Codes und Benachrichtigungen"
        ],
        [
          "TradingView-Benutzername",
          "Freischaltung der Indikatoren"
        ],
        [
          "Telegram-ID (wenn Sie den Bot verbunden haben)",
          "Zugang zu Kanälen und Benachrichtigungen"
        ],
        [
          "Zahlungsdaten: Betrag, Datum, Transaktions-ID",
          "Verwaltung von Abonnements und Rückerstattungen; Kartendaten erhalten wir nie"
        ],
        [
          "Herkunft des Besuchs: Werbe-Tags, verweisende Website, Empfehlungscode",
          "Auswertung, welche Werbung wirkt; Gutschrift des Bonus für den Empfehlenden"
        ],
        [
          "Technische Daten: IP-Adresse, Browser, Anmeldezeit",
          "Sicherheit und Schutz vor Kontoübernahme"
        ]
      ],
      "sections": [
        {
          "h": "Speicherung im Browser",
          "t": "Die Website speichert Ihre Anmeldung, Sprache und das Design in Ihrem Browser und bewahrt den Empfehlungscode sowie die Herkunft des Besuchs 30 Tage lang auf. Für Besuchsstatistiken wird Google Tag Manager verwendet."
        },
        {
          "h": "An wen wir Daten weitergeben",
          "t": "Nur an Dienste, ohne die die Plattform nicht funktioniert: Resend für den E-Mail-Versand; Heleket für Zahlungen; Telegram für Kanäle und Benachrichtigungen; TradingView für die Freischaltung per Benutzername; Google für Besuchsstatistiken. Außerdem geben wir Daten heraus, wenn Behörden dies rechtmäßig verlangen."
        },
        {
          "h": "Speicherdauer",
          "t": "Solange Ihr Konto besteht. Nach der Löschung des Kontos werden nur die für die Buchhaltung erforderlichen Zahlungsdaten aufbewahrt."
        },
        {
          "h": "Ihre Rechte",
          "t": "Sie können eine Kopie Ihrer Daten anfordern, diese berichtigen lassen oder Ihr Konto löschen. Schreiben Sie dazu an support@updown.team von der E-Mail-Adresse, mit der Ihr Konto registriert ist. Wir antworten innerhalb von 30 Tagen."
        },
        {
          "h": "Sicherheit",
          "t": "Die Verbindung zur Website ist verschlüsselt (HTTPS), Passwörter werden verschlüsselt gespeichert, und nur Administratoren der Plattform haben Zugriff auf die Daten."
        },
        {
          "h": "Änderungen",
          "t": "Eine neue Fassung dieser Datenschutzerklärung tritt mit dem Tag ihrer Veröffentlichung auf dieser Seite in Kraft."
        }
      ]
    },
    "refunds": {
      "title": "Rückerstattungsrichtlinie",
      "intro": "Sie können innerhalb von 7 Tagen nach der Zahlung eine Rückerstattung beantragen. Abonnements verlängern sich nicht automatisch: Jede Zahlung nehmen Sie selbst vor.",
      "fullTitle": "Wann wir den vollen Betrag erstatten",
      "full": [
        "der Zugang wurde durch unser Verschulden nicht innerhalb von 48 Stunden nach der Zahlung gewährt, und der Support konnte das Problem nicht lösen;",
        "Sie haben dasselbe Produkt zweimal bezahlt oder die Zahlung versehentlich ausgeführt;",
        "Intensivkurs „UpDown-Strategie“: Sie haben vor der ersten Lektion storniert."
      ],
      "noTitle": "Wann keine Rückerstattung erfolgt",
      "no": [
        "der Zugang zum Indikator, Kanal oder Tarif wurde bereits gewährt, auch bei nicht genutzten Tagen des Abonnements;",
        "der Intensivkurs hat bereits begonnen;",
        "der Zugang wurde wegen Verstoßes gegen die Bedingungen entzogen (Weitergabe des Zugangs, Weiterverkauf von Signalen);",
        "Handelsverluste — die Materialien von UpDown garantieren keinen Gewinn."
      ],
      "sections": [
        {
          "h": "So beantragen Sie eine Rückerstattung",
          "t": "Schreiben Sie innerhalb von 7 Tagen nach der Zahlung an @Agent_X_support auf Telegram oder an support@updown.team. Geben Sie die E-Mail-Adresse Ihres Kontos, die Transaktions-ID und den Grund an."
        },
        {
          "h": "So erstatten wir",
          "t": "In USDT an dieselbe Adresse und im selben Netzwerk, von dem die Zahlung kam, abzüglich der Netzwerkgebühr. Innerhalb von 14 Tagen nach der Genehmigung. Nach der Rückerstattung wird der Zugang zum Produkt gesperrt."
        }
      ]
    }
  },
  "es": {
    "nav": {
      "legal": "Información legal",
      "terms": "Términos de uso",
      "privacy": "Privacidad",
      "refunds": "Política de reembolsos"
    },
    "updated": "Versión del {date}",
    "contactsTitle": "Preguntas sobre este documento",
    "contactsText": "Escribe a soporte: @Agent_X_support en Telegram o support@updown.team.",
    "seo": {
      "termsTitle": "Términos de uso — UpDown",
      "termsDesc": "Términos de uso de UpDown: cuenta, pago, acceso a indicadores y canales, riesgos del trading y limitación de responsabilidad.",
      "privacyTitle": "Política de privacidad — UpDown",
      "privacyDesc": "Qué datos recopila UpDown, para qué, con quién los comparte, cuánto tiempo los conserva y cómo solicitar una copia o su eliminación.",
      "refundsTitle": "Política de reembolsos — UpDown",
      "refundsDesc": "Cuándo UpDown reembolsa un pago, cuándo no, cómo solicitar un reembolso en un plazo de 7 días y cómo se devuelve el dinero en USDT."
    },
    "terms": {
      "title": "Términos de uso",
      "intro": "Al registrarte en updown.team o pagar un producto, aceptas estos términos.",
      "sections": [
        {
          "h": "1. Qué es UpDown",
          "t": "UpDown es una plataforma de herramientas de análisis de mercado: indicadores para TradingView, canales de señales en Telegram, formación y un área personal en updown.team."
        },
        {
          "h": "2. Cuenta",
          "t": "Necesitas una cuenta con un email válido. Una cuenta por persona. Eres responsable de mantener seguro el acceso a tu email y a tu cuenta. Solo pueden usar el servicio personas mayores de edad."
        },
        {
          "h": "3. Pago",
          "t": "Los precios se indican en el sitio web en USDT. El pago se realiza en criptomonedas a través de un proveedor de pagos. El acceso se concede por el periodo pagado y no se renueva automáticamente. Los reembolsos se rigen por las normas de la página Política de reembolsos."
        },
        {
          "h": "4. Acceso a los productos",
          "t": "Los indicadores se asignan a tu nombre de usuario de TradingView, y los canales, mediante enlaces personales de Telegram. El acceso es personal: no puedes compartirlo, revenderlo ni publicar las señales o los materiales en otros sitios. Si lo haces, podemos retirarte el acceso sin reembolso."
        },
        {
          "h": "5. Riesgos",
          "t": "Operar con criptomonedas, forex y otros instrumentos conlleva un riesgo elevado, incluida la pérdida de todos los fondos. Los materiales de UpDown son herramientas de análisis y formación, no asesoramiento de inversión personalizado. Tú tomas tus propias decisiones de trading. Los resultados pasados y las opiniones no garantizan rentabilidades futuras."
        },
        {
          "h": "6. Limitación de responsabilidad",
          "t": "UpDown no se hace responsable de las pérdidas de trading, del funcionamiento de los exchanges, TradingView o Telegram, ni de las interrupciones del servicio. Nuestra responsabilidad máxima se limita al importe que pagaste por el producto."
        },
        {
          "h": "7. Propiedad intelectual",
          "t": "Los indicadores, algoritmos, lecciones, textos y diseño pertenecen a UpDown y a sus autores. No puedes copiarlos ni distribuirlos sin autorización."
        },
        {
          "h": "8. Cambios",
          "t": "Podemos modificar estos términos. La nueva versión entra en vigor en la fecha de su publicación; te avisaremos de los cambios importantes en tu área personal."
        }
      ]
    },
    "privacy": {
      "title": "Política de privacidad",
      "intro": "Solo recopilamos los datos necesarios para darte acceso y ayudarte, y nunca los vendemos.",
      "tableTitle": "Qué datos recopilamos",
      "head": [
        "Datos",
        "Para qué"
      ],
      "rows": [
        [
          "Email, nombre (opcional), idioma",
          "Inicio de sesión, emails con códigos y notificaciones"
        ],
        [
          "Nombre de usuario de TradingView",
          "Dar acceso a los indicadores"
        ],
        [
          "ID de Telegram (si conectaste el bot)",
          "Acceso a los canales y notificaciones"
        ],
        [
          "Datos del pago: importe, fecha, ID de la transacción",
          "Gestión de suscripciones y reembolsos; nunca recibimos datos de tarjetas"
        ],
        [
          "De dónde llegaste: etiquetas de anuncios, sitio de procedencia, código de referido",
          "Saber qué anuncios funcionan; abonar la bonificación a quien te recomendó"
        ],
        [
          "Datos técnicos: dirección IP, navegador, hora de inicio de sesión",
          "Seguridad y protección frente al robo de cuentas"
        ]
      ],
      "sections": [
        {
          "h": "Almacenamiento en el navegador",
          "t": "El sitio guarda en tu navegador tu sesión, el idioma y el tema, y conserva el código de referido y la fuente de la visita durante 30 días. Para las estadísticas de visitas se utiliza Google Tag Manager."
        },
        {
          "h": "Con quién compartimos los datos",
          "t": "Solo con los servicios sin los que la plataforma no puede funcionar: Resend para enviar emails; Heleket para los pagos; Telegram para los canales y las notificaciones; TradingView para dar acceso por nombre de usuario; Google para las estadísticas de visitas. También facilitamos datos cuando lo exigen legalmente las autoridades públicas."
        },
        {
          "h": "Conservación",
          "t": "Mientras exista tu cuenta. Tras eliminar la cuenta, solo se conservan los registros de pagos necesarios para la contabilidad."
        },
        {
          "h": "Tus derechos",
          "t": "Puedes solicitar una copia de tus datos, corregirlos o eliminar tu cuenta. Escribe a support@updown.team desde el email con el que está registrada tu cuenta. Te responderemos en un plazo de 30 días."
        },
        {
          "h": "Seguridad",
          "t": "La conexión con el sitio está cifrada (HTTPS), las contraseñas se guardan cifradas y solo los administradores de la plataforma tienen acceso a los datos."
        },
        {
          "h": "Cambios",
          "t": "La nueva versión de esta política entra en vigor en la fecha de su publicación en esta página."
        }
      ]
    },
    "refunds": {
      "title": "Política de reembolsos",
      "intro": "Puedes solicitar un reembolso en un plazo de 7 días desde el pago. Las suscripciones no se renuevan automáticamente: cada pago lo haces tú.",
      "fullTitle": "Cuándo reembolsamos el importe completo",
      "full": [
        "el acceso no se concedió por causas imputables a nosotros en las 48 horas siguientes al pago y soporte no pudo resolver el problema;",
        "pagaste dos veces el mismo producto o el pago se realizó por error;",
        "intensivo «Estrategia UpDown»: cancelaste antes de la primera lección."
      ],
      "noTitle": "Cuándo no hay reembolso",
      "no": [
        "ya se ha concedido el acceso al indicador, canal o plan, incluidos los días de suscripción no utilizados;",
        "el intensivo ya ha comenzado;",
        "el acceso se retiró por incumplir los términos (compartir el acceso, revender señales);",
        "pérdidas de trading: los materiales de UpDown no garantizan beneficios."
      ],
      "sections": [
        {
          "h": "Cómo solicitar un reembolso",
          "t": "En un plazo de 7 días desde el pago, escribe a @Agent_X_support en Telegram o a support@updown.team. Indica el email de tu cuenta, el ID de la transacción y el motivo."
        },
        {
          "h": "Cómo reembolsamos",
          "t": "En USDT, a la misma dirección y en la misma red desde las que se realizó el pago, descontando la comisión de la red. En un plazo de 14 días desde la aprobación. Tras el reembolso, se cierra el acceso al producto."
        }
      ]
    }
  },
  "it": {
    "nav": {
      "legal": "Note legali",
      "terms": "Termini d'uso",
      "privacy": "Privacy",
      "refunds": "Politica di rimborso"
    },
    "updated": "Versione del {date}",
    "contactsTitle": "Domande su questo documento",
    "contactsText": "Contatta l'assistenza: @Agent_X_support su Telegram o support@updown.team.",
    "seo": {
      "termsTitle": "Termini d'uso — UpDown",
      "termsDesc": "Termini d'uso di UpDown: account, pagamento, accesso a indicatori e canali, rischi del trading e limitazione di responsabilità.",
      "privacyTitle": "Informativa sulla privacy — UpDown",
      "privacyDesc": "Quali dati raccoglie UpDown, perché, con chi li condivide, per quanto tempo li conserva e come richiederne una copia o la cancellazione.",
      "refundsTitle": "Politica di rimborso — UpDown",
      "refundsDesc": "Quando UpDown rimborsa un pagamento e quando no, come richiedere un rimborso entro 7 giorni e come viene restituito il denaro in USDT."
    },
    "terms": {
      "title": "Termini d'uso",
      "intro": "Registrandoti su updown.team o pagando un prodotto, accetti questi termini.",
      "sections": [
        {
          "h": "1. Cos'è UpDown",
          "t": "UpDown è una piattaforma di strumenti per l'analisi dei mercati: indicatori per TradingView, canali di segnali su Telegram, formazione e un'area personale su updown.team."
        },
        {
          "h": "2. Account",
          "t": "Serve un account con un indirizzo email valido. Un solo account per persona. Sei responsabile della sicurezza dell'accesso alla tua email e al tuo account. Il servizio è riservato ai maggiorenni."
        },
        {
          "h": "3. Pagamento",
          "t": "I prezzi sono indicati sul sito in USDT. Il pagamento avviene in criptovaluta tramite un fornitore di servizi di pagamento. L'accesso viene concesso per il periodo pagato e non si rinnova automaticamente. I rimborsi seguono le regole indicate nella pagina Politica di rimborso."
        },
        {
          "h": "4. Accesso ai prodotti",
          "t": "Gli indicatori vengono attivati sul tuo nome utente TradingView, i canali tramite link personali di Telegram. L'accesso è personale: non puoi condividerlo, rivenderlo né pubblicare segnali o materiali altrove. In caso contrario, possiamo revocare l'accesso senza rimborso."
        },
        {
          "h": "5. Rischi",
          "t": "Il trading di criptovalute, forex e altri strumenti comporta un rischio elevato, inclusa la perdita di tutti i fondi. I materiali di UpDown sono strumenti di analisi e formazione, non consulenza personalizzata in materia di investimenti. Le decisioni di trading le prendi tu. I risultati passati e le recensioni non garantiscono rendimenti futuri."
        },
        {
          "h": "6. Limitazione di responsabilità",
          "t": "UpDown non è responsabile delle perdite di trading, del funzionamento degli exchange, di TradingView o di Telegram, né delle interruzioni del servizio. La nostra responsabilità massima è limitata all'importo che hai pagato per il prodotto."
        },
        {
          "h": "7. Proprietà intellettuale",
          "t": "Indicatori, algoritmi, lezioni, testi e design appartengono a UpDown e ai rispettivi autori. Non puoi copiarli né distribuirli senza autorizzazione."
        },
        {
          "h": "8. Modifiche",
          "t": "Possiamo modificare questi termini. Una nuova versione entra in vigore dalla data di pubblicazione; ti avviseremo delle modifiche rilevanti nella tua area personale."
        }
      ]
    },
    "privacy": {
      "title": "Informativa sulla privacy",
      "intro": "Raccogliamo solo i dati necessari per concederti l'accesso e aiutarti, e non li vendiamo mai.",
      "tableTitle": "Quali dati raccogliamo",
      "head": [
        "Dati",
        "Perché"
      ],
      "rows": [
        [
          "Email, nome (facoltativo), lingua",
          "Accesso al sito, email con codici e notifiche"
        ],
        [
          "Nome utente TradingView",
          "Attivazione dell'accesso agli indicatori"
        ],
        [
          "ID Telegram (se hai collegato il bot)",
          "Accesso ai canali e notifiche"
        ],
        [
          "Dati di pagamento: importo, data, ID della transazione",
          "Gestione di abbonamenti e rimborsi; non riceviamo mai i dati delle carte"
        ],
        [
          "Provenienza: tag pubblicitari, sito di provenienza, codice referral",
          "Capire quali annunci funzionano; accreditare il bonus a chi ti ha invitato"
        ],
        [
          "Dati tecnici: indirizzo IP, browser, orario di accesso",
          "Sicurezza e protezione contro il furto dell'account"
        ]
      ],
      "sections": [
        {
          "h": "Archiviazione nel browser",
          "t": "Il sito salva nel tuo browser la sessione di accesso, la lingua e il tema, e conserva il codice referral e la fonte della visita per 30 giorni. Per le statistiche delle visite viene utilizzato Google Tag Manager."
        },
        {
          "h": "Con chi condividiamo i dati",
          "t": "Solo con i servizi senza i quali la piattaforma non può funzionare: Resend per l'invio delle email; Heleket per i pagamenti; Telegram per canali e notifiche; TradingView per l'attivazione dell'accesso tramite nome utente; Google per le statistiche delle visite. Comunichiamo inoltre i dati alle autorità pubbliche quando previsto dalla legge."
        },
        {
          "h": "Conservazione",
          "t": "Per tutto il tempo in cui esiste il tuo account. Dopo la cancellazione dell'account, vengono conservati solo i dati dei pagamenti necessari per la contabilità."
        },
        {
          "h": "I tuoi diritti",
          "t": "Puoi richiedere una copia dei tuoi dati, correggerli o cancellare il tuo account. Scrivi a support@updown.team dall'indirizzo con cui è registrato il tuo account. Ti risponderemo entro 30 giorni."
        },
        {
          "h": "Sicurezza",
          "t": "La connessione al sito è crittografata (HTTPS), le password sono conservate in forma crittografata e solo gli amministratori della piattaforma hanno accesso ai dati."
        },
        {
          "h": "Modifiche",
          "t": "Una nuova versione di questa informativa entra in vigore dalla data della sua pubblicazione su questa pagina."
        }
      ]
    },
    "refunds": {
      "title": "Politica di rimborso",
      "intro": "Puoi richiedere un rimborso entro 7 giorni dal pagamento. Gli abbonamenti non si rinnovano automaticamente: ogni pagamento lo effettui tu.",
      "fullTitle": "Quando rimborsiamo per intero",
      "full": [
        "l'accesso non è stato concesso per causa nostra entro 48 ore dal pagamento e l'assistenza non è riuscita a risolvere il problema;",
        "hai pagato due volte lo stesso prodotto o il pagamento è stato effettuato per errore;",
        "intensivo «Strategia UpDown»: hai annullato prima della prima lezione."
      ],
      "noTitle": "Quando non è previsto il rimborso",
      "no": [
        "l'accesso all'indicatore, al canale o al piano è già stato concesso, anche per i giorni di abbonamento non utilizzati;",
        "l'intensivo è già iniziato;",
        "l'accesso è stato revocato per violazione dei termini (condivisione dell'accesso, rivendita dei segnali);",
        "perdite di trading — i materiali di UpDown non garantiscono profitti."
      ],
      "sections": [
        {
          "h": "Come richiedere un rimborso",
          "t": "Entro 7 giorni dal pagamento, scrivi a @Agent_X_support su Telegram o a support@updown.team. Indica l'email del tuo account, l'ID della transazione e il motivo."
        },
        {
          "h": "Come effettuiamo il rimborso",
          "t": "In USDT allo stesso indirizzo e sulla stessa rete da cui è arrivato il pagamento, al netto della commissione di rete. Entro 14 giorni dall'approvazione. Dopo il rimborso, l'accesso al prodotto viene chiuso."
        }
      ]
    }
  },
  "pt": {
    "nav": {
      "legal": "Documentos legais",
      "terms": "Termos de uso",
      "privacy": "Privacidade",
      "refunds": "Política de reembolso"
    },
    "updated": "Versão de {date}",
    "contactsTitle": "Dúvidas sobre este documento",
    "contactsText": "Fale com o suporte: @Agent_X_support no Telegram ou support@updown.team.",
    "seo": {
      "termsTitle": "Termos de uso — UpDown",
      "termsDesc": "Termos de uso da UpDown: conta, pagamento, acesso a indicadores e canais, riscos de trading e limitação de responsabilidade.",
      "privacyTitle": "Política de privacidade — UpDown",
      "privacyDesc": "Quais dados a UpDown coleta, para quê, com quem são compartilhados, por quanto tempo são guardados e como pedir uma cópia ou a exclusão.",
      "refundsTitle": "Política de reembolso — UpDown",
      "refundsDesc": "Quando a UpDown reembolsa um pagamento, quando não reembolsa, como pedir o reembolso em até 7 dias e como o valor é devolvido em USDT."
    },
    "terms": {
      "title": "Termos de uso",
      "intro": "Ao se cadastrar no updown.team ou pagar por um produto, você aceita estes termos.",
      "sections": [
        {
          "h": "1. O que é a UpDown",
          "t": "A UpDown é uma plataforma de ferramentas de análise de mercado: indicadores para TradingView, canais de sinais no Telegram, educação e uma área pessoal no updown.team."
        },
        {
          "h": "2. Conta",
          "t": "É necessária uma conta com um e-mail válido. Uma conta por pessoa. Você é responsável por manter seguro o acesso ao seu e-mail e à sua conta. O serviço é destinado apenas a maiores de idade."
        },
        {
          "h": "3. Pagamento",
          "t": "Os preços são informados no site em USDT. O pagamento é feito em criptomoeda por meio de um provedor de pagamentos. O acesso é concedido pelo período pago e não é renovado automaticamente. Os reembolsos seguem as regras da página Política de reembolso."
        },
        {
          "h": "4. Acesso aos produtos",
          "t": "Os indicadores são liberados para o seu nome de usuário no TradingView, e os canais, por links pessoais do Telegram. O acesso é pessoal: você não pode compartilhá-lo, revendê-lo nem publicar sinais ou materiais em outros lugares. Se fizer isso, poderemos revogar o acesso sem reembolso."
        },
        {
          "h": "5. Riscos",
          "t": "Operar criptomoedas, forex e outros instrumentos envolve alto risco, inclusive a perda de todo o capital. Os materiais da UpDown são ferramentas de análise e educação, não recomendações de investimento personalizadas. As decisões de trading são suas. Resultados passados e depoimentos não garantem rentabilidade futura."
        },
        {
          "h": "6. Limitação de responsabilidade",
          "t": "A UpDown não se responsabiliza por perdas em operações, pelo funcionamento de corretoras, do TradingView ou do Telegram, nem por interrupções do serviço. Nossa responsabilidade máxima se limita ao valor que você pagou pelo produto."
        },
        {
          "h": "7. Propriedade intelectual",
          "t": "Indicadores, algoritmos, aulas, textos e design pertencem à UpDown e aos seus autores. Não é permitido copiá-los ou distribuí-los sem autorização."
        },
        {
          "h": "8. Alterações",
          "t": "Podemos alterar estes termos. A nova versão entra em vigor na data de sua publicação; avisaremos sobre mudanças importantes na sua área pessoal."
        }
      ]
    },
    "privacy": {
      "title": "Política de privacidade",
      "intro": "Coletamos apenas os dados necessários para liberar o acesso e ajudar você, e nunca os vendemos.",
      "tableTitle": "Quais dados coletamos",
      "head": [
        "Dados",
        "Para quê"
      ],
      "rows": [
        [
          "E-mail, nome (opcional), idioma",
          "Login, e-mails com códigos e notificações"
        ],
        [
          "Nome de usuário no TradingView",
          "Liberação de acesso aos indicadores"
        ],
        [
          "ID do Telegram (se você conectou o bot)",
          "Acesso aos canais e notificações"
        ],
        [
          "Dados do pagamento: valor, data, ID da transação",
          "Controle de assinaturas e reembolsos; nunca recebemos dados de cartão"
        ],
        [
          "De onde você veio: tags de anúncios, site de origem, código de indicação",
          "Entender quais anúncios funcionam; creditar o bônus de quem indicou"
        ],
        [
          "Dados técnicos: endereço IP, navegador, horário de login",
          "Segurança e proteção contra invasão da conta"
        ]
      ],
      "sections": [
        {
          "h": "Armazenamento no navegador",
          "t": "O site guarda no seu navegador o login, o idioma e o tema, e mantém o código de indicação e a origem da visita por 30 dias. O Google Tag Manager é usado para estatísticas de visitas."
        },
        {
          "h": "Com quem compartilhamos dados",
          "t": "Apenas com serviços sem os quais a plataforma não funciona: Resend para envio de e-mails; Heleket para pagamentos; Telegram para canais e notificações; TradingView para liberar acesso pelo nome de usuário; Google para estatísticas de visitas. Também fornecemos dados quando exigido legalmente por autoridades públicas."
        },
        {
          "h": "Prazo de armazenamento",
          "t": "Enquanto sua conta existir. Após a exclusão da conta, mantemos apenas os registros de pagamento necessários para a contabilidade."
        },
        {
          "h": "Seus direitos",
          "t": "Você pode pedir uma cópia dos seus dados, corrigi-los ou excluir sua conta. Escreva para support@updown.team a partir do e-mail cadastrado na sua conta. Responderemos em até 30 dias."
        },
        {
          "h": "Segurança",
          "t": "A conexão com o site é criptografada (HTTPS), as senhas são armazenadas de forma criptografada e somente os administradores da plataforma têm acesso aos dados."
        },
        {
          "h": "Alterações",
          "t": "A nova versão desta política entra em vigor na data de sua publicação nesta página."
        }
      ]
    },
    "refunds": {
      "title": "Política de reembolso",
      "intro": "Você pode pedir reembolso em até 7 dias após o pagamento. As assinaturas não são renovadas automaticamente: você faz cada pagamento por conta própria.",
      "fullTitle": "Quando reembolsamos o valor integral",
      "full": [
        "o acesso não foi liberado por falha nossa em até 48 horas após o pagamento e o suporte não conseguiu resolver o problema;",
        "você pagou duas vezes pelo mesmo produto ou o pagamento foi feito por engano;",
        "intensivo «Estratégia UpDown»: você cancelou antes da primeira aula."
      ],
      "noTitle": "Quando não há reembolso",
      "no": [
        "o acesso ao indicador, canal ou plano já foi liberado, inclusive em relação a dias não utilizados da assinatura;",
        "o intensivo já começou;",
        "o acesso foi revogado por violação dos termos (compartilhamento de acesso, revenda de sinais);",
        "perdas em operações — os materiais da UpDown não garantem lucro."
      ],
      "sections": [
        {
          "h": "Como pedir reembolso",
          "t": "Em até 7 dias após o pagamento, envie uma mensagem para @Agent_X_support no Telegram ou um e-mail para support@updown.team. Informe o e-mail da sua conta, o ID da transação e o motivo."
        },
        {
          "h": "Como fazemos o reembolso",
          "t": "Em USDT, para o mesmo endereço e na mesma rede de onde veio o pagamento, descontada a taxa da rede. Em até 14 dias após a aprovação. O acesso ao produto é encerrado após o reembolso."
        }
      ]
    }
  },
  "zh": {
    "nav": {
      "legal": "法律信息",
      "terms": "使用条款",
      "privacy": "隐私",
      "refunds": "退款政策"
    },
    "updated": "{date} 版本",
    "contactsTitle": "关于本文件的问题",
    "contactsText": "联系客服：Telegram 上的 @Agent_X_support 或发送邮件至 support@updown.team。",
    "seo": {
      "termsTitle": "使用条款 — UpDown",
      "termsDesc": "UpDown 使用条款：账户、付款、指标和频道的访问权限、交易风险及责任限制。",
      "privacyTitle": "隐私政策 — UpDown",
      "privacyDesc": "UpDown 收集哪些数据、用途是什么、与谁共享、保存多久，以及如何申请获取副本或删除数据。",
      "refundsTitle": "退款政策 — UpDown",
      "refundsDesc": "UpDown 何时退款、何时不退款、如何在 7 天内申请退款，以及如何以 USDT 退还款项。"
    },
    "terms": {
      "title": "使用条款",
      "intro": "在 updown.team 注册或购买任何产品，即表示您接受本条款。",
      "sections": [
        {
          "h": "1. UpDown 是什么",
          "t": "UpDown 是一个市场分析工具平台，提供 TradingView 指标、Telegram 信号频道、培训课程，以及 updown.team 上的个人账户。"
        },
        {
          "h": "2. 账户",
          "t": "您需要使用有效的电子邮箱注册账户。每人仅限一个账户。您有责任确保邮箱和账户的访问安全。仅限成年人使用本服务。"
        },
        {
          "h": "3. 付款",
          "t": "网站上的价格以 USDT 标示。付款通过支付服务商以加密货币完成。访问权限在已付费期限内有效，不会自动续订。退款按照“退款政策”页面的规定办理。"
        },
        {
          "h": "4. 产品访问权限",
          "t": "指标会开通到您的 TradingView 用户名，频道则通过个人专属的 Telegram 链接加入。访问权限仅限本人使用：不得转让、转售，也不得在其他地方发布信号或资料。如有违反，我们可能会收回访问权限且不予退款。"
        },
        {
          "h": "5. 风险",
          "t": "交易加密货币、外汇及其他金融工具具有高风险，可能导致全部资金损失。UpDown 的资料属于分析和学习工具，并非个人投资建议。交易决策由您自行作出。过往业绩和用户评价不代表未来收益。"
        },
        {
          "h": "6. 责任限制",
          "t": "对于交易亏损、交易所、TradingView 或 Telegram 的运行情况以及服务中断，UpDown 概不负责。我们承担的最高责任以您为该产品支付的金额为限。"
        },
        {
          "h": "7. 知识产权",
          "t": "指标、算法、课程、文字内容和设计归 UpDown 及其作者所有。未经许可，不得复制或传播。"
        },
        {
          "h": "8. 条款变更",
          "t": "我们可能会修改本条款。新版本自发布之日起生效；如有重大变更，我们会在您的个人账户中通知您。"
        }
      ]
    },
    "privacy": {
      "title": "隐私政策",
      "intro": "我们只收集开通访问权限和为您提供帮助所必需的数据，并且绝不出售这些数据。",
      "tableTitle": "我们收集哪些数据",
      "head": [
        "数据",
        "用途"
      ],
      "rows": [
        [
          "电子邮箱、姓名（可选）、语言",
          "登录、发送验证码邮件和通知"
        ],
        [
          "TradingView 用户名",
          "开通指标访问权限"
        ],
        [
          "Telegram ID（如果您绑定了机器人）",
          "频道访问和通知"
        ],
        [
          "付款信息：金额、日期、交易 ID",
          "记录订阅和退款；我们从不获取银行卡信息"
        ],
        [
          "访问来源：广告标签、来源网站、推荐码",
          "了解哪些广告有效；为推荐人计发奖励"
        ],
        [
          "技术数据：IP 地址、浏览器、登录时间",
          "安全保障及防止账户被盗"
        ]
      ],
      "sections": [
        {
          "h": "浏览器存储",
          "t": "网站会在您的浏览器中保存登录状态、语言和主题设置，并将推荐码和访问来源保存 30 天。我们使用 Google Tag Manager 进行访问统计。"
        },
        {
          "h": "我们与谁共享数据",
          "t": "仅限平台运行所必需的服务：Resend 用于发送邮件；Heleket 用于处理付款；Telegram 用于频道和通知；TradingView 用于按用户名开通访问权限；Google 用于访问统计。此外，在国家机关依法要求时，我们也会提供数据。"
        },
        {
          "h": "保存期限",
          "t": "在您的账户存续期间保存。账户删除后，仅保留会计核算所需的付款记录。"
        },
        {
          "h": "您的权利",
          "t": "您可以申请获取数据副本、更正数据或删除账户。请使用注册账户时的邮箱发送邮件至 support@updown.team。我们将在 30 天内回复。"
        },
        {
          "h": "安全",
          "t": "与网站的连接经过加密（HTTPS），密码以加密形式存储，只有平台管理员可以访问数据。"
        },
        {
          "h": "政策变更",
          "t": "本政策的新版本自在本页面发布之日起生效。"
        }
      ]
    },
    "refunds": {
      "title": "退款政策",
      "intro": "您可以在付款后 7 天内申请退款。订阅不会自动续订：每一笔付款都由您本人发起。",
      "fullTitle": "全额退款的情况",
      "full": [
        "因我方原因，付款后 48 小时内未开通访问权限，且客服未能解决问题；",
        "您为同一产品重复付款，或付款属于误操作；",
        "“UpDown 策略”集训课程：您在第一节课开始前取消。"
      ],
      "noTitle": "不予退款的情况",
      "no": [
        "指标、频道或套餐的访问权限已经开通，包括订阅中未使用的天数；",
        "集训课程已经开始；",
        "因违反条款（转让访问权限、转售信号）而被收回访问权限；",
        "交易亏损 — UpDown 的资料不保证盈利。"
      ],
      "sections": [
        {
          "h": "如何申请退款",
          "t": "请在付款后 7 天内通过 Telegram 联系 @Agent_X_support，或发送邮件至 support@updown.team。请注明您的账户邮箱、交易 ID 和退款原因。"
        },
        {
          "h": "如何退款",
          "t": "以 USDT 退回至原付款地址及相同网络，并扣除网络手续费。退款在批准后 14 天内完成。退款后，产品访问权限将被关闭。"
        }
      ]
    }
  },
  "ar": {
    "nav": {
      "legal": "المعلومات القانونية",
      "terms": "شروط الاستخدام",
      "privacy": "الخصوصية",
      "refunds": "سياسة الاسترداد"
    },
    "updated": "نسخة بتاريخ {date}",
    "contactsTitle": "أسئلة حول هذه الوثيقة",
    "contactsText": "تواصل مع الدعم: @Agent_X_support على Telegram أو support@updown.team.",
    "seo": {
      "termsTitle": "شروط الاستخدام — UpDown",
      "termsDesc": "شروط استخدام UpDown: الحساب، والدفع، والوصول إلى المؤشرات والقنوات، ومخاطر التداول، وحدود المسؤولية.",
      "privacyTitle": "سياسة الخصوصية — UpDown",
      "privacyDesc": "ما البيانات التي تجمعها UpDown، ولماذا، ومع من تشاركها، وكم تحتفظ بها، وكيف تطلب نسخة منها أو حذفها.",
      "refundsTitle": "سياسة الاسترداد — UpDown",
      "refundsDesc": "متى تعيد UpDown المبلغ المدفوع ومتى لا تعيده، وكيف تطلب الاسترداد خلال 7 أيام، وكيف تُعاد الأموال بعملة USDT."
    },
    "terms": {
      "title": "شروط الاستخدام",
      "intro": "بتسجيلك في updown.team أو دفعك مقابل أي منتج، فإنك توافق على هذه الشروط.",
      "sections": [
        {
          "h": "1. ما هي UpDown",
          "t": "UpDown منصة لأدوات تحليل الأسواق: مؤشرات على TradingView، وقنوات إشارات على Telegram، ومواد تعليمية، وحساب شخصي على updown.team."
        },
        {
          "h": "2. الحساب",
          "t": "تحتاج إلى حساب ببريد إلكتروني صالح. حساب واحد لكل شخص. أنت مسؤول عن الحفاظ على أمان الوصول إلى بريدك الإلكتروني وحسابك. لا يحق استخدام الخدمة إلا للبالغين."
        },
        {
          "h": "3. الدفع",
          "t": "الأسعار معروضة على الموقع بعملة USDT. يتم الدفع بالعملات المشفرة عبر مزوّد خدمة دفع. يُمنح الوصول طوال الفترة المدفوعة ولا يتجدد تلقائيًا. يخضع الاسترداد للقواعد الواردة في صفحة سياسة الاسترداد."
        },
        {
          "h": "4. الوصول إلى المنتجات",
          "t": "تُمنح المؤشرات لاسم المستخدم الخاص بك على TradingView، والقنوات عبر روابط Telegram شخصية. الوصول شخصي: لا يجوز لك مشاركته أو إعادة بيعه أو نشر الإشارات أو المواد في أي مكان آخر. وإذا فعلت ذلك، يحق لنا إلغاء وصولك دون استرداد المبلغ."
        },
        {
          "h": "5. المخاطر",
          "t": "ينطوي تداول العملات المشفرة والفوركس وغيرها من الأدوات على مخاطر عالية، بما في ذلك خسارة جميع الأموال. مواد UpDown أدوات للتحليل والتعليم، وليست نصيحة استثمارية شخصية. أنت من يتخذ قرارات التداول الخاصة بك. النتائج والمراجعات السابقة لا تضمن أرباحًا مستقبلية."
        },
        {
          "h": "6. حدود المسؤولية",
          "t": "لا تتحمل UpDown المسؤولية عن خسائر التداول، ولا عن عمل منصات التداول أو TradingView أو Telegram، ولا عن انقطاع الخدمة. وتقتصر مسؤوليتنا القصوى على المبلغ الذي دفعته مقابل المنتج."
        },
        {
          "h": "7. الملكية الفكرية",
          "t": "المؤشرات والخوارزميات والدروس والنصوص والتصميم ملك لـ UpDown ولمؤلفيها. لا يجوز لك نسخها أو توزيعها دون إذن."
        },
        {
          "h": "8. التعديلات",
          "t": "يحق لنا تعديل هذه الشروط. تسري النسخة الجديدة من تاريخ نشرها؛ وسنُعلمك بالتعديلات الجوهرية في حسابك."
        }
      ]
    },
    "privacy": {
      "title": "سياسة الخصوصية",
      "intro": "نجمع فقط البيانات التي نحتاجها لمنحك الوصول ومساعدتك، ولا نبيعها أبدًا.",
      "tableTitle": "ما البيانات التي نجمعها",
      "head": [
        "البيانات",
        "الغرض"
      ],
      "rows": [
        [
          "البريد الإلكتروني، والاسم (اختياري)، واللغة",
          "تسجيل الدخول، ورسائل البريد التي تتضمن الرموز والإشعارات"
        ],
        [
          "اسم المستخدم على TradingView",
          "منح الوصول إلى المؤشرات"
        ],
        [
          "معرّف Telegram (إذا ربطت البوت)",
          "الوصول إلى القنوات والإشعارات"
        ],
        [
          "بيانات الدفع: المبلغ، والتاريخ، ومعرّف المعاملة",
          "متابعة الاشتراكات والمبالغ المستردة؛ لا نتلقى بيانات البطاقات أبدًا"
        ],
        [
          "مصدر زيارتك: وسوم الإعلانات، والموقع المُحيل، ورمز الإحالة",
          "فهم الإعلانات الفعّالة؛ واحتساب مكافأة صاحب الإحالة"
        ],
        [
          "البيانات التقنية: عنوان IP، والمتصفح، ووقت تسجيل الدخول",
          "الأمان والحماية من الاستيلاء على الحساب"
        ]
      ],
      "sections": [
        {
          "h": "التخزين في المتصفح",
          "t": "يحفظ الموقع في متصفحك حالة تسجيل الدخول واللغة والمظهر، ويحتفظ برمز الإحالة ومصدر الزيارة لمدة 30 يومًا. ونستخدم Google Tag Manager لإحصاءات الزيارات."
        },
        {
          "h": "مع من نشارك البيانات",
          "t": "فقط مع الخدمات التي لا تعمل المنصة بدونها: Resend لإرسال رسائل البريد الإلكتروني؛ وHeleket للمدفوعات؛ وTelegram للقنوات والإشعارات؛ وTradingView لمنح الوصول حسب اسم المستخدم؛ وGoogle لإحصاءات الزيارات. كما نفصح عن البيانات عندما تطلبها الجهات الرسمية وفقًا للقانون."
        },
        {
          "h": "مدة الاحتفاظ",
          "t": "طوال مدة وجود حسابك. وبعد حذف الحساب، لا نحتفظ إلا بسجلات الدفع اللازمة للأغراض المحاسبية."
        },
        {
          "h": "حقوقك",
          "t": "يمكنك طلب نسخة من بياناتك أو تصحيحها أو حذف حسابك. راسل support@updown.team من العنوان المسجل به حسابك. وسنرد خلال 30 يومًا."
        },
        {
          "h": "الأمان",
          "t": "الاتصال بالموقع مشفّر (HTTPS)، وتُخزَّن كلمات المرور بصيغة مشفّرة، ولا يصل إلى البيانات إلا مسؤولو المنصة."
        },
        {
          "h": "التعديلات",
          "t": "تسري النسخة الجديدة من هذه السياسة من تاريخ نشرها على هذه الصفحة."
        }
      ]
    },
    "refunds": {
      "title": "سياسة الاسترداد",
      "intro": "يمكنك طلب استرداد المبلغ خلال 7 أيام من الدفع. لا تتجدد الاشتراكات تلقائيًا: فأنت من يُجري كل دفعة بنفسك.",
      "fullTitle": "متى نعيد المبلغ كاملًا",
      "full": [
        "لم يُمنح الوصول بسبب خطأ من جانبنا خلال 48 ساعة من الدفع، ولم يتمكن الدعم من حل المشكلة؛",
        "دفعت مقابل المنتج نفسه مرتين، أو تم الدفع عن طريق الخطأ؛",
        "المكثّف «استراتيجية UpDown»: ألغيت قبل الدرس الأول."
      ],
      "noTitle": "متى لا يُسترد المبلغ",
      "no": [
        "تم منح الوصول بالفعل إلى المؤشر أو القناة أو الخطة، بما في ذلك أيام الاشتراك غير المستخدمة؛",
        "بدأ المكثّف بالفعل؛",
        "أُلغي الوصول بسبب مخالفة الشروط (مشاركة الوصول، أو إعادة بيع الإشارات)؛",
        "خسائر التداول — مواد UpDown لا تضمن تحقيق الربح."
      ],
      "sections": [
        {
          "h": "كيف تطلب الاسترداد",
          "t": "خلال 7 أيام من الدفع، راسل @Agent_X_support على Telegram أو أرسل بريدًا إلى support@updown.team. أرفق البريد الإلكتروني لحسابك، ومعرّف المعاملة، وسبب الطلب."
        },
        {
          "h": "كيف نعيد المبلغ",
          "t": "بعملة USDT إلى العنوان والشبكة نفسيهما اللذين وردت منهما الدفعة، بعد خصم رسوم الشبكة. خلال 14 يومًا من الموافقة. ويُغلق الوصول إلى المنتج بعد الاسترداد."
        }
      ]
    }
  }
}
