# UpDown Platform

Full-stack партнёрская платформа с Telegram-ботами.

## Стек

**Backend:** NestJS · PostgreSQL · TypeORM · JWT · bcrypt · Nodemailer · Telegram Bot API · Throttler  
**Frontend:** Vue 3 (Composition API) · Pinia · Vue Router · Axios · SCSS

---

## Быстрый старт

### 1. Клонировать и настроить переменные

```bash
# Backend
cp backend/.env.example backend/.env
# Заполните все значения в backend/.env

# Frontend
cp frontend/.env.example frontend/.env
# Укажите VITE_API_URL
```

### 2. Запуск через Docker Compose

```bash
docker compose up -d
```

### 3. Настройка Nginx (VPS)

```bash
sudo cp nginx-proxy.conf /etc/nginx/sites-available/updown
sudo ln -s /etc/nginx/sites-available/updown /etc/nginx/sites-enabled/
# Обновите yourdomain.com → ваш домен
sudo certbot --nginx -d yourdomain.com
sudo nginx -s reload
```

---

## Архитектура

```
project/
├── backend/
│   └── src/
│       ├── auth/           # JWT, регистрация, 2FA
│       ├── users/          # Профиль, смена email/пароля
│       ├── partners/       # Заявки партнёров
│       ├── bots/           # Управление ботами
│       ├── tickets/        # Система тикетов
│       ├── broadcasts/     # Рассылки
│       ├── admin/          # Управление пользователями, логи
│       ├── mail/           # Nodemailer
│       ├── telegram/       # Основной бот + партнёрские боты
│       └── database/
│           └── entities/   # TypeORM entities
└── frontend/
    └── src/
        ├── views/
        │   ├── auth/       # Login, Register
        │   ├── dashboard/  # Layout, Home, Profile, Tickets
        │   ├── partner/    # Bot, Broadcast
        │   ├── admin/      # Partners, AllTickets, BotsOverview
        │   └── owner/      # Users, AdminLogs
        ├── stores/         # Pinia (auth)
        ├── api/            # Axios клиент + endpoints
        └── router/         # Vue Router + guards
```

---

## Переменные окружения (backend)

| Переменная | Описание |
|---|---|
| `DB_*` | PostgreSQL подключение |
| `JWT_SECRET` | Секрет для подписи токенов (≥32 символа) |
| `JWT_EXPIRES_IN` | Срок жизни токена (напр. `7d`) |
| `MAIL_*` | SMTP настройки (Gmail App Password) |
| `MAIL_ADMIN` | Email для уведомлений о заявках |
| `MAIN_BOT_TOKEN` | Токен главного бота уведомлений |
| `MAIN_BOT_CHAT_ID` | Chat ID для уведомлений |
| `CODE_TTL_MINUTES` | Срок жизни кодов подтверждения |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | Rate limiting |
| `FRONTEND_URL` | URL фронтенда (для CORS) |

---

## Роли

| Роль | Возможности |
|---|---|
| **OWNER** | Всё: назначает Admins, видит логи, рассылки |
| **ADMIN** | Партнёры, тикеты, рассылки по всем ботам |
| **PARTNER** | Свой бот, статистика, рассылка своим |
| **USER** | Профиль, тикеты, заявка партнёра |

---

## API Endpoints

### Auth
```
POST /api/auth/send-code       — Код для регистрации
POST /api/auth/register        — Регистрация
POST /api/auth/login           — Вход по паролю
POST /api/auth/login/code      — Запросить код входа
POST /api/auth/login/verify    — Подтвердить код входа
```

### Users
```
GET  /api/users/me             — Профиль
PUT  /api/users/me             — Обновить профиль
POST /api/users/me/change-password
POST /api/users/me/change-email
POST /api/users/me/confirm-email
PUT  /api/users/me/2fa
```

### Partners
```
POST /api/partners/apply       — Подать заявку
GET  /api/partners/my-application
GET  /api/partners             — [ADMIN] Все партнёры
PUT  /api/partners/:id/review  — [ADMIN] Одобрить/отклонить
```

### Bots
```
GET  /api/bots/my              — [PARTNER] Мой бот
POST /api/bots/my/token        — [PARTNER] Установить токен
POST /api/bots/my/start        — [PARTNER] Запустить
POST /api/bots/my/stop         — [PARTNER] Остановить
PUT  /api/bots/my/buttons      — [PARTNER] Кнопки
GET  /api/bots/all             — [ADMIN] Все боты
```

### Tickets
```
POST /api/tickets              — Создать
GET  /api/tickets/my           — Мои
GET  /api/tickets/all          — [ADMIN] Все
GET  /api/tickets/:id/messages
POST /api/tickets/:id/reply
PUT  /api/tickets/:id/close    — [ADMIN]
```

### Broadcasts
```
POST /api/broadcasts           — Отправить рассылку
GET  /api/broadcasts/history   — История
```

### Admin
```
GET  /api/admin/users          — [OWNER/ADMIN]
POST /api/admin/users/:id/assign-admin  — [OWNER]
POST /api/admin/users/:id/revoke-admin  — [OWNER]
POST /api/admin/users/:id/deactivate    — [OWNER/ADMIN]
GET  /api/admin/logs           — [OWNER] Иммутабельные логи
```

---

## База данных

```
users              — Пользователи, роли, 2FA
verification_codes — Одноразовые коды (регистрация, 2FA, смена email)
partners           — Заявки партнёров
bots               — Telegram-боты партнёров
bot_users          — Пользователи ботов
link_clicks        — Клики по кнопкам (уникальные)
tickets            — Тикеты поддержки
ticket_messages    — Сообщения в тикетах
broadcasts         — История рассылок
admin_logs         — Лог действий (не удаляется)
```

---

## Безопасность

- Пароли хешируются bcrypt (cost=12)
- Коды хешируются bcrypt (cost=10) и имеют TTL
- JWT с configurable expiry
- Rate limiting на чувствительных endpoint'ах (3-10 req/min)
- RolesGuard на всех защищённых маршрутах
- CORS только с FRONTEND_URL
- Nginx rate limiting (10 req/s на /api/)
- Логирование всех действий ADMIN/OWNER

---

## Первый запуск: создание OWNER

После первого запуска выполните в psql:

```sql
UPDATE users SET role = 'OWNER' WHERE email = 'your@email.com';
```

Или через TypeORM seed (добавьте скрипт по необходимости).
