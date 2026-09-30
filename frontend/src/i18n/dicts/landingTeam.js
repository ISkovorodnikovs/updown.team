// Главная, Спринт 2: блок «Как начать» и команда (тексты утверждены 26.09).
// Подмешивается поверх landing.js по каждому языку.
export default {
  en: {
    how: {
      label: 'How to start', title: 'Four steps to your first setup',
      steps: [
        { icon: '🔐', title: 'Sign up in 30 seconds', desc: 'Just your email and a code from the message. No card, no payment.' },
        { icon: '📊', title: 'Magnet Pro in TradingView', desc: 'Add your TradingView username and we enable the indicator for 7 days, usually within an hour.' },
        { icon: '✈️', title: 'Signals in Telegram', desc: 'Join UpDown Digest and the UpDown PRO channel right from your dashboard.' },
        { icon: '🚀', title: 'Choose your set', desc: 'Keep what works for you: a plan or individual indicators and channels.' },
      ],
    },
    team: {
      label: 'Team', title: 'The people behind UpDown',
      members: [
        { initials: "D", photo: "/team/dmitry.jpg", name: "Dmitry · Vektor", role: "Co-founder & CEO", desc: "Trader, developer and author of the UpDown indicators. Brings scattered analysis tools into a single system, from market context to a trade scenario. Runs the \"UpDown Trading System: from context to trade\" program. Together with Ivan and Andrey, he is building the UpDown AI terminal." },
        { initials: "S", photo: "/team/sergey.jpg", name: "Sergey · SKTRADE", role: "Co-founder, trader, educator", desc: "Author of the SK Trade method and the Fibonacci system that Fib Pro is built on. Teaches how to read price reaction in key areas rather than just draw levels. Runs the \"UpDown Strategy\" intensive and closed market reviews." },
        { initials: "I", photo: "/team/ivan.jpg", name: "Ivan · ISKOVX", role: "Co-founder & CTO", desc: "Fintech developer and platform architect. Built everything in UpDown related to data analysis, trading systems and AI, from AI analytics to the signal infrastructure and this website. Together with Dmitry and Andrey, he is building the UpDown AI terminal." },
        { initials: "A", photo: "/team/andrey.jpg", name: "Andrey · FLOW", role: "Trader & developer, Order Flow", desc: "Looks at the market from the inside: order book, trade tape, liquidity. Runs the \"UpDown Order Flow\" program. Together with Dmitry and Ivan, he is developing a next-generation AI trading terminal." },
        { initials: "A", photo: "/team/alik.jpg", name: "Alik", role: "Marketer & trader", desc: "Makes sure UpDown reaches the people who need it. Trades himself, so he speaks the same language as traders." },
        { initials: "O", photo: "/team/olga.jpg", name: "Olga", role: "Trader & review host", desc: "Hosts UpDown market reviews and live sessions together with Nadezhda. Turns complex market ideas into short, clear videos for our social channels." },
        { initials: "N", photo: "/team/nadezhda.jpg", name: "Nadezhda", role: "PR & trader", desc: "Went from UpDown student to review host. Leads PR and public communications, trades herself and hosts market reviews and live sessions with Olga. Explains complex things in plain language and keeps in touch with the community." },
      ],
    },
  },
  ru: {
    how: {
      label: 'Как начать', title: 'Четыре шага до первого сетапа',
      steps: [
        { icon: '🔐', title: 'Регистрация за 30 секунд', desc: 'Только email и код из письма. Без карты и оплаты.' },
        { icon: '📊', title: 'Magnet Pro в TradingView', desc: 'Укажите ник TradingView — откроем индикатор на 7 дней, обычно в течение часа.' },
        { icon: '✈️', title: 'Сигналы в Telegram', desc: 'Вступите в UpDown Digest и канал UpDown PRO прямо из кабинета.' },
        { icon: '🚀', title: 'Выберите свой набор', desc: 'Оставьте то, что работает: тариф или отдельные индикаторы и каналы.' },
      ],
    },
    team: {
      label: 'Команда', title: 'Люди за UpDown',
      members: [
        { initials: "Д", photo: "/team/dmitry.jpg", name: "Дмитрий · Vektor", role: "Сооснователь и CEO", desc: "Трейдер, программист и автор индикаторов UpDown. Собирает разрозненные инструменты анализа в единую систему — от контекста рынка до торгового сценария. Ведёт программу «UpDown Trading System: от контекста к сделке». Вместе с Иваном и Андреем создаёт AI-терминал UpDown." },
        { initials: "С", photo: "/team/sergey.jpg", name: "Сергей · SKTRADE", role: "Сооснователь, трейдер, автор обучения", desc: "Автор методики SK Trade и авторской системы Фибоначчи, на которой построен Fib Pro. Учит не рисовать уровни, а читать реакцию цены в важных областях. Ведёт интенсив «Стратегия UpDown» и закрытые разборы рынка." },
        { initials: "И", photo: "/team/ivan.jpg", name: "Иван · ISKOVX", role: "Сооснователь и CTO", desc: "Финтех-разработчик и архитектор платформы. Создал всё, что в UpDown связано с анализом данных, торговыми системами и ИИ: от AI-аналитики до инфраструктуры сигналов и этого сайта. Вместе с Дмитрием и Андреем создаёт AI-терминал UpDown." },
        { initials: "А", photo: "/team/andrey.jpg", name: "Андрей · FLOW", role: "Трейдер и разработчик, Order Flow", desc: "Смотрит на рынок изнутри: стакан, лента сделок, ликвидность. Ведёт программу «UpDown Order Flow». Вместе с Дмитрием и Иваном разрабатывает AI-терминал для трейдинга нового поколения." },
        { initials: "А", photo: "/team/alik.jpg", name: "Алик", role: "Маркетолог и трейдер", desc: "Отвечает за то, чтобы об UpDown узнали те, кому он нужен. Сам торгует, поэтому говорит с трейдерами на одном языке." },
        { initials: "О", photo: "/team/olga.jpg", name: "Ольга", role: "Трейдер и ведущая обзоров", desc: "Вместе с Надеждой ведёт обзоры рынка и эфиры UpDown. Превращает сложные идеи рынка в короткие понятные ролики для соцсетей." },
        { initials: "Н", photo: "/team/nadezhda.jpg", name: "Надежда", role: "PR и трейдер", desc: "Прошла путь от ученицы UpDown до ведущей обзоров. Отвечает за PR и публичные коммуникации, торгует сама и вместе с Ольгой ведёт обзоры рынка и эфиры. Объясняет сложное простым языком и держит связь с сообществом." },
      ],
    },
  },
  uk: {
    how: {
      label: 'Як почати', title: 'Чотири кроки до першого сетапу',
      steps: [
        { icon: '🔐', title: 'Реєстрація за 30 секунд', desc: 'Лише email і код із листа. Без картки й оплати.' },
        { icon: '📊', title: 'Magnet Pro у TradingView', desc: 'Вкажіть нік TradingView — відкриємо індикатор на 7 днів, зазвичай протягом години.' },
        { icon: '✈️', title: 'Сигнали в Telegram', desc: 'Приєднайтеся до UpDown Digest і каналу UpDown PRO прямо з кабінету.' },
        { icon: '🚀', title: 'Оберіть свій набір', desc: 'Залиште те, що працює: тариф або окремі індикатори й канали.' },
      ],
    },
    team: {
      label: 'Команда', title: 'Люди за UpDown',
      members: [
        { initials: "Д", photo: "/team/dmitry.jpg", name: "Дмитро · Vektor", role: "Співзасновник і CEO", desc: "Трейдер, програміст і автор індикаторів UpDown. Збирає розрізнені інструменти аналізу в єдину систему — від контексту ринку до торгового сценарію. Веде програму «UpDown Trading System: від контексту до угоди». Разом з Іваном та Андрієм створює AI-термінал UpDown." },
        { initials: "С", photo: "/team/sergey.jpg", name: "Сергій · SKTRADE", role: "Співзасновник, трейдер, автор навчання", desc: "Автор методики SK Trade та авторської системи Фібоначчі, на якій побудовано Fib Pro. Вчить не малювати рівні, а читати реакцію ціни у важливих зонах. Веде інтенсив «Стратегія UpDown» і закриті розбори ринку." },
        { initials: "І", photo: "/team/ivan.jpg", name: "Іван · ISKOVX", role: "Співзасновник і CTO", desc: "Фінтех-розробник і архітектор платформи. Створив усе, що в UpDown пов'язано з аналізом даних, торговими системами та ШІ: від AI-аналітики до інфраструктури сигналів і цього сайту. Разом з Дмитром та Андрієм створює AI-термінал UpDown." },
        { initials: "А", photo: "/team/andrey.jpg", name: "Андрій · FLOW", role: "Трейдер і розробник, Order Flow", desc: "Дивиться на ринок зсередини: стакан, стрічка угод, ліквідність. Веде програму «UpDown Order Flow». Разом з Дмитром та Іваном розробляє AI-термінал для трейдингу нового покоління." },
        { initials: "А", photo: "/team/alik.jpg", name: "Алік", role: "Маркетолог і трейдер", desc: "Відповідає за те, щоб про UpDown дізналися ті, кому він потрібен. Сам торгує, тож говорить із трейдерами однією мовою." },
        { initials: "О", photo: "/team/olga.jpg", name: "Ольга", role: "Трейдерка й ведуча оглядів", desc: "Разом із Надією веде огляди ринку та ефіри UpDown. Перетворює складні ідеї ринку на короткі зрозумілі ролики для соцмереж." },
        { initials: "Н", photo: "/team/nadezhda.jpg", name: "Надія", role: "PR і трейдерка", desc: "Пройшла шлях від учениці UpDown до ведучої оглядів. Відповідає за PR і публічні комунікації, торгує сама й разом з Ольгою веде огляди ринку та ефіри. Пояснює складне простою мовою і тримає зв'язок зі спільнотою." },
      ],
    },
  },
  de: {
    how: {
      label: 'So starten Sie', title: 'Vier Schritte zum ersten Setup',
      steps: [
        { icon: '🔐', title: 'Registrierung in 30 Sekunden', desc: 'Nur E-Mail und ein Code aus der Nachricht. Keine Karte, keine Zahlung.' },
        { icon: '📊', title: 'Magnet Pro in TradingView', desc: 'Geben Sie Ihren TradingView-Namen an – wir schalten den Indikator für 7 Tage frei, meist innerhalb einer Stunde.' },
        { icon: '✈️', title: 'Signale in Telegram', desc: 'Treten Sie UpDown Digest und dem Kanal UpDown PRO direkt aus dem Dashboard bei.' },
        { icon: '🚀', title: 'Ihr Set wählen', desc: 'Behalten Sie, was funktioniert: einen Tarif oder einzelne Indikatoren und Kanäle.' },
      ],
    },
    team: {
      label: 'Team', title: 'Die Menschen hinter UpDown',
      members: [
        { initials: "D", photo: "/team/dmitry.jpg", name: "Dmitry · Vektor", role: "Mitgründer & CEO", desc: "Trader, Entwickler und Autor der UpDown-Indikatoren. Bündelt verstreute Analysewerkzeuge zu einem System – vom Marktkontext bis zum Trade-Szenario. Leitet das Programm „UpDown Trading System: vom Kontext zum Trade\". Entwickelt gemeinsam mit Ivan und Andrey das UpDown-KI-Terminal." },
        { initials: "S", photo: "/team/sergey.jpg", name: "Sergey · SKTRADE", role: "Mitgründer, Trader, Ausbilder", desc: "Autor der SK-Trade-Methode und des Fibonacci-Systems, auf dem Fib Pro basiert. Lehrt, die Preisreaktion in wichtigen Bereichen zu lesen, statt nur Levels zu zeichnen. Leitet den Intensivkurs „UpDown-Strategie\" und geschlossene Marktanalysen." },
        { initials: "I", photo: "/team/ivan.jpg", name: "Ivan · ISKOVX", role: "Mitgründer & CTO", desc: "Fintech-Entwickler und Architekt der Plattform. Hat alles in UpDown gebaut, was mit Datenanalyse, Handelssystemen und KI zu tun hat – von der KI-Analyse bis zur Signal-Infrastruktur und dieser Website. Entwickelt gemeinsam mit Dmitry und Andrey das UpDown-KI-Terminal." },
        { initials: "A", photo: "/team/andrey.jpg", name: "Andrey · FLOW", role: "Trader & Entwickler, Order Flow", desc: "Betrachtet den Markt von innen: Orderbuch, Time & Sales, Liquidität. Leitet das Programm „UpDown Order Flow\". Entwickelt gemeinsam mit Dmitry und Ivan ein KI-Trading-Terminal der neuen Generation." },
        { initials: "A", photo: "/team/alik.jpg", name: "Alik", role: "Marketer & Trader", desc: "Sorgt dafür, dass UpDown die Menschen erreicht, die es brauchen. Tradet selbst und spricht daher die Sprache der Trader." },
        { initials: "O", photo: "/team/olga.jpg", name: "Olga", role: "Traderin & Moderatorin", desc: "Moderiert gemeinsam mit Nadezhda die Marktanalysen und Live-Sessions von UpDown. Macht aus komplexen Marktideen kurze, verständliche Videos für unsere sozialen Kanäle." },
        { initials: "N", photo: "/team/nadezhda.jpg", name: "Nadezhda", role: "PR & Traderin", desc: "Von der UpDown-Schülerin zur Moderatorin der Marktanalysen. Verantwortet PR und öffentliche Kommunikation, tradet selbst und moderiert mit Olga Marktanalysen und Live-Sessions. Erklärt Komplexes in einfacher Sprache und hält den Kontakt zur Community." },
      ],
    },
  },
  es: {
    how: {
      label: 'Cómo empezar', title: 'Cuatro pasos hasta tu primer setup',
      steps: [
        { icon: '🔐', title: 'Registro en 30 segundos', desc: 'Solo email y un código del mensaje. Sin tarjeta ni pago.' },
        { icon: '📊', title: 'Magnet Pro en TradingView', desc: 'Indica tu usuario de TradingView y activamos el indicador durante 7 días, normalmente en menos de una hora.' },
        { icon: '✈️', title: 'Señales en Telegram', desc: 'Únete a UpDown Digest y al canal UpDown PRO directamente desde tu panel.' },
        { icon: '🚀', title: 'Elige tu conjunto', desc: 'Quédate con lo que te funcione: un plan o indicadores y canales por separado.' },
      ],
    },
    team: {
      label: 'Equipo', title: 'Las personas detrás de UpDown',
      members: [
        { initials: "D", photo: "/team/dmitry.jpg", name: "Dmitry · Vektor", role: "Cofundador y CEO", desc: "Trader, programador y autor de los indicadores de UpDown. Reúne herramientas de análisis dispersas en un solo sistema, del contexto del mercado al escenario de operación. Dirige el programa «UpDown Trading System: del contexto a la operación». Junto con Ivan y Andrey desarrolla el terminal de IA de UpDown." },
        { initials: "S", photo: "/team/sergey.jpg", name: "Sergey · SKTRADE", role: "Cofundador, trader, formador", desc: "Autor del método SK Trade y del sistema Fibonacci en el que se basa Fib Pro. Enseña a leer la reacción del precio en zonas importantes en lugar de solo trazar niveles. Dirige el intensivo «Estrategia UpDown» y análisis de mercado privados." },
        { initials: "I", photo: "/team/ivan.jpg", name: "Ivan · ISKOVX", role: "Cofundador y CTO", desc: "Desarrollador fintech y arquitecto de la plataforma. Creó todo lo relacionado con análisis de datos, sistemas de trading e IA en UpDown: desde la analítica con IA hasta la infraestructura de señales y este sitio web. Junto con Dmitry y Andrey desarrolla el terminal de IA de UpDown." },
        { initials: "A", photo: "/team/andrey.jpg", name: "Andrey · FLOW", role: "Trader y desarrollador, Order Flow", desc: "Mira el mercado desde dentro: libro de órdenes, cinta de operaciones, liquidez. Dirige el programa «UpDown Order Flow». Junto con Dmitry e Ivan desarrolla un terminal de trading con IA de nueva generación." },
        { initials: "A", photo: "/team/alik.jpg", name: "Alik", role: "Marketer y trader", desc: "Se encarga de que UpDown llegue a quien lo necesita. Opera él mismo, así que habla el mismo idioma que los traders." },
        { initials: "O", photo: "/team/olga.jpg", name: "Olga", role: "Trader y presentadora", desc: "Presenta con Nadezhda los análisis de mercado y directos de UpDown. Convierte ideas complejas del mercado en vídeos cortos y claros para nuestras redes." },
        { initials: "N", photo: "/team/nadezhda.jpg", name: "Nadezhda", role: "PR y trader", desc: "Pasó de alumna de UpDown a presentadora de los análisis. Se ocupa de las relaciones públicas y la comunicación, opera ella misma y presenta con Olga los análisis de mercado y directos. Explica lo complejo con palabras sencillas y mantiene el contacto con la comunidad." },
      ],
    },
  },
  it: {
    how: {
      label: 'Come iniziare', title: 'Quattro passi verso il tuo primo setup',
      steps: [
        { icon: '🔐', title: 'Registrazione in 30 secondi', desc: 'Solo email e un codice dal messaggio. Nessuna carta, nessun pagamento.' },
        { icon: '📊', title: 'Magnet Pro su TradingView', desc: 'Inserisci il tuo username TradingView e attiviamo l\'indicatore per 7 giorni, di solito entro un\'ora.' },
        { icon: '✈️', title: 'Segnali su Telegram', desc: 'Unisciti a UpDown Digest e al canale UpDown PRO direttamente dalla dashboard.' },
        { icon: '🚀', title: 'Scegli il tuo set', desc: 'Tieni ciò che funziona: un piano oppure singoli indicatori e canali.' },
      ],
    },
    team: {
      label: 'Team', title: 'Le persone dietro UpDown',
      members: [
        { initials: "D", photo: "/team/dmitry.jpg", name: "Dmitry · Vektor", role: "Co-fondatore e CEO", desc: "Trader, programmatore e autore degli indicatori UpDown. Riunisce strumenti di analisi sparsi in un unico sistema, dal contesto di mercato allo scenario operativo. Guida il programma «UpDown Trading System: dal contesto al trade». Con Ivan e Andrey sviluppa il terminale IA di UpDown." },
        { initials: "S", photo: "/team/sergey.jpg", name: "Sergey · SKTRADE", role: "Co-fondatore, trader, formatore", desc: "Autore del metodo SK Trade e del sistema Fibonacci su cui si basa Fib Pro. Insegna a leggere la reazione del prezzo nelle aree importanti invece di limitarsi a disegnare livelli. Guida l'intensivo «Strategia UpDown» e analisi di mercato riservate." },
        { initials: "I", photo: "/team/ivan.jpg", name: "Ivan · ISKOVX", role: "Co-fondatore e CTO", desc: "Sviluppatore fintech e architetto della piattaforma. Ha creato tutto ciò che in UpDown riguarda analisi dei dati, sistemi di trading e IA: dall'analisi con IA all'infrastruttura dei segnali e a questo sito. Con Dmitry e Andrey sviluppa il terminale IA di UpDown." },
        { initials: "A", photo: "/team/andrey.jpg", name: "Andrey · FLOW", role: "Trader e sviluppatore, Order Flow", desc: "Guarda il mercato dall'interno: book, time & sales, liquidità. Guida il programma «UpDown Order Flow». Con Dmitry e Ivan sviluppa un terminale di trading con IA di nuova generazione." },
        { initials: "A", photo: "/team/alik.jpg", name: "Alik", role: "Marketer e trader", desc: "Fa in modo che UpDown arrivi a chi ne ha bisogno. Fa trading anche lui, quindi parla la stessa lingua dei trader." },
        { initials: "O", photo: "/team/olga.jpg", name: "Olga", role: "Trader e conduttrice", desc: "Conduce con Nadezhda le analisi di mercato e le dirette di UpDown. Trasforma idee di mercato complesse in video brevi e chiari per i nostri social." },
        { initials: "N", photo: "/team/nadezhda.jpg", name: "Nadezhda", role: "PR e trader", desc: "Da allieva di UpDown a conduttrice delle analisi. Si occupa di PR e comunicazione pubblica, fa trading lei stessa e conduce con Olga analisi di mercato e dirette. Spiega le cose complesse in modo semplice e mantiene il contatto con la community." },
      ],
    },
  },
  pt: {
    how: {
      label: 'Como começar', title: 'Quatro passos até o seu primeiro setup',
      steps: [
        { icon: '🔐', title: 'Cadastro em 30 segundos', desc: 'Só o email e um código da mensagem. Sem cartão e sem pagamento.' },
        { icon: '📊', title: 'Magnet Pro no TradingView', desc: 'Informe seu usuário do TradingView e liberamos o indicador por 7 dias, geralmente em até uma hora.' },
        { icon: '✈️', title: 'Sinais no Telegram', desc: 'Entre no UpDown Digest e no canal UpDown PRO direto do seu painel.' },
        { icon: '🚀', title: 'Escolha o seu conjunto', desc: 'Fique com o que funciona: um plano ou indicadores e canais avulsos.' },
      ],
    },
    team: {
      label: 'Equipe', title: 'As pessoas por trás da UpDown',
      members: [
        { initials: "D", photo: "/team/dmitry.jpg", name: "Dmitry · Vektor", role: "Cofundador e CEO", desc: "Trader, programador e autor dos indicadores UpDown. Reúne ferramentas de análise dispersas em um único sistema, do contexto do mercado ao cenário de operação. Conduz o programa «UpDown Trading System: do contexto à operação». Com Ivan e Andrey, desenvolve o terminal de IA da UpDown." },
        { initials: "S", photo: "/team/sergey.jpg", name: "Sergey · SKTRADE", role: "Cofundador, trader, educador", desc: "Autor do método SK Trade e do sistema Fibonacci em que o Fib Pro se baseia. Ensina a ler a reação do preço em áreas importantes, em vez de apenas desenhar níveis. Conduz o intensivo «Estratégia UpDown» e análises de mercado fechadas." },
        { initials: "I", photo: "/team/ivan.jpg", name: "Ivan · ISKOVX", role: "Cofundador e CTO", desc: "Desenvolvedor fintech e arquiteto da plataforma. Criou tudo o que na UpDown envolve análise de dados, sistemas de trading e IA: da análise com IA à infraestrutura de sinais e a este site. Com Dmitry e Andrey, desenvolve o terminal de IA da UpDown." },
        { initials: "A", photo: "/team/andrey.jpg", name: "Andrey · FLOW", role: "Trader e desenvolvedor, Order Flow", desc: "Olha o mercado por dentro: livro de ofertas, fita de negócios, liquidez. Conduz o programa «UpDown Order Flow». Com Dmitry e Ivan, desenvolve um terminal de trading com IA de nova geração." },
        { initials: "A", photo: "/team/alik.jpg", name: "Alik", role: "Profissional de marketing e trader", desc: "Garante que a UpDown chegue a quem precisa dela. Também opera, por isso fala a mesma língua dos traders." },
        { initials: "O", photo: "/team/olga.jpg", name: "Olga", role: "Trader e apresentadora", desc: "Apresenta com Nadezhda as análises de mercado e lives da UpDown. Transforma ideias complexas do mercado em vídeos curtos e claros para as nossas redes." },
        { initials: "N", photo: "/team/nadezhda.jpg", name: "Nadezhda", role: "PR e trader", desc: "Passou de aluna da UpDown a apresentadora das análises. Cuida de PR e comunicação pública, opera ela mesma e apresenta com Olga as análises de mercado e lives. Explica o complexo em linguagem simples e mantém o contato com a comunidade." },
      ],
    },
  },
  zh: {
    how: {
      label: '如何开始', title: '四步完成您的第一个交易设置',
      steps: [
        { icon: '🔐', title: '30 秒注册', desc: '只需邮箱和邮件中的验证码。无需银行卡，无需付款。' },
        { icon: '📊', title: 'TradingView 中的 Magnet Pro', desc: '填写您的 TradingView 用户名，我们会为您开通 7 天指标，通常在一小时内。' },
        { icon: '✈️', title: 'Telegram 信号', desc: '直接在个人中心加入 UpDown Digest 和 UpDown PRO 频道。' },
        { icon: '🚀', title: '选择您的组合', desc: '保留适合您的：套餐，或单独的指标和频道。' },
      ],
    },
    team: {
      label: '团队', title: 'UpDown 背后的人',
      members: [
        { initials: "德", photo: "/team/dmitry.jpg", name: "德米特里 · Vektor", role: "联合创始人兼 CEO", desc: "交易员、程序员，UpDown 指标的作者。把分散的分析工具整合成一个体系——从市场背景到交易情景。主持“UpDown Trading System：从背景到交易”课程。正与伊万和安德烈共同打造 UpDown AI 交易终端。" },
        { initials: "谢", photo: "/team/sergey.jpg", name: "谢尔盖 · SKTRADE", role: "联合创始人、交易员、讲师", desc: "SK Trade 方法及 Fib Pro 所依据的斐波那契体系的作者。他教的不是画价位，而是解读价格在关键区域的反应。主持“UpDown 策略”强化课程和内部行情解读。" },
        { initials: "伊", photo: "/team/ivan.jpg", name: "伊万 · ISKOVX", role: "联合创始人兼 CTO", desc: "金融科技开发者和平台架构师。UpDown 中与数据分析、交易系统和人工智能相关的一切都由他打造：从 AI 分析到信号基础设施，再到这个网站。正与德米特里和安德烈共同打造 UpDown AI 交易终端。" },
        { initials: "安", photo: "/team/andrey.jpg", name: "安德烈 · FLOW", role: "交易员兼开发者，订单流", desc: "从内部观察市场：订单簿、成交明细、流动性。主持“UpDown Order Flow”课程。正与德米特里和伊万共同开发新一代 AI 交易终端。" },
        { initials: "阿", photo: "/team/alik.jpg", name: "阿利克", role: "市场营销兼交易员", desc: "负责让需要 UpDown 的人了解它。他自己也做交易，因此和交易员说同一种语言。" },
        { initials: "奥", photo: "/team/olga.jpg", name: "奥尔加", role: "交易员兼行情解读主持人", desc: "与娜杰日达一起主持 UpDown 的行情解读和直播。把复杂的市场观点做成简短易懂的视频，发布在我们的社交媒体上。" },
        { initials: "娜", photo: "/team/nadezhda.jpg", name: "娜杰日达", role: "公关兼交易员", desc: "从 UpDown 的学员成长为行情解读主持人。负责公关和对外沟通，自己也做交易，并与奥尔加一起主持行情解读和直播。用通俗的语言讲清复杂的问题，与社区保持联系。" },
      ],
    },
  },
  ar: {
    how: {
      label: 'كيف تبدأ', title: 'أربع خطوات حتى أول إعداد تداول',
      steps: [
        { icon: '🔐', title: 'تسجيل خلال 30 ثانية', desc: 'بريدك الإلكتروني ورمز من الرسالة فقط. دون بطاقة ودون دفع.' },
        { icon: '📊', title: 'Magnet Pro في TradingView', desc: 'أدخل اسمك في TradingView وسنفعّل المؤشر لمدة 7 أيام، عادةً خلال ساعة.' },
        { icon: '✈️', title: 'إشارات على Telegram', desc: 'انضم إلى UpDown Digest وقناة UpDown PRO مباشرة من لوحة التحكم.' },
        { icon: '🚀', title: 'اختر مجموعتك', desc: 'احتفظ بما يناسبك: باقة أو مؤشرات وقنوات منفصلة.' },
      ],
    },
    team: {
      label: 'الفريق', title: 'الأشخاص وراء UpDown',
      members: [
        { initials: "د", photo: "/team/dmitry.jpg", name: "دميتري · Vektor", role: "شريك مؤسس والرئيس التنفيذي", desc: "متداول ومبرمج ومؤلف مؤشرات UpDown. يجمع أدوات التحليل المتفرقة في نظام واحد، من سياق السوق إلى سيناريو الصفقة. يقدّم برنامج «UpDown Trading System: من السياق إلى الصفقة». يعمل مع إيفان وأندريه على تطوير منصة UpDown للتداول بالذكاء الاصطناعي." },
        { initials: "س", photo: "/team/sergey.jpg", name: "سيرغي · SKTRADE", role: "شريك مؤسس، متداول، مدرّب", desc: "صاحب منهجية SK Trade ونظام فيبوناتشي الذي بُني عليه Fib Pro. يعلّم قراءة ردّ فعل السعر في المناطق المهمة بدلًا من مجرد رسم المستويات. يقدّم الدورة المكثفة «استراتيجية UpDown» وتحليلات سوق مغلقة." },
        { initials: "إ", photo: "/team/ivan.jpg", name: "إيفان · ISKOVX", role: "شريك مؤسس والمدير التقني", desc: "مطوّر تقنيات مالية ومهندس المنصة. بنى كل ما يتعلق في UpDown بتحليل البيانات وأنظمة التداول والذكاء الاصطناعي، من تحليلات الذكاء الاصطناعي إلى بنية الإشارات وهذا الموقع. يعمل مع دميتري وأندريه على تطوير منصة UpDown للتداول بالذكاء الاصطناعي." },
        { initials: "أ", photo: "/team/andrey.jpg", name: "أندريه · FLOW", role: "متداول ومطوّر، تدفق الأوامر", desc: "ينظر إلى السوق من الداخل: دفتر الأوامر وشريط الصفقات والسيولة. يقدّم برنامج «UpDown Order Flow». يطوّر مع دميتري وإيفان منصة تداول بالذكاء الاصطناعي من الجيل الجديد." },
        { initials: "أ", photo: "/team/alik.jpg", name: "أليك", role: "مسوّق ومتداول", desc: "يحرص على أن تصل UpDown إلى من يحتاجها. يتداول بنفسه، لذلك يتحدث مع المتداولين بلغتهم." },
        { initials: "أ", photo: "/team/olga.jpg", name: "أولغا", role: "متداولة ومقدّمة تحليلات", desc: "تقدّم مع ناديجدا تحليلات السوق والبث المباشر في UpDown. تحوّل أفكار السوق المعقدة إلى مقاطع قصيرة وواضحة لحساباتنا على وسائل التواصل." },
        { initials: "ن", photo: "/team/nadezhda.jpg", name: "ناديجدا", role: "علاقات عامة ومتداولة", desc: "انتقلت من طالبة في UpDown إلى مقدّمة التحليلات. مسؤولة عن العلاقات العامة والتواصل، تتداول بنفسها وتقدّم مع أولغا تحليلات السوق والبث المباشر. تشرح الأمور المعقدة بلغة بسيطة وتبقى على تواصل مع المجتمع." },
      ],
    },
  },
}
