// Каталог индикаторов для публичных страниц (Спринт 3).
// Без зависимостей от Vue: импортируется и приложением, и vite.config (SEO, sitemap).
// Цена по умолчанию; на странице актуальная цена подтягивается из /api/public/catalog.

export const INDICATORS = [
  {
    "slug": "market-radar-pro",
    "id": "b7f0a6c2-5d1e-4c7b-9a3e-2f6d8c4e1a90",
    "name": "UpDown Market Radar Pro",
    "short": "Market Radar Pro",
    "tv": "https://ru.tradingview.com/v/ZqTJuDGK/",
    "flagship": true,
    "free": false,
    "plans": [],
    "pairs": [
      "magnet-pro",
      "fib-pro",
      "liquidity-zones"
    ],
    "img": "/indicators/market-radar-pro.webp",
    "thumb": "/indicators/market-radar-pro-sm.webp",
    "price": 49
  },
  {
    "slug": "magnet-pro",
    "id": "e1707cb0-3001-4bcb-9cc6-541c91fdee7c",
    "name": "UpDown Magnet Pro",
    "short": "Magnet Pro",
    "tv": "https://ru.tradingview.com/v/NsV5Mtn4/",
    "flagship": false,
    "free": true,
    "plans": [],
    "pairs": [
      "market-radar-pro",
      "liquidity-zones",
      "strong-levels-finder"
    ],
    "img": "/indicators/magnet-pro.webp",
    "thumb": "/indicators/magnet-pro-sm.webp",
    "price": 49
  },
  {
    "slug": "fib-pro",
    "id": "52c79986-3472-4500-b897-42cf0d7cd770",
    "name": "UpDown Fib Pro",
    "short": "Fib Pro",
    "tv": "https://www.tradingview.com/script/Z5q65byi-updown-fib-by-sk-trade-v3/",
    "flagship": false,
    "free": false,
    "plans": [
      "PRO",
      "ELITE"
    ],
    "pairs": [
      "market-radar-pro",
      "magnet-pro"
    ],
    "img": "/indicators/fib-pro.webp",
    "thumb": "/indicators/fib-pro-sm.webp",
    "price": 49
  },
  {
    "slug": "mm-target-pro",
    "id": "fa29b351-7009-46c5-85ca-0061d2adc5d5",
    "name": "UpDown MM Target Pro",
    "short": "MM Target Pro",
    "tv": "https://ru.tradingview.com/script/2ceyLqUH-updown-pump-mm-target-lite/",
    "flagship": false,
    "free": false,
    "plans": [
      "ELITE"
    ],
    "pairs": [
      "trap-hunter-pro",
      "market-radar-pro"
    ],
    "img": "/indicators/mm-target-pro.webp",
    "thumb": "/indicators/mm-target-pro-sm.webp",
    "price": 49
  },
  {
    "slug": "trap-hunter-pro",
    "id": "3265f13e-6562-47f7-bf00-036f553acd6f",
    "name": "UpDown Trap Hunter Pro",
    "short": "Trap Hunter Pro",
    "tv": "https://ru.tradingview.com/script/6RqoLJzu-updown-pump-trap-hunter/",
    "flagship": false,
    "free": false,
    "plans": [
      "ELITE"
    ],
    "pairs": [
      "market-radar-pro",
      "mm-target-pro"
    ],
    "img": "/indicators/trap-hunter-pro.webp",
    "thumb": "/indicators/trap-hunter-pro-sm.webp",
    "price": 49
  },
  {
    "slug": "oi-radar-pro",
    "id": "9b7b3ad8-d66d-4fdf-a698-458a8be19b17",
    "name": "UpDown OI Radar Pro",
    "short": "OI Radar Pro",
    "tv": "https://ru.tradingview.com/script/rF1wtKvL-updown-oi-engine/",
    "flagship": false,
    "free": false,
    "plans": [
      "ELITE"
    ],
    "pairs": [
      "trap-hunter-pro",
      "market-radar-pro"
    ],
    "img": "/indicators/oi-radar-pro.webp",
    "thumb": "/indicators/oi-radar-pro-sm.webp",
    "price": 49
  },
  {
    "slug": "liquidity-zones",
    "id": "8a27824a-0a66-436f-84ab-357530bc92b1",
    "name": "UpDown Liquidity Zones",
    "short": "Liquidity Zones",
    "tv": "https://ru.tradingview.com/script/NCfSaooq-updown-liquidity-zones/",
    "flagship": false,
    "free": false,
    "plans": [
      "ELITE"
    ],
    "pairs": [
      "magnet-pro",
      "strong-levels-finder"
    ],
    "img": "/indicators/liquidity-zones.webp",
    "thumb": "/indicators/liquidity-zones-sm.webp",
    "price": 49
  },
  {
    "slug": "strong-levels-finder",
    "id": "05ff482a-b1cc-45e7-b080-4fc01867410a",
    "name": "UpDown Strong Levels Finder",
    "short": "Strong Levels Finder",
    "tv": "https://ru.tradingview.com/script/AXB8VsvM-updown-strong-levels-finder/",
    "flagship": false,
    "free": false,
    "plans": [
      "PRO",
      "ELITE"
    ],
    "pairs": [
      "liquidity-zones",
      "fib-pro"
    ],
    "img": "/indicators/strong-levels-finder.webp",
    "thumb": "/indicators/strong-levels-finder-sm.webp",
    "price": 49
  },
  {
    "slug": "table-predictor",
    "id": "717eec39-1795-433c-94a6-e1e11fa57c50",
    "name": "UpDown Table Predictor",
    "short": "Table Predictor",
    "tv": "https://ru.tradingview.com/v/b0QMRPSg/",
    "flagship": false,
    "free": false,
    "plans": [
      "START",
      "PRO",
      "ELITE"
    ],
    "pairs": [
      "market-radar-pro",
      "tf-reaction-map"
    ],
    "img": "/indicators/table-predictor.webp",
    "thumb": "/indicators/table-predictor-sm.webp",
    "price": 49
  },
  {
    "slug": "tf-reaction-map",
    "id": "a4d26f41-5a32-49f8-b42f-492635a7d80f",
    "name": "UpDown TF Reaction Map",
    "short": "TF Reaction Map",
    "tv": "https://ru.tradingview.com/script/5s1UWvKx-updown-tf-reaction-map-v2/",
    "flagship": false,
    "free": false,
    "plans": [
      "ELITE"
    ],
    "pairs": [
      "table-predictor",
      "fib-pro"
    ],
    "img": "/indicators/tf-reaction-map.webp",
    "thumb": "/indicators/tf-reaction-map-sm.webp",
    "price": 49
  }
]

// Тексты по языкам: tagline, lead, question, helps[], role
export const INDICATOR_TEXT = {
  "en": {
    "market-radar-pro": {
      "tagline": "The core market radar",
      "lead": "A multi-timeframe market radar. One table shows trend, current move, momentum, RSI, volume and divergences from 1 minute to 1 month. In a few seconds you see what is happening with the asset on every timeframe.",
      "question": "What is the market doing right now?",
      "helps": [
        "Whether higher and lower timeframes agree",
        "Whether there is a steady trend and building momentum",
        "Whether RSI is overheated or divergences appear",
        "Whether volume confirms the move",
        "Whether to look for a trade or wait"
      ],
      "role": "Every analysis in the UpDown system starts here: Market Radar → zones and levels → price reaction → decision."
    },
    "magnet-pro": {
      "tagline": "A map of market-interest zones",
      "lead": "Shows the areas of interest above and below the current price, their strength and the distance to the nearest zones. It clears the chart and leaves what is really worth watching.",
      "question": "Where are the most interesting areas on the chart right now?",
      "helps": [
        "The nearest zones above and below price",
        "The strength of each zone: strong or medium",
        "Distance to each zone in percent",
        "Works on any instrument and timeframe"
      ],
      "role": "It is a map of where to pay attention, not a buy or sell command. Free for 7 days after sign-up."
    },
    "fib-pro": {
      "tagline": "Sergey SKTRADE's Fibonacci system",
      "lead": "Built on Sergey SKTRADE's method. It draws the key FIB areas automatically, marks entry, stop and targets, and flags when price approaches an important level.",
      "question": "Price has reached a key area — where do I look for confirmation?",
      "helps": [
        "Less manual drawing",
        "Key FIB areas are never missed",
        "Entry, stop and targets right on the chart",
        "The SK Trade method applied consistently"
      ],
      "role": "Especially strong together with Sergey's training and Market Radar Pro."
    },
    "mm-target-pro": {
      "tagline": "Targets after a strong move",
      "lead": "For analyzing the market after a strong impulse. It highlights the significant zones and targets to build your next scenario around.",
      "question": "The coin is already up 15% — what now?",
      "helps": [
        "Targets and key zones after an impulse",
        "Where the move may continue",
        "Fewer emotional chase entries"
      ],
      "role": "A specialized tool for experienced traders."
    },
    "trap-hunter-pro": {
      "tagline": "Spotting traps after strong moves",
      "lead": "Helps you notice when a strong move is losing stability and a trap or momentum exhaustion may be forming.",
      "question": "Chase the move, or is it time to be careful?",
      "helps": [
        "Signs of a trap after a pump",
        "Momentum exhaustion",
        "A warning before chasing an entry"
      ],
      "role": "An advanced add-on tool. Works best with Market Radar Pro and MM Target Pro."
    },
    "oi-radar-pro": {
      "tagline": "An open interest radar",
      "lead": "Adds a layer of open interest, volume and participant behavior to your chart. You see whether a move is backed by market participation or signs of a trap are appearing.",
      "question": "Is the move backed by money, or is it a trap?",
      "helps": [
        "Open interest changes",
        "Volume confirmation of the move",
        "Momentum strength",
        "Suspicious market behavior"
      ],
      "role": "An extra filter for traders who work with futures."
    },
    "liquidity-zones": {
      "tagline": "Liquidity zones on your chart",
      "lead": "Automatically finds liquidity zones where orders cluster and shows their strength, volume and distance to price.",
      "question": "Where might the market grab liquidity?",
      "helps": [
        "Automatic liquidity zone detection",
        "Zone strength and volume",
        "Support and resistance zones",
        "Liquidity sweeps on the chart"
      ],
      "role": "A good complement to Magnet Pro and Strong Levels Finder."
    },
    "strong-levels-finder": {
      "tagline": "Strong levels from price history",
      "lead": "Finds the levels price has already reacted to and updates them automatically as new data comes in.",
      "question": "Which levels does the market really respect?",
      "helps": [
        "Strong levels from price history",
        "Automatic level updates",
        "Fewer unnecessary lines on the chart"
      ],
      "role": "A core tool for building a trade scenario."
    },
    "table-predictor": {
      "tagline": "A forecast table of market direction",
      "lead": "A compact multi-timeframe table shows direction, strength and market state, and marks key price levels on the chart.",
      "question": "Which way is the market leaning right now?",
      "helps": [
        "Direction across several timeframes at once",
        "Clear labels: long, short or no edge",
        "Key levels on the chart",
        "Works on any timeframe"
      ],
      "role": "Included in every plan: START, PRO and ELITE."
    },
    "tf-reaction-map": {
      "tagline": "A multi-timeframe reaction map",
      "lead": "Brings reaction zones from higher timeframes onto your working chart — for example, fair value gaps (FVG) from the hourly chart onto the minute chart.",
      "question": "Where is price most likely to react?",
      "helps": [
        "Reaction zones from higher timeframes",
        "Visible on any working timeframe",
        "Helps you choose where to enter"
      ],
      "role": "Works well together with Table Predictor and Fib Pro."
    }
  },
  "de": {
    "market-radar-pro": {
      "tagline": "Das zentrale Marktradar",
      "lead": "Ein Multi-Timeframe-Marktradar. Eine Tabelle zeigt Trend, aktuelle Bewegung, Momentum, RSI, Volumen und Divergenzen von 1 Minute bis 1 Monat. In wenigen Sekunden sehen Sie, was mit dem Asset auf jedem Zeitrahmen passiert.",
      "question": "Was macht der Markt gerade?",
      "helps": [
        "Ob höhere und niedrigere Zeitrahmen übereinstimmen",
        "Ob es einen stabilen Trend und zunehmendes Momentum gibt",
        "Ob der RSI überhitzt ist oder Divergenzen auftreten",
        "Ob das Volumen die Bewegung bestätigt",
        "Ob Sie einen Trade suchen oder abwarten sollten"
      ],
      "role": "Jede Analyse im UpDown-System beginnt hier: Market Radar → Zonen und Levels → Preisreaktion → Entscheidung."
    },
    "magnet-pro": {
      "tagline": "Eine Karte der Marktinteresse-Zonen",
      "lead": "Zeigt die Interessenzonen über und unter dem aktuellen Preis, ihre Stärke und den Abstand zu den nächsten Zonen. Es räumt den Chart auf und lässt nur das übrig, was wirklich Beachtung verdient.",
      "question": "Wo liegen gerade die interessantesten Bereiche im Chart?",
      "helps": [
        "Die nächsten Zonen über und unter dem Preis",
        "Die Stärke jeder Zone: stark oder mittel",
        "Abstand zu jeder Zone in Prozent",
        "Funktioniert auf jedem Instrument und Zeitrahmen"
      ],
      "role": "Eine Karte, wohin Sie schauen sollten, kein Kauf- oder Verkaufsbefehl. Nach der Registrierung 7 Tage kostenlos."
    },
    "fib-pro": {
      "tagline": "Das Fibonacci-System von Sergey SKTRADE",
      "lead": "Basiert auf der Methode von Sergey SKTRADE. Zeichnet die wichtigen FIB-Bereiche automatisch ein, markiert Einstieg, Stop und Ziele und meldet, wenn sich der Preis einem wichtigen Level nähert.",
      "question": "Der Preis hat einen Schlüsselbereich erreicht – wo suche ich die Bestätigung?",
      "helps": [
        "Weniger manuelles Einzeichnen",
        "Keine wichtigen FIB-Bereiche mehr verpassen",
        "Einstieg, Stop und Ziele direkt im Chart",
        "Die SK Trade Methode konsequent angewendet"
      ],
      "role": "Besonders stark in Kombination mit Sergeys Training und Market Radar Pro."
    },
    "mm-target-pro": {
      "tagline": "Ziele nach einer starken Bewegung",
      "lead": "Für die Marktanalyse nach einem starken Impuls. Hebt die wichtigen Zonen und Ziele hervor, um Ihr nächstes Szenario darauf aufzubauen.",
      "question": "Der Coin ist schon 15 % gestiegen – was jetzt?",
      "helps": [
        "Ziele und Schlüsselzonen nach einem Impuls",
        "Wo sich die Bewegung fortsetzen kann",
        "Weniger emotionale Einstiege hinterher"
      ],
      "role": "Ein spezialisiertes Tool für erfahrene Trader."
    },
    "trap-hunter-pro": {
      "tagline": "Fallen nach starken Bewegungen erkennen",
      "lead": "Hilft Ihnen zu erkennen, wann eine starke Bewegung an Stabilität verliert und sich eine Falle oder Momentum-Erschöpfung bilden könnte.",
      "question": "Der Bewegung hinterherspringen oder lieber vorsichtig sein?",
      "helps": [
        "Anzeichen einer Falle nach einem Pump",
        "Momentum-Erschöpfung",
        "Eine Warnung, bevor Sie hinterherspringen"
      ],
      "role": "Ein fortgeschrittenes Zusatztool. Am besten mit Market Radar Pro und MM Target Pro."
    },
    "oi-radar-pro": {
      "tagline": "Ein Open-Interest-Radar",
      "lead": "Ergänzt Ihren Chart um eine Ebene aus Open Interest, Volumen und Teilnehmerverhalten. Sie sehen, ob eine Bewegung von echter Marktbeteiligung getragen wird oder Anzeichen einer Falle auftreten.",
      "question": "Steckt Geld hinter der Bewegung oder ist es eine Falle?",
      "helps": [
        "Veränderungen im Open Interest",
        "Bestätigung der Bewegung durch Volumen",
        "Stärke des Momentums",
        "Auffälliges Marktverhalten"
      ],
      "role": "Ein zusätzlicher Filter für Trader, die mit Futures arbeiten."
    },
    "liquidity-zones": {
      "tagline": "Liquiditätszonen in Ihrem Chart",
      "lead": "Findet automatisch Liquiditätszonen, in denen sich Orders häufen, und zeigt ihre Stärke, ihr Volumen und den Abstand zum Preis.",
      "question": "Wo könnte sich der Markt Liquidität holen?",
      "helps": [
        "Automatische Erkennung von Liquiditätszonen",
        "Stärke und Volumen der Zonen",
        "Unterstützungs- und Widerstandszonen",
        "Liquidity Sweeps im Chart"
      ],
      "role": "Eine gute Ergänzung zu Magnet Pro und Strong Levels Finder."
    },
    "strong-levels-finder": {
      "tagline": "Starke Levels aus der Preishistorie",
      "lead": "Findet die Levels, auf die der Preis bereits reagiert hat, und aktualisiert sie automatisch mit neuen Daten.",
      "question": "Welche Levels respektiert der Markt wirklich?",
      "helps": [
        "Starke Levels aus der Preishistorie",
        "Automatische Aktualisierung der Levels",
        "Weniger überflüssige Linien im Chart"
      ],
      "role": "Ein zentrales Tool für den Aufbau eines Trading-Szenarios."
    },
    "table-predictor": {
      "tagline": "Eine Prognosetabelle zur Marktrichtung",
      "lead": "Eine kompakte Multi-Timeframe-Tabelle zeigt Richtung, Stärke und Marktzustand und markiert wichtige Preislevels im Chart.",
      "question": "In welche Richtung tendiert der Markt gerade?",
      "helps": [
        "Richtung auf mehreren Zeitrahmen gleichzeitig",
        "Klare Signale: Long, Short oder kein Vorteil",
        "Wichtige Levels im Chart",
        "Funktioniert auf jedem Zeitrahmen"
      ],
      "role": "In jedem Tarif enthalten: START, PRO und ELITE."
    },
    "tf-reaction-map": {
      "tagline": "Eine Multi-Timeframe-Reaktionskarte",
      "lead": "Überträgt Reaktionszonen von höheren Zeitrahmen auf Ihren Arbeitschart – zum Beispiel Fair Value Gaps (FVG) vom Stundenchart auf den Minutenchart.",
      "question": "Wo wird der Preis am wahrscheinlichsten reagieren?",
      "helps": [
        "Reaktionszonen von höheren Zeitrahmen",
        "Sichtbar auf jedem Arbeits-Zeitrahmen",
        "Hilft bei der Wahl des Einstiegs"
      ],
      "role": "Passt gut zu Table Predictor und Fib Pro."
    }
  },
  "es": {
    "market-radar-pro": {
      "tagline": "El radar principal del mercado",
      "lead": "Un radar de mercado multitemporal. Una sola tabla muestra tendencia, movimiento actual, impulso, RSI, volumen y divergencias desde 1 minuto hasta 1 mes. En pocos segundos usted ve qué ocurre con el activo en cada temporalidad.",
      "question": "¿Qué está haciendo el mercado ahora mismo?",
      "helps": [
        "Si las temporalidades mayores y menores coinciden",
        "Si hay una tendencia estable y el impulso crece",
        "Si el RSI está sobrecalentado o aparecen divergencias",
        "Si el volumen confirma el movimiento",
        "Si conviene buscar una operación o esperar"
      ],
      "role": "Todo análisis en el sistema UpDown empieza aquí: Market Radar → zonas y niveles → reacción del precio → decisión."
    },
    "magnet-pro": {
      "tagline": "Un mapa de zonas de interés del mercado",
      "lead": "Muestra las zonas de interés por encima y por debajo del precio actual, su fuerza y la distancia a las zonas más cercanas. Despeja el gráfico y deja solo lo que realmente merece atención.",
      "question": "¿Dónde están ahora las zonas más interesantes del gráfico?",
      "helps": [
        "Las zonas más cercanas por encima y por debajo del precio",
        "La fuerza de cada zona: fuerte o media",
        "La distancia a cada zona en porcentaje",
        "Funciona en cualquier instrumento y temporalidad"
      ],
      "role": "Es un mapa de dónde prestar atención, no una orden de compra o venta. Gratis durante 7 días tras el registro."
    },
    "fib-pro": {
      "tagline": "El sistema Fibonacci de Sergey SKTRADE",
      "lead": "Basado en el método de Sergey SKTRADE. Traza automáticamente las zonas FIB clave, marca entrada, stop y objetivos, y avisa cuando el precio se acerca a un nivel importante.",
      "question": "El precio llegó a una zona clave: ¿dónde busco confirmación?",
      "helps": [
        "Menos trazado manual",
        "Nunca se le escapan las zonas FIB clave",
        "Entrada, stop y objetivos directamente en el gráfico",
        "El método SK Trade aplicado de forma consistente"
      ],
      "role": "Especialmente potente junto con la formación de Sergey y Market Radar Pro."
    },
    "mm-target-pro": {
      "tagline": "Objetivos tras un movimiento fuerte",
      "lead": "Para analizar el mercado después de un impulso fuerte. Resalta las zonas relevantes y los objetivos sobre los que construir su próximo escenario.",
      "question": "La moneda ya subió un 15 %: ¿y ahora qué?",
      "helps": [
        "Objetivos y zonas clave tras un impulso",
        "Dónde puede continuar el movimiento",
        "Menos entradas emocionales persiguiendo el precio"
      ],
      "role": "Una herramienta especializada para traders con experiencia."
    },
    "trap-hunter-pro": {
      "tagline": "Detecta trampas tras movimientos fuertes",
      "lead": "Le ayuda a notar cuándo un movimiento fuerte pierde estabilidad y puede estar formándose una trampa o un agotamiento del impulso.",
      "question": "¿Perseguir el movimiento o es momento de ser prudente?",
      "helps": [
        "Señales de trampa tras un pump",
        "Agotamiento del impulso",
        "Una advertencia antes de perseguir una entrada"
      ],
      "role": "Una herramienta complementaria avanzada. Funciona mejor con Market Radar Pro y MM Target Pro."
    },
    "oi-radar-pro": {
      "tagline": "Un radar de interés abierto",
      "lead": "Añade a su gráfico una capa de interés abierto, volumen y comportamiento de los participantes. Usted ve si un movimiento está respaldado por la participación del mercado o si aparecen señales de trampa.",
      "question": "¿El movimiento está respaldado por dinero o es una trampa?",
      "helps": [
        "Cambios en el interés abierto",
        "Confirmación del movimiento por volumen",
        "Fuerza del impulso",
        "Comportamiento sospechoso del mercado"
      ],
      "role": "Un filtro adicional para traders que operan futuros."
    },
    "liquidity-zones": {
      "tagline": "Zonas de liquidez en su gráfico",
      "lead": "Encuentra automáticamente las zonas de liquidez donde se acumulan órdenes y muestra su fuerza, volumen y distancia al precio.",
      "question": "¿Dónde podría el mercado tomar liquidez?",
      "helps": [
        "Detección automática de zonas de liquidez",
        "Fuerza y volumen de cada zona",
        "Zonas de soporte y resistencia",
        "Barridos de liquidez en el gráfico"
      ],
      "role": "Un buen complemento de Magnet Pro y Strong Levels Finder."
    },
    "strong-levels-finder": {
      "tagline": "Niveles fuertes del historial de precios",
      "lead": "Encuentra los niveles en los que el precio ya reaccionó y los actualiza automáticamente a medida que llegan nuevos datos.",
      "question": "¿Qué niveles respeta realmente el mercado?",
      "helps": [
        "Niveles fuertes del historial de precios",
        "Actualización automática de niveles",
        "Menos líneas innecesarias en el gráfico"
      ],
      "role": "Una herramienta básica para construir un escenario de operación."
    },
    "table-predictor": {
      "tagline": "Una tabla de pronóstico de la dirección del mercado",
      "lead": "Una tabla multitemporal compacta muestra la dirección, la fuerza y el estado del mercado, y marca los niveles de precio clave en el gráfico.",
      "question": "¿Hacia dónde se inclina el mercado ahora mismo?",
      "helps": [
        "Dirección en varias temporalidades a la vez",
        "Etiquetas claras: largo, corto o sin ventaja",
        "Niveles clave en el gráfico",
        "Funciona en cualquier temporalidad"
      ],
      "role": "Incluido en todos los planes: START, PRO y ELITE."
    },
    "tf-reaction-map": {
      "tagline": "Un mapa de reacción multitemporal",
      "lead": "Lleva a su gráfico de trabajo las zonas de reacción de temporalidades mayores; por ejemplo, los fair value gaps (FVG) del gráfico horario al de minutos.",
      "question": "¿Dónde es más probable que reaccione el precio?",
      "helps": [
        "Zonas de reacción de temporalidades mayores",
        "Visibles en cualquier temporalidad de trabajo",
        "Le ayuda a elegir dónde entrar"
      ],
      "role": "Funciona bien junto con Table Predictor y Fib Pro."
    }
  },
  "it": {
    "market-radar-pro": {
      "tagline": "Il radar di mercato principale",
      "lead": "Un radar di mercato multi-timeframe. Una sola tabella mostra trend, movimento attuale, momentum, RSI, volumi e divergenze da 1 minuto a 1 mese. In pochi secondi vedi cosa succede all'asset su ogni timeframe.",
      "question": "Cosa sta facendo il mercato adesso?",
      "helps": [
        "Se i timeframe superiori e inferiori concordano",
        "Se c'è un trend stabile e un momentum in crescita",
        "Se l'RSI è surriscaldato o compaiono divergenze",
        "Se i volumi confermano il movimento",
        "Se cercare un trade o aspettare"
      ],
      "role": "Ogni analisi nel sistema UpDown parte da qui: Market Radar → zone e livelli → reazione del prezzo → decisione."
    },
    "magnet-pro": {
      "tagline": "Una mappa delle zone di interesse del mercato",
      "lead": "Mostra le aree di interesse sopra e sotto il prezzo attuale, la loro forza e la distanza dalle zone più vicine. Ripulisce il grafico e lascia solo ciò che conta davvero.",
      "question": "Dove sono le aree più interessanti del grafico in questo momento?",
      "helps": [
        "Le zone più vicine sopra e sotto il prezzo",
        "La forza di ogni zona: forte o media",
        "La distanza da ogni zona in percentuale",
        "Funziona su qualsiasi strumento e timeframe"
      ],
      "role": "È una mappa di dove prestare attenzione, non un ordine di acquisto o vendita. Gratis per 7 giorni dopo la registrazione."
    },
    "fib-pro": {
      "tagline": "Il sistema Fibonacci di Sergey SKTRADE",
      "lead": "Basato sul metodo di Sergey SKTRADE. Traccia automaticamente le aree FIB chiave, segna ingresso, stop e target e ti avvisa quando il prezzo si avvicina a un livello importante.",
      "question": "Il prezzo ha raggiunto un'area chiave: dove cerco la conferma?",
      "helps": [
        "Meno disegno manuale",
        "Nessuna area FIB chiave persa",
        "Ingresso, stop e target direttamente sul grafico",
        "Il metodo SK Trade applicato con coerenza"
      ],
      "role": "Particolarmente efficace insieme alla formazione di Sergey e a Market Radar Pro."
    },
    "mm-target-pro": {
      "tagline": "Target dopo un movimento forte",
      "lead": "Per analizzare il mercato dopo un forte impulso. Evidenzia le zone significative e i target su cui costruire il tuo prossimo scenario.",
      "question": "La moneta è già salita del 15%: e adesso?",
      "helps": [
        "Target e zone chiave dopo un impulso",
        "Dove il movimento può proseguire",
        "Meno ingressi emotivi all'inseguimento"
      ],
      "role": "Uno strumento specializzato per trader esperti."
    },
    "trap-hunter-pro": {
      "tagline": "Individua le trappole dopo i movimenti forti",
      "lead": "Ti aiuta a capire quando un movimento forte sta perdendo stabilità e potrebbe formarsi una trappola o un esaurimento del momentum.",
      "question": "Inseguire il movimento o è il momento di essere prudenti?",
      "helps": [
        "Segnali di trappola dopo un pump",
        "Esaurimento del momentum",
        "Un avviso prima di inseguire un ingresso"
      ],
      "role": "Uno strumento avanzato aggiuntivo. Dà il meglio con Market Radar Pro e MM Target Pro."
    },
    "oi-radar-pro": {
      "tagline": "Un radar dell'open interest",
      "lead": "Aggiunge al grafico un livello di open interest, volumi e comportamento dei partecipanti. Vedi se un movimento è sostenuto dalla partecipazione del mercato o se compaiono segnali di trappola.",
      "question": "Il movimento è sostenuto dal denaro o è una trappola?",
      "helps": [
        "Variazioni dell'open interest",
        "Conferma del movimento dai volumi",
        "Forza del momentum",
        "Comportamento sospetto del mercato"
      ],
      "role": "Un filtro in più per chi fa trading sui futures."
    },
    "liquidity-zones": {
      "tagline": "Le zone di liquidità sul tuo grafico",
      "lead": "Trova automaticamente le zone di liquidità dove si concentrano gli ordini e ne mostra forza, volume e distanza dal prezzo.",
      "question": "Dove potrebbe il mercato andare a prendere liquidità?",
      "helps": [
        "Rilevamento automatico delle zone di liquidità",
        "Forza e volume delle zone",
        "Zone di supporto e resistenza",
        "Sweep di liquidità sul grafico"
      ],
      "role": "Un ottimo complemento a Magnet Pro e Strong Levels Finder."
    },
    "strong-levels-finder": {
      "tagline": "Livelli forti dallo storico dei prezzi",
      "lead": "Trova i livelli a cui il prezzo ha già reagito e li aggiorna automaticamente all'arrivo di nuovi dati.",
      "question": "Quali livelli il mercato rispetta davvero?",
      "helps": [
        "Livelli forti dallo storico dei prezzi",
        "Aggiornamento automatico dei livelli",
        "Meno linee inutili sul grafico"
      ],
      "role": "Uno strumento fondamentale per costruire uno scenario di trading."
    },
    "table-predictor": {
      "tagline": "Una tabella di previsione della direzione del mercato",
      "lead": "Una tabella multi-timeframe compatta mostra direzione, forza e stato del mercato, e segna sul grafico i livelli di prezzo chiave.",
      "question": "Da che parte pende il mercato adesso?",
      "helps": [
        "La direzione su più timeframe contemporaneamente",
        "Indicazioni chiare: long, short o nessun vantaggio",
        "Livelli chiave sul grafico",
        "Funziona su qualsiasi timeframe"
      ],
      "role": "Incluso in tutti i piani: START, PRO ed ELITE."
    },
    "tf-reaction-map": {
      "tagline": "Una mappa delle reazioni multi-timeframe",
      "lead": "Porta sul tuo grafico operativo le zone di reazione dei timeframe superiori, ad esempio i fair value gap (FVG) dal grafico orario a quello al minuto.",
      "question": "Dove è più probabile che il prezzo reagisca?",
      "helps": [
        "Zone di reazione dai timeframe superiori",
        "Visibili su qualsiasi timeframe operativo",
        "Ti aiuta a scegliere dove entrare"
      ],
      "role": "Funziona bene insieme a Table Predictor e Fib Pro."
    }
  },
  "pt": {
    "market-radar-pro": {
      "tagline": "O radar central do mercado",
      "lead": "Um radar de mercado multi-tempo gráfico. Uma única tabela mostra tendência, movimento atual, momentum, RSI, volume e divergências de 1 minuto a 1 mês. Em poucos segundos você vê o que está acontecendo com o ativo em cada tempo gráfico.",
      "question": "O que o mercado está fazendo agora?",
      "helps": [
        "Se os tempos gráficos maiores e menores estão alinhados",
        "Se há uma tendência consistente e momentum ganhando força",
        "Se o RSI está sobreaquecido ou surgem divergências",
        "Se o volume confirma o movimento",
        "Se é hora de buscar uma operação ou esperar"
      ],
      "role": "Toda análise no sistema UpDown começa aqui: Market Radar → zonas e níveis → reação do preço → decisão."
    },
    "magnet-pro": {
      "tagline": "Um mapa das zonas de interesse do mercado",
      "lead": "Mostra as áreas de interesse acima e abaixo do preço atual, sua força e a distância até as zonas mais próximas. Limpa o gráfico e deixa só o que realmente merece atenção.",
      "question": "Onde estão as áreas mais interessantes do gráfico agora?",
      "helps": [
        "As zonas mais próximas acima e abaixo do preço",
        "A força de cada zona: forte ou média",
        "Distância até cada zona em porcentagem",
        "Funciona em qualquer ativo e tempo gráfico"
      ],
      "role": "É um mapa de onde prestar atenção, não uma ordem de compra ou venda. Grátis por 7 dias após o cadastro."
    },
    "fib-pro": {
      "tagline": "O sistema Fibonacci de Sergey SKTRADE",
      "lead": "Baseado no método de Sergey SKTRADE. Traça automaticamente as áreas-chave de FIB, marca entrada, stop e alvos, e avisa quando o preço se aproxima de um nível importante.",
      "question": "O preço chegou a uma área-chave — onde busco confirmação?",
      "helps": [
        "Menos traçado manual",
        "Nenhuma área-chave de FIB passa despercebida",
        "Entrada, stop e alvos direto no gráfico",
        "O método SK Trade aplicado com consistência"
      ],
      "role": "Especialmente forte junto com o treinamento de Sergey e o Market Radar Pro."
    },
    "mm-target-pro": {
      "tagline": "Alvos após um movimento forte",
      "lead": "Para analisar o mercado após um impulso forte. Destaca as zonas e alvos relevantes para montar seu próximo cenário.",
      "question": "A moeda já subiu 15% — e agora?",
      "helps": [
        "Alvos e zonas-chave após um impulso",
        "Onde o movimento pode continuar",
        "Menos entradas emocionais correndo atrás do preço"
      ],
      "role": "Uma ferramenta especializada para traders experientes."
    },
    "trap-hunter-pro": {
      "tagline": "Detectando armadilhas após movimentos fortes",
      "lead": "Ajuda você a perceber quando um movimento forte está perdendo estabilidade e pode estar se formando uma armadilha ou esgotamento do momentum.",
      "question": "Seguir o movimento ou é hora de ter cautela?",
      "helps": [
        "Sinais de armadilha após um pump",
        "Esgotamento do momentum",
        "Um alerta antes de correr atrás da entrada"
      ],
      "role": "Uma ferramenta complementar avançada. Funciona melhor com Market Radar Pro e MM Target Pro."
    },
    "oi-radar-pro": {
      "tagline": "Um radar de open interest",
      "lead": "Adiciona ao seu gráfico uma camada de open interest, volume e comportamento dos participantes. Você vê se o movimento tem participação real do mercado ou se surgem sinais de armadilha.",
      "question": "O movimento tem dinheiro por trás ou é uma armadilha?",
      "helps": [
        "Variações do open interest",
        "Confirmação do movimento pelo volume",
        "Força do momentum",
        "Comportamento suspeito do mercado"
      ],
      "role": "Um filtro extra para quem opera futuros."
    },
    "liquidity-zones": {
      "tagline": "Zonas de liquidez no seu gráfico",
      "lead": "Encontra automaticamente as zonas de liquidez onde as ordens se concentram e mostra sua força, volume e distância até o preço.",
      "question": "Onde o mercado pode buscar liquidez?",
      "helps": [
        "Detecção automática de zonas de liquidez",
        "Força e volume das zonas",
        "Zonas de suporte e resistência",
        "Varreduras de liquidez no gráfico"
      ],
      "role": "Um ótimo complemento ao Magnet Pro e ao Strong Levels Finder."
    },
    "strong-levels-finder": {
      "tagline": "Níveis fortes a partir do histórico de preço",
      "lead": "Encontra os níveis aos quais o preço já reagiu e os atualiza automaticamente à medida que chegam novos dados.",
      "question": "Quais níveis o mercado realmente respeita?",
      "helps": [
        "Níveis fortes do histórico de preço",
        "Atualização automática dos níveis",
        "Menos linhas desnecessárias no gráfico"
      ],
      "role": "Uma ferramenta essencial para montar um cenário de operação."
    },
    "table-predictor": {
      "tagline": "Uma tabela de previsão da direção do mercado",
      "lead": "Uma tabela compacta multi-tempo gráfico mostra direção, força e estado do mercado, e marca os níveis de preço-chave no gráfico.",
      "question": "Para que lado o mercado está pendendo agora?",
      "helps": [
        "Direção em vários tempos gráficos ao mesmo tempo",
        "Rótulos claros: long, short ou sem vantagem",
        "Níveis-chave no gráfico",
        "Funciona em qualquer tempo gráfico"
      ],
      "role": "Incluído em todos os planos: START, PRO e ELITE."
    },
    "tf-reaction-map": {
      "tagline": "Um mapa de reação multi-tempo gráfico",
      "lead": "Leva as zonas de reação dos tempos gráficos maiores para o seu gráfico de trabalho — por exemplo, fair value gaps (FVG) do gráfico de 1 hora para o de minutos.",
      "question": "Onde o preço tem mais chance de reagir?",
      "helps": [
        "Zonas de reação dos tempos gráficos maiores",
        "Visíveis em qualquer tempo gráfico de trabalho",
        "Ajuda a escolher onde entrar"
      ],
      "role": "Funciona bem junto com Table Predictor e Fib Pro."
    }
  },
  "ru": {
    "market-radar-pro": {
      "tagline": "Главный рыночный радар",
      "lead": "Мультитаймфреймовый радар рынка. В одной таблице видно тренд, текущее движение, импульс, RSI, объём и дивергенции — от 1 минуты до месяца. За несколько секунд понятно, что происходит с активом на всех интервалах.",
      "question": "Что сейчас происходит на рынке?",
      "helps": [
        "Совпадают ли старшие и младшие таймфреймы",
        "Есть ли устойчивый тренд и развивается ли импульс",
        "Нет ли перегрева по RSI и дивергенций",
        "Подтверждает ли объём движение",
        "Стоит ли искать сделку или лучше подождать"
      ],
      "role": "С него начинается анализ любого актива в системе UpDown: Market Radar → зоны и уровни → реакция цены → решение."
    },
    "magnet-pro": {
      "tagline": "Карта зон рыночного интереса",
      "lead": "Показывает области интереса выше и ниже текущей цены, их силу и расстояние до ближайших зон. Убирает с графика лишнее и оставляет то, за чем действительно стоит следить.",
      "question": "Где на графике сейчас самые интересные области?",
      "helps": [
        "Ближайшие зоны сверху и снизу от цены",
        "Сила каждой зоны: сильная или средняя",
        "Расстояние до зоны в процентах",
        "Работает на любом инструменте и таймфрейме"
      ],
      "role": "Это карта внимания трейдера, а не команда купить или продать. После регистрации — бесплатно на 7 дней."
    },
    "fib-pro": {
      "tagline": "Авторская система Фибоначчи SK TRADE",
      "lead": "Инструмент по методике Сергея SKTRADE. Автоматически строит важные FIB-области, отмечает вход, стоп и цели и подсказывает, когда цена подходит к значимому уровню.",
      "question": "Цена пришла в важную область — где искать подтверждение?",
      "helps": [
        "Меньше ручных построений",
        "Важные FIB-области не теряются",
        "Вход, стоп и цели прямо на графике",
        "Методика SK Trade применяется последовательно"
      ],
      "role": "Особенно сильна в связке с обучением Сергея и с Market Radar Pro."
    },
    "mm-target-pro": {
      "tagline": "Цели после сильного движения",
      "lead": "Инструмент для анализа рынка после сильного импульса. Выделяет значимые зоны и цели, относительно которых стоит строить дальнейший сценарий.",
      "question": "Монета уже выросла на 15% — что теперь?",
      "helps": [
        "Цели и значимые зоны после импульса",
        "Понятно, где движение может продолжиться",
        "Меньше эмоциональных входов вдогонку"
      ],
      "role": "Специализированный инструмент для подготовленного трейдера."
    },
    "trap-hunter-pro": {
      "tagline": "Поиск ловушек после сильных движений",
      "lead": "Помогает заметить момент, когда сильное движение теряет устойчивость и может сформироваться ловушка или истощение импульса.",
      "question": "Догонять движение или рынок уже требует осторожности?",
      "helps": [
        "Признаки ловушки после пампа",
        "Истощение импульса",
        "Предупреждение до входа вдогонку"
      ],
      "role": "Продвинутый дополнительный инструмент. Лучше всего работает вместе с Market Radar Pro и MM Target Pro."
    },
    "oi-radar-pro": {
      "tagline": "Радар открытого интереса",
      "lead": "Добавляет к графику слой открытого интереса, объёма и поведения участников. Видно, подтверждается ли движение участием рынка или появляются признаки ловушки.",
      "question": "Движение поддержано деньгами или это ловушка?",
      "helps": [
        "Изменение открытого интереса",
        "Подтверждение движения объёмом",
        "Оценка силы импульса",
        "Подозрительное поведение рынка"
      ],
      "role": "Дополнительный фильтр для трейдера, который работает с фьючерсами."
    },
    "liquidity-zones": {
      "tagline": "Зоны ликвидности на графике",
      "lead": "Автоматически находит зоны ликвидности, где скапливаются ордера, и показывает их силу, объём и расстояние до цены.",
      "question": "Где рынок может собрать ликвидность?",
      "helps": [
        "Автоматический поиск зон ликвидности",
        "Сила зоны и объём",
        "Зоны поддержки и сопротивления",
        "Снятие ликвидности (sweep) на графике"
      ],
      "role": "Хорошо дополняет Magnet Pro и Strong Levels Finder."
    },
    "strong-levels-finder": {
      "tagline": "Сильные уровни по истории цены",
      "lead": "Находит уровни, от которых цена уже реагировала, и обновляет их автоматически по мере появления новых данных.",
      "question": "Какие уровни рынок действительно уважает?",
      "helps": [
        "Сильные уровни по истории цены",
        "Автоматическое обновление уровней",
        "Меньше лишних линий на графике"
      ],
      "role": "Базовый инструмент для построения сценария."
    },
    "table-predictor": {
      "tagline": "Прогнозная таблица движений",
      "lead": "Компактная таблица по нескольким таймфреймам показывает направление, силу и состояние рынка, а на графике отмечает ключевые уровни.",
      "question": "В какую сторону сейчас перевес?",
      "helps": [
        "Направление сразу по нескольким таймфреймам",
        "Понятные метки: лонг, шорт или нет перевеса",
        "Ключевые уровни на графике",
        "Работает на любом таймфрейме"
      ],
      "role": "Входит во все тарифы: START, PRO и ELITE."
    },
    "tf-reaction-map": {
      "tagline": "Карта реакции по таймфреймам",
      "lead": "Переносит на рабочий график зоны реакции со старших таймфреймов — например, зоны дисбаланса (FVG) с часового графика на минутный.",
      "question": "Где цена скорее всего отреагирует?",
      "helps": [
        "Зоны реакции со старших таймфреймов",
        "Видны на любом рабочем таймфрейме",
        "Помогают выбрать место для входа"
      ],
      "role": "Хорошо работает вместе с Table Predictor и Fib Pro."
    }
  },
  "uk": {
    "market-radar-pro": {
      "tagline": "Головний ринковий радар",
      "lead": "Мультитаймфреймовий радар ринку. В одній таблиці видно тренд, поточний рух, імпульс, RSI, обсяг і дивергенції — від 1 хвилини до місяця. За кілька секунд зрозуміло, що відбувається з активом на всіх інтервалах.",
      "question": "Що зараз відбувається на ринку?",
      "helps": [
        "Чи збігаються старші й молодші таймфрейми",
        "Чи є стійкий тренд і чи розвивається імпульс",
        "Чи немає перегріву за RSI та дивергенцій",
        "Чи підтверджує обсяг рух",
        "Чи варто шукати угоду, чи краще зачекати"
      ],
      "role": "З нього починається аналіз будь-якого активу в системі UpDown: Market Radar → зони та рівні → реакція ціни → рішення."
    },
    "magnet-pro": {
      "tagline": "Карта зон ринкового інтересу",
      "lead": "Показує області інтересу вище й нижче поточної ціни, їхню силу та відстань до найближчих зон. Прибирає з графіка зайве й залишає те, за чим справді варто стежити.",
      "question": "Де на графіку зараз найцікавіші області?",
      "helps": [
        "Найближчі зони зверху та знизу від ціни",
        "Сила кожної зони: сильна чи середня",
        "Відстань до зони у відсотках",
        "Працює на будь-якому інструменті й таймфреймі"
      ],
      "role": "Це карта уваги трейдера, а не команда купувати чи продавати. Після реєстрації — безкоштовно на 7 днів."
    },
    "fib-pro": {
      "tagline": "Авторська система Фібоначчі SK TRADE",
      "lead": "Інструмент за методикою Сергія SKTRADE. Автоматично будує важливі FIB-області, позначає вхід, стоп і цілі та підказує, коли ціна наближається до значущого рівня.",
      "question": "Ціна дійшла до важливої області — де шукати підтвердження?",
      "helps": [
        "Менше ручних побудов",
        "Важливі FIB-області не губляться",
        "Вхід, стоп і цілі просто на графіку",
        "Методика SK Trade застосовується послідовно"
      ],
      "role": "Особливо сильна у зв'язці з навчанням Сергія та з Market Radar Pro."
    },
    "mm-target-pro": {
      "tagline": "Цілі після сильного руху",
      "lead": "Інструмент для аналізу ринку після сильного імпульсу. Виділяє значущі зони та цілі, від яких варто будувати подальший сценарій.",
      "question": "Монета вже зросла на 15% — що тепер?",
      "helps": [
        "Цілі та значущі зони після імпульсу",
        "Зрозуміло, де рух може продовжитися",
        "Менше емоційних входів навздогін"
      ],
      "role": "Спеціалізований інструмент для підготовленого трейдера."
    },
    "trap-hunter-pro": {
      "tagline": "Пошук пасток після сильних рухів",
      "lead": "Допомагає помітити момент, коли сильний рух втрачає стійкість і може сформуватися пастка або виснаження імпульсу.",
      "question": "Наздоганяти рух чи ринок уже вимагає обережності?",
      "helps": [
        "Ознаки пастки після пампу",
        "Виснаження імпульсу",
        "Попередження до входу навздогін"
      ],
      "role": "Просунутий додатковий інструмент. Найкраще працює разом із Market Radar Pro та MM Target Pro."
    },
    "oi-radar-pro": {
      "tagline": "Радар відкритого інтересу",
      "lead": "Додає до графіка шар відкритого інтересу, обсягу та поведінки учасників. Видно, чи підтверджується рух участю ринку, чи з'являються ознаки пастки.",
      "question": "Рух підкріплений грошима чи це пастка?",
      "helps": [
        "Зміна відкритого інтересу",
        "Підтвердження руху обсягом",
        "Оцінка сили імпульсу",
        "Підозріла поведінка ринку"
      ],
      "role": "Додатковий фільтр для трейдера, який працює з ф'ючерсами."
    },
    "liquidity-zones": {
      "tagline": "Зони ліквідності на графіку",
      "lead": "Автоматично знаходить зони ліквідності, де накопичуються ордери, і показує їхню силу, обсяг і відстань до ціни.",
      "question": "Де ринок може зібрати ліквідність?",
      "helps": [
        "Автоматичний пошук зон ліквідності",
        "Сила зони та обсяг",
        "Зони підтримки й опору",
        "Зняття ліквідності (sweep) на графіку"
      ],
      "role": "Добре доповнює Magnet Pro та Strong Levels Finder."
    },
    "strong-levels-finder": {
      "tagline": "Сильні рівні за історією ціни",
      "lead": "Знаходить рівні, від яких ціна вже реагувала, і оновлює їх автоматично в міру появи нових даних.",
      "question": "Які рівні ринок справді поважає?",
      "helps": [
        "Сильні рівні за історією ціни",
        "Автоматичне оновлення рівнів",
        "Менше зайвих ліній на графіку"
      ],
      "role": "Базовий інструмент для побудови сценарію."
    },
    "table-predictor": {
      "tagline": "Прогнозна таблиця рухів",
      "lead": "Компактна таблиця за кількома таймфреймами показує напрямок, силу та стан ринку, а на графіку позначає ключові рівні.",
      "question": "У який бік зараз перевага?",
      "helps": [
        "Напрямок одразу за кількома таймфреймами",
        "Зрозумілі мітки: лонг, шорт або немає переваги",
        "Ключові рівні на графіку",
        "Працює на будь-якому таймфреймі"
      ],
      "role": "Входить до всіх тарифів: START, PRO та ELITE."
    },
    "tf-reaction-map": {
      "tagline": "Карта реакції за таймфреймами",
      "lead": "Переносить на робочий графік зони реакції зі старших таймфреймів — наприклад, зони дисбалансу (FVG) з годинного графіка на хвилинний.",
      "question": "Де ціна найімовірніше відреагує?",
      "helps": [
        "Зони реакції зі старших таймфреймів",
        "Видно на будь-якому робочому таймфреймі",
        "Допомагають обрати місце для входу"
      ],
      "role": "Добре працює разом із Table Predictor та Fib Pro."
    }
  },
  "zh": {
    "market-radar-pro": {
      "tagline": "核心市场雷达",
      "lead": "多周期市场雷达。一张表格即可显示从 1 分钟到 1 个月各周期的趋势、当前走势、动能、RSI、成交量和背离。几秒钟内就能看清该资产在每个周期上的状态。",
      "question": "市场现在在做什么？",
      "helps": [
        "高低周期是否一致",
        "是否存在稳定趋势并且动能在增强",
        "RSI 是否过热或出现背离",
        "成交量是否确认走势",
        "该寻找交易机会还是等待"
      ],
      "role": "UpDown 体系中的每一次分析都从这里开始：Market Radar → 区域与水平位 → 价格反应 → 决策。"
    },
    "magnet-pro": {
      "tagline": "市场关注区域地图",
      "lead": "显示当前价格上方和下方的关注区域、区域强度以及到最近区域的距离。它让图表更清爽，只保留真正值得关注的内容。",
      "question": "图表上现在最值得关注的区域在哪里？",
      "helps": [
        "价格上下方最近的区域",
        "每个区域的强度：强或中等",
        "到每个区域的百分比距离",
        "适用于任何品种和周期"
      ],
      "role": "这是一张提示关注位置的地图，而不是买入或卖出指令。注册后可免费使用 7 天。"
    },
    "fib-pro": {
      "tagline": "谢尔盖 SKTRADE 的斐波那契体系",
      "lead": "基于谢尔盖 SKTRADE 的方法打造。自动绘制关键 FIB 区域，标注入场、止损和目标，并在价格接近重要水平位时发出提示。",
      "question": "价格已到达关键区域——该去哪里寻找确认？",
      "helps": [
        "减少手动画线",
        "不再错过关键 FIB 区域",
        "入场、止损和目标直接显示在图表上",
        "始终如一地执行 SK TRADE 方法"
      ],
      "role": "与谢尔盖的培训课程和 Market Radar Pro 搭配使用效果尤佳。"
    },
    "mm-target-pro": {
      "tagline": "强势行情后的目标",
      "lead": "用于分析强劲冲动后的市场。它标出重要区域和目标，帮助你构建下一步的交易情景。",
      "question": "币已经涨了 15%——接下来怎么办？",
      "helps": [
        "冲动行情后的目标与关键区域",
        "走势可能延续的位置",
        "减少情绪化追单"
      ],
      "role": "面向有经验交易者的专业工具。"
    },
    "trap-hunter-pro": {
      "tagline": "识别强势行情后的陷阱",
      "lead": "帮助你发现强势走势何时失去稳定性，以及可能正在形成的陷阱或动能衰竭。",
      "question": "该追这波行情，还是该谨慎了？",
      "helps": [
        "拉升后的陷阱信号",
        "动能衰竭",
        "追单前的预警"
      ],
      "role": "高级辅助工具。与 Market Radar Pro 和 MM Target Pro 搭配效果最佳。"
    },
    "oi-radar-pro": {
      "tagline": "持仓量雷达",
      "lead": "在图表上叠加持仓量、成交量和参与者行为信息。你可以看出走势是否有市场参与支撑，或是否出现了陷阱迹象。",
      "question": "这波走势有资金支撑，还是一个陷阱？",
      "helps": [
        "持仓量变化",
        "成交量对走势的确认",
        "动能强度",
        "可疑的市场行为"
      ],
      "role": "为交易合约的交易者提供的额外过滤器。"
    },
    "liquidity-zones": {
      "tagline": "图表上的流动性区域",
      "lead": "自动找出订单聚集的流动性区域，并显示其强度、成交量以及与价格的距离。",
      "question": "市场可能会在哪里扫流动性？",
      "helps": [
        "自动识别流动性区域",
        "区域强度与成交量",
        "支撑与阻力区域",
        "图表上的流动性扫荡"
      ],
      "role": "与 Magnet Pro 和 Strong Levels Finder 相辅相成。"
    },
    "strong-levels-finder": {
      "tagline": "来自历史价格的强水平位",
      "lead": "找出价格曾经产生过反应的水平位，并随着新数据自动更新。",
      "question": "市场真正尊重哪些水平位？",
      "helps": [
        "来自历史价格的强水平位",
        "水平位自动更新",
        "图表上多余的线更少"
      ],
      "role": "构建交易情景的核心工具。"
    },
    "table-predictor": {
      "tagline": "市场方向预测表",
      "lead": "紧凑的多周期表格显示方向、强度和市场状态，并在图表上标出关键价格水平。",
      "question": "市场现在偏向哪个方向？",
      "helps": [
        "同时查看多个周期的方向",
        "清晰标签：做多、做空或无优势",
        "图表上的关键水平位",
        "适用于任何周期"
      ],
      "role": "包含在所有套餐中：START、PRO 和 ELITE。"
    },
    "tf-reaction-map": {
      "tagline": "多周期反应地图",
      "lead": "将高周期的反应区域投射到你的工作图表上——例如把小时图上的公允价值缺口（FVG）显示在分钟图上。",
      "question": "价格最可能在哪里产生反应？",
      "helps": [
        "来自高周期的反应区域",
        "在任何工作周期上可见",
        "帮助你选择入场位置"
      ],
      "role": "与 Table Predictor 和 Fib Pro 搭配使用效果很好。"
    }
  },
  "ar": {
    "market-radar-pro": {
      "tagline": "رادار السوق الأساسي",
      "lead": "رادار للسوق متعدد الأطر الزمنية. جدول واحد يعرض الاتجاه والحركة الحالية والزخم وRSI والحجم والانحرافات من دقيقة واحدة حتى شهر. في ثوانٍ معدودة ترى ما يحدث للأصل على كل إطار زمني.",
      "question": "ماذا يفعل السوق الآن؟",
      "helps": [
        "هل تتوافق الأطر الزمنية الكبيرة والصغيرة",
        "هل هناك اتجاه مستقر وزخم يتصاعد",
        "هل RSI في منطقة تشبّع أو تظهر انحرافات",
        "هل يؤكد الحجم الحركة",
        "هل تبحث عن صفقة أم تنتظر"
      ],
      "role": "كل تحليل في نظام UpDown يبدأ من هنا: Market Radar ← المناطق والمستويات ← رد فعل السعر ← القرار."
    },
    "magnet-pro": {
      "tagline": "خريطة مناطق اهتمام السوق",
      "lead": "يعرض مناطق الاهتمام فوق السعر الحالي وتحته، وقوتها، والمسافة إلى أقرب المناطق. ينظّف الرسم البياني ويُبقي ما يستحق المتابعة فعلًا.",
      "question": "أين توجد أهم المناطق على الرسم البياني الآن؟",
      "helps": [
        "أقرب المناطق فوق السعر وتحته",
        "قوة كل منطقة: قوية أو متوسطة",
        "المسافة إلى كل منطقة بالنسبة المئوية",
        "يعمل على أي أداة مالية وأي إطار زمني"
      ],
      "role": "إنه خريطة لما يستحق انتباهك، وليس أمرًا بالشراء أو البيع. مجاني لمدة 7 أيام بعد التسجيل."
    },
    "fib-pro": {
      "tagline": "نظام فيبوناتشي من سيرغي SKTRADE",
      "lead": "مبني على منهجية سيرغي SKTRADE. يرسم مناطق FIB الرئيسية تلقائيًا، ويحدد الدخول ووقف الخسارة والأهداف، وينبّهك عند اقتراب السعر من مستوى مهم.",
      "question": "وصل السعر إلى منطقة رئيسية — أين أبحث عن التأكيد؟",
      "helps": [
        "رسم يدوي أقل",
        "لن تفوتك مناطق FIB الرئيسية",
        "الدخول ووقف الخسارة والأهداف على الرسم البياني مباشرة",
        "تطبيق منهجية SK Trade باتساق"
      ],
      "role": "قوي بشكل خاص مع تدريب سيرغي وMarket Radar Pro."
    },
    "mm-target-pro": {
      "tagline": "الأهداف بعد حركة قوية",
      "lead": "لتحليل السوق بعد اندفاع قوي. يبرز المناطق المهمة والأهداف لتبني عليها سيناريوك التالي.",
      "question": "العملة ارتفعت 15% بالفعل — ماذا بعد؟",
      "helps": [
        "الأهداف والمناطق الرئيسية بعد الاندفاع",
        "أين قد تستمر الحركة",
        "دخول عاطفي أقل خلف السعر"
      ],
      "role": "أداة متخصصة للمتداولين ذوي الخبرة."
    },
    "trap-hunter-pro": {
      "tagline": "رصد الفخاخ بعد الحركات القوية",
      "lead": "يساعدك على ملاحظة فقدان الحركة القوية لاستقرارها واحتمال تشكّل فخ أو استنفاد الزخم.",
      "question": "هل ألحق بالحركة، أم حان وقت الحذر؟",
      "helps": [
        "علامات الفخ بعد الارتفاع الحاد",
        "استنفاد الزخم",
        "تحذير قبل الدخول خلف السعر"
      ],
      "role": "أداة إضافية متقدمة. تعمل بأفضل شكل مع Market Radar Pro وMM Target Pro."
    },
    "oi-radar-pro": {
      "tagline": "رادار الفائدة المفتوحة",
      "lead": "يضيف إلى رسمك البياني طبقة من الفائدة المفتوحة والحجم وسلوك المشاركين. ترى هل الحركة مدعومة بمشاركة السوق أم تظهر علامات فخ.",
      "question": "هل الحركة مدعومة بالمال أم أنها فخ؟",
      "helps": [
        "تغيّرات الفائدة المفتوحة",
        "تأكيد الحركة بالحجم",
        "قوة الزخم",
        "سلوك مريب في السوق"
      ],
      "role": "فلتر إضافي للمتداولين في العقود الآجلة."
    },
    "liquidity-zones": {
      "tagline": "مناطق السيولة على رسمك البياني",
      "lead": "يجد تلقائيًا مناطق السيولة حيث تتجمع الأوامر، ويعرض قوتها وحجمها والمسافة إلى السعر.",
      "question": "أين قد يلتقط السوق السيولة؟",
      "helps": [
        "رصد تلقائي لمناطق السيولة",
        "قوة المنطقة وحجمها",
        "مناطق الدعم والمقاومة",
        "سحب السيولة على الرسم البياني"
      ],
      "role": "مكمّل جيد لـ Magnet Pro وStrong Levels Finder."
    },
    "strong-levels-finder": {
      "tagline": "مستويات قوية من تاريخ السعر",
      "lead": "يجد المستويات التي تفاعل معها السعر سابقًا ويحدّثها تلقائيًا مع وصول بيانات جديدة.",
      "question": "ما المستويات التي يحترمها السوق فعلًا؟",
      "helps": [
        "مستويات قوية من تاريخ السعر",
        "تحديث تلقائي للمستويات",
        "خطوط غير ضرورية أقل على الرسم البياني"
      ],
      "role": "أداة أساسية لبناء سيناريو الصفقة."
    },
    "table-predictor": {
      "tagline": "جدول توقعات لاتجاه السوق",
      "lead": "جدول مدمج متعدد الأطر الزمنية يعرض الاتجاه والقوة وحالة السوق، ويحدد مستويات السعر الرئيسية على الرسم البياني.",
      "question": "إلى أين يميل السوق الآن؟",
      "helps": [
        "الاتجاه على عدة أطر زمنية في آن واحد",
        "إشارات واضحة: شراء أو بيع أو لا أفضلية",
        "المستويات الرئيسية على الرسم البياني",
        "يعمل على أي إطار زمني"
      ],
      "role": "مشمول في جميع الخطط: START وPRO وELITE."
    },
    "tf-reaction-map": {
      "tagline": "خريطة ردود الفعل متعددة الأطر الزمنية",
      "lead": "ينقل مناطق رد الفعل من الأطر الزمنية الأكبر إلى رسمك البياني للعمل — مثل فجوات القيمة العادلة (FVG) من الرسم الساعي إلى رسم الدقيقة.",
      "question": "أين يُرجَّح أن يتفاعل السعر؟",
      "helps": [
        "مناطق رد الفعل من الأطر الزمنية الأكبر",
        "مرئية على أي إطار زمني للعمل",
        "يساعدك على اختيار مكان الدخول"
      ],
      "role": "يعمل جيدًا مع Table Predictor وFib Pro."
    }
  }
}

export function indicatorBySlug(slug) {
  return INDICATORS.find((i) => i.slug === slug) || null
}
