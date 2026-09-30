import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  Email, CodePurpose, normalizeLang,
  codeEmail, welcomeEmail, tvGrantedEmail, tvNotFoundEmail, paymentEmail, partnerStatusEmail,
} from './templates';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {}

  /** Отправка через Resend. Коды подтверждения в лог НЕ пишем. */
  private async deliver(to: string, mail: Email) {
    this.logger.log(`📧 TO: ${to} | ${mail.subject.replace(/\b\d{6}\b/g, '******')}`);

    const apiKey = this.config.get('RESEND_API_KEY');
    const from = this.config.get('MAIL_FROM') || 'UpDown <onboarding@resend.dev>';
    const replyTo = this.config.get('MAIL_REPLY_TO', 'support@updown.team');

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY не задан — письмо не отправлено');
      return;
    }

    try {
      await axios.post(
        'https://api.resend.com/emails',
        {
          from, to,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          ...(replyTo ? { reply_to: replyTo } : {}),
        },
        {
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          timeout: 10000,
        },
      );
      this.logger.log(`✅ Email отправлен на ${to}`);
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      this.logger.warn(`⚠️ Email не отправлен на ${to}: ${msg}`);
    }
  }

  private ttl() {
    return this.config.get('CODE_TTL_MINUTES', '10');
  }

  // ── Коды ─────────────────────────────────────────────────────────
  async sendCode(email: string, purpose: CodePurpose, code: string, lang?: string | null) {
    await this.deliver(email, codeEmail(normalizeLang(lang), purpose, code, this.ttl()));
  }

  // Совместимость со старыми вызовами
  async sendVerificationCode(email: string, code: string, lang?: string | null) {
    return this.sendCode(email, 'registration', code, lang);
  }
  async sendLoginCode(email: string, code: string, lang?: string | null) {
    return this.sendCode(email, 'login', code, lang);
  }
  async sendEmailChangeCode(email: string, code: string, lang?: string | null) {
    return this.sendCode(email, 'email_change', code, lang);
  }
  async sendPasswordResetCode(email: string, code: string, lang?: string | null) {
    return this.sendCode(email, 'reset', code, lang);
  }

  // ── Пользовательские письма ──────────────────────────────────────
  async sendWelcome(email: string, lang: string | null | undefined, trialEndsAt: Date | null) {
    await this.deliver(email, welcomeEmail(normalizeLang(lang), trialEndsAt));
  }

  async sendTvGranted(email: string, lang: string | null | undefined, products: string[], tvUsername: string, until: Date | null) {
    await this.deliver(email, tvGrantedEmail(normalizeLang(lang), products, tvUsername, until));
  }

  async sendTvNotFound(email: string, lang: string | null | undefined, tvUsername: string) {
    await this.deliver(email, tvNotFoundEmail(normalizeLang(lang), tvUsername));
  }

  async sendPaymentSuccess(email: string, lang?: string | null, tx?: { id: string; amount: any; currency?: string; paidAt?: Date }) {
    const amount = tx ? Number(tx.amount || 0).toFixed(2) : '—';
    await this.deliver(email, paymentEmail(normalizeLang(lang), tx?.id || '—', amount, tx?.currency || 'USDT', tx?.paidAt || new Date()));
  }

  async sendPartnerStatusUpdate(email: string, status: string, reason?: string, lang?: string | null) {
    await this.deliver(email, partnerStatusEmail(normalizeLang(lang), status === 'approved', reason));
  }

  // ── Служебное письмо администратору (без шаблона) ────────────────
  async sendPartnerApplication(data: { name: string; email: string; companyName: string; description: string }) {
    const esc = (s: any) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html =
      `<h2>New partner application</h2>
       <p><b>Name:</b> ${esc(data.name)}</p>
       <p><b>Email:</b> ${esc(data.email)}</p>
       <p><b>Company:</b> ${esc(data.companyName)}</p>
       <p><b>Description:</b> ${esc(data.description)}</p>`;
    await this.deliver(this.config.get('MAIL_ADMIN'), {
      subject: 'New partner application',
      html,
      text: `New partner application\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.companyName}\n${data.description}`,
    });
  }
}
